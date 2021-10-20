const MathJs = require('mathjs');
const Moment = require('moment');
const Change = require('../models/change');
const MetricsUtils = require("./metrics-utils");

//todo add open change
//todo add hour separation

//todo separate compute metrics
//todo compute metrics
//todo rate for 3, 7, 14, 30, 90
//todo last X (1, 3, 10, 100) time
//branch rate of build
//project rate of build
//best reviewer timezone diff
//probability of build

let projectName = "libreoffice";
let start = 0;
let end = 10000;
let date_for_recent = null;

let NUM_DAYS_FOR_RECENT = null;
let NUMBER_OF_DAYS_FOR_RECENT_FOR_RATE = 30;
let NUMBER_OF_DAYS_FOR_RECENT_CHANGES_OF_FILES = 30;
let NUMBER_OF_BEST_REVIEWER = 5;


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
    if (projectJson["NUM_DAYS_FOR_RECENT"])
        NUM_DAYS_FOR_RECENT = projectJson["NUM_DAYS_FOR_RECENT"];

    return MetricsUtils.startComputeMetrics(projectName, start, end, function (json) {
        return collectMetrics(json)
    })
}

async function collectMetrics(json) {
    let t1 = getChangesInfo(json)
        .then((values) => {
            return computeMedianInfo(json, values);
        })
        .then((values) => {
            return getMetrics(json, values);
        })
    /*let t2 = getBestReviewer(json).then((values) => {
        //console.log(values)
        return getMetrics(json, values);
    })*/

    //return Promise.all([t1, t2]).then((results) => {
    return Promise.all([t1]).then((results) => {
        //return Promise.all([t2]).then((results) => {
        let metrics = {...results[0], ...results[1]};
        if (NUM_DAYS_FOR_RECENT !== null) {
            let suffix = '_' + NUM_DAYS_FOR_RECENT + '_days'
            let array = ['id', 'number', 'projectAge', 'subsystemAge', 'branchAge', 'ownerAge'];
            metrics = MetricsUtils.add_suffix_to_json(metrics, suffix, array)
        }
        return metrics
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

async function computeMedianInfo(json, data) {

    let number = json._number;
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let files_list = json.files_list ? json.files_list : [];

    if (NUM_DAYS_FOR_RECENT !== null)
        date_for_recent = Moment(json.created).subtract(NUM_DAYS_FOR_RECENT, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');

    //change duration median
    let priorChangesDurationMed = getPriorChangeDurationMed(data, created_date)
    let priorOwnerProjectBranchChangesDurationMed = getPriorOwnerProjectBranchChangesDurationMed(data, created_date)
    //let priorOwnerChangesDurationMed = getPriorOwnerChangesDurationMed(data, created_date)
    //let priorProjectChangesDurationMed = getPriorProjectChangesDurationMed(data, created_date)
    //let priorBranchChangesDurationMed = getPriorBranchChangesDurationMed(data, created_date)

    //let priorOwnerProjectChangesDurationMed = getPriorOwnerProjectChangesDurationMed(data, created_date)
    //let priorOwnerBranchChangesDurationMed = getPriorOwnerBranchChangesDurationMed(data, created_date)
    //let priorProjectBranchChangesDurationMed = getPriorProjectBranchChangesDurationMed(data, created_date)

    //build time median
    let priorBuildTimeDurationMed = getPriorBuildTimeDurationMed(data, created_date)
    let priorOwnerProjectBranchBuildTimeDurationMed = getPriorOwnerProjectBranchBuildTimeDurationMed(data, created_date)

    //let priorOwnerBuildTimeDurationMed = getPriorOwnerBuildTimeDurationMed(data, created_date)
    //let priorProjectBuildTimeDurationMed = getPriorProjectBuildTimeDurationMed(data, created_date)
    //let priorBranchBuildTimeDurationMed = getPriorBranchBuildTimeDurationMed(data, created_date)

    //let priorOwnerProjectBuildTimeDurationMed = getPriorOwnerProjectBuildTimeDurationMed(data, created_date)
    //let priorOwnerBranchBuildTimeDurationMed = getPriorOwnerBranchBuildTimeDurationMed(data, created_date)
    //let priorProjectBranchBuildTimeDurationMed = getPriorProjectBranchBuildTimeDurationMed(data, created_date)

    //time to add reviewer median
    let priorTimeToAddReviewerMed = getPriorTimeToAddReviewerMed(data, created_date)
    let priorOwnerProjectBranchTimeToAddReviewerMed = getPriorOwnerProjectBranchTimeToAddReviewerMed(data, created_date)
    //let priorOwnerTimeToAddReviewerMed = getPriorOwnerTimeToAddReviewerMed(data, created_date)

    //let priorProjectTimeToAddReviewerMed = getPriorProjectTimeToAddReviewerMed(data, created_date)
    //let priorBranchTimeToAddReviewerMed = getPriorBranchTimeToAddReviewerMed(data, created_date)

    //let priorOwnerProjectTimeToAddReviewerMed = getPriorOwnerProjectTimeToAddReviewerMed(data, created_date)
    //let priorOwnerBranchTimeToAddReviewerMed = getPriorOwnerBranchTimeToAddReviewerMed(data, created_date)
    //let priorProjectBranchTimeToAddReviewerMed = getPriorProjectBranchTimeToAddReviewerMed(data, created_date)


    //number of revision median
    let num_revision_med = getMedian(data.priorClosedChangesCount,
        all_match(created_date), "revisions_num")

    let owner_project_branch_num_revision_med = getMedian(data.ownerProjectBranchClosedChangesCount,
        owner_project_branch_match(created_date, ownerId, project, branch),
        "revisions_num")

    /*let owner_num_revision_med = getMedian(data.ownerPriorClosedChangesCount,
        owner_match(created_date, ownerId, project, branch),
        "revisions_num")*/

    /*let project_num_revision_med = getMedian(data.priorProjectClosedChangesCount,
        project_match(created_date, ownerId, project, branch),
        "revisions_num")

    let branch_num_revision_med = getMedian(data.priorBranchClosedChangesCount,
        branch_match(created_date, ownerId, project, branch),
        "revisions_num")*/

    /*let owner_project_num_revision_med = getMedian(data.priorOwnerProjectClosedChangesCount,
        owner_project_match(created_date, ownerId, project, branch),
        "revisions_num")

    let owner_branch_num_revision_med = getMedian(data.priorOwnerBranchClosedChangesCount,
        owner_branch_match(created_date, ownerId, project, branch),
        "revisions_num")

    let project_branch_num_revision_med = getMedian(data.priorProjectBranchClosedChangesCount,
        project_branch_match(created_date, ownerId, project, branch),
        "revisions_num")*/


    //revision duration median
    let num_revision_duration_med = getMedian(data.priorClosedChangesCount,
        all_match(created_date), "avg_time_revision_before_close")

    let owner_project_branch_num_revision_duration_med = getMedian(data.ownerProjectBranchClosedChangesCount,
        owner_project_branch_match(created_date, ownerId, project, branch),
        "avg_time_revision_before_close")

    /*let owner_num_revision_duration_med = getMedian(data.ownerPriorClosedChangesCount,
        owner_match(created_date, ownerId, project, branch),
        "avg_time_revision_before_close")*/

    /*let project_num_revision_duration_med = getMedian(data.priorProjectClosedChangesCount,
        project_match(created_date, ownerId, project, branch),
        "avg_time_revision_before_close")

    let branch_num_revision_duration_med = getMedian(data.priorBranchClosedChangesCount,
        branch_match(created_date, ownerId, project, branch),
        "avg_time_revision_before_close")*/

    /*let owner_project_num_revision_duration_med = getMedian(data.priorOwnerProjectClosedChangesCount,
        owner_project_match(created_date, ownerId, project, branch),
        "avg_time_revision_before_close")

    let owner_branch_num_revision_duration_med = getMedian(data.priorOwnerBranchClosedChangesCount,
        owner_branch_match(created_date, ownerId, project, branch),
        "avg_time_revision_before_close")

    let project_branch_num_revision_duration_med = getMedian(data.priorProjectBranchClosedChangesCount,
        project_branch_match(created_date, ownerId, project, branch),
        "avg_time_revision_before_close")*/


    //time between message median
    let time_between_messages_med  = getMedian(data.priorClosedChangesCount,
        all_match(created_date), "avg_time_between_msg_before_close")

    let owner_project_branch_time_between_messages_med = getMedian(data.ownerProjectBranchClosedChangesCount,
        owner_project_branch_match(created_date, ownerId, project, branch),
        "avg_time_between_msg_before_close")

    /*let owner_time_between_messages_med = getMedian(data.ownerPriorClosedChangesCount,
        owner_match(created_date, ownerId, project, branch),
        "avg_time_between_msg_before_close")*/

    /*let project_time_between_messages_med = getMedian(data.priorProjectClosedChangesCount,
        project_match(created_date, ownerId, project, branch),
        "avg_time_between_msg_before_close")

    let branch_time_between_messages_med = getMedian(data.priorBranchClosedChangesCount,
        branch_match(created_date, ownerId, project, branch),
        "avg_time_between_msg_before_close")*/

    /*let owner_project_time_between_messages_med = getMedian(data.priorOwnerProjectClosedChangesCount,
        owner_project_match(created_date, ownerId, project, branch),
        "avg_time_between_msg_before_close")

    let owner_branch_time_between_messages_med = getMedian(data.priorOwnerBranchClosedChangesCount,
        owner_branch_match(created_date, ownerId, project, branch),
        "avg_time_between_msg_before_close")

    let project_branch_time_between_messages_med = getMedian(data.priorProjectBranchClosedChangesCount,
        project_branch_match(created_date, ownerId, project, branch),
        "avg_time_between_msg_before_close")*/


    //num messages median
    let num_messages_med  = getMedian(data.priorClosedChangesCount,
        all_match(created_date), "messages_count_before_close")

    let owner_project_branch_num_messages_med = getMedian(data.ownerProjectBranchClosedChangesCount,
        owner_project_branch_match(created_date, ownerId, project, branch),
        "messages_count_before_close")

    /*let owner_num_messages_med = getMedian(data.ownerPriorClosedChangesCount,
        owner_match(created_date, ownerId, project, branch),
        "messages_count_before_close")*/

    /*let project_num_messages_med = getMedian(data.priorProjectClosedChangesCount,
        project_match(created_date, ownerId, project, branch),
        "messages_count_before_close")

    let branch_num_messages_med = getMedian(data.priorBranchClosedChangesCount,
        branch_match(created_date, ownerId, project, branch),
        "messages_count_before_close")*/

    /*let owner_project_num_messages_med = getMedian(data.priorOwnerProjectClosedChangesCount,
        owner_project_match(created_date, ownerId, project, branch),
        "messages_count_before_close")

    let owner_branch_num_messages_med = getMedian(data.priorOwnerBranchClosedChangesCount,
        owner_branch_match(created_date, ownerId, project, branch),
        "messages_count_before_close")

    let project_branch_num_messages_med = getMedian(data.priorProjectBranchClosedChangesCount,
        project_branch_match(created_date, ownerId, project, branch),
        "messages_count_before_close")*/


    //files time median
    let files_changes_duration_med  = getMedian(data.numChangesFiles,
        {
            $match: {
                files_list: {$in: files_list},
                created: {$lte: created_date},
            }
        },
        "date_updated_date_created_diff")

    //owner file time median
    let owner_files_changes_duration_med  = getMedian(data.numChangesFiles,
        {
            $match: {
                files_list: {$in: files_list},
                'owner._account_id': ownerId,
                created: {$lte: created_date},
            }
        },
        "date_updated_date_created_diff")

    //files build time median
    let files_build_time_med  = getMedian(data.numChangesFiles,
        {
            $match: {
                files_list: {$in: files_list},
                created: {$lte: created_date},
            }
        },
        "avg_build_time_before_close")

    //files revision time median
    let files_revision_time_med  = getMedian(data.numChangesFiles,
        {
            $match: {
                files_list: {$in: files_list},
                created: {$lte: created_date},
            }
        },
        "avg_time_revision_before_close")


    //files num fails median
    let files_num_fails_med  = getMedian(data.numChangesFiles,
        {
            $match: {
                files_list: {$in: files_list},
                created: {$lte: created_date},
            }
        },
        "num_of_build_failures_before_close")


    //inactive median
    //prior change duration median
    //owner inactive median
    //owner time between message median
    //owner changes messages median
    //opb build time median
    //opb number of revision median
    //opb time between message median
    //opb time to add reviewer median

    //fileNumChangesAvg median


    let values = [
        priorChangesDurationMed,
        priorOwnerProjectBranchChangesDurationMed,
        //priorOwnerChangesDurationMed,
        //priorProjectChangesDurationMed,
        //priorBranchChangesDurationMed,

        //priorOwnerProjectChangesDurationMed,
        //priorOwnerBranchChangesDurationMed,
        //priorProjectBranchChangesDurationMed,

        priorBuildTimeDurationMed,
        priorOwnerProjectBranchBuildTimeDurationMed,
        //priorOwnerBuildTimeDurationMed,
        //priorProjectBuildTimeDurationMed,
        //priorBranchBuildTimeDurationMed,

        //priorOwnerProjectBuildTimeDurationMed,
        //priorOwnerBranchBuildTimeDurationMed,
        //priorProjectBranchBuildTimeDurationMed,

        priorTimeToAddReviewerMed,
        priorOwnerProjectBranchTimeToAddReviewerMed,
        //priorOwnerTimeToAddReviewerMed,

        //priorProjectTimeToAddReviewerMed,
        //priorBranchTimeToAddReviewerMed,

        //priorOwnerProjectTimeToAddReviewerMed,
        //priorOwnerBranchTimeToAddReviewerMed,
        //priorProjectBranchTimeToAddReviewerMed,

        num_revision_med,
        owner_project_branch_num_revision_med,
        //owner_num_revision_med,

        //project_num_revision_med,
        //branch_num_revision_med,

        //owner_project_num_revision_med,
        //owner_branch_num_revision_med,
        //project_branch_num_revision_med,

        num_revision_duration_med,
        owner_project_branch_num_revision_duration_med,
        //owner_num_revision_duration_med,

        //project_num_revision_duration_med,
        //branch_num_revision_duration_med,

        //owner_project_num_revision_duration_med,
        //owner_branch_num_revision_duration_med,
        //project_branch_num_revision_duration_med,

        time_between_messages_med,
        owner_project_branch_time_between_messages_med,
        //owner_time_between_messages_med,

        //project_time_between_messages_med,
        //branch_time_between_messages_med,

        //owner_project_time_between_messages_med,
        //owner_branch_time_between_messages_med,
        //project_branch_time_between_messages_med,

        num_messages_med,
        owner_project_branch_num_messages_med,
        //owner_num_messages_med,

        //project_num_messages_med,
        //branch_num_messages_med,

        //owner_project_num_messages_med,
        //owner_branch_num_messages_med,
        //project_branch_num_messages_med,

        files_changes_duration_med,
        owner_files_changes_duration_med,
        files_build_time_med,
        files_revision_time_med,
        files_num_fails_med,

    ]
    return Promise.all(values
    ).then((results) => {

        let data2 = {
            priorChangesDurationMed: getResult(results, values, priorChangesDurationMed),
            priorOwnerProjectBranchChangesDurationMed: getResult(results, values, priorOwnerProjectBranchChangesDurationMed),
            //priorOwnerChangesDurationMed: getResult(results, values, priorOwnerChangesDurationMed),
            //priorProjectChangesDurationMed: getResult(results, values, priorProjectChangesDurationMed),
            //priorBranchChangesDurationMed: getResult(results, values, priorBranchChangesDurationMed),

            //priorOwnerProjectChangesDurationMed: getResult(results, values, priorOwnerProjectChangesDurationMed),
            //priorOwnerBranchChangesDurationMed: getResult(results, values, priorOwnerBranchChangesDurationMed),
            //priorProjectBranchChangesDurationMed: getResult(results, values, priorProjectBranchChangesDurationMed),

            priorBuildTimeDurationMed: getResult(results, values, priorBuildTimeDurationMed),
            priorOwnerProjectBranchBuildTimeDurationMed: getResult(results, values, priorOwnerProjectBranchBuildTimeDurationMed),
            //priorOwnerBuildTimeDurationMed: getResult(results, values, priorOwnerBuildTimeDurationMed),
            //priorProjectBuildTimeDurationMed: getResult(results, values, priorProjectBuildTimeDurationMed),
            //priorBranchBuildTimeDurationMed: getResult(results, values, priorBranchBuildTimeDurationMed),

            //priorOwnerProjectBuildTimeDurationMed: getResult(results, values, priorOwnerProjectBuildTimeDurationMed),
            //priorOwnerBranchBuildTimeDurationMed: getResult(results, values, priorOwnerBranchBuildTimeDurationMed),
            //priorProjectBranchBuildTimeDurationMed: getResult(results, values, priorProjectBranchBuildTimeDurationMed),

            priorTimeToAddReviewerMed: getResult(results, values, priorTimeToAddReviewerMed),
            priorOwnerProjectBranchTimeToAddReviewerMed: getResult(results, values, priorOwnerProjectBranchTimeToAddReviewerMed),
            //priorOwnerTimeToAddReviewerMed: getResult(results, values, priorOwnerTimeToAddReviewerMed),

            //priorProjectTimeToAddReviewerMed: getResult(results, values, priorProjectTimeToAddReviewerMed),
            //priorBranchTimeToAddReviewerMed: getResult(results, values, priorBranchTimeToAddReviewerMed),

            //priorOwnerProjectTimeToAddReviewerMed: getResult(results, values, priorOwnerProjectTimeToAddReviewerMed),
            //priorOwnerBranchTimeToAddReviewerMed: getResult(results, values, priorOwnerBranchTimeToAddReviewerMed),
            //priorProjectBranchTimeToAddReviewerMed: getResult(results, values, priorProjectBranchTimeToAddReviewerMed),

            num_revision_med: getResult(results, values, num_revision_med),
            owner_project_branch_num_revision_med: getResult(results, values, owner_project_branch_num_revision_med),
            //owner_num_revision_med: getResult(results, values, owner_num_revision_med),

            //project_num_revision_med: getResult(results, values, project_num_revision_med),
            //branch_num_revision_med: getResult(results, values, branch_num_revision_med),

            //owner_project_num_revision_med: getResult(results, values, owner_project_num_revision_med),
            //owner_branch_num_revision_med: getResult(results, values, owner_branch_num_revision_med),
            //project_branch_num_revision_med: getResult(results, values, project_branch_num_revision_med),

            num_revision_duration_med: getResult(results, values, num_revision_duration_med),
            owner_project_branch_num_revision_duration_med: getResult(results, values, owner_project_branch_num_revision_duration_med),
            //owner_num_revision_duration_med: getResult(results, values, owner_num_revision_duration_med),

            //project_num_revision_duration_med: getResult(results, values, project_num_revision_duration_med),
            //branch_num_revision_duration_med: getResult(results, values, branch_num_revision_duration_med),

            //owner_project_num_revision_duration_med: getResult(results, values, owner_project_num_revision_duration_med),
            //owner_branch_num_revision_duration_med: getResult(results, values, owner_branch_num_revision_duration_med),
            //project_branch_num_revision_duration_med: getResult(results, values, project_branch_num_revision_duration_med),

            time_between_messages_med: getResult(results, values, time_between_messages_med),
            owner_project_branch_time_between_messages_med: getResult(results, values, owner_project_branch_time_between_messages_med),
            //owner_time_between_messages_med: getResult(results, values, owner_time_between_messages_med),

            //project_time_between_messages_med: getResult(results, values, project_time_between_messages_med),
            //branch_time_between_messages_med: getResult(results, values, branch_time_between_messages_med),

            //owner_project_time_between_messages_med: getResult(results, values, owner_project_time_between_messages_med),
            //owner_branch_time_between_messages_med: getResult(results, values, owner_branch_time_between_messages_med),
            //project_branch_time_between_messages_med: getResult(results, values, project_branch_time_between_messages_med),

            num_messages_med: getResult(results, values, num_messages_med),
            owner_project_branch_num_messages_med: getResult(results, values, owner_project_branch_num_messages_med),
            //owner_num_messages_med: getResult(results, values, owner_num_messages_med),

            //project_num_messages_med: getResult(results, values, project_num_messages_med),
            //branch_num_messages_med: getResult(results, values, branch_num_messages_med),

            //owner_project_num_messages_med: getResult(results, values, owner_project_num_messages_med),
            //owner_branch_num_messages_med: getResult(results, values, owner_branch_num_messages_med),
            //project_branch_num_messages_med: getResult(results, values, project_branch_num_messages_med),

            files_changes_duration_med: getResult(results, values, files_changes_duration_med),
            owner_files_changes_duration_med: getResult(results, values, owner_files_changes_duration_med),
            files_build_time_med: getResult(results, values, files_build_time_med),
            files_revision_time_med: getResult(results, values, files_revision_time_med),
            files_num_fails_med: getResult(results, values, files_num_fails_med),

        };

        return {...data, ...data2};
    })
}

function getMedian(count, match, field) {
    let project_val = "$" + field
    let pipeline = [
        match,
        {$sort: {[field]: 1}},
        {$skip: Math.floor(count / 2)},
        {$limit: 1},
        {$project: {_id: 0, count: project_val}}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

async function getChangesInfo(json) {

    let number = json._number;
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let files_list = json.files_list ? json.files_list : [];

    if (NUM_DAYS_FOR_RECENT !== null)
        date_for_recent = Moment(json.created).subtract(NUM_DAYS_FOR_RECENT, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');

    let priorChangesCount = getPriorChangesCount(json);
    let priorClosedChangesCount = getPriorTypeChangesCount(json, {$in: ['MERGED', 'ABANDONED']});
    let priorOwnerChangesCount = getOwnerPriorChangesCount(json);
    let priorOwnerClosedChangesCount = getOwnerPriorTypeChangesCount(json, {$in: ['MERGED', 'ABANDONED']});
    let priorProjectChangesCount = getPriorSubsystemChangesCount(json);
    let priorProjectClosedChangesCount = getPriorSubsystemTypeChangesCount(json, {$in: ['MERGED', 'ABANDONED']});
    let priorBranchChangesCount = getPriorBranchChangesCount(json);
    let priorBranchClosedChangesCount = getPriorBranchTypeChangesCount(json, {$in: ['MERGED', 'ABANDONED']});

    //let priorOwnerProjectChangesCount = getPriorSubsystemOwnerChangesCount(json);
    //let priorOwnerProjectClosedChangesCount = getPriorSubsystemOwnerTypeChangesCount(json, {$in: ['MERGED', 'ABANDONED']});
    //let priorOwnerBranchChangesCount = getPriorOwnerBranchChangesCount(json);
    //let priorOwnerBranchClosedChangesCount = getPriorOwnerBranchTypeChangesCount(json, {$in: ['MERGED', 'ABANDONED']});
    //let priorProjectBranchChangesCount = getPriorProjectBranchChangesCount(json);
    //let priorProjectBranchClosedChangesCount = getPriorProjectBranchTypeChangesCount(json, {$in: ['MERGED', 'ABANDONED']});

    let priorOwnerProjectBranchChangesCount = getPriorProjectBranchOwnerChangesCount(json);
    let priorOwnerProjectBranchClosedChangesCount = getPriorProjectBranchOwnerTypeChangesCount(json, {$in: ['MERGED', 'ABANDONED']});

    //todo file open change
    //let fileCount = getFileCount(json);
    let numChangesFiles = getPriorChangesFiles(json);
    let numClosedChangesFiles = getPriorClosedChangesFiles(json);

    //todo add auto-review
    let numberOfAutoReview = getNumberOfAutoReview(json);
    let ownerProjectBranchNumberOfAutoReview = getOwnerProjectBranchNumberOfAutoReview(json);
    let ownerNumberOfAutoReview = getOwnerNumberOfAutoReview(json);
    //let projectNumberOfAutoReview = getProjectNumberOfAutoReview(json);
    //let branchNumberOfAutoReview = getBranchNumberOfAutoReview(json);

    //let ownerProjectNumberOfAutoReview = getOwnerProjectNumberOfAutoReview(json);
    //let projectBranchNumberOfAutoReview = getProjectBranchNumberOfAutoReview(json);
    //let ownerBranchNumberOfAutoReview = getOwnerBranchNumberOfAutoReview(json);

    //todo number of build
    //todo add ratio
    let numberChangesBuilt = getNumberChangesBuilt(json);
    let ownerProjectBranchNumberChangesBuilt = getOwnerProjectBranchNumberChangesBuilt(json);

    //let ownerNumberChangesBuilt = getOwnerNumberChangesBuilt(json);
    //let projectNumberChangesBuilt = getProjectNumberChangesBuilt(json);

    let branchNumberChangesBuilt = getBranchNumberChangesBuilt(json);

    //let ownerProjectNumberChangesBuilt = getOwnerProjectNumberChangesBuilt(json);
    //let ownerBranchNumberChangesBuilt = getOwnerBranchNumberChangesBuilt(json);
    //let projectBranchNumberChangesBuilt = getProjectBranchNumberChangesBuilt(json);

    //todo number of build file extension
    let filesExtensionNumberChangesCount = getFilesExtensionNumberChangesCount(json);
    let filesExtensionNumberChangesBuilt = getFilesExtensionNumberChangesBuilt(json);


    //change duration median
    //inactive median
    //number of revision median
    //revision duration median
    //time between message median
    //time to add reviewer median
    //build time median
    //num messages median


    //owner file time median
    //files time median
    //files build time median
    //files revision time median
    //files num fails median

    //prior change duration median
    //owner inactive median
    //owner time between message median
    //owner changes messages median
    //opb build time median
    //opb number of revision median
    //opb time between message median
    //opb time to add reviewer median

    //fileNumChangesAvg median


    let values = [
        priorChangesCount,
        priorClosedChangesCount,
        priorOwnerChangesCount,
        priorOwnerClosedChangesCount,
        priorProjectChangesCount,
        priorProjectClosedChangesCount,
        priorBranchChangesCount,
        priorBranchClosedChangesCount,
        //priorOwnerProjectChangesCount,
        //priorOwnerProjectClosedChangesCount,
        //priorOwnerBranchChangesCount,
        //priorOwnerBranchClosedChangesCount,
        //priorProjectBranchChangesCount,
        //priorProjectBranchClosedChangesCount,
        priorOwnerProjectBranchChangesCount,
        priorOwnerProjectBranchClosedChangesCount,

        numChangesFiles,
        numClosedChangesFiles,

        numberOfAutoReview,
        ownerProjectBranchNumberOfAutoReview,
        ownerNumberOfAutoReview,
        //projectNumberOfAutoReview,
        //branchNumberOfAutoReview,

        //ownerProjectNumberOfAutoReview,
        //projectBranchNumberOfAutoReview,
        //ownerBranchNumberOfAutoReview,

        numberChangesBuilt,
        ownerProjectBranchNumberChangesBuilt,

        //ownerNumberChangesBuilt,
        //projectNumberChangesBuilt,

        //branchNumberChangesBuilt,

        //ownerProjectNumberChangesBuilt,
        //ownerBranchNumberChangesBuilt,
        //projectBranchNumberChangesBuilt,

        filesExtensionNumberChangesCount,
        filesExtensionNumberChangesBuilt,
    ]
    return Promise.all(values
    ).then((results) => {
        //console.log(priorChangesCount)
        let data = {
            priorChangesCount: getResult(results, values, priorChangesCount),
            priorClosedChangesCount: getResult(results, values, priorClosedChangesCount),

            ownerPriorChangesCount: getResult(results, values, priorOwnerChangesCount),
            ownerPriorClosedChangesCount: getResult(results, values, priorOwnerClosedChangesCount),

            priorProjectChangesCount: getResult(results, values, priorProjectChangesCount),
            priorProjectClosedChangesCount: getResult(results, values, priorProjectClosedChangesCount),

            priorBranchChangesCount: getResult(results, values, priorBranchChangesCount),
            priorBranchClosedChangesCount: getResult(results, values, priorBranchClosedChangesCount),

            //priorOwnerProjectChangesCount: getResult(results, values, priorOwnerProjectChangesCount),
            //priorOwnerProjectClosedChangesCount: getResult(results, values, priorOwnerProjectClosedChangesCount),
            //priorOwnerBranchChangesCount: getResult(results, values, priorOwnerBranchChangesCount),
            //priorOwnerBranchClosedChangesCount: getResult(results, values, priorOwnerBranchClosedChangesCount),
            //priorProjectBranchChangesCount: getResult(results, values, priorProjectBranchChangesCount),
            //priorProjectBranchClosedChangesCount: getResult(results, values, priorProjectBranchClosedChangesCount),

            ownerProjectBranchChangesCount: getResult(results, values, priorOwnerProjectBranchChangesCount),
            ownerProjectBranchClosedChangesCount: getResult(results, values, priorOwnerProjectBranchClosedChangesCount),

            numChangesFiles: getResult(results, values, numChangesFiles),
            numClosedChangesFiles: getResult(results, values, numClosedChangesFiles),

            numberOfAutoReview: getResult(results, values, numberOfAutoReview),
            ownerProjectBranchNumberOfAutoReview: getResult(results, values, ownerProjectBranchNumberOfAutoReview),
            ownerNumberOfAutoReview: getResult(results, values, ownerNumberOfAutoReview),
            //projectNumberOfAutoReview: getResult(results, values, projectNumberOfAutoReview),
            //branchNumberOfAutoReview: getResult(results, values, branchNumberOfAutoReview),
            //ownerProjectNumberOfAutoReview: getResult(results, values, ownerProjectNumberOfAutoReview),
            //projectBranchNumberOfAutoReview: getResult(results, values, projectBranchNumberOfAutoReview),
            //ownerBranchNumberOfAutoReview: getResult(results, values, ownerBranchNumberOfAutoReview),

            numberChangesBuilt: getResult(results, values, numberChangesBuilt),
            ownerProjectBranchNumberChangesBuilt: getResult(results, values, ownerProjectBranchNumberChangesBuilt),
            //ownerNumberChangesBuilt: getResult(results, values, ownerNumberChangesBuilt),
            //projectNumberChangesBuilt: getResult(results, values, projectNumberChangesBuilt),
            //branchNumberChangesBuilt: getResult(results, values, branchNumberChangesBuilt),

            //ownerProjectNumberChangesBuilt: getResult(results, values, ownerProjectNumberChangesBuilt),
            //ownerBranchNumberChangesBuilt: getResult(results, values, ownerBranchNumberChangesBuilt),
            //projectBranchNumberChangesBuilt: getResult(results, values, projectBranchNumberChangesBuilt),

            filesExtensionNumberChangesCount: getResult(results, values, filesExtensionNumberChangesCount),
            filesExtensionNumberChangesBuilt: getResult(results, values, filesExtensionNumberChangesBuilt),

        };

        //console.log(data["priorOpenChangesCount"])
        data["priorOpenChangesCount"] = data["priorChangesCount"] - data["priorClosedChangesCount"]
        data["priorOwnerOpenChangesCount"] = data["ownerPriorChangesCount"] - data["ownerPriorClosedChangesCount"]
        data["priorProjectOpenChangesCount"] = data["priorProjectChangesCount"] - data["priorProjectClosedChangesCount"]
        data["priorBranchOpenChangesCount"] = data["priorBranchChangesCount"] - data["priorBranchClosedChangesCount"]
        //data["priorOwnerProjectOpenChangesCount"] = data["priorOwnerProjectChangesCount"] - data["priorOwnerProjectClosedChangesCount"]
        //data["priorOwnerBranchOpenChangesCount"] = data["priorOwnerBranchChangesCount"] - data["priorOwnerBranchClosedChangesCount"]
        //data["priorProjectBranchOpenChangesCount"] = data["priorProjectBranchChangesCount"] - data["priorProjectBranchClosedChangesCount"]

        data["priorOwnerProjectBranchOpenChangesCount"] = data.ownerProjectBranchChangesCount - data.ownerProjectBranchClosedChangesCount

        //auto review
        data["numberOfAutoReviewRatio"] = safeDivision(data.numberOfAutoReview, data.priorClosedChangesCount)
        data["ownerProjectBranchNumberOfAutoReviewRatio"] = safeDivision(data.ownerProjectBranchNumberOfAutoReview, data.ownerProjectBranchClosedChangesCount)
        data["ownerNumberOfAutoReviewRatio"] = safeDivision(data.ownerNumberOfAutoReview, data.ownerPriorClosedChangesCount)


        //console.log(data["numberChangesBuilt"])
        //console.log(data["priorClosedChangesCount"])
        data["numberChangesBuiltRatio"] = safeDivision(data.numberChangesBuilt, data.priorClosedChangesCount)

        //data["ownerNumberChangesBuiltRatio"] = safeDivision(data["ownerNumberChangesBuilt"], data["ownerPriorClosedChangesCount"])
        //data["projectNumberChangesBuiltRatio"] = safeDivision(data["projectNumberChangesBuilt"], data["priorProjectClosedChangesCount"])

        //data["branchNumberChangesBuiltRatio"] = safeDivision(data.branchNumberChangesBuilt, data.priorBranchClosedChangesCount)

        //data["ownerProjectNumberChangesBuiltRatio"] = safeDivision(data["ownerProjectNumberChangesBuilt"], data["priorOwnerProjectClosedChangesCount"])
        //data["ownerBranchNumberChangesBuiltRatio"] = safeDivision(data["ownerBranchNumberChangesBuilt"], data["priorOwnerBranchClosedChangesCount"])
        //data["projectBranchNumberChangesBuiltRatio"] = safeDivision(data["projectBranchNumberChangesBuilt"], data["priorProjectBranchClosedChangesCount"])

        data["ownerProjectBranchNumberChangesBuiltRatio"] = safeDivision(data.ownerProjectBranchNumberChangesBuilt, data.ownerProjectBranchClosedChangesCount)

        data["filesExtensionNumberChangesBuiltRatio"] = safeDivision(data.filesExtensionNumberChangesBuilt, data.filesExtensionNumberChangesCount)

        return data;
    })
}

function getResult(results, values, index) {
    return results[values.indexOf(index)];
}

function convertAsDays(input) {
    //console.log(Moment.duration(input).asDays())
    if (typeof input === 'number')
        return Moment.duration(input).asDays();
    else
        return 0;
}

function safeDivision(number1, number2) {
    //return (number2 !== 0 || number2 === undefined)? MathJs.divide(number1, number2) : 0;
    return (number2 !== 0)? MathJs.divide(number1, number2) : 0;
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
    if (date_for_recent !== null) {
        if (pipeline[0]["$match"]["created"])
            pipeline[0]["$match"]["created"]["$gte"] = date_for_recent
        else
            pipeline[0]["$match"]["created"] = {$gte: date_for_recent}
        return pipeline
    } else
        return pipeline
}

function getPriorChangesCount(json) {
    let number = json._number;
    let created_date = json.created;
    let pipeline = [
        {
            $match: {
                //_number: {$lt: number},
                created: {$lte: created_date}
            }
        },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorTypeChangesCount(json, TYPE) {
    let number = json._number;
    let created_date = json.created;
    let pipeline = [
        {
            $match: {
                status: TYPE,
                //created: {$lte: created_date},
                updated: {$lte: created_date},
                //_number: {$lt: number},
            }
        },
        {$count: "count"}
    ];
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerPriorChangesCount(json) {
    let number = json._number;
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let pipeline = [
        {
            $match: {
                //_number: {$lt: number},
                'owner._account_id': ownerId,
                created: {$lte: created_date},
            }
        },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerPriorTypeChangesCount(json, TYPE) {
    let number = json._number;
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            status: TYPE,
            'owner._account_id': ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorSubsystemChangesCount(json) {
    let number = json._number;
    let project = json.project;
    let created_date = json.created;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            project: project,
            created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorSubsystemTypeChangesCount(json, TYPE) {
    let number = json._number;
    let project = json.project;
    let created_date = json.created;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            status: TYPE,
            project: project,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorSubsystemOwnerChangesCount(json) {
    let number = json._number;
    let project = json.project;
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            project: project,
            'owner._account_id': ownerId,
            created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorSubsystemOwnerTypeChangesCount(json, TYPE) {
    let number = json._number;
    let project = json.project;
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            status: TYPE,
            project: project,
            'owner._account_id': ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
                return [];
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
            //_number: {$lt: number},
            status: TYPE,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: TYPE,
            'owner._account_id': ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getPriorOwnerProjectBranchChangesMeanTimeType(json, TYPE) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    //let project = getProject();
    let project = json.project;
    let branch = json.branch;

    let match = {
        $match: {
            //_number: {$lt: number},
            status: TYPE,
            'owner._account_id': ownerId,
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: TYPE,
            files_list: {$in: files_list},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    };
    if (TYPE == null) delete match.$match.status;
    let pipeline = get_file_pipeline(match, files_list);
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getFileCount(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            //_number: {$lt: number},
            //status: TYPE,
            files_list: {$in: files_list},
            created: {$lte: created_date},
            //updated: {$lte: created_date},
        }
    };
    let pipeline = [
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
            }
        }
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getFileTimeAndCountForOwner(number, ownerId, created_date, files_list, TYPE) {
    let match = {
        $match: {
            //_number: {$lt: number},
            status: TYPE,
            'owner._account_id': ownerId,
            files_list: {$in: files_list},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getOwnerProjectBranchNumberOfRevision(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "reviewers.REVIEWER._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            //created: {$lte: created_date},
            files_list: {$in: files_list},
            updated: {$lte: created_date},
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
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            files_list: {$in: files_list},
            created: {$lte: created_date},
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
    return dbRequest(pipeline);
}

function getPriorClosedChangesFiles(json) {
    let created_date = json.created;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            files_list: {$in: files_list},
            updated: {$lte: created_date},
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
    return dbRequest(pipeline);
}

//done
function getOwnerPreviousMessageCount(number, ownerId, created_date) {
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "messages_per_account_before_close.account": ownerId, //todo convert to Int or String
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
function getOwnerProjectBranchBuildTime(json) {
    let created_date = json.created;
    let branch = json.branch;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
    let project = json.project;
    let branch = json.branch;
    let number = json._number;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getOwnerProjectBranchRevisionTime(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let number = json._number;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getOwnerProjectBranchTimeBetweenRevision(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getOwnerTimeBetweenRevision(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

//todo correct when no review
function getOwnerTimeToAddReviewer(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getOwnerProjectBranchTimeToAddReviewer(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            files_list: {$in: files_list},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            files_list: {$in: files_list},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                files_list: {$in: files_list},
            }
        },
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                is_self_review: true,
            }
        },
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
            is_self_review: true,
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}


function getOwnerProjectBranchNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            is_self_review: true,
            "owner._account_id": ownerId,
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
            is_self_review: true,
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getProjectNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                is_self_review: true,
            }
        },
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getBranchNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                is_self_review: true,
            }
        },
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerProjectNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            project: project,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                is_self_review: true,
            }
        },
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getProjectBranchNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                is_self_review: true,
            }
        },
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerBranchNumberOfAutoReview(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                is_self_review: true,
            }
        },
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}


//added
function getOwnerInactiveTime(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getOwnerProjectBranchInactiveTime(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getOwnerProjectBranchTimeBetweenMessage(json) {
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            "owner._account_id": ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                is_a_cherry_pick: true,
            }
        },
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                is_a_cherry_pick: true,
            }
        },
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

//added


//add
function getPriorBranchChangesCount(json) {
    let number = json._number;
    let created_date = json.created;
    let branch = json.branch;
    let pipeline = [{
        $match: {
            branch: branch,
            updated: {$lte: created_date},
            //_number: {$lt: number},
            //status: TYPE,
            //'owner._account_id': ownerId,
            //created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorBranchTypeChangesCount(json, TYPE) {
    let number = json._number;
    let created_date = json.created;
    let branch = json.branch;
    let pipeline = [{
        $match: {
            status: TYPE,
            branch: branch,
            updated: {$lte: created_date},
            //_number: {$lt: number},
            //'owner._account_id': ownerId,
            //created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorOwnerBranchChangesCount(json) {
    let number = json._number;
    let created_date = json.created;
    let branch = json.branch;
    let ownerId = json.owner._account_id;
    let pipeline = [{
        $match: {
            branch: branch,
            'owner._account_id': ownerId,
            updated: {$lte: created_date},
            //_number: {$lt: number},
            //status: TYPE,
            //created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorOwnerBranchTypeChangesCount(json, TYPE) {
    let number = json._number;
    let created_date = json.created;
    let branch = json.branch;
    let ownerId = json.owner._account_id;
    let pipeline = [{
        $match: {
            status: TYPE,
            branch: branch,
            updated: {$lte: created_date},
            //_number: {$lt: number},
            'owner._account_id': ownerId,
            //created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorOwnerBranchChangesCount(json) {
    let number = json._number;
    let created_date = json.created;
    let branch = json.branch;
    let ownerId = json.owner._account_id;
    let pipeline = [{
        $match: {
            branch: branch,
            'owner._account_id': ownerId,
            updated: {$lte: created_date},
            //_number: {$lt: number},
            //status: TYPE,
            //created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}


//Added


//Project and branch
function getPriorProjectBranchChangesCount(json) {
    let number = json._number;
    let branch = json.branch;
    let project = json.project;
    let created_date = json.created;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorProjectBranchTypeChangesCount(json, TYPE) {
    let created_date = json.created;
    let number = json._number;
    let branch = json.branch;
    let project = json.project;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            status: TYPE,
            project: project,
            branch: branch,
            updated: {$lte: created_date},
            //created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorProjectBranchChangeMeanTimeType(json) {
    let created_date = json.created;
    let number = json._number;
    let branch = json.branch;
    let project = json.project;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

function getPriorProjectBranchOwnerChangesCount(json) {
    let number = json._number;
    let branch = json.branch;
    let project = json.project;
    let ownerId = json.owner._account_id;
    let created_date = json.created;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            project: project,
            branch: branch,
            'owner._account_id': ownerId,
            updated: {$lte: created_date},
            //created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorProjectBranchOwnerTypeChangesCount(json, TYPE) {
    let created_date = json.created;
    let number = json._number;
    let branch = json.branch;
    let project = json.project;
    let ownerId = json.owner._account_id;
    let pipeline = [{
        $match: {
            //_number: {$lt: number},
            status: TYPE,
            project: project,
            branch: branch,
            'owner._account_id': ownerId,
            updated: {$lte: created_date},
            //created: {$lte: created_date},
        }
    },
        {$count: "count"}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getPriorProjectBranchOwnerChangeMeanTimeType(json) {
    let created_date = json.created;
    let number = json._number;
    let branch = json.branch;
    let project = json.project;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            branch: branch,
            project: project,
            'owner._account_id': ownerId,
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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

//Probability of build

//all build
function getNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

//project number of build
function getProjectNumberChangesBuilt(json) {
    let created_date = json.created;
    let project = json.project;
    let number = json._number;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

//project branch build
function getProjectBranchNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

//branch number of build
function getBranchNumberChangesBuilt(json) {
    let created_date = json.created;
    let branch = json.branch;
    let number = json._number;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            branch: branch,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

//owner number of build
function getOwnerNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            'owner._account_id': ownerId,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

//project owner branch build
function getOwnerProjectBranchNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
            'owner._account_id': ownerId,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            'owner._account_id': ownerId,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getProjectNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getBranchNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            branch: branch,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerProjectNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            'owner._account_id': ownerId,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getOwnerBranchNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            branch: branch,
            'owner._account_id': ownerId,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getProjectBranchNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let ownerId = json.owner._account_id;
    let project = json.project;
    let branch = json.branch;
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}


//file number of build
//project number of build
function getFilesNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let files_list = json.files_list ? json.files_list : [];
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            files_list: {$in: files_list},
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getFilesExtensionNumberChangesCount(json) {
    let created_date = json.created;
    let number = json._number;
    let extensions_list = json.extensions_list ? json.extensions_list : [];
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            extensions_list: {$in: extensions_list},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getFilesExtensionNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let extensions_list = json.extensions_list ? json.extensions_list : [];
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            extensions_list: {$in: extensions_list},
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getDirectoriesExtensionNumberChangesCount(json) {
    let created_date = json.created;
    let number = json._number;
    let directories_list = json.directories_list ? json.directories_list : [];
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            base_directories: {$in: directories_list},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}

function getDirectoriesExtensionNumberChangesBuilt(json) {
    let created_date = json.created;
    let number = json._number;
    let directories_list = json.directories_list ? json.directories_list : [];
    let match = {
        $match: {
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            base_directories: {$in: directories_list},
            avg_build_time: {$gt: 0},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {$count: 'count'}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return dbRequest(pipeline);
}


//file type number of build

//Age
function agePipeline(match, created_date) {
    let pipeline = [
        match,
        {$sort: {created: 1, _number: 1}},
        {$limit: 1},
        {
            $project: {
                _id: 0,
                count: {
                    $subtract: [
                        {$dateFromString: {dateString: {$substr: [created_date, 0, 22]}, timezone: "UTC"}},
                        {$dateFromString: {dateString: {$substr: ["$created", 0, 22]}, timezone: "UTC"}}
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
            //console.log(docs)
            return docs.length > 0 ? docs[0].count : 0;
        })
        .catch(err => {
            console.log(err)
        });
}

function getProjectAge(json) {
    let created = json.created;
    let number = json._number;
    let created_date = json.created;
    let match = {
        $match: {
            //_number: {$lt: number},
            //created: {$lte: created_date}
            //updated: {$lte: created},
        }
    }
    return agePipeline(match, created);
}

function getSubsystemAge(json) {
    let created = json.created;
    let project = json.project;
    let number = json._number;
    let created_date = json.created;
    let match = {
        $match: {
            //_number: {$lt: number},
            project: project,
            //created: {$lte: created_date},
            //updated: {$lte: created},
        }
    }
    return agePipeline(match, created);
}

function getBranchAge(json) {
    let created = json.created;
    let branch = json.branch;
    //let number = json._number;
    //let created_date = json.created;
    let match = {
        $match: {
            branch: branch,
            //_number: {$lt: number},
            //created: {$lte: created_date},
            //updated: {$lte: created},
        }
    }
    return agePipeline(match, created);
}

function getOwnerAge(json) {
    let created = json.created;
    let ownerId = json.owner._account_id;
    //let number = json._number;
    //let created_date = json.created;
    let match = {
        $match: {
            //_number: {$lt: number},
            //created: {$lte: created_date},
            //updated: {$lte: created},
            $or: [{'owner._account_id': ownerId}, {"reviewers.REVIEWER._account_id": ownerId}]
        }
    }
    return agePipeline(match, created);
}

//Rate
//get number of change to the date divide by the number of day

function getPriorRate(json, number_of_days, property = null, value = null) {

    if (NUM_DAYS_FOR_RECENT != null)
        number_of_days = NUM_DAYS_FOR_RECENT;

    let number = json._number;
    let created = json.created;
    let created_date = json.created;
    let dateFromNumberOfDaysAgo = Moment(json.created).subtract(number_of_days, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');
    let pipeline = [
        {
            $match: {
                //_number: {$lt: number},
                status: {$in: ['MERGED', 'ABANDONED']},
                created: {$lt: created_date, $gte: dateFromNumberOfDaysAgo},
                updated: {$lt: created},
            }
        },
        {$count: "count"},
        {
            $project: {
                count: {$divide: ["$count", number_of_days]}
            }
        },
    ]
    if (property) {
        if (value)
            pipeline[0]["$match"][property] = value;
    }

    return dbRequest(pipeline);
}

function getPriorBranchRate(json, number_of_days) {
    let property = "branch";
    let value = json.branch;
    return getPriorRate(json, number_of_days, property, value)
}

function getPriorSubsystemRate(json, number_of_days) {
    let property = "project";
    let value = json.project;
    return getPriorRate(json, number_of_days, property, value)
}

function getPriorOwnerRate(json, number_of_days) {
    let property = "$or";
    let ownerId = json.owner._account_id;
    let value = [{'owner._account_id': ownerId}, {"reviewers.REVIEWER._account_id": ownerId}]
    return getPriorRate(json, number_of_days, property, value)
}

function getPriorOwnerProjectBranchRate(json, number_of_days) {

    if (NUM_DAYS_FOR_RECENT != null)
        number_of_days = NUM_DAYS_FOR_RECENT;

    let number = json._number;
    let created_date = json.created;
    let ownerId = json.owner._account_id;
    let dateFromNumberOfDaysAgo = Moment(json.created).subtract(number_of_days, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');
    let pipeline = [
        {
            $match: {
                //_number: {$lt: number},
                status: {$in: ['MERGED', 'ABANDONED']},
                created: {$lt: created_date, $gte: dateFromNumberOfDaysAgo},
                updated: {$lte: created_date},
                $or: [
                    {'owner._account_id': ownerId},
                    {"reviewers.REVIEWER._account_id": ownerId}
                ]
            }
        },
        {$count: "count"},
        {
            $project: {
                count: {$divide: ["$count", number_of_days]}
            }
        },
    ]
    if (property) {
        if (value)
            pipeline[0]["$match"][property] = value;
    }

    return dbRequest(pipeline);
}

//file
function getFilesNumberOfRecentChangesOnBranch(json, number_of_days) {

    if (NUM_DAYS_FOR_RECENT != null)
        number_of_days = NUM_DAYS_FOR_RECENT;

    let number = json._number;
    let created_date = json.created
    let branch = json.branch;
    let files_list = json.files_list ? json.files_list : [];
    let dateFromNumberOfDaysAgo = Moment(json.created).subtract(number_of_days, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');
    let pipeline = [
        /*{
            $match: {

            }
        },*/
        {
            $match: {
                //status: "MERGED",
                //_number: {$lt: number},
                //$or: [{created: {$gte: dateFromNumberOfDaysAgo}}, {updated: {$gte: dateFromNumberOfDaysAgo}}]
                branch: branch,
                files_list: {$in: files_list},
                created: {$gte: dateFromNumberOfDaysAgo, $lt: created_date},
                updated: {$lte: created_date},
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
    let accountToExclude = MetricsUtils.getBotArray(projectName);
    //todo not exclude the owner
    //accountToExclude.push(ownerId)
    let pipeline = [
        {
            $match: {
                //_number: {$lt: number},
                status: {$in: ['MERGED', 'ABANDONED']},
                'owner._account_id': ownerId,
                //created: {$lte: created_date},
                updated: {$lte: created_date},
            }
        },
        {$unwind: "$reviewers.REVIEWER"},
        {$match: {_id: {$nin: accountToExclude}}},
        {$group: {_id: "$reviewers.REVIEWER._account_id", count: {$sum: 1}}},
        {$sort: {count: -1}},
        {$limit: NUMBER_OF_BEST_REVIEWER},
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return Change
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return 0;
            return docs.length > 0 ? getReviewersMetrics(json, docs) : initRev;
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

let initRev = {
    reviewersPriorChangesSum: 0,
    reviewersPriorChangesAvg: 0,
    reviewersPriorChangesMax: 0,
    reviewersPriorChangesMin: 0,
    reviewersPriorChangesStd: 0,
    reviewersPriorMergedChangesSum: 0,
    reviewersPriorMergedChangesAvg: 0,
    reviewersPriorMergedChangesMax: 0,
    reviewersPriorMergedChangesMin: 0,
    reviewersPriorMergedChangesStd: 0,
    reviewersPriorAbandonedChangesSum: 0,
    reviewersPriorAbandonedChangesAvg: 0,
    reviewersPriorAbandonedChangesMax: 0,
    reviewersPriorAbandonedChangesMin: 0,
    reviewersPriorAbandonedChangesStd: 0,
    reviewersPriorUnCloseChangesSum: 0,
    reviewersPriorUnCloseChangesAvg: 0,
    reviewersPriorUnCloseChangesMax: 0,
    reviewersPriorUnCloseChangesMin: 0,
    reviewersPriorUnCloseChangesStd: 0,
    reviewersNumberOfReviewSum: 0,
    reviewersNumberOfReviewAvg: 0,
    reviewersNumberOfReviewMax: 0,
    reviewersNumberOfReviewMin: 0,
    reviewersNumberOfReviewStd: 0,
    reviewersPreviousMessageSum: 0,
    reviewersPreviousMessageAvg: 0,
    reviewersPreviousMessageMax: 0,
    reviewersPreviousMessageMin: 0,
    reviewersPreviousMessageStd: 0,
    fileCountForReviewersCountAvg: 0,
    fileCountForReviewersCountMax: 0,
    fileCountForReviewersCountMin: 0,
    fileCountForReviewersCountStd: 0,
    fileTimeForReviewersCountAvg: 0,
    fileTimeForReviewersCountMax: 0,
    fileTimeForReviewersCountMin: 0,
    fileTimeForReviewersCountStd: 0,
    ownerAndReviewerCommonsChangesSum: 0,
    ownerAndReviewerCommonsMessagesSum: 0,
    ownerAndReviewerCommonsMessagesSumForRev: 0,
    ownerAndReviewerCommonsMessagesAvg: 0,
    ownerAndReviewerCommonsMessagesMax: 0,
    ownerAndReviewerCommonsMessagesMin: 0,
    ownerAndReviewerCommonsMessagesStd: 0,
    reviewersChangesSum: 0,
    reviewersChangesAvg: 0,
    reviewersChangesMax: 0,
    reviewersChangesMin: 0,
    reviewersChangesStd: 0,
}


async function getReviewersMetrics(json, reviewersDocs) {
    let number = json._number;
    let created_date = json.created;
    let ownerId = json.owner._account_id;
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

    let reviewersPriorChangesCount = getReviewersPriorChangesCount(reviewersId, number, created_date);
    let reviewersPriorMergedChangesCount = getReviewersPriorTypeChangesCount(number, reviewersId, created_date, "MERGED");
    let reviewersPriorAbandonedChangesCount = getReviewersPriorTypeChangesCount(number, reviewersId, created_date, "ABANDONED");
    let reviewersPriorUnCloseChangesCount = getReviewersPriorUnCloseChangesCount(number, reviewersId, created_date);
    let reviewersNumberOfReview = getReviewersNumberOfReview(number, reviewersId, created_date);
    let reviewersPreviousMessageCount = getReviewersPreviousMessageCount(number, reviewersId, created_date);
    let fileTimeAndCountForReviewers = getFileTimeAndCountForReviewers(number, reviewersId, created_date, files_list, {$in: ['MERGED', 'ABANDONED']});
    let ownerAndReviewerCommonsChangesSumAndMessagesSum = getOwnerAndReviewerCommonsChangesSumAndMessagesSum(json, reviewersId);
    let ownerAndReviewerCommonsMessagesAvg = getOwnerAndReviewerCommonsMessagesAvg(json, reviewersId);

    //let reviewersChangesCount = Promise.resolve(getSumMeanMaxMinStd(allCount));

    let reviewerTimezone = getReviewerTimezone(number, reviewersId, created_date);
    let reviewerLastMessage = getReviewerLastMessage(number, reviewersId, created_date, ownerId);
    //let reviewerLastChange = getReviewerLastChange(number, reviewersId, created_date);
    //let reviewerLastReview = getReviewerLastReview(number, reviewersId, created_date, ownerId);
    //console.log(reviewerLastReview)

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
        //reviewersChangesCount,//9
        reviewerTimezone,//9
        reviewerLastMessage,//10
        //reviewerLastChange,//11
        //reviewerLastReview,//13
    ]).then((results) => {
        let metadata = {
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

            //reviewersChangesSum: results[9].sum,
            //reviewersChangesAvg: results[9].avg,
            //reviewersChangesMax: results[9].max,
            //reviewersChangesMin: results[9].min,
            //reviewersChangesStd: results[9].std,

            reviewerTimezoneAvg: results[9].avg,
            reviewerTimezoneMax: results[9].max,
            reviewerTimezoneMin: results[9].min,
            reviewerTimezoneStd: results[9].std,

            reviewerLastMessageDate: results[10].date,
            //reviewerLastChangeDate: results[11].length > 0 ? results[11].date : 0,
            //reviewerLastReviewDate: results[13].length > 0 ? results[13].date : 0,

            //reviewerLastChangeDateDiff: MetricsUtils.timeDiff(results[11].length > 0 ? results[11].date : 0 , created_date),
            //reviewerLastMessageDateDiff: MetricsUtils.timeDiff(results[12].length > 0 ? results[12].date : 0, created_date),
            //reviewerLastReviewDateDiff: MetricsUtils.timeDiff(results[13].length > 0 ? results[13].date : 0, created_date),
        }

        //console.log(results[10].avg)
        //console.log(results[11].date)
        metadata["reviewerLastMessageDateDiff"] = metadata["reviewerLastMessageDate"] ? MetricsUtils.timeDiff(metadata["reviewerLastMessageDate"], created_date) : undefined;
        //metadata["reviewerLastChangeDateDiff"] = metadata["reviewerLastChangeDate"] ? MetricsUtils.timeDiff(metadata["reviewerLastChangeDate"], created_date) : undefined;
        //metadata["reviewerLastReviewDateDiff"] = metadata["reviewerLastReviewDate"] ? MetricsUtils.timeDiff(metadata["reviewerLastReviewDate"], created_date) : undefined;
        //console.log(metadata["reviewerLastMessageDateDiff"])

        /*if (!metadata["reviewerLastChangeDateDiff"] && !metadata["reviewerLastMessageDateDiff"] && !metadata["reviewerLastReviewDateDiff"])
            metadata["reviewerLastActivity"] = undefined
        else
            metadata["reviewerLastActivity"] = MathJs.min([metadata["reviewerLastChangeDateDiff"], metadata["reviewerLastMessageDateDiff"], metadata["reviewerLastReviewDateDiff"]]);
        */

        return metadata;
    })

}

function getReviewerTimezone(number, reviewersId, created_date) {
    let pipeline = [
        {
            $match: {
                //_number: {$lt: number},
                'owner._account_id': {$in: reviewersId},
                created: {$lte: created_date},
            }
        },
        {
            $group: {
                _id: "$owner._account_id",
                owner_timezone: {$avg: "$owner_timezone"},
            }
        },
        {
            $group: {
                _id: 1,
                avg: {$avg: "$owner_timezone"},
                max: {$max: "$owner_timezone"},
                min: {$min: "$owner_timezone"},
                std: {$stdDevPop: "$owner_timezone"},
            }
        },
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getReviewerLastChange(number, reviewersId, created_date) {
    let pipeline = [
        {
            $match:
                {
                    //_number: {$lt: number},
                    "owner._account_id": {$in: reviewersId},
                    created: {$lte: created_date},
                }
        },
        {$sort: {created: -1}},
        {$limit: 1},
        {
            $project: {
                _id: 0,
                date: "$created",
            }
        }
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getReviewerLastMessage(number, reviewersId, created_date, ownerId) {
    let pipeline = [
        {
            $match:
                {
                    //_number: {$lt: number},
                    created: {$lte: created_date},
                    $and:
                        [
                            {"messages.author._account_id": {$in: reviewersId}},
                            {"messages.date": {$lt: created_date}},
                        ]
                }
        },
        {$sort: {created: -1}},
        {$limit: 1},
        {$unwind: "$messages"},
        {
            $match:
                {
                    "messages.author._account_id": {$in: reviewersId},
                    "messages.date": {$lt: created_date}
                }
        },
        {
            $group: {
                _id: 0,
                //first_messages_date: {$first: "$messages.date"},
                date: {$last: "$messages.date"},
            }
        },
        /*{$sort: {"messages.date": -1}},
        {$limit: 1},
        {
            $project: {
                _id: 0,
                date: "$messages.date",
            }
        },*/
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

function getReviewerLastReview(number, reviewersId, created_date, ownerId) {
    let pipeline = [
        {
            $match:
                {
                    //_number: {$lt: number},
                    status: {$in: ['MERGED', 'ABANDONED']},
                    "labels.Code-Review.all._account_id": ownerId,
                    //created: {$lte: created_date},
                    updated: {$lte: created_date},
                }
        },
        {$sort: {created: -1}},
        {$limit: 1},
        {$unwind: "$labels.Code-Review.all"},
        {
            $match:
                {
                    "labels.Code-Review.all._account_id": ownerId
                }
        },
        {$sort: {"labels.Code-Review.all.date": -1}},
        {$limit: 1},
        {
            $project: {
                _id: 0, date: "$labels.Code-Review.all.date",
            }
        }
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
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

function getReviewersPriorChangesCount(reviewersId, number, created_date) {
    let pipeline = [
        {
            $match: {
                //_number: {$lt: number},
                'owner._account_id': {$in: reviewersId},
                created: {$lte: created_date},
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
                //_number: {$lt: number},
                status: TYPE,
                'owner._account_id': {$in: reviewersId},
                //created: {$lte: created_date},
                updated: {$lte: created_date},
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
                //_number: {$lt: number},
                'owner._account_id': {$in: reviewersId},
                updated: {$gt: created_date},
                //created: {$lte: created_date},
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                "reviewers.REVIEWER._account_id": {$in: reviewersId}
            }
        },
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
        }
    }
    let pipeline = [
        match,
        {
            $match: {
                "messages_per_account_before_close.account": {$in: reviewersId}
            }
        },
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
            //_number: {$lt: number},
            status: TYPE,
            'reviewers.REVIEWER._account_id': {$in: reviewersId},
            files_list: {$in: files_list},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            ]
        }
    }
    let pipeline = [
        {
            $match: {
                //_number: {$lt: number},
                status: {$in: ['MERGED', 'ABANDONED']},
                //created: {$lte: created_date},
                updated: {$lte: created_date},
            }
        },
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
            //_number: {$lt: number},
            status: {$in: ['MERGED', 'ABANDONED']},
            //created: {$lte: created_date},
            updated: {$lte: created_date},
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
            ]
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

//get median function
function all_match (created_date) {
    return {
        $match: {
            updated: {$lte: created_date},
            status: {$in: ['MERGED', 'ABANDONED']},
        }
    }
}

function owner_match (created_date, ownerId) {
    return {
        $match: {
            updated: {$lte: created_date},
            status: {$in: ['MERGED', 'ABANDONED']},
            'owner._account_id': ownerId,
        }
    }
}

function project_match (created_date, project) {
    return {
        $match: {
            updated: {$lte: created_date},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
        }
    }
}

function branch_match (created_date, branch) {
    return {
        $match: {
            updated: {$lte: created_date},
            status: {$in: ['MERGED', 'ABANDONED']},
            branch: branch,
        }
    }
}

function owner_project_match (created_date, ownerId, project, branch) {
    return {
        $match: {
            updated: {$lte: created_date},
            status: {$in: ['MERGED', 'ABANDONED']},
            'owner._account_id': ownerId,
            project: project,
        }
    }
}

function owner_branch_match (created_date, ownerId, project, branch) {
    return {
        $match: {
            updated: {$lte: created_date},
            status: {$in: ['MERGED', 'ABANDONED']},
            'owner._account_id': ownerId,
            branch: branch,
        }
    }
}

function project_branch_match (created_date, ownerId, project, branch) {
    return {
        $match: {
            updated: {$lte: created_date},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
        }
    }
}

function owner_project_branch_match (created_date, ownerId, project, branch) {
    return {
        $match: {
            updated: {$lte: created_date},
            status: {$in: ['MERGED', 'ABANDONED']},
            project: project,
            branch: branch,
            'owner._account_id': ownerId,
        }
    }
}


//change duration
function getPriorChangeDurationMed(data, created_date){
    return getMedian(
        data.priorClosedChangesCount,
        all_match(created_date),
        "date_updated_date_created_diff"
    )
}

function getPriorOwnerProjectBranchChangesDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.ownerProjectBranchClosedChangesCount,
        owner_project_branch_match (created_date, ownerId, project, branch),
        "date_updated_date_created_diff"
    )
}

function getPriorOwnerChangesDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.ownerPriorClosedChangesCount,
        owner_match (created_date, ownerId),
        "date_updated_date_created_diff"
    )
}

function getPriorProjectChangesDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorProjectClosedChangesCount,
        project_match (created_date, project),
        "date_updated_date_created_diff"
    )
}

function getPriorBranchChangesDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorBranchClosedChangesCount,
        branch_match (created_date, branch),
        "date_updated_date_created_diff"
    )
}

function getPriorOwnerProjectChangesDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorOwnerProjectClosedChangesCount,
        owner_project_match (created_date, ownerId, project, branch),
        "date_updated_date_created_diff"
    )
}

function getPriorOwnerBranchChangesDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorOwnerBranchClosedChangesCount,
        owner_branch_match (created_date, ownerId, project, branch),
        "date_updated_date_created_diff"
    )
}

function getPriorProjectBranchChangesDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorProjectBranchChangesCount,
        project_branch_match (created_date, ownerId, project, branch),
        "date_updated_date_created_diff"
    )
}

//build time duration
function getPriorBuildTimeDurationMed(data, created_date){
    return getMedian(
        data.priorClosedChangesCount,
        {
            $match: {
                updated: {$lte: created_date},
                status: {$in: ['MERGED', 'ABANDONED']},
            }
        },
        "avg_build_time_before_close"
    )
}

function getPriorOwnerProjectBranchBuildTimeDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.ownerProjectBranchClosedChangesCount,
        {
            $match: {
                updated: {$lte: created_date},
                status: {$in: ['MERGED', 'ABANDONED']},
                project: project,
                branch: branch,
                "owner._account_id": ownerId,
            }
        },
        "avg_build_time_before_close"
    )
}

function getPriorOwnerBuildTimeDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.ownerPriorChangesCount,
        {
            $match: {
                updated: {$lte: created_date},
                status: {$in: ['MERGED', 'ABANDONED']},
                "owner._account_id": ownerId,
            }
        },
        "avg_build_time_before_close"
    )
}

function getPriorProjectBuildTimeDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorProjectChangesCount,
        {
            $match: {
                updated: {$lte: created_date},
                status: {$in: ['MERGED', 'ABANDONED']},
                project: project,
            }
        },
        "avg_build_time_before_close"
    )
}

function getPriorBranchBuildTimeDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorProjectChangesCount,
        {
            $match: {
                updated: {$lte: created_date},
                status: {$in: ['MERGED', 'ABANDONED']},
                branch: branch,
            }
        },
        "avg_build_time_before_close"
    )
}

function getPriorOwnerProjectBuildTimeDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorOwnerProjectChangesCount,
        {
            $match: {
                updated: {$lte: created_date},
                status: {$in: ['MERGED', 'ABANDONED']},
                project: project,
                "owner._account_id": ownerId,
            }
        },
        "avg_build_time_before_close"
    )
}

function getPriorOwnerBranchBuildTimeDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorOwnerBranchChangesCount,
        {
            $match: {
                status: {$in: ['MERGED', 'ABANDONED']},
                branch: branch,
                "owner._account_id": ownerId,
                updated: {$lte: created_date},
            }
        },
        "avg_build_time_before_close"
    )
}

function getPriorProjectBranchBuildTimeDurationMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorProjectBranchChangesCount,
        {
            $match: {
                updated: {$lte: created_date},
                status: {$in: ['MERGED', 'ABANDONED']},
                project: project,
                branch: branch,
            }
        },
        "avg_build_time_before_close"
    )
}

//time to add reviewer
function getPriorTimeToAddReviewerMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorClosedChangesCount,
        all_match(created_date),
        "avg_time_to_add_human_reviewers_before_close"
    )
}

function getPriorOwnerProjectBranchTimeToAddReviewerMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.ownerProjectBranchClosedChangesCount,
        owner_project_branch_match(created_date, ownerId, project, branch),
        "avg_time_to_add_human_reviewers_before_close"
    )
}

function getPriorOwnerTimeToAddReviewerMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.ownerPriorClosedChangesCount,
        owner_match(created_date, ownerId, project, branch),
        "avg_time_to_add_human_reviewers_before_close"
    )
}

function getPriorProjectTimeToAddReviewerMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorProjectClosedChangesCount,
        project_match(created_date, ownerId, project, branch),
        "avg_time_to_add_human_reviewers_before_close"
    )
}

function getPriorBranchTimeToAddReviewerMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorBranchClosedChangesCount,
        branch_match(created_date, ownerId, project, branch),
        "avg_time_to_add_human_reviewers_before_close"
    )
}

function getPriorOwnerProjectTimeToAddReviewerMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorOwnerProjectClosedChangesCount,
        owner_project_match(created_date, ownerId, project, branch),
        "avg_time_to_add_human_reviewers_before_close"
    )
}

function getPriorOwnerBranchTimeToAddReviewerMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorOwnerBranchClosedChangesCount,
        owner_branch_match(created_date, ownerId, project, branch),
        "avg_time_to_add_human_reviewers_before_close"
    )
}

function getPriorProjectBranchTimeToAddReviewerMed(data, created_date, ownerId, project, branch){
    return getMedian(
        data.priorProjectBranchClosedChangesCount,
        project_branch_match(created_date, ownerId, project, branch),
        "avg_time_to_add_human_reviewers_before_close"
    )
}



module.exports = {
    start: startComputeMetrics
};