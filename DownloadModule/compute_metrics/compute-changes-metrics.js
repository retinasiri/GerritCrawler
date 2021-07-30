const MathJs = require('mathjs');
const Moment = require('moment');
const Change = require('../models/change');
const MetricsUtils = require("./metrics-utils");

let projectName = "libreoffice";
let start = 0;
let end = 10000;
let NUMBER_OF_DAYS_FOR_RECENT = null;
let DATE_FOR_RECENT = null;
let NUMBER_OF_DAYS_FOR_RECENT_FOR_RATE = 30;
let NUMBER_OF_DAYS_FOR_RECENT_CHANGES_OF_FILES = 30;

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
    })
}

async function collectMetrics(json) {
    let t1 = getChangesInfo(json).then((values) => {
        return getMetrics(json, values);
    })
    let t2 = getBestReviewer(json).then((values) => {
        return getMetrics(json, values);
    })

    return Promise.all([t1, t2]).then((results) => {
        return {...results[0], ...results[1]}
    })
}

function getMetrics(json, values) {
    let metric = {};
    metric["number"] = json._number;
    metric["id"] = json.id;
    Object.keys(values).forEach(function (key) {
        if (values[key] === null || values[key] === undefined || isNaN(values[key])) {
            metric[key] = 0;
        } else {
            metric[key] = values[key];
        }
    })
    return Promise.resolve(metric);
}

async function getChangesInfo(json) {
    /*
    console.time('getPriorChangesCount')
    let priorChangesCount = await getPriorChangesCount(json);
    console.timeEnd('getPriorChangesCount')

    console.time('getPriorTypeChangesCount')
    let priorMergedChangesCount = await getPriorTypeChangesCount(json, "MERGED");
    console.timeEnd('getPriorTypeChangesCount')

    console.time('getPriorTypeChangesCount')
    let priorAbandonedChangesCount = await getPriorTypeChangesCount(json, "ABANDONED");
    console.timeEnd('getPriorTypeChangesCount')

    console.time('getOwnerPriorChangesCount')
    let ownerPriorChangesCount = await getOwnerPriorChangesCount(json);
    console.timeEnd('getOwnerPriorChangesCount')

    console.time('getOwnerPriorTypeChangesCount')
    let ownerPriorMergedChangesCount = await getOwnerPriorTypeChangesCount(json, "MERGED");
    console.timeEnd('getOwnerPriorTypeChangesCount')

    console.time('getOwnerPriorTypeChangesCount')
    let ownerPriorAbandonedChangesCount = await getOwnerPriorTypeChangesCount(json, "ABANDONED");
    console.timeEnd('getOwnerPriorTypeChangesCount')

    console.time('getPriorSubsystemChangesCount')
    let priorSubsystemChangesCount = await getPriorSubsystemChangesCount(json);
    console.timeEnd('getPriorSubsystemChangesCount')

    console.time('getPriorSubsystemTypeChangesCount')
    let priorSubsystemMergedChangesCount = await getPriorSubsystemTypeChangesCount(json, "MERGED");
    console.timeEnd('getPriorSubsystemTypeChangesCount')

    console.time('getPriorSubsystemTypeChangesCount')
    let priorSubsystemAbandonedChangesCount = await getPriorSubsystemTypeChangesCount(json, "ABANDONED");
    console.timeEnd('getPriorSubsystemTypeChangesCount')

    console.time('getPriorSubsystemOwnerChangesCount')
    let priorSubsystemOwnerChangesCount = await getPriorSubsystemOwnerChangesCount(json);
    console.timeEnd('getPriorSubsystemOwnerChangesCount')

    console.time('getPriorSubsystemOwnerTypeChangesCount')
    let priorSubsystemOwnerMergedChangesCount = await getPriorSubsystemOwnerTypeChangesCount(json, "MERGED");
    console.timeEnd('getPriorSubsystemOwnerTypeChangesCount')

    console.time('getPriorSubsystemOwnerTypeChangesCount')
    let priorSubsystemOwnerAbandonedChangesCount = await getPriorSubsystemOwnerTypeChangesCount(json, "ABANDONED");
    console.timeEnd('getPriorSubsystemOwnerTypeChangesCount')

    //getChangesTimeInfo
    console.time('getPriorChangeMeanTimeType')
    let priorChangesDuration = await getPriorChangeMeanTimeType(json, {$in: ['MERGED', 'ABANDONED']});
    console.timeEnd('getPriorChangeMeanTimeType')

    console.time('getPriorOwnerChangesMeanTimeType')
    let priorOwnerChangesDuration = await getPriorOwnerChangesMeanTimeType(json, {$in: ['MERGED', 'ABANDONED']});
    console.timeEnd('getPriorOwnerChangesMeanTimeType')

    console.time('getFileTimeAndCount')
    let fileTimeAndCount = await getFileTimeAndCount(json, {$in: ['MERGED', 'ABANDONED']});
    console.timeEnd('getFileTimeAndCount')

    console.time('getFileTimeAndCountForOwner')
    let fileTimeAndCountForOwner = await getFileTimeAndCountForOwner(json, {$in: ['MERGED', 'ABANDONED']});
    console.timeEnd('getFileTimeAndCountForOwner')

    console.time('getOwnerNumberOfRevision')
    let ownerNumberOfRevision = await getOwnerNumberOfRevision(json, {$in: ['MERGED', 'ABANDONED']});
    console.timeEnd('getOwnerNumberOfRevision')

    console.time('getOwnerNumberOfReview')
    let ownerNumberOfReview = await getOwnerNumberOfReview(json);
    console.timeEnd('getOwnerNumberOfReview')

    console.time('getFileDeveloperNumber')
    let fileDeveloperNumber = await getFileDeveloperNumber(json);
    console.timeEnd('getFileDeveloperNumber')

    console.time('getOwnerPreviousMessageCount')
    let ownerPreviousMessageCount = await getOwnerPreviousMessageCount(json);
    console.timeEnd('getOwnerPreviousMessageCount')

    console.time('getOwnerChangesMessagesCountAndAvgPerChanges')
    let ownerChangesMessagesCountAndAvgPerChanges = await getOwnerChangesMessagesCountAndAvgPerChanges(json);
    console.timeEnd('getOwnerChangesMessagesCountAndAvgPerChanges')

    console.time('getChangesMessagesCountAndAvg')
    let changesMessagesCountAndAvg = await getChangesMessagesCountAndAvg(json);
    console.timeEnd('getChangesMessagesCountAndAvg')

    console.time('getPriorChangesFiles')
    let priorChangesFiles = await getPriorChangesFiles(json);
    console.timeEnd('getPriorChangesFiles')
    */

    let number = json._number;
    let ownerId = json.owner._account_id;
    let created_date = json.created;
    let project = json.project;
    let files_list = json.files_list ? json.files_list : [];

    if (NUMBER_OF_DAYS_FOR_RECENT !== null)
        DATE_FOR_RECENT = Moment(json.created).subtract(NUMBER_OF_DAYS_FOR_RECENT, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');

    let priorChangesCount = getPriorChangesCount(number);
    let priorMergedChangesCount = getPriorTypeChangesCount(number, created_date, "MERGED");
    let priorAbandonedChangesCount = getPriorTypeChangesCount(number, created_date, "ABANDONED");
    let ownerPriorChangesCount = getOwnerPriorChangesCount(ownerId, number);
    let ownerPriorMergedChangesCount = getOwnerPriorTypeChangesCount(number, ownerId, created_date, "MERGED");
    let ownerPriorAbandonedChangesCount = getOwnerPriorTypeChangesCount(number, ownerId, created_date, "ABANDONED");
    let priorSubsystemChangesCount = getPriorSubsystemChangesCount(number, project);
    let priorSubsystemMergedChangesCount = getPriorSubsystemTypeChangesCount(number, project, created_date, "MERGED");
    let priorSubsystemAbandonedChangesCount = getPriorSubsystemTypeChangesCount(number, project, created_date, "ABANDONED");
    let priorSubsystemOwnerChangesCount = getPriorSubsystemOwnerChangesCount(number, project, ownerId);
    let priorSubsystemOwnerMergedChangesCount = getPriorSubsystemOwnerTypeChangesCount(number, project, ownerId, created_date, "MERGED");
    let priorSubsystemOwnerAbandonedChangesCount = getPriorSubsystemOwnerTypeChangesCount(number, project, ownerId, created_date, "ABANDONED");

    //getChangesTimeInfo
    let priorChangesDuration = getPriorChangeMeanTimeType(json, {$in: ['MERGED', 'ABANDONED']});
    let priorOwnerChangesDuration = getPriorOwnerChangesMeanTimeType(json, {$in: ['MERGED', 'ABANDONED']});
    let fileTimeAndCount = getFileTimeAndCount(json, {$in: ['MERGED', 'ABANDONED']});
    let fileTimeAndCountForOwner = getFileTimeAndCountForOwner(number, ownerId, created_date, files_list, {$in: ['MERGED', 'ABANDONED']});
    let ownerNumberOfRevision = getOwnerNumberOfRevision(json);
    let ownerNumberOfReview = getOwnerNumberOfReview(number, ownerId, created_date);
    let fileDeveloperNumber = getFileDeveloperNumber(json);
    let ownerPreviousMessageCount = getOwnerPreviousMessageCount(number, ownerId, created_date);
    let ownerChangesMessagesCountAndAvgPerChanges = getOwnerChangesMessagesCountAndAvgPerChanges(json);
    let changesMessagesCountAndAvg = getChangesMessagesCountAndAvg(json);
    let priorChangesFiles = getPriorChangesFiles(json);

    let branchBuildTime = getBranchBuildTime(json);
    let revisionTime = getRevisionTime(json);
    let branchRevisionTime = getBranchRevisionTime(json);
    let ownerRevisionTime = getOwnerRevisionTime(json);
    let ownerTimeBetweenRevision = getOwnerTimeBetweenRevision(json);
    let ownerTimeToAddReviewer = getOwnerTimeToAddReviewer(json);
    let filesBuildTime = getFilesBuildTime(json);
    let filesRevisionTime = getFilesRevisionTime(json);
    let filesNumFails = getFilesNumFails(json);
    let ownerNumberOfAutoReview = getOwnerNumberOfAutoReview(json);

    let ownerInactiveTime = getOwnerInactiveTime(json);
    let ownerTimeBetweenMessage = getOwnerTimeBetweenMessage(json);
    let ownerNumberOfCherryPicked = getOwnerNumberOfCherryPicked(json); //ratio of cherry pick
    let branchNumberOfCherryPicked = getBranchNumberOfCherryPicked(json);
    let priorBranchChangesCount = getPriorBranchChangesCount(json);
    let priorBranchMergedChangesCount = getPriorBranchTypeChangesCount(json, "MERGED");
    let priorBranchAbandonedChangesCount = getPriorBranchTypeChangesCount(json, "ABANDONED");
    let priorBranchOwnerChangesCount = getPriorBranchOwnerChangesCount(json); //todo owner ratio in branch
    let priorBranchOwnerMergedChangesCount = getPriorBranchOwnerTypeChangesCount(json, "MERGED");
    let priorBranchOwnerAbandonedChangesCount = getPriorBranchOwnerTypeChangesCount(json, "ABANDONED");
    let priorBranchChangeMeanTimeType = getPriorBranchChangeMeanTimeType(json);

    let projectAge = await getProjectAge(json);
    let subsystemAge = getSubsystemAge(json);
    let branchAge = getBranchAge(json);
    let ownerAge = getOwnerAge(json);

    let priorRateFromCount = getPriorRateFromCount(json, NUMBER_OF_DAYS_FOR_RECENT_FOR_RATE);
    let priorBranchRateFromCount = getPriorBranchRateFromCount(json, NUMBER_OF_DAYS_FOR_RECENT_FOR_RATE);
    let priorSubsystemRateFromCount = getPriorSubsystemRateFromCount(json, NUMBER_OF_DAYS_FOR_RECENT_FOR_RATE);
    let priorOwnerRateFromCount = getPriorOwnerRateFromCount(json, NUMBER_OF_DAYS_FOR_RECENT_FOR_RATE);
    let filesNumberOfRecentChangesOnBranch = getFilesNumberOfRecentChangesOnBranch(json, NUMBER_OF_DAYS_FOR_RECENT_CHANGES_OF_FILES);

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
        //nonBotAccountPreviousMessageCount,
        branchBuildTime,//23
        revisionTime,//24
        branchRevisionTime,//25
        ownerRevisionTime,//26
        ownerTimeBetweenRevision,//27
        ownerTimeToAddReviewer,//28
        filesBuildTime,//29
        filesRevisionTime,//30
        filesNumFails,//31
        ownerNumberOfAutoReview,//32

        ownerInactiveTime,//33
        ownerTimeBetweenMessage,//34
        ownerNumberOfCherryPicked,//35
        branchNumberOfCherryPicked,//36
        priorBranchChangesCount,//37
        priorBranchMergedChangesCount,//38
        priorBranchAbandonedChangesCount,//39
        priorBranchOwnerChangesCount,//40
        priorBranchOwnerMergedChangesCount,//41
        priorBranchOwnerAbandonedChangesCount,//42
        priorBranchChangeMeanTimeType,//43

        projectAge,//44
        subsystemAge,//45
        branchAge,//46
        ownerAge,//47
        priorRateFromCount,//48
        priorBranchRateFromCount,//49
        priorSubsystemRateFromCount,//50
        priorOwnerRateFromCount,//51
        filesNumberOfRecentChangesOnBranch,//52

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

            branchBuildTimeAvg: results[23].avg,
            branchBuildTimeMax: results[23].max,
            branchBuildTimeMin: results[23].min,
            branchBuildTimeStd: results[23].std,

            revisionTimeAvg: results[24].avg,
            revisionTimeMax: results[24].max,
            revisionTimeMin: results[24].min,
            revisionTimeStd: results[24].std,

            branchRevisionTimeAvg: results[25].avg,
            branchRevisionTimeMax: results[25].max,
            branchRevisionTimeMin: results[25].min,
            branchRevisionTimeStd: results[25].std,

            ownerRevisionTimeAvg: results[26].avg,
            ownerRevisionTimeMax: results[26].max,
            ownerRevisionTimeMin: results[26].min,
            ownerRevisionTimeStd: results[26].std,

            ownerTimeBetweenRevisionAvg: results[27].avg,
            ownerTimeBetweenRevisionMax: results[27].max,
            ownerTimeBetweenRevisionMin: results[27].min,
            ownerTimeBetweenRevisionStd: results[27].std,

            ownerTimeToAddReviewerAvg: results[28].avg,
            ownerTimeToAddReviewerMax: results[28].max,
            ownerTimeToAddReviewerMin: results[28].min,
            ownerTimeToAddReviewerStd: results[28].std,

            filesBuildTimeAvg: results[29].avg,
            filesBuildTimeMax: results[29].max,
            filesBuildTimeMin: results[29].min,
            filesBuildTimeStd: results[29].std,

            filesRevisionTimeAvg: results[30].avg,
            filesRevisionTimeMax: results[30].max,
            filesRevisionTimeMin: results[30].min,
            filesRevisionTimeStd: results[30].std,

            filesNumFailsAvg: results[31].avg,
            filesNumFailsMax: results[31].max,
            filesNumFailsMin: results[31].min,
            filesNumFailsStd: results[31].std,

            ownerRateOfAutoReview: results[3] > 0 ? results[32].count / results[3] : 0,

            ownerInactiveTimeAvg: results[33].avg,
            ownerInactiveTimeMax: results[33].max,
            ownerInactiveTimeMin: results[33].min,
            ownerInactiveTimeStd: results[33].std,

            ownerTimeBetweenMessageAvg: results[34].avg,
            ownerTimeBetweenMessageMax: results[34].max,
            ownerTimeBetweenMessageMin: results[34].min,
            ownerTimeBetweenMessageStd: results[34].std,

            ownerNumberOfCherryPicked: results[35].count,
            branchNumberOfCherryPicked: results[36].count,

            priorBranchChangesCount: results[37].count,
            priorBranchMergedChangesCount: results[38].count,
            priorBranchAbandonedChangesCount: results[39].count,
            priorBranchOwnerChangesCount: results[40].count,
            priorBranchOwnerMergedChangesCount: results[41].count,
            priorBranchOwnerAbandonedChangesCount: results[42].count,

            priorBranchChangeMeanTimeTypeAvg: results[43].avg,
            priorBranchChangeMeanTimeTypeMax: results[43].max,
            priorBranchChangeMeanTimeTypeMin: results[43].min,
            priorBranchChangeMeanTimeTypeStd: results[43].std,

            projectAge: results[44],
            subsystemAge: results[45],
            branchAge: results[46],
            ownerAge: results[47],
            priorOverAllRateFromCount: safeDivision(results[0], results[44]),
            priorOverAllBranchRateFromCount: safeDivision(results[37], results[46]),
            priorOverAllSubsystemRateFromCount: safeDivision(results[6], results[45]),
            priorOverAlOwnerRateFromCount: safeDivision(results[3], results[47]),

            priorRateFromCount: results[48],
            priorBranchRateFromCount: results[49],
            priorSubsystemRateFromCount: results[50],
            priorOwnerRateFromCount: results[51],

            filesNumberOfRecentChangesOnBranch: results[52],

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

function addRecentDateToPipeline(pipeline) {
    if (DATE_FOR_RECENT !== null) {
        pipeline[0]["$match"]["created"] = {$gte: DATE_FOR_RECENT}
        return pipeline
    } else
        return pipeline
}

function getPriorChangesCount(number) {
    let pipeline = [
        {
            $match: {
                _number: {$lt: number}
            }
        },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorTypeChangesCount(number, created_date, TYPE) {
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
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerPriorChangesCount(ownerId, number) {
    let pipeline = [
        {
            $match: {
                'owner._account_id': ownerId,
                _number: {$lt: number}
            }
        },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerPriorTypeChangesCount(number, ownerId, created_date, TYPE) {
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
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorSubsystemChangesCount(number, project) {
    let pipeline = [{
        $match: {
            project: project,
            _number: {$lt: number},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorSubsystemTypeChangesCount(number, project, created_date, TYPE) {
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
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorSubsystemOwnerChangesCount(number, project, ownerId) {
    let pipeline = [{
        $match: {
            'owner._account_id': ownerId,
            project: project,
            _number: {$lt: number},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorSubsystemOwnerTypeChangesCount(number, project, ownerId, created_date, TYPE) {
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
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

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
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$date_updated_date_created_diff"},
                max: {$max: "$date_updated_date_created_diff"},
                min: {$min: "$date_updated_date_created_diff"},
                std: {$stdDevPop: "$date_updated_date_created_diff"}
            }
        }
    ]
    pipeline = addRecentDateToPipeline(pipeline);
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
        //project,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$date_updated_date_created_diff"},
                max: {$max: "$date_updated_date_created_diff"},
                min: {$min: "$date_updated_date_created_diff"},
                std: {$stdDevPop: "$date_updated_date_created_diff"}
            }
        }
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function get_file_pipeline(match, files_list) {
    return [
        match,
        {$unwind: "$files_list"},
        {$group: {_id: "$files_list", count: {$sum: 1}, time: {$avg: "$date_updated_date_created_diff"}}},
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
            _number: {$lt: number},
            updated: {$lte: created_date},
            status: TYPE,
            files_list: {$in: files_list}
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = get_file_pipeline(match, files_list);
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getFileTimeAndCountForOwner(number, ownerId, created_date, files_list, TYPE) {
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date},
            status: TYPE,
            'owner._account_id': ownerId,
            files_list: {$in: files_list}
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = get_file_pipeline(match, files_list);
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//check
function getOwnerNumberOfRevision(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            "owner._account_id": ownerId,
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
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
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//done
function getOwnerNumberOfReview(number, ownerId, created_date) {
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            "reviewers.REVIEWER._account_id": ownerId
        }
    }
    let pipeline = [
        match,
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//done
function getFileDeveloperNumber(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
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
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//done
function getPriorChangesFiles(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
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
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//done
function getOwnerPreviousMessageCount(number, ownerId, created_date) {
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            "messages_per_account_before_close.account": ownerId //todo convert to Int or String
        }
    }
    let pipeline = [
        match,
        {$unwind: "$messages_per_account_before_close"},
        {$match: {"messages_per_account_before_close.account": ownerId}},
        {
            $group: {
                _id: "$messages_per_account_before_close.account",
                count: {$sum: "$messages_per_account_before_close.num_messages"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//check
function getOwnerChangesMessagesCountAndAvgPerChanges(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            "owner._account_id": ownerId,
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                count: {$sum: "$messages_count_before_close"},
                avg: {$avg: "$messages_count_before_close"},
                max: {$max: "$messages_count_before_close"},
                min: {$avg: "$messages_count_before_close"},
                std: {$stdDevPop: "$messages_count_before_close"}
            }
        }
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//check
function getChangesMessagesCountAndAvg(json) {
    let created_date = json.created;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                count: {$sum: "$messages_count_before_close"},
                avg: {$avg: "$messages_count_before_close"},
                max: {$max: "$messages_count_before_close"},
                min: {$avg: "$messages_count_before_close"},
                std: {$stdDevPop: "$messages_count_before_close"}
            }
        }
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//begin add
function getBranchBuildTime(json) {
    let created_date = json.created;
    let branch = json.branch;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            branch: branch,
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_build_time_before_close"},
                max: {$max: "$avg_build_time_before_close"},
                min: {$min: "$avg_build_time_before_close"},
                std: {$stdDevPop: "$avg_build_time_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getRevisionTime(json) {
    let created_date = json.created;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            _number: {$lt: number},
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_time_revision_before_close"},
                max: {$max: "$avg_time_revision_before_close"},
                min: {$min: "$avg_time_revision_before_close"},
                std: {$stdDevPop: "$avg_time_revision_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getBranchRevisionTime(json) {
    let created_date = json.created;
    let branch = json.branch;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            branch: branch,
            _number: {$lt: number},
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_time_revision_before_close"},
                max: {$max: "$avg_time_revision_before_close"},
                min: {$min: "$avg_time_revision_before_close"},
                std: {$stdDevPop: "$avg_time_revision_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getOwnerRevisionTime(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            "owner._account_id": ownerId,
            _number: {$lt: number},
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_time_revision_before_close"},
                max: {$max: "$avg_time_revision_before_close"},
                min: {$min: "$avg_time_revision_before_close"},
                std: {$stdDevPop: "$avg_time_revision_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getOwnerTimeBetweenRevision(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            "owner._account_id": ownerId,
            _number: {$lt: number},
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_time_between_revision_before_close"},
                max: {$max: "$avg_time_between_revision_before_close"},
                min: {$min: "$avg_time_between_revision_before_close"},
                std: {$stdDevPop: "$avg_time_between_revision_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getOwnerTimeToAddReviewer(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            "owner._account_id": ownerId,
            _number: {$lt: number},
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_time_to_add_human_reviewers_before_close"},
                max: {$max: "$avg_time_to_add_human_reviewers_before_close"},
                min: {$min: "$avg_time_to_add_human_reviewers_before_close"},
                std: {$stdDevPop: "$avg_time_to_add_human_reviewers_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getFilesBuildTime(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            files_list: {$in: files_list}
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_time_revision_before_close"},
                max: {$max: "$avg_time_revision_before_close"},
                min: {$min: "$avg_time_revision_before_close"},
                std: {$stdDevPop: "$avg_time_revision_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getFilesRevisionTime(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            files_list: {$in: files_list}
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_build_time_before_close"},
                max: {$max: "$avg_build_time_before_close"},
                min: {$min: "$avg_build_time_before_close"},
                std: {$stdDevPop: "$avg_build_time_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getFilesNumFails(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            files_list: {$in: files_list}
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                count: {$sum: "$num_of_build_failures_before_close"},
                avg: {$avg: "$num_of_build_failures_before_close"},
                max: {$max: "$num_of_build_failures_before_close"},
                min: {$min: "$num_of_build_failures_before_close"},
                std: {$stdDevPop: "$num_of_build_failures_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getOwnerNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            _number: {$lt: number},
            is_self_review: true,
            "owner._account_id": ownerId
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//added
function getOwnerInactiveTime(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            "owner._account_id": ownerId,
            _number: {$lt: number},
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$max_inactive_time_before_close"},
                max: {$max: "$max_inactive_time_before_close"},
                min: {$min: "$max_inactive_time_before_close"},
                std: {$stdDevPop: "$max_inactive_time_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getOwnerTimeBetweenMessage(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            "owner._account_id": ownerId,
            _number: {$lt: number},
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$avg_time_between_msg_before_close"},
                max: {$max: "$avg_time_between_msg_before_close"},
                min: {$min: "$avg_time_between_msg_before_close"},
                std: {$stdDevPop: "$avg_time_between_msg_before_close"}
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getOwnerNumberOfCherryPicked(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            _number: {$lt: number},
            is_a_cherry_pick: true,
            "owner._account_id": ownerId
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getBranchNumberOfCherryPicked(json) {
    let created_date = json.created;
    let branch = json.branch;
    let number = json._number;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            updated: {$lte: created_date},
            _number: {$lt: number},
            is_a_cherry_pick: true,
            branch: branch
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getPriorBranchChangesCount(json) {
    let number = json._number;
    let branch = json.branch;
    let created_date = json.created;
    let pipeline = [{
        $match: {
            branch: branch,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
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
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorBranchOwnerChangesCount(json) {
    let number = json._number;
    let branch = json.branch;
    let ownerId = json.owner._account_id;
    let created_date = json.created;
    let pipeline = [{
        $match: {
            'owner._account_id': ownerId,
            branch: branch,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorBranchOwnerTypeChangesCount(json, TYPE) {
    let created_date = json.created;
    let number = json._number;
    let branch = json.branch;
    let ownerId = json.owner._account_id;
    let pipeline = [{
        $match: {
            'owner._account_id': ownerId,
            branch: branch,
            status: TYPE,
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorBranchChangeMeanTimeType(json) {
    let created_date = json.created;
    let number = json._number;
    let branch = json.branch;
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            branch: branch,
        }
    };
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                avg: {$avg: "$date_updated_date_created_diff"},
                max: {$max: "$date_updated_date_created_diff"},
                min: {$min: "$date_updated_date_created_diff"},
                std: {$stdDevPop: "$date_updated_date_created_diff"}
            }
        }
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//Age
function agePipeline(match, created_date) {
    let pipeline = [
        match,
        {$sort: {_number: 1}},
        {$limit: 1},
        {
            $project: {
                _id: 0,
                count: {
                    $divide: [
                        {
                            $subtract: [
                                {$dateFromString: {dateString: {$substr: [created_date, 0, 22]}, timezone: "UTC"}},
                                {$dateFromString: {dateString: {$substr: ["$created", 0, 22]}, timezone: "UTC"}}
                            ]
                        },
                        1000 * 60 * 60 * 24
                    ]
                }
            }
        }
    ]
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

function getProjectAge(json) {
    let created = json.created;
    let number = json._number;
    let match = {
        $match: {
            number: {$lt: number},
            //updated: {$lte: created},
        }
    }
    return agePipeline(match, created);
}

function getSubsystemAge(json) {
    let created = json.created;
    let project = json.project;
    let number = json._number;
    let match = {
        $match: {
            number: {$lt: number},
            //updated: {$lte: created},
            project: project,
        }
    }
    return agePipeline(match, created);
}

function getBranchAge(json) {
    let created = json.created;
    let branch = json.branch;
    let number = json._number;
    let match = {
        $match: {
            number: {$lt: number},
            //updated: {$lte: created},
            branch: branch,
        }
    }
    return agePipeline(match, created);
}

function getOwnerAge(json) {
    let created = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            number: {$lt: number},
            //updated: {$lte: created},
            $or: [{'owner._account_id': ownerId}, {"reviewers.REVIEWER._account_id": ownerId}]
        }
    }
    return agePipeline(match, created);
}

//Rate
//get number of change to the date divide by the number of day

function getPriorRateFromCount(json, number_of_days, property = null, value = null) {
    let number = json._number;
    let created = json.created
    let dateFromNumberOfDaysAgo = Moment(json.created).subtract(number_of_days, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');
    let pipeline = [
        {
            $match: {
                status: {$in: ['MERGED', 'ABANDONED']},
                number: {$lt: number},
                updated: {$lte: created},
                created: {$gte: dateFromNumberOfDaysAgo}
            }
        },
        {$count: "count"},
        {
            $project: {
                count: {$divide: ["$count", dateFromNumberOfDaysAgo]}
            }
        },
    ]
    if (property) {
        if (value)
            pipeline[0]["$match"][property] = value;
    }

    return dbRequest(pipeline);
}

function getPriorBranchRateFromCount(json, number_of_days) {
    let property = "branch";
    let value = json.branch;
    return getPriorRateFromCount(json, number_of_days, property, value)
}

function getPriorSubsystemRateFromCount(json, number_of_days) {
    let property = "project";
    let value = json.project;
    return getPriorRateFromCount(json, number_of_days, property, value)
}

function getPriorOwnerRateFromCount(json, number_of_days) {
    let property = "$or";
    let ownerId = json.owner._account_id;
    let value = [{'owner._account_id': ownerId}, {"reviewers.REVIEWER._account_id": ownerId}]
    return getPriorRateFromCount(json, number_of_days, property, value)
}

//file
function getFilesNumberOfRecentChangesOnBranch(json, number_of_days) {
    let number = json._number;
    let created = json.created
    let branch = json.branch;
    let files_list = json.files_list ? json.files_list : [];
    let dateFromNumberOfDaysAgo = Moment(json.created).subtract(number_of_days, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');
    let pipeline = [
        {
            $match: {
                //status: "MERGED",
                number: {$lt: number},
                branch: branch,
                updated: {$lte: created},
                files_list: {$in: files_list},
                $or: [{created: {$gte: dateFromNumberOfDaysAgo}}, {updated: {$gte: dateFromNumberOfDaysAgo}}]
            }
        },
        {$count: "count"},
    ]
    return dbRequest(pipeline);
}

//reviewer
function getBestReviewer(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let accountToExclude = MetricsUtils.getBotArray(projectName)
    accountToExclude.push(ownerId)
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            'owner._account_id': ownerId
        }
    };
    let pipeline = [
        match,
        {$unwind: "$reviewers.REVIEWER"},
        {$match: {_id: {$nin: accountToExclude}}},
        {$group: {_id: "$reviewers.REVIEWER._account_id", count: {$sum: 1}}},
        {$sort: {count: -1}},
        {$limit: 5},
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return Change
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return 0;
            return docs.length > 0 ? getReviewersMetrics(json, docs) : [];
        })
        .catch(err => {
            console.log(err)
        });
}

//reviewer exchange message
//reviewer number of change type (merged, abandonned, unclosed)
//reviewer number of review
//reviewer number of review of file
//get

function getReviewersMetrics(json, reviewersDocs) {
    let number = json._number;
    let created_date = json.created;
    let files_list = json.files_list ? json.files_list : [];
    let reviewersId = [];
    let allCount = [];

    for (let index in reviewersDocs) {
        let docs = reviewersDocs[index];
        let reviewerId = docs._id;
        let count = docs.count;
        reviewersId.push(reviewerId);
        allCount.push(count);
    }

    let reviewersPriorChangesCount = getReviewersPriorChangesCount(reviewersId, number);
    let reviewersPriorMergedChangesCount = getReviewersPriorTypeChangesCount(number, reviewersId, created_date, "MERGED");
    let reviewersPriorAbandonedChangesCount = getReviewersPriorTypeChangesCount(number, reviewersId, created_date, "ABANDONED");
    let reviewersPriorUnCloseChangesCount = getReviewersPriorUnCloseChangesCount(number, reviewersId, created_date);
    let reviewersNumberOfReview = getReviewersNumberOfReview(number, reviewersId, created_date);
    let reviewersPreviousMessageCount = getReviewersPreviousMessageCount(number, reviewersId, created_date);
    let fileTimeAndCountForReviewers = getFileTimeAndCountForReviewers(number, reviewersId, created_date, files_list, {$in: ['MERGED', 'ABANDONED']});
    let ownerAndReviewerCommonsChangesSumAndMessagesSum = getOwnerAndReviewerCommonsChangesSumAndMessagesSum(json, reviewersId);
    let ownerAndReviewerCommonsMessagesAvg = getOwnerAndReviewerCommonsMessagesAvg(json, reviewersId);

    let reviewersChangesCount = Promise.resolve(getSumMeanMaxMinStd(allCount));

    return Promise.all([
        reviewersPriorChangesCount,//0
        reviewersPriorMergedChangesCount,//1
        reviewersPriorAbandonedChangesCount,//2
        reviewersPriorUnCloseChangesCount,//3
        reviewersNumberOfReview,//4
        reviewersPreviousMessageCount,//5
        fileTimeAndCountForReviewers,//6
        ownerAndReviewerCommonsChangesSumAndMessagesSum,//7
        ownerAndReviewerCommonsMessagesAvg,//8
        reviewersChangesCount,//9
    ]).then((results) => {
        return {
            reviewersPriorChangesSum: results[0].sum,
            reviewersPriorChangesAvg: results[0].avg,
            reviewersPriorChangesMax: results[0].max,
            reviewersPriorChangesMin: results[0].min,
            reviewersPriorChangesStd: results[0].std,

            reviewersPriorMergedChangesSum: results[1].sum,
            reviewersPriorMergedChangesAvg: results[1].avg,
            reviewersPriorMergedChangesMax: results[1].max,
            reviewersPriorMergedChangesMin: results[1].min,
            reviewersPriorMergedChangesStd: results[1].std,

            reviewersPriorAbandonedChangesSum: results[2].sum,
            reviewersPriorAbandonedChangesAvg: results[2].avg,
            reviewersPriorAbandonedChangesMax: results[2].max,
            reviewersPriorAbandonedChangesMin: results[2].min,
            reviewersPriorAbandonedChangesStd: results[2].std,

            reviewersPriorUnCloseChangesSum: results[3].sum,
            reviewersPriorUnCloseChangesAvg: results[3].avg,
            reviewersPriorUnCloseChangesMax: results[3].max,
            reviewersPriorUnCloseChangesMin: results[3].min,
            reviewersPriorUnCloseChangesStd: results[3].std,

            reviewersNumberOfReviewSum: results[4].sum,
            reviewersNumberOfReviewAvg: results[4].avg,
            reviewersNumberOfReviewMax: results[4].max,
            reviewersNumberOfReviewMin: results[4].min,
            reviewersNumberOfReviewStd: results[4].std,

            reviewersPreviousMessageSum: results[5].sum,
            reviewersPreviousMessageAvg: results[5].avg,
            reviewersPreviousMessageMax: results[5].max,
            reviewersPreviousMessageMin: results[5].min,
            reviewersPreviousMessageStd: results[5].std,

            fileCountForReviewersCountAvg: results[6].count_avg,
            fileCountForReviewersCountMax: results[6].count_max,
            fileCountForReviewersCountMin: results[6].count_min,
            fileCountForReviewersCountStd: results[6].count_std,
            fileTimeForReviewersCountAvg: results[6].time_avg,
            fileTimeForReviewersCountMax: results[6].time_max,
            fileTimeForReviewersCountMin: results[6].time_min,
            fileTimeForReviewersCountStd: results[6].time_std,

            ownerAndReviewerCommonsChangesSum: results[7].changes_sum,
            ownerAndReviewerCommonsMessagesSum: results[7].messages_sum,

            ownerAndReviewerCommonsMessagesSumForRev: results[8].sum,
            ownerAndReviewerCommonsMessagesAvg: results[8].avg,
            ownerAndReviewerCommonsMessagesMax: results[8].max,
            ownerAndReviewerCommonsMessagesMin: results[8].min,
            ownerAndReviewerCommonsMessagesStd: results[8].std,

            reviewersChangesSum: results[9].sum,
            reviewersChangesAvg: results[9].avg,
            reviewersChangesMax: results[9].max,
            reviewersChangesMin: results[9].min,
            reviewersChangesStd: results[9].std,
        }
    })

}

function getSumMeanMaxMinStd(array) {
    return {
        sum: array.length > 0 ? MathJs.sum(array) : 0,
        avg: array.length > 0 ? MathJs.mean(array) : 0,
        Max: array.length > 0 ? MathJs.max(array) : 0,
        min: array.length > 0 ? MathJs.min(array) : 0,
        std: array.length > 0 ? MathJs.std(array) : 0,
    }
}

function getReviewersPriorChangesCount(reviewersId, number) {
    let pipeline = [
        {
            $match: {
                'owner._account_id': {$in: reviewersId},
                _number: {$lt: number}
            }
        },
        {
            $group: {
                _id: "$owner._account_id",
                sum: {$sum: 1},
            }
        },
        {
            $group: {
                _id: 1,
                sum: {$sum: "$sum"},
                avg: {$avg: "$sum"},
                max: {$max: "$sum"},
                min: {$min: "$sum"},
                std: {$stdDevPop: "$sum"},
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getReviewersPriorTypeChangesCount(number, reviewersId, created_date, TYPE) {
    let pipeline = [
        {
            $match: {
                'owner._account_id': {$in: reviewersId},
                status: TYPE,
                _number: {$lt: number},
                updated: {$lte: created_date}
            }
        },
        {
            $group: {
                _id: "$owner._account_id",
                sum: {$sum: 1},
            }
        },
        {
            $group: {
                _id: 1,
                sum: {$sum: "$sum"},
                avg: {$avg: "$sum"},
                max: {$max: "$sum"},
                min: {$min: "$sum"},
                std: {$stdDevPop: "$sum"},
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getReviewersPriorUnCloseChangesCount(number, reviewersId, created_date) {
    let pipeline = [
        {
            $match: {
                'owner._account_id': {$in: reviewersId},
                //status: {},
                _number: {$lt: number},
                updated: {$gt: created_date}
            }
        },
        {
            $group: {
                _id: "$owner._account_id",
                sum: {$sum: 1},
            }
        },
        {
            $group: {
                _id: 1,
                sum: {$sum: "$sum"},
                avg: {$avg: "$sum"},
                max: {$max: "$sum"},
                min: {$min: "$sum"},
                std: {$stdDevPop: "$sum"},
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getReviewersNumberOfReview(number, reviewersId, created_date) {
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            "reviewers.REVIEWER._account_id": {$in: reviewersId}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$reviewers.REVIEWER"},
        {
            $match: {
                "reviewers.REVIEWER._account_id": {$in: reviewersId},
            }
        },
        {
            $group: {
                _id: "$reviewers.REVIEWER._account_id",
                sum: {$sum: 1},
            }
        },
        {
            $group: {
                _id: 1,
                sum: {$sum: "$sum"},
                avg: {$avg: "$sum"},
                max: {$max: "$sum"},
                min: {$min: "$sum"},
                std: {$stdDevPop: "$sum"},
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getReviewersPreviousMessageCount(number, reviewersId, created_date) {
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date},
            "messages_per_account_before_close.account": {$in: reviewersId}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$messages_per_account_before_close"},
        {
            $match: {
                "messages_per_account_before_close.account": {$in: reviewersId}
            }
        },
        {
            $group: {
                _id: "$messages_per_account_before_close.account",
                sum: {$sum: "$messages_per_account_before_close.num_messages"}
            }
        },
        {
            $group: {
                _id: 1,
                sum: {$sum: "$sum"},
                avg: {$avg: "$sum"},
                max: {$max: "$sum"},
                min: {$min: "$sum"},
                std: {$stdDevPop: "$sum"},
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);

    return genericDBRequest(pipeline);
}

function getFileTimeAndCountForReviewers(number, reviewersId, created_date, files_list, TYPE) {
    let match = {
        $match: {
            _number: {$lt: number},
            updated: {$lte: created_date},
            status: TYPE,
            'reviewers.REVIEWER._account_id': {$in: reviewersId},
            files_list: {$in: files_list}
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = get_file_pipeline(match, files_list);
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getOwnerAndReviewerCommonsChangesSumAndMessagesSum(json, reviewersId) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            $or: [
                {
                    $and: [
                        {'owner._account_id': ownerId},
                        {"reviewers.REVIEWER._account_id": {$in: reviewersId}}
                    ]
                },
                {
                    $and: [
                        {'owner._account_id': {$in: reviewersId}},
                        {"reviewers.REVIEWER._account_id": ownerId}
                    ]
                }
            ],
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {
            $group: {
                _id: 1,
                changes_sum: {$sum: 1},
                messages_sum: {$sum: "$messages_human_count_before_close"},
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getOwnerAndReviewerCommonsMessagesAvg(json, reviewersId) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            $or: [
                {
                    $and: [
                        {'owner._account_id': ownerId},
                        {"reviewers.REVIEWER._account_id": {$in: reviewersId}}
                    ]
                },
                {
                    $and: [
                        {'owner._account_id': {$in: reviewersId}},
                        {"reviewers.REVIEWER._account_id": ownerId}
                    ]
                }
            ],
            status: {$in: ['MERGED', 'ABANDONED']},
            _number: {$lt: number},
            updated: {$lte: created_date}
        }
    }
    let pipeline = [
        match,
        {$unwind: "$messages_per_account_before_close"},
        {
            $match: {
                "messages_per_account_before_close.account": {$in: reviewersId}
            }
        },
        {
            $group: {
                _id: "$messages_per_account_before_close.account",
                sum: {$sum: "$messages_per_account_before_close.num_messages"}
            }
        },
        {
            $group: {
                _id: 1,
                sum: {$sum: "$sum"},
                avg: {$avg: "$sum"},
                max: {$max: "$sum"},
                min: {$min: "$sum"},
                std: {$stdDevPop: "$sum"},
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

/*function getOwnerWorkLoad(json) {
}*/

//do autoreview ratio
//todo work load
//todo last 48h add changes
//todo last 24h non close changes
//todo add metrics to compute


module.exports = {
    start: startComputeMetrics
};