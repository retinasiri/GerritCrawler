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
            if (values[key] === null) {
                metric[key] = 0;
            } else {
                metric[key] = values[key];
            }
        })
        let changesTimeInfo = getChangesTimeInfo(json, values.priorMergedChangesCount, values.priorAbandonedChangesCount)
        let task = Promise.resolve(metric);
        return Promise.all([changesTimeInfo, task]);
        //return Promise.resolve(metric);
    }).then((results) => {
        let values = results[0];
        let metric = results[1];
        Object.keys(values).forEach(function (key) {
            if (values[key] === null) {
                metric[key] = 0;
            } else {
                metric[key] = values[key];
            }
        })
        return Promise.resolve(metric);
    });
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

        };
    })
}

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

    let ownerNumberOfRevisionMerged = getOwnerNumberOfRevision(json, "MERGED");
    let ownerNumberOfRevisionAbandoned = getOwnerNumberOfRevision(json, "ABANDONED");

    let ownerNumberOfReview = getOwnerNumberOfReview(json, "ABANDONED");

    let fileDeveloperNumber = getFileDeveloperNumber(json, "ABANDONED");

    let ownerPreviousMessageCount = getOwnerPreviousMessageCount(json);
    let reviewersTotalPreviousMessagesCount = getReviewersTotalPreviousMessagesCount(json);

    let ownerChangesMessagesCountAndAvgPerChanges = getOwnerChangesMessagesCountAndAvgPerChanges(json);

    let ownerAndReviewerCommonsChangesAndMessages = getOwnerAndReviewerCommonsChangesAndMessages(json);
    let ownerChangesCountAndMessagesCountWithSameReviewers = getOwnerChangesCountAndMessagesCountWithSameReviewers(json);

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

        ownerNumberOfRevisionMerged, //12
        ownerNumberOfRevisionAbandoned, //13

        ownerNumberOfReview, //14

        fileDeveloperNumber, //15

        ownerPreviousMessageCount, //16
        reviewersTotalPreviousMessagesCount, //17

        ownerChangesMessagesCountAndAvgPerChanges, //18

        ownerAndReviewerCommonsChangesAndMessages, //19
        ownerChangesCountAndMessagesCountWithSameReviewers, //20

    ]).then((results) => {
        //console.log(results);
        return {

            ownerNumberOfReview: results[14].count,
            //rename fileDeveloperNumber: results[15].count,
            AvgNumberOfDeveloperWhoChangesFileInChanges: results[15].count,
            ownerPreviousMessageCount: results[16].count,
            reviewersTotalPreviousMessagesCount: results[17].count,

            priorMergedChangeMeanTime: results[0].avg,
            priorMergedChangeMaxTime: results[0].max,
            priorMergedChangeMinTime: results[0].min,
            priorMergedChangeStdTime: results[0].std,
            priorAbandonedChangeMeanTime: results[1].avg,
            priorAbandonedChangeMaxTime: results[1].max,
            priorAbandonedChangeMinTime: results[1].min,
            priorAbandonedChangeStdTime: results[1].std,

            priorOwnerMergedChangesMeanTime: results[2].avg,
            priorOwnerMergedChangesMaxTime: results[2].max,
            priorOwnerMergedChangesMinTime: results[2].min,
            priorOwnerMergedChangesStdTime: results[2].std,
            priorOwnerAbandonedChangesMeanTime: results[3].avg,
            priorOwnerAbandonedChangesMaxTime: results[3].max,
            priorOwnerAbandonedChangesMinTime: results[3].avg,
            priorOwnerAbandonedChangesStdTime: results[3].std,

            reviewersMergedChangesCountAvg: results[4].count_avg,
            reviewersMergedChangesCountMax: results[4].count_max,
            reviewersMergedChangesCountMin: results[4].count_min,
            reviewersMergedChangesCountStd: results[4].count_std,
            reviewersMergedChangesTimeAvg: results[4].time_avg,
            reviewersMergedChangesTimeMax: results[4].time_max,
            reviewersMergedChangesTimeMin: results[4].time_min,
            reviewersMergedChangesTimeStd: results[4].time_std,
            reviewersMergedChangesPercentageAvg: results[4].percentage_avg,
            reviewersMergedChangesRatioAvg: results[4].ratio_avg,
            reviewersAbandonedChangesCountAvg: results[5].count_avg,
            reviewersAbandonedChangesCountMax: results[5].count_max,
            reviewersAbandonedChangesCountMin: results[5].count_min,
            reviewersAbandonedChangesCountStd: results[5].count_std,
            reviewersAbandonedChangesTimeAvg: results[5].time_avg,
            reviewersAbandonedChangesTimeMax: results[5].time_max,
            reviewersAbandonedChangesTimeMin: results[5].time_min,
            reviewersAbandonedChangesTimeStd: results[5].time_std,
            reviewersAbandonedChangesPercentageAvg: results[5].percentage_avg,
            reviewersAbandonedChangesRatioAvg: results[5].ratio_avg,

            mergedFileCountAvg: results[6].count_avg,
            mergedFileCountMax: results[6].count_max,
            mergedFileCountMin: results[6].count_min,
            mergedFileCountStd: results[6].count_std,
            mergedFileTimeAvg: results[6].time_avg,
            mergedFileTimeMax: results[6].time_max,
            mergedFileTimeMin: results[6].time_min,
            mergedFileTimeStd: results[6].time_std,
            abandonedFileCountAvg: results[7].count_avg,
            abandonedFileCountMax: results[7].count_max,
            abandonedFileCountMin: results[7].count_min,
            abandonedFileCountStd: results[7].count_std,
            abandonedFileTimeAvg: results[7].time_avg,
            abandonedFileTimeMax: results[7].time_max,
            abandonedFileTimeMin: results[7].time_min,
            abandonedFileTimeStd: results[7].time_std,

            ownerMergedFileCountAvg: results[8].count_avg,
            ownerMergedFileCountMax: results[8].count_max,
            ownerMergedFileCountMin: results[8].count_min,
            ownerMergedFileCountStd: results[8].count_std,
            ownerMergedFileTimeAvg: results[8].time_avg,
            ownerMergedFileTimeMax: results[8].time_max,
            ownerMergedFileTimeMin: results[8].time_min,
            ownerMergedFileTimeStd: results[8].time_std,
            ownerAbandonedFileCountAvg: results[9].count_avg,
            ownerAbandonedFileCountMax: results[9].count_max,
            ownerAbandonedFileCountMin: results[9].count_min,
            ownerAbandonedFileCountStd: results[9].count_std,
            ownerAbandonedFileTimeAvg: results[9].time_avg,
            ownerAbandonedFileTimeMax: results[9].time_max,
            ownerAbandonedFileTimeMin: results[9].time_min,
            ownerAbandonedFileTimeStd: results[9].time_std,

            reviewersMergedFileCountAvg: results[10].count_avg,
            reviewersMergedFileTimeAvg: results[10].time_avg,
            reviewersAbandonedFileCountAvg: results[11].count_avg,
            reviewersAbandonedFileTimeAvg: results[11].time_avg,

            ownerNumberOfRevisionMergedAvg: results[12].revision_avg,
            ownerNumberOfRevisionMergedMax: results[12].revision_max,
            ownerNumberOfRevisionMergedMin: results[12].revision_min,
            ownerNumberOfRevisionMergedStd: results[12].revision_std,
            ownerNumberOfRevisionAbandonedAvg: results[13].revision_avg,
            ownerNumberOfRevisionAbandonedMax: results[13].revision_max,
            ownerNumberOfRevisionAbandonedMin: results[13].revision_min,
            ownerNumberOfRevisionAbandonedStd: results[13].revision_std,

            ownerChangesMessagesSum: results[18].count,
            ownerChangesMessagesAvgPerChanges: results[18].avg,
            ownerChangesMessagesMaxPerChanges: results[18].max,
            ownerChangesMessagesMinPerChanges: results[18].min,
            ownerChangesMessagesStdPerChanges: results[18].std,

            ownerAndReviewerCommonsChangesSum: results[19].changes_count_sum,
            ownerAndReviewerCommonsChangesAvg: results[19].changes_count_avg,
            ownerAndReviewerCommonsChangesMax: results[19].changes_count_max,
            ownerAndReviewerCommonsChangesMin: results[19].changes_count_min,
            ownerAndReviewerCommonsChangesStd: results[19].changes_count_std,
            ownerAndReviewerCommonsChangesMessagesSum: results[19].messages_count_sum,
            ownerAndReviewerCommonsChangesMessagesAvg: results[19].messages_count_avg,
            ownerAndReviewerCommonsChangesMessagesMax: results[19].messages_count_max,
            ownerAndReviewerCommonsChangesMessagesMin: results[19].messages_count_min,
            ownerAndReviewerCommonsChangesMessagesStd: results[19].messages_count_std,

            ownerChangesWithSameReviewersSum: results[20].changes_count_sum,
            ownerChangesWithSameReviewersAvg: results[20].changes_count_avg,
            ownerChangesWithSameReviewersMax: results[20].changes_count_max,
            ownerChangesWithSameReviewersMin: results[20].changes_count_min,
            ownerChangesWithSameReviewersStd: results[20].changes_count_std,
            ownerChangesMessagesWithSameReviewersSum: results[20].messages_count_sum,
            ownerChangesMessagesWithSameReviewersAvg: results[20].messages_count_avg,
            ownerChangesMessagesWithSameReviewersMax: results[20].messages_count_max,
            ownerChangesMessagesWithSameReviewersMin: results[20].messages_count_min,
            ownerChangesMessagesWithSameReviewersStd: results[20].messages_count_std,

        };
    })
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
    let created_date = Moment(json.created).toDate().toISOString();
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
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
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
    let files_list = json.files_list ? json.files_list : [];
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
                revision_min: {$min: "$revisions_num"},
                revision_std: {$stdDevPop: "$revisions_num"}
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
    let files_list = json.files_list ? json.files_list : [];
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
        {
            $group: {
                _id: 1,
                count: {$avg: {$size: "$dev"}}
            }
        }
    ]
    return genericDBRequest(pipeline);
}

function getOwnerPreviousMessageCount(json) {
    let created_date = Moment(json.created).toDate().toISOString();
    let number = json._number;
    let owner_id = json.owner._account_id;
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
        {$match: {_id: owner_id}},
    ]
    return genericDBRequest(pipeline);
}

function getReviewersTotalPreviousMessagesCount(json) {
    let created_date = Moment(json.created).toDate().toISOString();
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

function getOwnerChangesMessagesCountAndAvgPerChanges(json) {
    let created_date = Moment(json.created).toDate().toISOString();
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

function getOwnerAndReviewerCommonsChangesAndMessages(json) {
    let created_date = Moment(json.created).toDate().toISOString();
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
        {$project: {_id: "$_id", changes_count: {$size: "$id"}, messages_count:  "$messages"}},
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
    let created_date = Moment(json.created).toDate().toISOString();
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