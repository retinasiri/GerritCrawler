const MathJs = require('mathjs');
const Moment = require('moment');
const Change = require('../models/change');
const MetricsUtils = require("./metrics-utils");

let projectName = "libreoffice";
let start = 0;
let end = 10000;

if (typeof require !== 'undefined' && require.main === module) {
    startComputeMetrics(projectName).catch(err => {
        console.log(err)
    });
}

function startComputeMetrics(projectJson) {
    if (projectJson["projectName"])
        projectName = projectJson["projectName"];
    if (projectJson["start"])
        start = projectJson["start"];
    if (projectJson["end"])
        end = projectJson["end"];
    return MetricsUtils.startComputeMetrics(projectName, start, end, "owner", function (json) {
        return collectMetrics(json)
    });
}

async function collectMetrics(json) {
    return getChangesInfo(json).then((values) => {
        let metric = {};
        metric["number"] = json._number;
        metric["id"] = json.id;
        Object.keys(values).forEach(function (key) {
            if (values[key] === null || values[key] === undefined) {
                metric[key] = 0;
            } else {
                metric[key] = values[key];
            }
        })
        //let changesTimeInfo = getChangesTimeInfo(json, values.priorMergedChangesCount, values.priorAbandonedChangesCount, values.priorChangesCount)
        //let task = Promise.resolve(metric);
        //return Promise.all([changesTimeInfo, task]);

        return Promise.resolve(metric);
    })
        /*.then((results) => {
        let values = results[0];
        let metric = results[1];
        Object.keys(values).forEach(function (key) {
            if (values[key] === null || values[key] === undefined) {
                metric[key] = 0;
            } else {
                metric[key] = values[key];
            }
        })
        return Promise.resolve(metric);
    });*/
}

//count prior code changes
//count prior merged changes
//count prior abandoned changes

//count owner prior code changes
//count owner prior merged changes
//count owner prior abandoned changes

//count subsystem prior code changes
//count subsystem prior merged changes
//count subsystem prior abandoned changes

//count owner subsystem prior code changes
//count owner subsystem prior merged changes
//count owner subsystem prior abandoned changes

//count merge ratio
//count abandoned ratio

//count prior Subsystem percentage

//count total change
//count owner merged
//count owner all change
//count owner merge ratio
//count percentage of merged
//count owner percentage of merge

async function getChangesInfo(json) {
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

    //getChangesTimeInfo
    let priorChangesDuration = getPriorChangeMeanTimeType(json, {$in: ['MERGED', 'ABANDONED']});
    let priorOwnerChangesDuration = getPriorOwnerChangesMeanTimeType(json, {$in: ['MERGED', 'ABANDONED']});
    let fileTimeAndCount = getFileTimeAndCount(json, {$in: ['MERGED', 'ABANDONED']});
    let fileTimeAndCountForOwner = getFileTimeAndCountForOwner(json, {$in: ['MERGED', 'ABANDONED']});
    let ownerNumberOfRevision = getOwnerNumberOfRevision(json, {$in: ['MERGED', 'ABANDONED']});
    let ownerNumberOfReview = getOwnerNumberOfReview(json);
    let fileDeveloperNumber = getFileDeveloperNumber(json);
    let ownerPreviousMessageCount = getOwnerPreviousMessageCount(json);
    let ownerChangesMessagesCountAndAvgPerChanges = getOwnerChangesMessagesCountAndAvgPerChanges(json);
    let changesMessagesCountAndAvg = getChangesMessagesCountAndAvg(json);
    let priorChangesFiles = getPriorChangesFiles(json);

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
        priorSubsystemOwnerAbandonedChangesCount, //11

        priorChangesDuration, //12
        priorOwnerChangesDuration, //13
        fileTimeAndCount, //14
        fileTimeAndCountForOwner, //15
        ownerNumberOfRevision, //16
        ownerNumberOfReview, //17
        fileDeveloperNumber, //18
        ownerPreviousMessageCount, //19
        ownerChangesMessagesCountAndAvgPerChanges, //20
        changesMessagesCountAndAvg, //21
        priorChangesFiles, //22
        //nonBotAccountPreviousMessageCount, //23

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

            priorSubsystemPercentage: safeDivision(results[6], results[0]),
            priorSubsystemMergedRatio: safeDivision(results[7], results[6]),
            priorSubsystemAbandonedRatio: safeDivision(results[8], results[6]),

            priorSubsystemMergedPercentageInMerged: safeDivision(results[7], results[1]),
            priorSubsystemAbandonedPercentageInAbandoned: safeDivision(results[8], results[2]),

            priorOwnerSubsystemChangesRatio: safeDivision(results[9], results[6]),
            priorOwnerSubsystemMergedChangesRatio: safeDivision(results[10], results[9]),
            priorOwnerSubsystemAbandonedChangesRatio: safeDivision(results[11], results[9]),

            priorOwnerPercentageOfMergedInSubsystem: safeDivision(results[10], results[7]),
            priorOwnerPercentageOfAbandonedInSubsystem: safeDivision(results[11], results[8]),


            //getChangesTimeInfo

            priorChangeDurationMean: results[12].avg,
            priorChangeDurationMax: results[12].max,
            priorChangeDurationMin: results[12].min,
            priorChangeDurationStd: results[12].std,

            priorOwnerChangesDurationMean: results[13].avg,
            priorOwnerChangesDurationMax: results[13].max,
            priorOwnerChangesDurationMin: results[13].min,
            priorOwnerChangesDurationStd: results[13].std,

            fileCountAvg: results[14].count_avg,
            fileCountMax: results[14].count_max,
            fileCountMin: results[14].count_min,
            fileCountStd: results[14].count_std,
            fileTimeAvg: results[14].time_avg,
            fileTimeMax: results[14].time_max,
            fileTimeMin: results[14].time_min,
            fileTimeStd: results[14].time_std,

            ownerFileCountAvg: results[15].count_avg,
            ownerFileCountMax: results[15].count_max,
            ownerFileCountMin: results[15].count_min,
            ownerFileCountStd: results[15].count_std,
            ownerFileTimeAvg: results[15].time_avg,
            ownerFileTimeMax: results[15].time_max,
            ownerFileTimeMin: results[15].time_min,
            ownerFileTimeStd: results[15].time_std,

            ownerNumberOfRevisionAvg: results[16].revision_avg,
            ownerNumberOfRevisionMax: results[16].revision_max,
            ownerNumberOfRevisionMin: results[16].revision_min,
            ownerNumberOfRevisionStd: results[16].revision_std,

            ownerNumberOfReview: results[17].count,

            //rename fileDeveloperNumber: results[18].count,
            AvgNumberOfDeveloperWhoModifiedFiles: results[18].count,

            ownerPreviousMessageCount: results[19].count,

            ownerChangesMessagesSum: results[20].count,
            ownerChangesMessagesAvgPerChanges: results[20].avg,
            ownerChangesMessagesMaxPerChanges: results[20].max,
            ownerChangesMessagesMinPerChanges: results[20].min,
            ownerChangesMessagesStdPerChanges: results[20].std,

            changesMessagesSum: results[21].count,
            changesMessagesAvg: results[21].avg,
            changesMessagesMax: results[21].max,
            changesMessagesMin: results[21].min,
            changesMessagesStd: results[21].std,

            priorChangesFiles: results[22].count,

            /*
            nonBotAccountPreviousMessageSum: results[23].count,
            nonBotAccountPreviousMessageAvg: results[23].avg,
            nonBotAccountPreviousMessageMax: results[23].max,
            nonBotAccountPreviousMessageMin: results[23].min,
            nonBotAccountPreviousMessageStd: results[23].std,
            */

        };
    })
}

/*
async function getChangesTimeInfo(json) {
    let priorChangesDuration = getPriorChangeMeanTimeType(json, {$in: ['MERGED', 'ABANDONED']});
    let priorOwnerChangesDuration = getPriorOwnerChangesMeanTimeType(json, {$in: ['MERGED', 'ABANDONED']});
    let fileTimeAndCount = getFileTimeAndCount(json, {$in: ['MERGED', 'ABANDONED']});
    let fileTimeAndCountForOwner = getFileTimeAndCountForOwner(json, {$in: ['MERGED', 'ABANDONED']});
    let ownerNumberOfRevision = getOwnerNumberOfRevision(json, {$in: ['MERGED', 'ABANDONED']});
    let ownerNumberOfReview = getOwnerNumberOfReview(json);
    let fileDeveloperNumber = getFileDeveloperNumber(json);
    let ownerPreviousMessageCount = getOwnerPreviousMessageCount(json);
    let ownerChangesMessagesCountAndAvgPerChanges = getOwnerChangesMessagesCountAndAvgPerChanges(json);
    let changesMessagesCountAndAvg = getChangesMessagesCountAndAvg(json);
    let priorChangesFiles = getPriorChangesFiles(json);
    //let nonBotAccountPreviousMessageCount = getPreviousMessageCount(json);
    return Promise.all([
        priorChangesDuration, //0
        priorOwnerChangesDuration, //1
        fileTimeAndCount, //2
        fileTimeAndCountForOwner, //3
        ownerNumberOfRevision, //4
        ownerNumberOfReview, //5
        fileDeveloperNumber, //6
        ownerPreviousMessageCount, //7
        ownerChangesMessagesCountAndAvgPerChanges, //8
        changesMessagesCountAndAvg, //9
        priorChangesFiles, //10
        //nonBotAccountPreviousMessageCount, //11
    ]).then((results) => {
        //console.log(results);
        return {

            priorChangeDurationMean: results[0].avg,
            priorChangeDurationMax: results[0].max,
            priorChangeDurationMin: results[0].min,
            priorChangeDurationStd: results[0].std,

            priorOwnerChangesDurationMean: results[1].avg,
            priorOwnerChangesDurationMax: results[1].max,
            priorOwnerChangesDurationMin: results[1].min,
            priorOwnerChangesDurationStd: results[1].std,

            fileCountAvg: results[2].count_avg,
            fileCountMax: results[2].count_max,
            fileCountMin: results[2].count_min,
            fileCountStd: results[2].count_std,
            fileTimeAvg: results[2].time_avg,
            fileTimeMax: results[2].time_max,
            fileTimeMin: results[2].time_min,
            fileTimeStd: results[2].time_std,

            ownerFileCountAvg: results[3].count_avg,
            ownerFileCountMax: results[3].count_max,
            ownerFileCountMin: results[3].count_min,
            ownerFileCountStd: results[3].count_std,
            ownerFileTimeAvg: results[3].time_avg,
            ownerFileTimeMax: results[3].time_max,
            ownerFileTimeMin: results[3].time_min,
            ownerFileTimeStd: results[3].time_std,

            ownerNumberOfRevisionAvg: results[4].revision_avg,
            ownerNumberOfRevisionMax: results[4].revision_max,
            ownerNumberOfRevisionMin: results[4].revision_min,
            ownerNumberOfRevisionStd: results[4].revision_std,

            ownerNumberOfReview: results[5].count,

            //rename fileDeveloperNumber: results[6].count,
            AvgNumberOfDeveloperWhoModifiedFiles: results[6].count,

            ownerPreviousMessageCount: results[7].count,

            ownerChangesMessagesSum: results[8].count,
            ownerChangesMessagesAvgPerChanges: results[8].avg,
            ownerChangesMessagesMaxPerChanges: results[8].max,
            ownerChangesMessagesMinPerChanges: results[8].min,
            ownerChangesMessagesStdPerChanges: results[8].std,

            changesMessagesSum: results[9].count,
            changesMessagesAvg: results[9].avg,
            changesMessagesMax: results[9].max,
            changesMessagesMin: results[9].min,
            changesMessagesStd: results[9].std,

            priorChangesFiles: results[10].count,


            //nonBotAccountPreviousMessageSum: results[11].count,
            //nonBotAccountPreviousMessageAvg: results[11].avg,
            //nonBotAccountPreviousMessageMax: results[11].max,
            //nonBotAccountPreviousMessageMin: results[11].min,
            //nonBotAccountPreviousMessageStd: results[11].std,


        };
    })
}
*/


function safeDivision(number1, number2) {
    return number2 !== 0 ? MathJs.divide(number1, number2) : 0;
}

function safe_result(number) {
    return number ? number : 0;
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
    let created_date = json.created;
    let number = json._number;
    let pipeline = [
        {
            $match: {
                status: TYPE,
                _number: {$lt: number},
                updated: {$lte: created_date}
            }
        },
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
        {
            $match: {
                'owner._account_id': ownerId,
                _number: {$lt: number}
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

function getOwnerPriorTypeChangesCount(json, TYPE) {
    let created_date = json.created;
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

function getPriorBranchChangesCount(json) {
    let number = json._number;
    let branch = json.branch;
    let pipeline = [{
        $match: {
            branch: branch,
            _number: {$lt: number},
        }
    },
        {$count: "count"}
    ]

    return dbRequest(pipeline);
}

function getPriorBranchTypeChangesCount(json, TYPE) {
    let created_date = json.created;
    let number = json._number;
    let branch = json.branch;
    let pipeline = [{
        $match: {
            branch: branch,
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
    let created_date = json.created;
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
    let created_date = json.created;
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

//check
function getPriorChangeMeanTimeType(json, TYPE) {
    let created_date = json.created;
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
        {
            $group: {
                _id: 1,
                avg: {$avg: "$dateDiff"},
                max: {$max: "$dateDiff"},
                min: {$min: "$dateDiff"},
                std: {$stdDevPop: "$dateDiff"}
            }
        }
    ]
    return genericDBRequest(pipeline);
}

//check
function getPriorOwnerChangesMeanTimeType(json, TYPE) {
    let created_date = json.created;
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
        {
            $group: {
                _id: 1,
                avg: {$avg: "$dateDiff"},
                max: {$max: "$dateDiff"},
                min: {$min: "$dateDiff"},
                std: {$stdDevPop: "$dateDiff"}
            }
        }
    ]
    return genericDBRequest(pipeline);
}

//exclude bot in reviewersIdArray
function getReviewersChangesMeanNumType(json, TYPE, count) {
    let created_date = json.created;
    let number = json._number;
    let reviewersIdArray = MetricsUtils.getHumanReviewersID(json, projectName) ? MetricsUtils.getHumanReviewersID(json, projectName) : [];
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
                //ratio: {"$divide": [{$sum: 1}, count]},
                time: {$avg: "$dateDiff"}
            }
        },
        {
            $project: {
                _id: 1,
                count: 1,
                time: 1,
                ratio: {
                    $cond: [
                        {$eq: [count, 0]},
                        0,
                        {"$divide": ["$count", count]}]
                },
            }
        },
        {$match: {_id: {$in: reviewersIdArray}}},
        {
            $group: {
                _id: 1,
                count_avg: {$avg: "$count"},
                count_max: {$max: "$count"},
                count_min: {$min: "$count"},
                count_std: {$stdDevPop: "$count"},
                time_avg: {$avg: "$time"},
                time_max: {$max: "$time"},
                time_min: {$min: "$time"},
                time_std: {$stdDevPop: "$time"},
                //percentage_avg: {$divide: [{$avg: "$count"}, count]},
                ratio_avg: {$avg: "$ratio"}
            }
        },
        {
            $project: {
                _id: 1,
                count_avg: 1,
                count_max: 1,
                count_min: 1,
                count_std: 1,
                time_avg: 1,
                time_max: 1,
                time_min: 1,
                time_std: 1,
                ratio_avg: 1,
                percentage_avg: {
                    $cond: [
                        {$eq: [count, 0]},
                        0,
                        {"$divide": ["$count", count]}]
                },
                //percentage_avg: {$divide: [{$avg: "$count"}, count]},
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
                count_max: {$max: "$count"},
                count_min: {$min: "$count"},
                count_std: {$stdDevPop: "$count"},
                time_avg: {$avg: "$time"},
                time_max: {$max: "$time"},
                time_min: {$min: "$time"},
                time_std: {$stdDevPop: "$time"},
            }
        }
    ]
}

function getFileTimeAndCount(json, TYPE) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            status: TYPE,
            _number: {$lt: number},
            updated: {$lte: created_date},
            files_list: {$in: files_list}
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = get_file_pipeline(match, files_list);
    return genericDBRequest(pipeline);
}

function getFileTimeAndCountForOwner(json, TYPE) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            status: TYPE,
            'owner._account_id': ownerId,
            _number: {$lt: number},
            updated: {$lte: created_date},
            files_list: {$in: files_list}
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = get_file_pipeline(match, files_list);
    return genericDBRequest(pipeline);
}

//reviewer
function getFileTimeAndCountForReviewers(json, TYPE) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list;
    let reviewersIdArray = MetricsUtils.getHumanReviewersID(json, projectName) ? MetricsUtils.getHumanReviewersID(json, projectName) : [];
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
        {
            $group: {
                _id: 1,
                count_avg: {$avg: "$count"},
                time_avg: {$avg: "$time"}
            }
        }
    ]
    return genericDBRequest(pipeline);
}

//file developper num
//owner num of revision mean
//owner number of review
//test
//refactoring et config file
//install server

//check
function getOwnerNumberOfRevision(json, TYPE) {
    let created_date = json.created;
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
                revision_min: {$min: "$revisions_num"},
                revision_std: {$stdDevPop: "$revisions_num"}
            }
        },
    ]
    return genericDBRequest(pipeline);
}

//done
function getOwnerNumberOfReview(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date},
            "reviewers._account_id": ownerId
        }
    }
    let pipeline = [
        match,
        //{$unwind: "$reviewers.REVIEWER"},
        //{$project: {id: 1, reviewers: "$reviewers.REVIEWER"}},
        //{$match: {"reviewers._account_id": ownerId}},
        {$count: "count"}
    ]
    return genericDBRequest(pipeline);
}

//done
function getFileDeveloperNumber(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date},
            files_list: {$in: files_list}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$files_list"},
        {$match: {files_list: {$in: files_list}}},
        {$group: {_id: "$files_list", dev: {$addToSet: '$owner._account_id'}}},
        {
            $group: {
                _id: 1,
                count: {$avg: {$size: "$dev"}}
            }
        }
    ]
    return genericDBRequest(pipeline);
}

//done
function getPriorChangesFiles(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date},
            files_list: {$in: files_list}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$files_list"},
        {$match: {files_list: {$in: files_list}}},
        {$group: {_id: "$id"}},
        {$count: "count"}
    ]
    return genericDBRequest(pipeline);
}

//done
function getOwnerPreviousMessageCount(json) {
    let created_date = json.created;
    let number = json._number;
    let owner_id = json.owner._account_id;
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date},
            "messages.author._account_id": owner_id
        }
    }
    let pipeline = [
        match,
        {$unwind: "$messages"},
        {$group: {_id: "$messages.author._account_id", count: {$sum: 1}}},
        {$match: {_id: owner_id}},
    ]
    return genericDBRequest(pipeline);
}

//bad
function getPreviousMessageCount(json) {
    let created_date = json.created;
    let number = json._number;
    let botArray = MetricsUtils.getBotArray(projectName)
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$messages"},
        {
            $group: {
                _id: "$messages.author._account_id",
                count: {$sum: 1}
            }
        },
        {$match: {_id: {$nin: botArray}}},
        {
            $group: {
                _id: 1,
                avg: {$avg: "$count"},
                max: {$max: "$count"},
                min: {$min: "$count"},
                std: {$stdDevPop: "$count"},
            }
        }
    ]
    return genericDBRequest(pipeline);
}

function getReviewersTotalPreviousMessagesCount(json) {
    let created_date = json.created;
    let number = json._number;
    let reviewersIdArray = MetricsUtils.getHumanReviewersID(json, projectName) ? MetricsUtils.getHumanReviewersID(json, projectName) : [];
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$messages"},
        {$group: {_id: "$messages.author._account_id", count: {$sum: 1}}},
        {$match: {_id: {$in: reviewersIdArray}}},
        {$group: {_id: 1, count: {$sum: "$count"}}},
    ]
    return genericDBRequest(pipeline);
}

//check
function getOwnerChangesMessagesCountAndAvgPerChanges(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            _number: {$lt: number},
            "owner._account_id": ownerId,
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        //{$unwind: "$messages"},
        //{$group: {_id: "$id", count:{$sum:1}}},
        //{$group: {_id: 1, count:{$sum:"$count"}, avg:{$avg:"$count"}}},
        {$project: {id: 1, msg_count: {$size: "$messages"}}},
        {
            $group: {
                _id: 1,
                count: {$sum: "$msg_count"},
                avg: {$avg: "$msg_count"},
                max: {$max: "$msg_count"},
                min: {$avg: "$msg_count"},
                std: {$stdDevPop: "$msg_count"}
            }
        }
    ]
    return genericDBRequest(pipeline);
}

//check
function getChangesMessagesCountAndAvg(json) {
    let created_date = json.created;
    let number = json._number;
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$project: {id: 1, msg_count: {$size: "$messages"}}},
        {
            $group: {
                _id: 1,
                count: {$sum: "$msg_count"},
                avg: {$avg: "$msg_count"},
                max: {$max: "$msg_count"},
                min: {$avg: "$msg_count"},
                std: {$stdDevPop: "$msg_count"}
            }
        }
    ]
    return genericDBRequest(pipeline);
}

function getOwnerAndReviewerCommonsChangesAndMessages(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let accountIdArray = MetricsUtils.getHumanReviewersID(json, projectName) ? MetricsUtils.getHumanReviewersID(json, projectName) : [];
    accountIdArray.push(ownerId);
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$messages"},
        {$unwind: "$reviewers.REVIEWER"},
        {$match: {"owner._account_id": {$in: accountIdArray}}},
        {$match: {"reviewers.REVIEWER._account_id": {$in: accountIdArray}}},
        {
            $group: {
                _id: "$reviewers.REVIEWER._account_id",
                id: {$addToSet: "$id"},
                messages: {$sum: 1},
            }
        },
        {$project: {_id: "$_id", changes_count: {$size: "$id"}, messages_count: "$messages"}},
        {
            $group: {
                _id: 1,
                changes_count_sum: {$sum: "$changes_count"},
                changes_count_avg: {$avg: "$changes_count"},
                changes_count_max: {$max: "$changes_count"},
                changes_count_min: {$min: "$changes_count"},
                changes_count_std: {$stdDevPop: "$changes_count"},
                messages_count_sum: {$sum: "$messages_count"},
                messages_count_avg: {$avg: "$messages_count"},
                messages_count_max: {$max: "$messages_count"},
                messages_count_min: {$min: "$messages_count"},
                messages_count_std: {$stdDevPop: "$messages_count"},
            }
        },
    ]
    return genericDBRequest(pipeline);
}

function getOwnerChangesCountAndMessagesCountWithSameReviewers(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let accountIdArray = MetricsUtils.getHumanReviewersID(json, projectName) ? MetricsUtils.getHumanReviewersID(json, projectName) : [];
    accountIdArray.push(ownerId);
    let match = {
        $match: {
            "owner._account_id": ownerId,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$messages"},
        {$unwind: "$reviewers.REVIEWER"},
        {$match: {"reviewers.REVIEWER._account_id": {$in: accountIdArray}}},
        {
            $group: {
                _id: "$reviewers.REVIEWER._account_id",
                id: {$addToSet: "$id"},
                messages: {$sum: 1},
            }
        },
        {$project: {_id: "$_id", changes_count: {$size: "$id"}, messages_count: "$messages"}},
        {
            $group: {
                _id: 1,
                changes_count_sum: {$sum: "$changes_count"},
                changes_count_avg: {$avg: "$changes_count"},
                changes_count_max: {$max: "$changes_count"},
                changes_count_min: {$min: "$changes_count"},
                changes_count_std: {$stdDevPop: "$changes_count"},
                messages_count_sum: {$sum: "$messages_count"},
                messages_count_avg: {$avg: "$messages_count"},
                messages_count_max: {$max: "$messages_count"},
                messages_count_min: {$min: "$messages_count"},
                messages_count_std: {$stdDevPop: "$messages_count"},
            }
        },
    ]
    return genericDBRequest(pipeline);
}

module.exports = {
    start: startComputeMetrics
};