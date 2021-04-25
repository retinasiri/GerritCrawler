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
const MetricsUtils = require("./metrics-utils");

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let projectDBUrl = Database.libreOfficeDBUrl;
let projectApiUrl = ApiEndPoints.qtApiUrl;

let STARTING_POINT = 0;
let NUM_OF_CHANGES_LIMIT = 1000;
let NUMBER_DATABASE_REQUEST = 4;
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
            NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUMBER_DATABASE_REQUEST);
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, STARTING_POINT);

            let tasks = []
            for (let i = 0; i < NUMBER_DATABASE_REQUEST; i++) {
                tasks.push(getChanges(NUM_OF_CHANGES_LIMIT * i))
            }
            return Promise.all(tasks);
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
            if (!docs)
                Promise.resolve(false)
            return docs.length ? collectDocs(docs) : Promise.resolve(false);
        })
        /*.then(result => {
            return result ? getChanges(skip + NUM_OF_CHANGES_LIMIT) : Promise.resolve(false);
        })*/
        .catch(err => {
            console.log(err)
        });
}

/*async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);

    const generatePromises = function*() {
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
}*/

async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        await collectMetrics(docs[key])
            .then((json) => {
                return saveMetrics(json);
            })
    }
    return Promise.resolve(true);
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

        Object.keys(values).forEach(function (key) {
            metric[key] = values[key];
        })

        let changesTimeInfo = getChangesTimeInfo(json, values.priorMergedChangesCount, values.priorAbandonedChangesCount)
        let task = Promise.resolve(metric);
        return Promise.all([changesTimeInfo, task]);
    }).then((results) => {

        let values = results[0];
        let metric = results[1];

        Object.keys(values).forEach(function (key) {
            metric[key] = values[key];
        })

        return Promise.resolve(metric);
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
        priorAbandonedChangesCount, //2
        ownerPriorChangesCount, //3
        ownerPriorMergedChangesCount, //4
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
        .allowDiskUse(true)
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
    let pipeline = [{
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

function getPriorSubsystemChangesCount(json) {
    let number = json._number;
    let project = json.project;
    let pipeline = [{
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
    let pipeline = [{
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
    let pipeline = [{
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
    let pipeline = [{
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

//time metrics
//-mean time merged
//-mean time abandoned
//-mean owner time merged
//-mean owner time abandoned

//reviewer num changes
//-mean reviewer num merged
//-mean reviewer num abandoned

//-mean reviewer time merged
//-mean reviewer time abandoned

//-mean reviewer percentage of merged
//-mean reviewer percentage of abandoned

//-mean reviewer merged ratio
//-mean reviewer abandoned ratio

//-mean file num of merged
//-mean file num of abandoned
//-mean file time of merged
//-mean file time of abandoned
//-mean file time per owner
//-mean file time per reviewer

//todo count owner num of review
//todo count file num of dev

function genericDBRequest(pipeline) {
    return Change
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return 0;
            return docs.length > 0 ? docs[0] : [];
        })
        .catch(err => {
            console.log(err)
        });
}

async function getChangesTimeInfo(json, mergedCount, abandonedCount) {
    let priorChangeMeanTimeMerged = getPriorChangeMeanTimeType(json, "MERGED");
    let priorChangeMeanTimeAbandoned = getPriorChangeMeanTimeType(json, "ABANDONED");

    let priorOwnerChangesMeanTimeMerged = getPriorOwnerChangesMeanTimeType(json, "MERGED");
    let priorOwnerChangesMeanTimeAbandoned = getPriorOwnerChangesMeanTimeType(json, "ABANDONED");

    let reviewersChangesMeanNumMerged = getReviewersChangesMeanNumType(json, "MERGED", mergedCount);
    let reviewersChangesMeanNumAbandoned = getReviewersChangesMeanNumType(json, "ABANDONED", abandonedCount);

    let fileTimeAndCountMerged = getFileTimeAndCount(json, "MERGED");
    let fileTimeAndCountAbandoned = getFileTimeAndCount(json, "ABANDONED");

    let fileTimeAndCountForOwnerMerged = getFileTimeAndCountForOwner(json, "MERGED");
    let fileTimeAndCountForOwnerAbandoned = getFileTimeAndCountForOwner(json, "ABANDONED");

    let fileTimeAndCountForReviewersMerged = getFileTimeAndCountForReviewers(json, "MERGED");
    let fileTimeAndCountForReviewersAbandoned = getFileTimeAndCountForReviewers(json, "ABANDONED");

    return Promise.all([
        priorChangeMeanTimeMerged, //0
        priorChangeMeanTimeAbandoned, //1

        priorOwnerChangesMeanTimeMerged, //2
        priorOwnerChangesMeanTimeAbandoned, //3

        reviewersChangesMeanNumMerged, //4
        reviewersChangesMeanNumAbandoned, //5

        fileTimeAndCountMerged, //6
        fileTimeAndCountAbandoned, //7

        fileTimeAndCountForOwnerMerged, //8
        fileTimeAndCountForOwnerAbandoned, //9

        fileTimeAndCountForReviewersMerged, //10
        fileTimeAndCountForReviewersAbandoned, //11
    ]).then((results) => {
        //console.log(results);
        return {
            priorMergedChangeMeanTime: results[0].avg,
            priorAbandonedChangeMeanTime: results[1].avg,
            priorOwnerMergedChangesMeanTime: results[2].avg,
            priorOwnerAbandonedChangesMeanTime: results[3].avg,

            reviewersMergedChangesCountAvg: results[4].count_avg,
            reviewersMergedChangesCountMax: results[4].count_max,
            reviewersMergedChangesCountMin: results[4].count_min,
            reviewersMergedChangesTimeAvg: results[4].time_avg,
            reviewersMergedChangesTimeMax: results[4].time_max,
            reviewersMergedChangesTimeMin: results[4].time_min,
            reviewersMergedChangesPercentageAvg: results[4].percentage_avg,
            reviewersMergedChangesRatioAvg: results[4].ratio_avg,

            reviewersAbandonedChangesCountAvg: results[5].count_avg,
            reviewersAbandonedChangesCountMax: results[5].count_max,
            reviewersAbandonedChangesCountMin: results[5].count_min,
            reviewersAbandonedChangesTimeAvg: results[5].time_avg,
            reviewersAbandonedChangesTimeMax: results[5].time_max,
            reviewersAbandonedChangesTimeMin: results[5].time_min,
            reviewersAbandonedChangesPercentageAvg: results[5].percentage_avg,
            reviewersAbandonedChangesRatioAvg: results[5].ratio_avg,

            mergedFileCountAvg: results[6].count_avg,
            mergedFileTimeAvg: results[6].time_avg,
            abandonedFileCountAvg: results[7].count_avg,
            abandonedFileTimeAvg: results[7].time_avg,

            ownerMergedFileCountAvg: results[8].count_avg,
            ownerMergedFileTimeAvg: results[8].time_avg,
            ownerAbandonedFileCountAvg: results[9].count_avg,
            ownerAbandonedFileTimeAvg: results[9].time_avg,

            reviewersMergedFileCountAvg: results[10].count_avg,
            reviewersMergedFileTimeAvg: results[10].time_avg,
            reviewersAbandonedFileCountAvg: results[11].count_avg,
            reviewersAbandonedFileTimeAvg: results[11].time_avg,

        };
    })
}


function getPriorChangeMeanTimeType(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let match = {
        $match: {
            status: TYPE,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    };
    let project = getProject();
    let pipeline = [
        match,
        project,
        {$group: {_id: 1, avg: {$avg: "$dateDiff"}}}
    ]
    return genericDBRequest(pipeline);
}

function getPriorOwnerChangesMeanTimeType(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = getProject();
    let match = {
        $match: {
            status: TYPE,
            'owner._account_id': ownerId,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    };
    let pipeline = [
        match,
        project,
        {$group: {_id: 1, avg: {$avg: "$dateDiff"}}}
    ]
    return genericDBRequest(pipeline);
}

function getProject() {
    return {
        $project: {
            _id: 0,
            dateDiff: {
                $subtract: [
                    {$dateFromString: {dateString: {$substr: ["$updated", 0, 22]}, timezone: "UTC"}},
                    {$dateFromString: {dateString: {$substr: ["$created", 0, 22]}, timezone: "UTC"}}
                ]
            }
        }
    }
}

//exclude bot in reviewersIdArray
function getReviewersChangesMeanNumType(json, TYPE, count) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let reviewersIdArray = MetricsUtils.getHumanReviewersID(json);
    let match = {
        $match: {
            status: TYPE,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = [
        match,
        {$unwind: "$reviewers.REVIEWER"},
        {
            $project: {
                id: 1,
                owner_id: "$owner._account_id",
                reviewers_id: "$reviewers.REVIEWER._account_id",
                dateDiff: {
                    $subtract: [
                        {$dateFromString: {dateString: {$substr: ["$updated", 0, 22]}, timezone: "UTC"}},
                        {$dateFromString: {dateString: {$substr: ["$created", 0, 22]}, timezone: "UTC"}}
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$reviewers_id",
                count: {$sum: 1},
                ratio: {"$divide": [{$sum: 1}, count]},
                time: {$avg: "$dateDiff"}
            }
        },
        {$match: {_id: {$in: reviewersIdArray}}},
        {
            $group: {
                _id: 1,
                count_avg: {$avg: "$count"},
                count_max: {$max: "$count"},
                count_min: {$min: "$count"},
                time_avg: {$avg: "$time"},
                time_max: {$max: "$time"},
                time_min: {$min: "$time"},
                percentage_avg: {$divide: [{$avg: "$count"}, count]},
                ratio_avg: {$avg: "$ratio"}
            }
        }
    ]
    return genericDBRequest(pipeline);
}

//mean file num of merged
//mean file num of abandoned
//mean file time per owner
//mean file time per reviewer

function get_file_pipeline(match, files_list) {
    return [
        match,
        {$unwind: "$files_list"},
        {
            $project: {
                id: 1, filename: "$files_list", dateDiff: {
                    $subtract: [
                        {$dateFromString: {dateString: {$substr: ["$updated", 0, 22]}, timezone: "UTC"}},
                        {$dateFromString: {dateString: {$substr: ["$created", 0, 22]}, timezone: "UTC"}}
                    ]
                }
            }
        },
        {$group: {_id: "$filename", count: {$sum: 1}, time: {$avg: "$dateDiff"}}},
        {$match: {_id: {$in: files_list}}},
        {
            $group: {
                _id: 1,
                count_avg: {$avg: "$count"},
                time_avg: {$avg: "$time"}
            }
        }
    ]
}

function getFileTimeAndCount(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let files_list = json.files_list;
    let match = {
        $match: {
            status: TYPE,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = get_file_pipeline(match, files_list);
    return genericDBRequest(pipeline);
}

function getFileTimeAndCountForOwner(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let ownerId = json.owner._account_id;
    let number = json._number;
    let files_list = json.files_list;
    let match = {
        $match: {
            status: TYPE,
            'owner._account_id': ownerId,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = get_file_pipeline(match, files_list);
    return genericDBRequest(pipeline);
}

//reviewer
function getFileTimeAndCountForReviewers(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let files_list = json.files_list;
    let reviewersIdArray = MetricsUtils.getHumanReviewersID(json);
    let match = {
        $match: {
            status: TYPE,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$reviewers.REVIEWER"},
        {$unwind: "$files_list"},
        {
            $project: {
                id: 1,
                filename: "$files_list",
                reviewers_id: "$reviewers.REVIEWER._account_id",
                dateDiff: {
                    $subtract: [
                        {$dateFromString: {dateString: {$substr: ["$updated", 0, 22]}, timezone: "UTC"}},
                        {$dateFromString: {dateString: {$substr: ["$created", 0, 22]}, timezone: "UTC"}}
                    ]
                }
            }
        },
        {
            $match: {
                filename: {$in: files_list},
                reviewers_id: {$in: reviewersIdArray}
            }
        },
        {$group: {_id: "$filename", count: {$sum: 1}, time: {$avg: "$dateDiff"}}},
        {$group: {_id: 1, count_avg: {$avg: "$count"}, time_avg: {$avg: "$time"}}}
    ]
    return genericDBRequest(pipeline);
}

//todo file developper num
//todo owner num of revision mean
//todo owner number of review
//todo multiprocess graph
//test
//refactoring et config file
//install server

function getOwnerNumberOfRevision(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            status: TYPE,
            _number: {$lt: number},
            "owner._account_id": ownerId,
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$project: {id: 1, owner_id: "$owner._account_id", revisions_num: {"$size": {"$objectToArray": "$revisions"}}}},
        {
            $group: {
                _id: "$owner_id",
                revision_avg: {$avg: "$revisions_num"},
                revision_max: {$max: "$revisions_num"},
                revision_min: {$min: "$revisions_num"}
            }
        },
    ]
    return genericDBRequest(pipeline);
}

function getOwnerNumberOfReview(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            status: TYPE,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$reviewers.REVIEWER"},
        {$project: {id: 1, reviewers: "$reviewers.REVIEWER"}},
        {$match: {"reviewers._account_id": ownerId}},
        {$count: "count"}
    ]
    return genericDBRequest(pipeline);
}

function getFileDeveloperNumber(json, TYPE) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let files_list = json.files_list;
    let match = {
        $match: {
            status: TYPE,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$files_list"},
        {$match: {files_list: {$in: files_list}}},
        {$group: {_id: "$files_list", dev: {$addToSet: '$owner._account_id'}}},
        {$group: {_id: 1, count_avg: {$avg: {$size: "$dev"}}}}
    ]
    return genericDBRequest(pipeline);
}

