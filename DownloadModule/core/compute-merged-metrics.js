const MathJs = require('mathjs');
const Moment = require('moment');
const Mongoose = require('mongoose');
const cliProgress = require('cli-progress');
const PromisePool = require('es6-promise-pool')
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const Utils = require('../config/utils');
const ApiEndPoints = require('../config/apiEndpoints');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let projectDBUrl = Database.libreOfficeDBUrl;
let projectApiUrl = ApiEndPoints.qtApiUrl;

let STARTING_POINT = 0;
let NUM_OF_CHANGES_LIMIT = 1000;
let NUMBER_DATABASE_REQUEST = 3;
const NUM_CONCURRENCY = 100;

let DATA_PATH = "data/";

let metricsJson = {};

let libreOffice = {
    projectApiUrl: ApiEndPoints.libreOfficeApiUrl,
    projectDBUrl: Database.libreOfficeDBUrl,
    directory: DATA_PATH
}

startComputeMetrics(libreOffice).catch(err => {
    console.log(err)
});

function startComputeMetrics(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["directory"])
        DATA_PATH = json["directory"];

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            //NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUMBER_DATABASE_REQUEST);
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, STARTING_POINT);
            return getChanges(STARTING_POINT);
        })
        .then(() => {
            let projectName = Utils.getProjectName(ApiEndPoints.getProjectsUrl(projectApiUrl));
            let name = projectName + "-merged-metrics"
            return Utils.saveJSONInFile(DATA_PATH, name, metricsJson);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished!!!!");
            return Mongoose.connection.close();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip) {
    return Change
        .aggregate([
            {$sort: {_number: 1, created: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            return docs.length ? collectDocs(docs) : Promise.resolve(false);
        })
        .then(result => {
            return result ? getChanges(skip + NUM_OF_CHANGES_LIMIT) : Promise.resolve(false);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);

    const generatePromises = function* () {
        for (let key in docs) {
            yield collectMetrics(docs[key])
                .then((json) => {
                    return saveMetrics(json);
                })
        }
    }

    const promiseIterator = generatePromises()
    const pool = new PromisePool(promiseIterator, NUM_CONCURRENCY)

    return pool.start()
        .then(() => {
            return Promise.resolve(true)
        })
}

/**
 * @param {JSON} json Output json to save
 */
function saveMetrics(json) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true}).then(() => {
        metricsJson[json.id] = json;
        let prefix = Utils.getProjectName(projectApiUrl);
        let filename = prefix + "-merged-metrics.csv"
        return Utils.add_line_to_file(json, filename, DATA_PATH)
    }).then(() => {
        updateProgress();
    });
}

function updateProgress() {
    progressBar.increment(1);
}

//count all merged
//count total change
//count owner merged
//count owner all change
//count owner merge ratio
//count percentage of merged
//count owner percentage of merge

async function collectMetrics(json) {
    return getChangesInfo(json).then((values) => {
        let metric = {};
        metric["number"] = json._number;
        metric["id"] = json.id;

        metric["priorChangesCount"] = values.priorChangesCount;
        metric["priorMergedChangesCount"] = values.priorMergedChangesCount;
        metric["priorAbandonedChangesCount"] = values.priorAbandonedChangesCount;

        metric["ownerPriorChangesCount"] = values.ownerPriorChangesCount;
        metric["ownerPriorMergedChangesCount"] = values.ownerPriorMergedChangesCount;
        metric["ownerPriorAbandonedChangesCount"] = values.ownerPriorAbandonedChangesCount;
        metric["ownerMergedRatio"] = values.ownerMergedRatio;
        metric["ownerPercentageOfMerged"] = values.ownerPercentageOfMerged;
        metric["ownerPercentageOfAbandoned"] = values.ownerPercentageOfAbandoned;

        metric["mergedRatio"] = values.mergedRatio;
        metric["abandonedRatio"] = values.abandonedRatio;

        metric["priorSubsystemChangesCount"] = values.priorSubsystemChangesCount;
        metric["priorSubsystemMergedChangesCount"] = values.priorSubsystemMergedChangesCount;
        metric["priorSubsystemAbandonedChangesCount"] = values.priorSubsystemAbandonedChangesCount;

        metric["priorOwnerSubsystemChangesCount"] = values.priorOwnerSubsystemChangesCount;
        metric["priorOwnerSubsystemMergedChangesCount"] = values.priorOwnerSubsystemMergedChangesCount;
        metric["priorOwnerSubsystemAbandonedChangesCount"] = values.priorOwnerSubsystemAbandonedChangesCount;

        metric["priorSubsystemRatio"] = values.priorSubsystemRatio;
        metric["priorSubsystemMergedRatio"] = values.priorSubsystemMergedRatio;
        metric["priorSubsystemAbandonedRatio"] = values.priorSubsystemAbandonedRatio;

        metric["priorOwnerSubsystemChangesRatio"] = values.priorOwnerSubsystemChangesRatio;
        metric["priorOwnerSubsystemMergedChangesRatio"] = values.priorOwnerSubsystemMergedChangesRatio;
        metric["priorOwnerSubsystemAbandonedChangesRatio"] = values.priorOwnerSubsystemAbandonedChangesRatio;
        return Promise.resolve(metric)
    });
}

function getChangesInfo(json) {
    let priorChangesCount = getPriorChangesCount(json);
    let priorMergedChangesCount = getPriorTypeChangesCount(json, "MERGED");
    let priorAbandonedChangesCount = getPriorTypeChangesCount(json, "ABANDONED");
    let ownerPriorChangesCount = getOwnerPriorChangesCount(json);
    let ownerPriorMergedChangesCount = getOwnerPriorTypeChangesCount(json, "MERGED");
    let ownerPriorAbandonedChangesCount = getOwnerPriorTypeChangesCount(json, "ABANDONED");

    let priorSubsystemChangesCount = getPriorSubsystemChangesCount(json);
    let priorSubsystemMergedChangesCount = getPriorSubsystemTypeChangesCount(json, "MERGED");
    let priorSubsystemAbandonedChangesCount = getPriorSubsystemTypeChangesCount(json, "ABANDONED");
    let priorSubsystemOwnerChangesCount = getPriorSubsystemOwnerChangesCount(json);
    let priorSubsystemOwnerMergedChangesCount = getPriorSubsystemOwnerTypeChangesCount(json, "MERGED");
    let priorSubsystemOwnerAbandonedChangesCount = getPriorSubsystemOwnerTypeChangesCount(json, "ABANDONED");

    return Promise.all([
        priorChangesCount, //0
        priorMergedChangesCount, //1
        priorAbandonedChangesCount,  //2
        ownerPriorChangesCount, //3
        ownerPriorMergedChangesCount,  //4
        ownerPriorAbandonedChangesCount, //5
        priorSubsystemChangesCount, //6
        priorSubsystemMergedChangesCount, //7
        priorSubsystemAbandonedChangesCount, //8
        priorSubsystemOwnerChangesCount, //9
        priorSubsystemOwnerMergedChangesCount, //10
        priorSubsystemOwnerAbandonedChangesCount //11
    ]).then((results) => {
        //console.log(results);
        return {
            priorChangesCount: results[0],
            priorMergedChangesCount: results[1],
            priorAbandonedChangesCount: results[2],

            ownerPriorChangesCount: results[3],
            ownerPriorMergedChangesCount: results[4],
            ownerPriorAbandonedChangesCount: results[5],
            ownerMergedRatio: safeDivision(results[4], results[3]),
            ownerAbandonedRatio: safeDivision(results[5], results[3]),
            ownerPercentageOfMerged: safeDivision(results[4], results[1]),
            ownerPercentageOfAbandoned: safeDivision(results[5], results[2]),

            mergedRatio: safeDivision(results[1], results[0]),
            abandonedRatio: safeDivision(results[2], results[0]),

            priorSubsystemChangesCount: results[6],
            priorSubsystemMergedChangesCount: results[7],
            priorSubsystemAbandonedChangesCount: results[8],

            priorOwnerSubsystemChangesCount: results[9],
            priorOwnerSubsystemMergedChangesCount: results[10],
            priorOwnerSubsystemAbandonedChangesCount: results[11],

            priorSubsystemRatio: safeDivision(results[6], results[0]),
            priorSubsystemMergedRatio: safeDivision(results[7], results[1]),
            priorSubsystemAbandonedRatio: safeDivision(results[8], results[2]),

            priorOwnerSubsystemChangesRatio: safeDivision(results[9], results[6]),
            priorOwnerSubsystemMergedChangesRatio: safeDivision(results[10], results[7]),
            priorOwnerSubsystemAbandonedChangesRatio: safeDivision(results[11], results[8]),

        };
    })
}

function safeDivision(number1, number2) {
    return number2 !== 0 ? MathJs.divide(number1, number2) : 0;
}

function dbRequest(pipeline) {
    return Change
        .aggregate(pipeline)
        .exec()
        .then(docs => {
            if (!docs)
                return 0;
            return docs.length > 0 ? docs[0].count : 0;
        })
        .catch(err => {
            console.log(err)
        });
}

function getPriorTypeChangesCount(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let pipeline = [
        {$match: {status: TYPE, _number: {$lt: number}, updated: {$lte: created_date}}},
        {$count: "count"}
    ];
    return dbRequest(pipeline);
}

function getPriorChangesCount(json) {
    let number = json._number;
    let pipeline = [
        {$match: {_number: {$lt: number}}},
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

function getOwnerPriorChangesCount(json) {
    let number = json._number;
    let ownerId = json.owner._account_id;
    let pipeline = [
        {$match: {'owner._account_id': ownerId, _number: {$lt: number}}},
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

function getOwnerPriorTypeChangesCount(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let ownerId = json.owner._account_id;
    let pipeline = [
        {
            $match: {
                'owner._account_id': ownerId,
                status: TYPE,
                _number: {$lt: number},
                updated: {$lte: created_date}
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

//todo subsystem merged
//todo subsystem merged ratio

function getPriorSubsystemChangesCount(json) {
    let number = json._number;
    let project = json.project;
    let pipeline = [
        {
            $match: {
                project: project,
                _number: {$lt: number},
            }
        },
        {$count: "count"}
    ]

    return dbRequest(pipeline);
}

function getPriorSubsystemTypeChangesCount(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let project = json.project;
    let pipeline = [
        {
            $match: {
                project: project,
                status: TYPE,
                _number: {$lt: number},
                updated: {$lte: created_date}
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

function getPriorSubsystemOwnerChangesCount(json) {
    let number = json._number;
    let project = json.project;
    let ownerId = json.owner._account_id;
    let pipeline = [
        {
            $match: {
                'owner._account_id': ownerId,
                project: project,
                _number: {$lt: number},
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

function getPriorSubsystemOwnerTypeChangesCount(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let project = json.project;
    let ownerId = json.owner._account_id;
    let pipeline = [
        {
            $match: {
                'owner._account_id': ownerId,
                project: project,
                status: TYPE,
                _number: {$lt: number},
                updated: {$lte: created_date}
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}