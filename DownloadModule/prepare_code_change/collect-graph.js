const Mongoose = require('mongoose');
const Moment = require('moment');
const MathJs = require('mathjs');
const jsnx = require('jsnetworkx');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const MetricsUtils = require('../compute_metrics/metrics-utils');
const Utils = require('../config/utils');
const ApiEndPoints = require('../config/apiEndpoints');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let projectDBUrl = Database.libreOfficeDBUrl;
let projectApiUrl = ApiEndPoints.qtApiUrl;

let STARTING_POINT = 0;
let NUM_DAYS_FOR_RECENT = 365;
let NUM_OF_CHANGES_LIMIT = 100;
let NUMBER_DATABASE_REQUEST = 3;
let DATA_PATH = "data/";
let overAllGraphJson = {};
let overAllFullConnectedGraphJson = {};

let i = 0;

let libreOfficeJson = {
    projectApiUrl: ApiEndPoints.libreOfficeApiUrl,
    projectDBUrl: Database.libreOfficeDBUrl,
    directory: DATA_PATH
}

mainFunction(libreOfficeJson)
    .catch(err => {
        console.log(err)
    });

function mainFunction(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["directory"])
        DATA_PATH = json["directory"];

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
            ;
        })
        .then((count) => {
            //NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUMBER_DATABASE_REQUEST);
            //console.log("Processing data... by " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT);
        })
        .then(() => {
            let projectName = Utils.getProjectName(ApiEndPoints.getProjectsUrl(projectApiUrl));
            let name1 = projectName + "-graph";
            let name2 = projectName + "-full-connected-graph";
            let t1 = Utils.saveJSONInFile(DATA_PATH, name1, overAllGraphJson);
            let t2 = Utils.saveJSONInFile(DATA_PATH, name2, overAllFullConnectedGraphJson);
            return Promise.all([t1, t2]);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished!!!!");
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

function getChanges(skip) {
    return Change
        .aggregate([
            {$sort: {_number: 1}},
            {$project: {id: 1, created: 1, updated: 1, _number: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            return docs.length ? collectDocs(docs) : Promise.resolve(false);
            //return docs.length ? collectDocs(docs) : Promise.resolve(false);
        })
        /*.then(result => {
            return result ? getChanges(skip + NUM_OF_CHANGES_LIMIT) : Promise.resolve(false);
        })*/
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        await collectGraph(docs[key])
            .then((result) => {
                updateProgress();
            });
    }
    return Promise.resolve(true);
}

function updateProgress() {
    progressBar.increment(1);
}

async function collectGraph(json) {
    return getPriorChanges(json).then((result) => {
        let graph = result[0];
        let fullConnectedGraph = result[1];
        let id = json.id;
        overAllGraphJson[id] = graph;
        overAllFullConnectedGraphJson[id] = fullConnectedGraph;
        return Promise.resolve(true)
    });
}

function getPriorChanges(json) {
    let id = json.id
    let owner = json.owner._account_id;
    let endDate = Moment(json.created).toDate().toISOString();
    let startDate = Moment(json.created).subtract(NUM_DAYS_FOR_RECENT, 'days').toDate().toISOString();
    let number = json._number;
    let pipeline = [
        {
            $match: {
                status: {$in: ['MERGED', 'ABANDONED']},
                _number: {$lt: number},
                updated: {$lte: endDate},
                created: {$lte: endDate, $gte: startDate}
            }
        },
        {$project: {id: 1, owner_id: "$owner._account_id", reviewers_id: "$reviewers.REVIEWER._account_id"}},
    ];
    return dbRequest(pipeline, id, owner);
}

function dbRequest(pipeline, id, owner) {
    return Change
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return 0;
            let t1 = buildGraph(docs, id, owner);
            let t2 = buildFullConnectedGraph(docs, id, owner);
            return Promise.all([t1, t2]);
        })
        .catch(err => {
            console.log(err)
        });
}

async function buildGraph(docs, id, owner) {
    let nodes = new Set();
    let edges = [];
    for (let i = 0; i < docs.length; i++) {
        let doc = docs[i];
        let owner_id = doc["owner_id"];
        if (!owner_id) continue;
        nodes.add(owner_id);
        let reviewersId = doc["reviewers_id"];
        if (reviewersId)
            for (let j = 0; j < reviewersId.length; j++) {
                let rev_id = reviewersId[j];
                //console.log(reviewersId[j]);
                if (!rev_id) continue;
                if (MetricsUtils.isABot(rev_id)) continue;
                nodes.add(rev_id);
                let edge = [owner_id, rev_id];
                edges.push(edge);
            }
    }
    let graph = {};
    graph["id"] = id;
    graph["owner_id"] = owner;
    graph["nodes"] = [...nodes];
    graph["edges"] = [...edges];
    return graph;
}

Array.prototype.except = function (val) {
    return this.filter(function (x) {
        return x !== val;
    });
};

function buildFullConnectedGraph(docs, id, owner) {
    let nodes = new Set();
    let edges = [];
    for (let i = 0; i < docs.length; i++) {
        let doc = docs[i];
        let owner_id = doc["owner_id"];
        if (!owner_id) continue;
        nodes.add(owner_id);
        let reviewersId = doc["reviewers_id"];
        if (reviewersId)
            for (let j = 0; j < reviewersId.length; j++) {
                let revId1 = reviewersId[j];
                nodes.add(revId1);
                let edge = [owner_id, revId1];
                edges.push(edge);

                for (let k = 0; k < reviewersId.length; k++) {
                    let revId2 = reviewersId[k];
                    if (revId1 === revId2) continue;
                    let edge = [revId1, revId2];
                    edges.push(edge);
                }

            }
    }
    let graph = {};
    graph["id"] = id;
    graph["owner_id"] = owner;
    graph["nodes"] = [...nodes];
    graph["edges"] = [...edges];
    return graph;
}
