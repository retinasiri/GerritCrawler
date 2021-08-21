const cliProgress = require('cli-progress');
const Moment = require('moment');
const Database = require('../config/databaseConfig');
const Metrics = require('../models/metrics');
const Changes = require('../models/change');
const Utils = require('../config/utils');
const fs = require('fs');
const MetricsUtils = require('./metrics-utils');

const progressBar = new cliProgress.SingleBar({
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | skipped : {skipped} ',
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);
const PathLibrary = require('path');

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectName = libreOfficeJson["projectName"];
let DATA_PATH = "data/"
let NUM_OF_CHANGES_LIMIT = 10000;
let skipped = 0;


if (typeof require !== 'undefined' && require.main === module) {
    startComputeMetrics(libreOfficeJson).catch(err => {
        console.log(err)
    });
}

function startComputeMetrics(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Metrics.estimatedDocumentCount({});
        })
        .then((count) => {
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            delete_metrics_file();
            progressBar.start(count, 0);
            return getMetrics(0);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished !!!!");
        })
        .then(() => {
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

function save_other_file(filename, path, suffix, json) {
    for (let id in json) {
        let value = json[id]
        return Utils.add_line_to_file(value, filename, path)
    }
}

function getMetrics(skip) {
    return Metrics
        .aggregate([
            {
                $match: {
                    status: {$in: ['MERGED', 'ABANDONED']},
                    //is_a_bot : false,
                    //first_revision : 1
                }
            },
            {$sort: {date_created: 1, number: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve(false)
            return docs.length ? collectDocs(docs) : Promise.resolve(false);
        })
        .then(result => {
            return result ? getMetrics(skip + NUM_OF_CHANGES_LIMIT) : Promise.resolve(false);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        let doc = docs[key];
        let id = doc.id;

        let check = await Changes.exists({id: id});
        if (!check)
            continue;

        if (check_value_to_ignore(doc)) {
            skipped += 1;
            continue;
        }

        addMetrics(doc)

        await collectMetrics(doc)
            /*.then((json) => {
                return saveMetrics(json);
            })*/
            .then(() => {
                return updateProgress();
            })

    }
    return Promise.resolve(true);
}

function check_value_to_ignore(metrics) {
    let bool = false;

    if (metrics["status"])
        if (metrics["status"].includes("NEW"))
            return true;
    if (metrics["is_a_bot"] === true)
        return true;

    /*if (metrics["first_revision_number"] !== 1)
        return true;*/
    /*if (check_self_review(metrics))
        return true;*/
    /*if(metrics["is_self_review"])
        return true;*/

    //todo
    /*
    //if(metrics["date_updated_date_created_diff"] < 24)
    if(metrics["date_updated_date_created_diff"] < 1)
        return true;

    //if(metrics["date_updated_date_created_diff"] > 336)
    if(metrics["date_updated_date_created_diff"] > 730)
        return true;

    if(metrics["max_inactive_time_before_close"] > 168)
        return true;
    */

    //let keys = ['fg_degree_centrality', 'num_segs_added', 'filesBuildTimeAvg']
    //let keys = ['fg_degree_centrality', 'num_segs_added', 'revisionTimeAvg']
    let keys = ['fg_degree_centrality', 'num_segs_added']
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (metrics[key] == null || !metrics.hasOwnProperty(key) || !(key in metrics)) {
            bool = true;
        }
    }

    return bool;
}

async function saveMetrics(json, suffix = "") {
    let path = PathLibrary.join(DATA_PATH, projectName);
    if (!suffix || suffix === "")
        suffix = "metrics"
    let filename = projectName + "-" + suffix + ".csv";
    return Utils.add_line_to_file(json, filename, path)
}

function delete_metrics_file() {
    try {
        let filename = projectName + "-metrics.csv";
        let filename_path = PathLibrary.join(DATA_PATH, projectName, filename);
        if (fs.existsSync(filename_path))
            fs.unlinkSync(filename_path);
    } catch (error) {
        console.log(error);
    }
}

async function updateProgress() {
    progressBar.increment(1, {skipped: skipped});
    return Promise.resolve(true);
}

const NUMBER_OF_DECIMAL = 4
const DEFAULT_VALUE = 0

function copy(result, json, key, new_name = "", convert_to_hours = false) {
    let name = key.camelCaseToDashed()

    if (new_name !== "") {
        name = new_name.camelCaseToDashed()
    }

    if (json[key] === null || !(key in json) || !(json.hasOwnProperty(key)))
        result[name] = DEFAULT_VALUE;
    else {
        if (typeof (json[key]) === "number") {
            result[name] = parseFloat(json[key]);
            if (convert_to_hours) {
                result[name] = Moment.duration(result[name]).asHours()
            }
        } else {
            result[name] = json[key];
        }
    }
    return result;
}


let i = 1;

String.prototype.camelCaseToDashed = function () {
    return this.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

function copy_time_metrics(id, metric, result, number_of_days) {
    if (metric.hasOwnProperty(id + number_of_days)) {
        result = copy(result, metric, id + number_of_days)
    } else {
        if (id.includes("eviewer"))
            result = copy(result, metric, id + number_of_days)
        else
            result = copy(result, metric, id)
    }
    return result;
}

async function collectMetrics(metric) {

    let result = {};
    let result_all = {};
    let result_7_days = {};
    let result_14_days = {};
    let result_30_days = {};

    for (let id in metric_to_collect) {
        result = copy(result, metric, id);
        result_7_days = copy_time_metrics(id, metric, result_7_days, "_7_days")
        result_14_days = copy_time_metrics(id, metric, result_14_days, "_14_days")
        result_30_days = copy_time_metrics(id, metric, result_30_days, "_30_days")
        result_all = {...result, ...result_7_days, ...result_14_days, ...result_30_days}
    }

    delete result_all["date_updated_date_created_diff"]
    result_all = copy(result_all, metric, "date_updated_date_created_diff");

    return Promise.all(
        [
            saveMetrics(result, "metrics"),
            saveMetrics(result_7_days, "metrics-7-days"),
            saveMetrics(result_14_days, "metrics-14-days"),
            saveMetrics(result_30_days, "metrics-30-days"),
            saveMetrics(result_all, "metrics-all")
        ]
    ).then(() => {
        return result
    })
}

let metric_to_collect = {
    id: true,

    days_of_the_weeks_of_date_created: true,
    days_of_the_weeks_of_date_created_for_owner_timezone: true,
    hours_of_the_days_date_created: true,
    hours_of_the_days_date_created_for_owner: true,
    is_created_date_a_weekend: true,
    is_created_date_a_weekend_for_owner_timezone: true,
    author_timezone: true,
    month_date_created: true,
    month_date_created_for_owner: true,
    //is_created_date_a_weekend: true,

    fg_degree_centrality: true,
    fg_closeness_centrality: true,
    fg_betweenness_centrality: true,
    fg_eigenvector_centrality: true,
    fg_clustering_coefficient: true,
    fg_core_number: true,

    first_revision_insertions: true,
    first_revision_deletions: true,
    num_files: true,
    num_files_type: true,
    num_directory: true,
    num_binary_file: true,
    num_programming_language: true,
    num_data_language: true,
    num_prose_language: true,
    num_markup_language: true,
    modify_entropy: true,
    num_segs_added: true,
    num_segs_deleted: true,
    num_segs_modify: true,
    first_revision_code_churn: true,
    first_revision_code_churn_size: true,
    //is_a_cherry_pick: true,
    //num_files_type: true,
    //num_directory: true,
    //sum_loc: true,
    //sum_complexity: true,

    subject_length: true,
    subject_word_count: true,
    msg_length: true,
    msg_word_count: true,
    is_non_fonctional: true,
    is_refactoring: true,
    is_corrective: true,
    is_preventive: true,
    has_feature_addition: true,
    is_merge: true,
    is_a_bot: true,
    //is_perfective: true,
    //msg_word_count: true,
    //subject_word_count: true,
    //subject_length: true,

    //todo add unclose change
    //todo add unclose owner change
    //todo add subsystem unclose change
    //todo owner merged ratio

    owner_non_close_changes: true,
    non_close_changes: true,
    project_non_close_changes: true,

    priorChangesCount: true,
    priorSubsystemChangesCount: true,
    ownerPriorChangesCount: true,

    ownerFileCountAvg: true,
    ownerFileTimeAvg: true,
    AvgNumberOfDeveloperWhoModifiedFiles: true,
    priorChangesFiles: true,

    fileCountAvg: true,
    fileTimeAvg: true,
    filesBuildTimeAvg: true,
    filesRevisionTimeAvg: true,
    filesNumFailsAvg: true,

    filesNumberOfRecentChangesOnBranch: true,

    ownerAge: true,
    subsystemAge: true,
    branchAge: true,
    priorOwnerRate: true,

    ownerNumberOfReview: true,
    ownerPreviousMessageCount: true,

    ownerChangesMessagesSum: true,
    ownerChangesMessagesAvgPerChanges: true,

    priorChangeDurationMean: true,

    //ownerNumberOfAutoReview: true, //todo change for autoreview rate

    ownerInactiveTimeAvg: true,
    ownerTimeBetweenMessageAvg: true,

    ownerProjectBranchNumberOfAutoReview: true, //todo change for autoreview rate

    ownerProjectBranchBuildTimeAvg: true,
    ownerProjectBranchNumberOfRevisionAvg: true,
    ownerProjectBranchInactiveTimeAvg: true,
    ownerProjectBranchTimeBetweenMessageAvg: true,
    ownerProjectBranchChangesDurationAvg: true,
    ownerProjectBranchRevisionTimeAvg: true,
    ownerProjectBranchTimeBetweenRevisionAvg: true,
    ownerProjectBranchTimeToAddReviewerAvg: true,

    ownerProjectBranchChangesCount: true,
    ownerProjectBranchClosedChangesCount: true,

    ownerProjectBranchChangeMeanTimeTypeAvg: true,

    ownerProjectBranchNumberChangesBuilt: true,

    ownerMergedRatio: true,
    ownerRateOfAutoReview: true,
    ratioOwnerProjectBranchNumberChangesBuilt: true,

    priorOwnerSubsystemChangesCount: true,
    priorOwnerSubsystemChangesRatio: true,

    //prior_branch_owner_ratio: true,
    //owner_non_close_changes: true,

    reviewersPriorChangesSum: true,
    reviewersPriorChangesAvg: true,
    //reviewersPriorChangesMax: true,
    //reviewersPriorChangesMin: true,
    //reviewersPriorChangesStd: true,

    reviewersPriorMergedChangesSum: true,
    reviewersPriorMergedChangesAvg: true,
    //reviewersPriorMergedChangesMax: true,
    //reviewersPriorMergedChangesMin: true,
    //reviewersPriorMergedChangesStd: true,

    reviewersPriorAbandonedChangesSum: true,
    reviewersPriorAbandonedChangesAvg: true,
    //reviewersPriorAbandonedChangesMax: true,
    //reviewersPriorAbandonedChangesMin: true,
    //reviewersPriorAbandonedChangesStd: true,

    reviewersPriorUnCloseChangesSum: true,
    reviewersPriorUnCloseChangesAvg: true,
    //reviewersPriorUnCloseChangesMax: true,
    //reviewersPriorUnCloseChangesMin: true,
    //reviewersPriorUnCloseChangesStd: true,

    reviewersNumberOfReviewSum: true,
    reviewersNumberOfReviewAvg: true,
    //reviewersNumberOfReviewMax: true,
    //reviewersNumberOfReviewMin: true,
    //reviewersNumberOfReviewStd: true,

    reviewersPreviousMessageSum: true,
    reviewersPreviousMessageAvg: true,
    //reviewersPreviousMessageMax: true,
    //reviewersPreviousMessageMin: true,
    //reviewersPreviousMessageStd: true,

    fileCountForReviewersCountAvg: true,
    //fileCountForReviewersCountMax: true,
    //fileCountForReviewersCountMin: true,
    //fileCountForReviewersCountStd: true,

    fileTimeForReviewersCountAvg: true,
    //fileTimeForReviewersCountMax: true,
    //fileTimeForReviewersCountMin: true,
    //fileTimeForReviewersCountStd: true,

    ownerAndReviewerCommonsChangesSum: true,
    ownerAndReviewerCommonsMessagesSum: true,

    ownerAndReviewerCommonsMessagesSumForRev: true,
    ownerAndReviewerCommonsMessagesAvg: true,
    //ownerAndReviewerCommonsMessagesMax: true,
    //ownerAndReviewerCommonsMessagesMin: true,
    //ownerAndReviewerCommonsMessagesStd: true,

    reviewersChangesSum: true,
    reviewersChangesAvg: true,
    //reviewersChangesMax: true,
    //reviewersChangesMin: true,
    //reviewersChangesStd: true,

    reviewerTimezoneAvg: true,
    reviewerTimezoneMax: true,
    reviewerTimezoneMin: true,
    reviewerTimezoneStd: true,

    reviewerLastActivity: true,
    reviewerLastMessageDateDiff: true,

    date_updated_date_created_diff: true,

}


module.exports = {
    start: startComputeMetrics
};

let date_suffix = ['', '_7_days', '_14_days', '_30_days']

function addMetrics(json) {
    add_non_close(json, "owner_non_close_changes", "ownerPriorChangesCount", "ownerPriorMergedChangesCount", "ownerPriorAbandonedChangesCount")
    add_non_close(json, "non_close_changes", "priorChangesCount", "priorMergedChangesCount", "priorAbandonedChangesCount")
    add_non_close(json, "project_non_close_changes", "priorSubsystemChangesCount", "priorSubsystemMergedChangesCount", "priorSubsystemAbandonedChangesCount")
    add_ratio(json, "ownerProjectBranchNumberOfAutoReviewRate", "ownerProjectBranchNumberOfAutoReview", "ownerProjectBranchChangesCount")

}

function add_non_close(json, result_name, first, second, third) {
    for (let i = 0; i < date_suffix.length; i) {
        let suffix = date_suffix[i];
        json[result_name + suffix] = json[first + suffix] - json[second + suffix] - json[third + suffix];
    }
    //return json
}

function add_ratio(json, result_name, first, second) {
    for (let i = 0; i < date_suffix.length; i) {
        let suffix = date_suffix[i];
        json[result_name + suffix] = MetricsUtils.safeDivision(json[first + suffix], json[second + suffix])
    }
    //return json
}


/*/////////
    //ownerPriorMergedChangesCount: true,
    //ownerPriorAbandonedChangesCount: true,
    //mergedRatio: true,
    //priorSubsystemChangesCount: true,

    priorChangeDurationMean: true,
    //priorChangeDurationMax: true,
    //priorChangeDurationMin: true,
    //priorChangeDurationStd: true,

    priorOwnerChangesDurationMean: true,
    //priorOwnerChangesDurationMax: true,
    //priorOwnerChangesDurationMin: true,
    //priorOwnerChangesDurationStd: true,


    ownerNumberOfReview: true,
    ownerPreviousMessageCount: true,
    ownerChangesMessagesSum: true,

    ownerChangesMessagesAvgPerChanges: true,
    //ownerChangesMessagesMaxPerChanges: true,
    //ownerChangesMessagesMinPerChanges: true,
    //ownerChangesMessagesStdPerChanges: true,

    ownerNumberOfRevisionAvg: true,
    //ownerNumberOfRevisionMax: true,
    //ownerNumberOfRevisionMin: true,
    //ownerNumberOfRevisionStd: true,

    ownerRateOfAutoReview: true,

    revisionTimeAvg: true,
    //revisionTimeMax: true,
    //revisionTimeMin: true,
    //revisionTimeStd: true,

    ownerRevisionTimeAvg: true,
    //ownerRevisionTimeMax: true,
    //ownerRevisionTimeMin: true,
    //ownerRevisionTimeStd: true,

    ownerTimeBetweenRevisionAvg: true,
    //ownerTimeBetweenRevisionMax: true,
    //ownerTimeBetweenRevisionMin: true,
    //ownerTimeBetweenRevisionStd: true,

    ownerTimeToAddReviewerAvg: true,
    //ownerTimeToAddReviewerMax: true,
    //ownerTimeToAddReviewerMin: true,
    //ownerTimeToAddReviewerStd: true,

    branchBuildTimeAvg: true,
    //branchBuildTimeMax: true,
    //branchBuildTimeMin: true,
    //branchBuildTimeStd: true,

    branchRevisionTimeAvg: true,
    //branchRevisionTimeMax: true,
    //branchRevisionTimeMin: true,
    //branchRevisionTimeStd: true,

    AvgNumberOfDeveloperWhoModifiedFiles: true,

    fileTimeAvg: true,
    //fileTimeMax: true,
    //fileTimeMin: true,
    //fileTimeStd: true,

    fileCountAvg: true,
    //fileCountMax: true,
    //fileCountMin: true,
    //fileCountStd: true,

    filesBuildTimeAvg: true,
    //filesBuildTimeMax: true,
    //filesBuildTimeMin: true,
    //filesBuildTimeStd: true,

    filesRevisionTimeAvg: true,
    //filesRevisionTimeMax: true,
    //filesRevisionTimeMin: true,
    //filesRevisionTimeStd: true,

    filesNumFailsAvg: true,
    //filesNumFailsMax: true,
    //filesNumFailsMin: true,
    //filesNumFailsStd: true,

    ownerInactiveTimeAvg: true,
    //ownerInactiveTimeMax: true,
    //ownerInactiveTimeMin: true,
    //ownerInactiveTimeStd: true,

    ownerTimeBetweenMessageAvg: true,
    //ownerTimeBetweenMessageMax: true,
    //ownerTimeBetweenMessageMin: true,
    //ownerTimeBetweenMessageStd: true,

    ownerNumberOfCherryPicked: true,
    branchNumberOfCherryPicked: true,

    priorBranchChangesCount: true,
    priorBranchMergedChangesCount: true,
    priorBranchAbandonedChangesCount: true,
    priorBranchOwnerChangesCount: true,
    priorBranchOwnerMergedChangesCount: true,
    priorBranchOwnerAbandonedChangesCount: true,

    priorBranchChangeMeanTimeTypeAvg: true,
    //priorBranchChangeMeanTimeTypeMax: true,
    //priorBranchChangeMeanTimeTypeMin: true,
    //priorBranchChangeMeanTimeTypeStd: true,

    projectAge: true,
    subsystemAge: true,
    branchAge: true,
    ownerAge: true,

    priorOverAllRateFromCount: true,
    priorOverAllBranchRateFromCount: true,
    priorOverAllSubsystemRateFromCount: true,
    priorOverAlOwnerRateFromCount: true,

    priorRateFromCount: true,
    priorBranchRateFromCount: true,
    priorSubsystemRateFromCount: true,
    priorOwnerRateFromCount: true,

    filesNumberOfRecentChangesOnBranch: true,*/

/*function addMetrics(json) {
    json["prior_branch_owner_ratio"] = MetricsUtils.safeDivision(json["priorBranchOwnerChangesCount"], json["priorBranchChangesCount"])
    json["owner_non_close_changes"] = json["ownerPriorChangesCount"] - json["ownerPriorMergedChangesCount"] - json["ownerPriorAbandonedChangesCount"]

    if (json.hasOwnProperty("priorBranchOwnerChangesCount_14_days") && json.hasOwnProperty("priorBranchChangesCount_14_days")) {
        json["prior_branch_owner_ratio_14_days"] = MetricsUtils.safeDivision(json["priorBranchOwnerChangesCount_14_days"], json["priorBranchChangesCount_14_days"])
    }

    if (json.hasOwnProperty("priorBranchOwnerChangesCount_30_days") && json.hasOwnProperty("priorBranchChangesCount_30_days")) {
        json["prior_branch_owner_ratio_30_days"] = MetricsUtils.safeDivision(json["priorBranchOwnerChangesCount_30_days"], json["priorBranchChangesCount_30_days"])
    }

    if (json.hasOwnProperty("priorBranchOwnerChangesCount_90_days") && json.hasOwnProperty("priorBranchChangesCount_90_days")) {
        json["prior_branch_owner_ratio_90_days"] = MetricsUtils.safeDivision(json["priorBranchOwnerChangesCount_90_days"], json["priorBranchChangesCount_90_days"])
    }

    if (json.hasOwnProperty("priorBranchOwnerChangesCount_180_days") && json.hasOwnProperty("priorBranchChangesCount_180_days")) {
        json["prior_branch_owner_ratio_180_days"] = MetricsUtils.safeDivision(json["priorBranchOwnerChangesCount_180_days"], json["priorBranchChangesCount_180_days"])
    }


    if (json.hasOwnProperty("ownerPriorChangesCount_14_days") && json.hasOwnProperty("ownerPriorMergedChangesCount_14_days") && json.hasOwnProperty("ownerPriorAbandonedChangesCount_14_days")) {
        json["owner_non_close_changes_14_days"] = json["ownerPriorChangesCount_14_days"] - json["ownerPriorMergedChangesCount_14_days"] - json["ownerPriorAbandonedChangesCount_14_days"]
    }

    if (json.hasOwnProperty("ownerPriorChangesCount_30_days") && json.hasOwnProperty("ownerPriorMergedChangesCount_30_days") && json.hasOwnProperty("ownerPriorAbandonedChangesCount_30_days")) {
        json["owner_non_close_changes_30_days"] = json["ownerPriorChangesCount_30_days"] - json["ownerPriorMergedChangesCount_30_days"] - json["ownerPriorAbandonedChangesCount_30_days"]
    }

    if (json.hasOwnProperty("ownerPriorChangesCount_90_days") && json.hasOwnProperty("ownerPriorMergedChangesCount_90_days") && json.hasOwnProperty("ownerPriorAbandonedChangesCount_90_days")) {
        json["owner_non_close_changes_90_days"] = json["ownerPriorChangesCount_90_days"] - json["ownerPriorMergedChangesCount_90_days"] - json["ownerPriorAbandonedChangesCount_90_days"]
    }

    if (json.hasOwnProperty("ownerPriorChangesCount_180_days") && json.hasOwnProperty("ownerPriorMergedChangesCount_180_days") && json.hasOwnProperty("ownerPriorAbandonedChangesCount_180_days")) {
        json["owner_non_close_changes_180_days"] = json["ownerPriorChangesCount_180_days"] - json["ownerPriorMergedChangesCount_180_days"] - json["ownerPriorAbandonedChangesCount_180_days"]
    }

}*/


/*function match_review_kind_value(metric) {
    let value = 1;
    if (metric.includes("REWORK")) {
        value = 1;
    } else if (metric.includes("TRIVIAL_REBASE")) {
        value = 2;
    } else if (metric.includes("MERGE_FIRST_PARENT_UPDATE")) {
        value = 3;
    } else if (metric.includes("NO_CODE_CHANGE")) {
        value = 4;
    } else if (metric.includes("NO_CHANGE")) {
        value = 5;
    }
    return value;
}*/

/*function check_self_review(metrics) {
    if (metrics["is_owner_the_only_reviewer"])
        return true;
    if (metrics["labels_code_review_2_owner"] && metrics["labels_code_review_2_count"] === 1)
        return true;
    if (metrics["labels_code_review_minus_2_owner"] && metrics["labels_code_review_minus_2_count"] === 1)
        return true;

    return false;
}*/

/*
    if(metric.hasOwnProperty("priorBranchOwnerChangesCount_30_days") && metric.hasOwnProperty("priorBranchChangesCount_30_days")){
        result_all["prior_branch_owner_ratio_30_days"] = MetricsUtils.safeDivision(metric["priorBranchOwnerChangesCount_30_days"], metric["priorBranchChangesCount_30_days"])
        result_30_days["prior_branch_owner_ratio_30_days"] = MetricsUtils.safeDivision(metric["priorBranchOwnerChangesCount_30_days"], metric["priorBranchChangesCount_30_days"])
    }

    if(metric.hasOwnProperty("priorBranchOwnerChangesCount_90_days") && metric.hasOwnProperty("priorBranchChangesCount_90_days")){
        result_all["prior_branch_owner_ratio_90_days"] = MetricsUtils.safeDivision(metric["priorBranchOwnerChangesCount_90_days"], metric["priorBranchChangesCount_90_days"])
        result_90_days["prior_branch_owner_ratio_90_days"] = MetricsUtils.safeDivision(metric["priorBranchOwnerChangesCount_90_days"], metric["priorBranchChangesCount_90_days"])
    }

    if(metric.hasOwnProperty("priorBranchOwnerChangesCount_180_days") && metric.hasOwnProperty("priorBranchChangesCount_180_days")){
        result_all["prior_branch_owner_ratio_180_days"] = MetricsUtils.safeDivision(metric["priorBranchOwnerChangesCount_180_days"], metric["priorBranchChangesCount_180_days"])
        result_180_days["prior_branch_owner_ratio_180_days"] = MetricsUtils.safeDivision(metric["priorBranchOwnerChangesCount_180_days"], metric["priorBranchChangesCount_180_days"])
    }

    if(metric.hasOwnProperty("ownerPriorChangesCount_30_days") && metric.hasOwnProperty("ownerPriorMergedChangesCount_30_days") && metric.hasOwnProperty("ownerPriorAbandonedChangesCount_30_days")){
        result_all["owner_non_close_changes_30_days"] = metric["ownerPriorChangesCount_30_days"] - metric["ownerPriorMergedChangesCount_30_days"] - metric["ownerPriorAbandonedChangesCount_30_days"]
        result_30_days["owner_non_close_changes_30_days"] = metric["ownerPriorChangesCount_30_days"] - metric["ownerPriorMergedChangesCount_30_days"] - metric["ownerPriorAbandonedChangesCount_30_days"]
    }

    if(metric.hasOwnProperty("ownerPriorChangesCount_90_days") && metric.hasOwnProperty("ownerPriorMergedChangesCount_90_days") && metric.hasOwnProperty("ownerPriorAbandonedChangesCount_90_days")){
        result_all["owner_non_close_changes_90_days"] = metric["ownerPriorChangesCount_90_days"] - metric["ownerPriorMergedChangesCount_90_days"] - metric["ownerPriorAbandonedChangesCount_90_days"]
        result_90_days["owner_non_close_changes_90_days"] = metric["ownerPriorChangesCount_90_days"] - metric["ownerPriorMergedChangesCount_90_days"] - metric["ownerPriorAbandonedChangesCount_90_days"]
    }

    if(metric.hasOwnProperty("ownerPriorChangesCount_180_days") && metric.hasOwnProperty("ownerPriorMergedChangesCount_180_days") && metric.hasOwnProperty("ownerPriorAbandonedChangesCount_180_days")){
        result_all["owner_non_close_changes_180_days"] = metric["ownerPriorChangesCount_180_days"] - metric["ownerPriorMergedChangesCount_180_days"] - metric["ownerPriorAbandonedChangesCount_180_days"]
        result_180_days["owner_non_close_changes_180_days"] = metric["ownerPriorChangesCount_180_days"] - metric["ownerPriorMergedChangesCount_180_days"] - metric["ownerPriorAbandonedChangesCount_180_days"]
    }
*/


/*
//Time metrics
//result["n"] = i++
//result["prior_branch_owner_ratio"] = MetricsUtils.safeDivision(metric["priorBranchOwnerChangesCount"], metric["priorBranchChangesCount"])
//result["owner_non_close_changes"] = metric["ownerPriorChangesCount"] - metric["ownerPriorMergedChangesCount"] - metric["ownerPriorAbandonedChangesCount"]

//result["id"] = metric["id"]
result = copy(result, metric, "id");
result = copy(result, metric, "prior_branch_owner_ratio");
result = copy(result, metric, "owner_non_close_changes");

//result = copy(result, metric, "is_created_date_a_weekend");
result = copy(result, metric, "author_timezone");
result = copy(result, metric, "days_of_the_weeks_date_created_precise");
result = copy(result, metric, "hours_of_the_days_date_created");
result = copy(result, metric, "days_of_the_weeks_of_date_created_for_owner_timezone");
result = copy(result, metric, "is_created_date_a_weekend_for_owner_timezone");

result = copy(result, metric, "is_a_cherry_pick");
result = copy(result, metric, "first_revision_code_churn_size");
result = copy(result, metric, "first_revision_code_churn");

//Collaboration Graph
//todo put fg_
result = copy(result, metric, "fg_degree_centrality", "degree_centrality");
result = copy(result, metric, "fg_closeness_centrality", "closeness_centrality");
result = copy(result, metric, "fg_betweenness_centrality", "betweenness_centrality");
result = copy(result, metric, "fg_eigenvector_centrality", "eigenvector_centrality");
result = copy(result, metric, "fg_clustering_coefficient", "clustering_coefficient");
result = copy(result, metric, "fg_core_number", "core_number");

//code
result = copy(result, metric, "first_revision_insertions", "insertions");
result = copy(result, metric, "first_revision_deletions", "deletions");
//result = copy(result, metric, "diff_lines_added_line_deleted", "code_churn");
//result["code_churn"] = metric["first_revision_insertions"] + metric["first_revision_deletions"]
result = copy(result, metric, "num_files");
//result = copy(result, metric, "num_files_type");
result = copy(result, metric, "num_programming_language");
//result = copy(result, metric, "num_directory");
result = copy(result, metric, "modify_entropy", "change_entropy");
//result = copy(result, metric, "sum_loc");
//result = copy(result, metric, "sum_complexity");
result = copy(result, metric, "num_segs_added");
result = copy(result, metric, "num_segs_deleted");
result = copy(result, metric, "num_segs_modify");

//result = copy(result, metric, "first_revision_kind", "kind_of_revision");
//result["kind_of_revision"] = match_review_kind_value(result["kind_of_revision"])

//Text metrics
//result = copy(result, metric, "subject_length");
//result = copy(result, metric, "subject_word_count");
result = copy(result, metric, "msg_length");
//result = copy(result, metric, "msg_word_count");
result = copy(result, metric, "is_non_fonctional");
result = copy(result, metric, "is_refactoring");
result = copy(result, metric, "is_corrective");
result = copy(result, metric, "is_preventive");
//result = copy(result, metric, "is_merge");
result = copy(result, metric, "has_feature_addition");
//result = copy(result, metric, "is_perfective");

//Owner experience metrics
result = copy(result, metric, "ownerPriorChangesCount", "owner_prior_changes");
//result = copy(result, metric, "ownerPriorMergedChangesCount", "owner_prior_merged_changes");
//result = copy(result, metric, "ownerPriorAbandonedChangesCount", "owner_prior_abandoned_changes");
result = copy(result, metric, "ownerMergedRatio", "owner_merge_ratio");
//result = copy(result, metric, "mergedRatio", "merge_ratio");
//result = copy(result, metric, "priorSubsystemChangesCount", "prior_subsystem_changes");

//todo
result = copy(result, metric, "priorChangeDurationMean", "prior_change_duration_mean");
//result = copy(result, metric, "priorChangeDurationMax", "prior_change_duration_max", true);
//result = copy(result, metric, "priorChangeDurationMin", "prior_change_duration_min", true);
//result = copy(result, metric, "priorChangeDurationStd", "prior_change_duration_std", true);

result = copy(result, metric, "priorOwnerChangesDurationMean", "owner_prior_change_duration_mean");
//result = copy(result, metric, "priorOwnerChangesDurationMax", "owner_prior_change_duration_max");
//result = copy(result, metric, "priorOwnerChangesDurationMin", "owner_prior_change_duration_min");
//result = copy(result, metric, "priorOwnerChangesDurationStd", "owner_prior_change_duration_std");

//todo
result = copy(result, metric, "priorOwnerSubsystemChangesCount", "prior_owner_subsystem_changes");
result = copy(result, metric, "priorOwnerSubsystemChangesRatio", "prior_owner_subsystem_changes_ratio");
result = copy(result, metric, "ownerNumberOfReview", "reviewed_changes_owner");
result = copy(result, metric, "ownerPreviousMessageCount", "owner_previous_message");
result = copy(result, metric, "ownerChangesMessagesSum", "owner_exchanged_messages");

result = copy(result, metric, "ownerChangesMessagesAvgPerChanges", "owner_changes_messages_avg");
//result = copy(result, metric, "ownerChangesMessagesMaxPerChanges", "owner_changes_messages_max");
//result = copy(result, metric, "ownerChangesMessagesMinPerChanges", "owner_changes_messages_min");
//result = copy(result, metric, "ownerChangesMessagesStdPerChanges", "owner_changes_messages_std");
result = copy(result, metric, "ownerNumberOfRevisionAvg", "owner_number_of_revision_avg");
//result = copy(result, metric, "ownerNumberOfRevisionMax", "owner_number_of_revision_max");
//result = copy(result, metric, "ownerNumberOfRevisionMin", "owner_number_of_revision_min");
//result = copy(result, metric, "ownerNumberOfRevisionStd", "owner_number_of_revision_std");

result = copy(result, metric, "ownerRateOfAutoReview", "owner_rate_of_auto_review");

result = copy(result, metric, "revisionTimeAvg", "revision_time_avg");
//result = copy(result, metric, "revisionTimeMax", "revision_time_max");
//result = copy(result, metric, "revisionTimeMin", "revision_time_min");
//result = copy(result, metric, "revisionTimeStd", "revision_time_std");

result = copy(result, metric, "ownerRevisionTimeAvg", "owner_revision_time_avg");
//result = copy(result, metric, "ownerRevisionTimeMax", "owner_revision_time_max");
//result = copy(result, metric, "ownerRevisionTimeMin", "owner_revision_time_min");
//result = copy(result, metric, "ownerRevisionTimeStd", "owner_revision_time_std");

//todo
result = copy(result, metric, "ownerTimeBetweenRevisionAvg", "owner_time_between_revision_avg");
//result = copy(result, metric, "ownerTimeBetweenRevisionMax", "owner_time_between_revision_max");
//result = copy(result, metric, "ownerTimeBetweenRevisionMin", "owner_time_between_revision_min");
//result = copy(result, metric, "ownerTimeBetweenRevisionStd", "owner_time_between_revision_std");

//todo
result = copy(result, metric, "ownerTimeToAddReviewerAvg", "owner_time_to_add_reviewer_avg");
//result = copy(result, metric, "ownerTimeToAddReviewerMax", "owner_time_to_add_reviewer_max");
//result = copy(result, metric, "ownerTimeToAddReviewerMin", "owner_time_to_add_reviewer_min");
//result = copy(result, metric, "ownerTimeToAddReviewerStd", "owner_time_to_add_reviewer_std");

//branch metrics
//todo
result = copy(result, metric, "branchBuildTimeAvg", "branch_build_time_avg")
//result = copy(result, metric, "branchBuildTimeMax", "branch_build_time_max");
//result = copy(result, metric, "branchBuildTimeMin", "branch_build_time_min");
//result = copy(result, metric, "branchBuildTimeStd", "branch_build_time_std");

//todo
result = copy(result, metric, "branchRevisionTimeAvg", "branch_revision_time_avg");
//result = copy(result, metric, "branchRevisionTimeMax", "branch_revision_time_max");
//result = copy(result, metric, "branchRevisionTimeMin", "branch_revision_time_min");
//result = copy(result, metric, "branchRevisionTimeStd", "branch_revision_time_std");


//file metrics
result = copy(result, metric, "AvgNumberOfDeveloperWhoModifiedFiles", "developers_file");

result = copy(result, metric, "fileTimeAvg", "file_changes_duration_avg");
//result = copy(result, metric, "fileTimeMax", "file_changes_duration_max");
//result = copy(result, metric, "fileTimeMin", "file_changes_duration_min");
//result = copy(result, metric, "fileTimeStd", "file_changes_duration_std");

result = copy(result, metric, "fileCountAvg", "prior_changes_files_avg");
//result = copy(result, metric, "fileCountMax", "prior_changes_files_max");
//result = copy(result, metric, "fileCountMin", "prior_changes_files_min");
//result = copy(result, metric, "fileCountStd", "prior_changes_files_std");


result = copy(result, metric, "filesBuildTimeAvg", "files_build_time_avg");
//result = copy(result, metric, "filesBuildTimeMax", "files_build_time_max");
//result = copy(result, metric, "filesBuildTimeMin", "files_build_time_min");
//result = copy(result, metric, "filesBuildTimeStd", "files_build_time_std");

//todo
result = copy(result, metric, "filesRevisionTimeAvg", "files_revision_time_avg");
//result = copy(result, metric, "filesRevisionTimeMax", "files_revision_time_max");
//result = copy(result, metric, "filesRevisionTimeMin", "files_revision_time_min");
//result = copy(result, metric, "filesRevisionTimeStd", "files_revision_time_std");

result = copy(result, metric, "filesNumFailsAvg", "files_num_fails_avg");
//result = copy(result, metric, "filesNumFailsMax", "files_num_fails_max");
//result = copy(result, metric, "filesNumFailsMin", "files_num_fails_min");
//result = copy(result, metric, "filesNumFailsStd", "files_num_fails_std");

result = copy(result, metric, "ownerInactiveTimeAvg", "owner_inactive_time_avg");
//result = copy(result, metric, "ownerInactiveTimeMax", "owner_inactive_time_max");
//result = copy(result, metric, "ownerInactiveTimeMin", "owner_inactive_time_min");
//result = copy(result, metric, "ownerInactiveTimeStd", "owner_inactive_time_std");

result = copy(result, metric, "ownerTimeBetweenMessageAvg", "owner_time_between_message_avg");
//result = copy(result, metric, "ownerTimeBetweenMessageMax", "owner_time_between_message_max");
//result = copy(result, metric, "ownerTimeBetweenMessageMin", "owner_time_between_message_min");
//result = copy(result, metric, "ownerTimeBetweenMessageStd", "owner_time_between_message_std");

result = copy(result, metric, "ownerNumberOfCherryPicked", "owner_number_of_cherry_picked");
result = copy(result, metric, "branchNumberOfCherryPicked", "branch_number_of_cherry_picked");

result = copy(result, metric, "priorBranchChangesCount", "prior_branch_changes_count");
result = copy(result, metric, "priorBranchMergedChangesCount", "prior_branch_merged_changes_count");
result = copy(result, metric, "priorBranchAbandonedChangesCount", "prior_branch_abandoned_changes_count");
result = copy(result, metric, "priorBranchOwnerChangesCount", "prior_branch_owner_changes_count");
result = copy(result, metric, "priorBranchOwnerMergedChangesCount", "prior_branch_owner_merged_changes_count");
result = copy(result, metric, "priorBranchOwnerAbandonedChangesCount", "prior_branch_owner_abandoned_changes_count");

result = copy(result, metric, "priorBranchChangeMeanTimeTypeAvg", "prior_branch_change_mean_time_type_avg");
//result = copy(result, metric, "priorBranchChangeMeanTimeTypeMax", "prior_branch_change_mean_time_type_max");
//result = copy(result, metric, "priorBranchChangeMeanTimeTypeMin", "prior_branch_change_mean_time_type_min");
//result = copy(result, metric, "priorBranchChangeMeanTimeTypeStd", "prior_branch_change_mean_time_type_std");

result = copy(result, metric, "projectAge", "project_age");
result = copy(result, metric, "subsystemAge", "subsystem_age");
result = copy(result, metric, "branchAge", "branch_age");
result = copy(result, metric, "ownerAge", "owner_age");

result = copy(result, metric, "priorOverAllRateFromCount", "prior_over_all_rate_from_count");
result = copy(result, metric, "priorOverAllBranchRateFromCount", "prior_over_all_branch_rate_from_count");
result = copy(result, metric, "priorOverAllSubsystemRateFromCount", "prior_over_all_subsystem_rate_from_count");
result = copy(result, metric, "priorOverAlOwnerRateFromCount", "prior_over_all_owner_rate_from_count"); //todo correct the word all

result = copy(result, metric, "priorRateFromCount", "prior_rate_from_count");
result = copy(result, metric, "priorBranchRateFromCount", "prior_branch_rate_from_count");
result = copy(result, metric, "priorSubsystemRateFromCount", "prior_subsystem_rate_from_count");
result = copy(result, metric, "priorOwnerRateFromCount", "prior_owner_rate_from_count");

result = copy(result, metric, "filesNumberOfRecentChangesOnBranch", "files_number_of_recent_changes_on_branch");

result = copy(result, metric, "reviewersPriorChangesSum", "reviewers_prior_changes_sum");
result = copy(result, metric, "reviewersPriorChangesAvg", "reviewers_prior_changes_avg");
//result = copy(result, metric, "reviewersPriorChangesMax", "reviewers_prior_changes_max");
//result = copy(result, metric, "reviewersPriorChangesMin", "reviewers_prior_changes_min");
//result = copy(result, metric, "reviewersPriorChangesStd", "reviewers_prior_changes_std");

result = copy(result, metric, "reviewersPriorMergedChangesSum", "reviewers_prior_merged_changes_sum");
result = copy(result, metric, "reviewersPriorMergedChangesAvg", "reviewers_prior_merged_changes_avg");
//result = copy(result, metric, "reviewersPriorMergedChangesMax", "reviewers_prior_merged_changes_max");
//result = copy(result, metric, "reviewersPriorMergedChangesMin", "reviewers_prior_merged_changes_min");
//result = copy(result, metric, "reviewersPriorMergedChangesStd", "reviewers_prior_merged_changes_std");

result = copy(result, metric, "reviewersPriorAbandonedChangesSum", "reviewers_prior_abandoned_changes_sum");
result = copy(result, metric, "reviewersPriorAbandonedChangesAvg", "reviewers_prior_abandoned_changes_avg");
//result = copy(result, metric, "reviewersPriorAbandonedChangesMax", "reviewers_prior_abandoned_changes_max");
//result = copy(result, metric, "reviewersPriorAbandonedChangesMin", "reviewers_prior_abandoned_changes_min");
//result = copy(result, metric, "reviewersPriorAbandonedChangesStd", "reviewers_prior_abandoned_changes_std");

result = copy(result, metric, "reviewersPriorUnCloseChangesSum", "reviewers_prior_unClose_changes_sum");
result = copy(result, metric, "reviewersPriorUnCloseChangesAvg", "reviewers_prior_unClose_changes_avg");
//result = copy(result, metric, "reviewersPriorUnCloseChangesMax", "reviewers_prior_unClose_changes_max");
//result = copy(result, metric, "reviewersPriorUnCloseChangesMin", "reviewers_prior_unClose_changes_min");
//result = copy(result, metric, "reviewersPriorUnCloseChangesStd", "reviewers_prior_unClose_changes_std");

result = copy(result, metric, "reviewersNumberOfReviewSum", "reviewers_number_of_review_sum");
result = copy(result, metric, "reviewersNumberOfReviewAvg", "reviewers_number_of_review_avg");
//result = copy(result, metric, "reviewersNumberOfReviewMax", "reviewers_number_of_review_max");
//result = copy(result, metric, "reviewersNumberOfReviewMin", "reviewers_number_of_review_min");
//result = copy(result, metric, "reviewersNumberOfReviewStd", "reviewers_number_of_review_std");

result = copy(result, metric, "reviewersPreviousMessageSum", "reviewers_previous_message_sum");
result = copy(result, metric, "reviewersPreviousMessageAvg", "reviewers_previous_message_avg");
//result = copy(result, metric, "reviewersPreviousMessageMax", "reviewers_previous_message_max");
//result = copy(result, metric, "reviewersPreviousMessageMin", "reviewers_previous_message_min");
//result = copy(result, metric, "reviewersPreviousMessageStd", "reviewers_previous_message_std");

result = copy(result, metric, "fileCountForReviewersCountAvg", "file_count_for_reviewers_count_avg");
//result = copy(result, metric, "fileCountForReviewersCountMax", "file_count_for_reviewers_count_max");
//result = copy(result, metric, "fileCountForReviewersCountMin", "file_count_for_reviewers_count_min");
//result = copy(result, metric, "fileCountForReviewersCountStd", "file_count_for_reviewers_count_std");

result = copy(result, metric, "fileTimeForReviewersCountAvg", "file_time_for_reviewers_count_avg");
//result = copy(result, metric, "fileTimeForReviewersCountMax", "file_time_for_reviewers_count_max");
//result = copy(result, metric, "fileTimeForReviewersCountMin", "file_time_for_reviewers_count_min");
//result = copy(result, metric, "fileTimeForReviewersCountStd", "file_time_for_reviewers_count_std");

result = copy(result, metric, "ownerAndReviewerCommonsChangesSum", "owner_and_reviewer_commons_changes_sum");
result = copy(result, metric, "ownerAndReviewerCommonsMessagesSum", "owner_and_reviewer_commons_messages_sum");

result = copy(result, metric, "ownerAndReviewerCommonsMessagesSumForRev", "owner_and_reviewer_commons_messages_sum_for_rev");
result = copy(result, metric, "ownerAndReviewerCommonsMessagesAvg", "owner_and_reviewer_commons_messages_avg");
//result = copy(result, metric, "ownerAndReviewerCommonsMessagesMax", "owner_and_reviewer_commons_messages_max");
//result = copy(result, metric, "ownerAndReviewerCommonsMessagesMin", "owner_and_reviewer_commons_messages_min");
//result = copy(result, metric, "ownerAndReviewerCommonsMessagesStd", "owner_and_reviewer_commons_messages_std");

result = copy(result, metric, "reviewersChangesSum", "reviewers_changes_sum");
result = copy(result, metric, "reviewersChangesAvg", "reviewers_changes_avg");
//result = copy(result, metric, "reviewersChangesMax", "reviewers_changes_max");
//result = copy(result, metric, "reviewersChangesMin", "reviewers_changes_min");
//result = copy(result, metric, "reviewersChangesStd", "reviewers_changes_std");

//metrics to predict
//result = copy(result, metric, "diff_created_updated_in_hours");
result = copy(result, metric, "date_updated_date_created_diff"); //todo
return Promise.resolve(result);


let result_all = {};
let result_30_days = {};
let result_90_days = {};
let result_180_days = {};

function copy_2(result, json, key, new_name = "", convert_to_hours = false) {
    let days_30_key = key + "_30_days";
    let days_90_key = key + "_90_days";
    let days_180_key = key + "_180_days";
    //let r_all = {};
    if (json.hasOwnProperty(days_30_key)){
        copy(result_all, json, days_30_key, new_name + "_30_days", convert_to_hours)
        copy(result_30_days, json, days_30_key, new_name + "_30_days", convert_to_hours)
    }
    if (json.hasOwnProperty(days_90_key)){
        copy(result_all, json, days_90_key, new_name + "_90_days", convert_to_hours)
        copy(result_90_days, json, days_90_key, new_name + "_90_days", convert_to_hours)
    }
    if (json.hasOwnProperty(days_180_key)){
        copy(result_all, json, days_180_key, new_name + "_180_days", convert_to_hours)
        copy(result_180_days, json, days_180_key, new_name + "_180_days", convert_to_hours)
    }
    return copy(result, json, key, new_name, convert_to_hours)
}

 */

//do prior_changes_files
//todo reviewed_changes_owner
//todo updated rate
/*
//identification
//result["n"] = i++
//result = copy(result, metric, "n");
//result = copy(result, metric, "number");
//result = copy(result, metric, "change_id");

//time
//result = copy(result, metric, "date_created");
//result = copy(result, metric, "committer_timezone");

//code metrics
//result = copy(result, metric, "num_file_added");
//result = copy(result, metric, "num_file_deleted");
//result = copy(result, metric, "num_binary_file");
//result = copy(result, metric, "num_subsystem");
//result = copy(result, metric, "num_programming_language");
//result = copy(result, metric, "num_data_language");
//result = copy(result, metric, "num_prose_language");
//result = copy(result, metric, "num_markup_language");
//result = copy(result, metric, "is_a_bot");
//result = copy(result, metric, "num_human_reviewer");
//result = copy(result, metric, "first_revision");

//
//result = copy(result, metric, "sum_changed_methods_count");
//result = copy(result, metric, "sum_added_lines");
//result = copy(result, metric, "sum_removed_lines");
//result = copy(result, metric, "moy_loc");
//result = copy(result, metric, "moy_complexity");
//result = copy(result, metric, "num_modify_modification");
//result = copy(result, metric, "num_add_modification");
//result = copy(result, metric, "num_copy_modification");
//result = copy(result, metric, "num_delete_modification");
//result = copy(result, metric, "num_rename_modification");
//result = copy(result, metric, "num_unknown_modification");

//Text metrics
//result = copy(result, metric, "is_corrective");
//result = copy(result, metric, "is_merge");
//result = copy(result, metric, "is_preventive");

//Owner experience metrics
result = copy(result, metric, "priorChangesCount");
result = copy(result, metric, "priorChangesCount");
result = copy(result, metric, "priorMergedChangesCount");
result = copy(result, metric, "priorAbandonedChangesCount");

result = copy(result, metric, "mergedRatio");
result = copy(result, metric, "abandonedRatio");

result = copy(result, metric, "priorSubsystemChangesCount");
result = copy(result, metric, "priorSubsystemMergedChangesCount");
result = copy(result, metric, "priorSubsystemAbandonedChangesCount");
result = copy(result, metric, "priorSubsystemPercentage");
result = copy(result, metric, "priorSubsystemMergedRatio");
result = copy(result, metric, "priorSubsystemAbandonedRatio");
result = copy(result, metric, "priorSubsystemMergedPercentageInMerged");
result = copy(result, metric, "priorSubsystemAbandonedPercentageInAbandoned");

result = copy(result, metric, "ownerPriorChangesCount");
result = copy(result, metric, "ownerPriorMergedChangesCount");
result = copy(result, metric, "ownerPriorAbandonedChangesCount");
result = copy(result, metric, "ownerMergedRatio");
result = copy(result, metric, "ownerAbandonedRatio");
result = copy(result, metric, "ownerPercentageOfMerged");
result = copy(result, metric, "ownerPercentageOfAbandoned");

result = copy(result, metric, "priorOwnerSubsystemChangesCount");
result = copy(result, metric, "priorOwnerSubsystemMergedChangesCount");
result = copy(result, metric, "priorOwnerSubsystemAbandonedChangesCount");
result = copy(result, metric, "priorOwnerSubsystemChangesRatio");
result = copy(result, metric, "priorOwnerSubsystemMergedChangesRatio");
result = copy(result, metric, "priorOwnerSubsystemAbandonedChangesRatio");
result = copy(result, metric, "priorOwnerPercentageOfMergedInSubsystem");
result = copy(result, metric, "priorOwnerPercentageOfAbandonedInSubsystem");

//
result = copy(result, metric, "priorChangeDurationMean");
result = copy(result, metric, "priorChangeDurationMax");
result = copy(result, metric, "priorChangeDurationMin");
result = copy(result, metric, "priorChangeDurationStd");

result = copy(result, metric, "priorOwnerChangesDurationMean");
result = copy(result, metric, "priorOwnerChangesDurationMax");
result = copy(result, metric, "priorOwnerChangesDurationMin");
result = copy(result, metric, "priorOwnerChangesDurationStd");

result = copy(result, metric, "ownerNumberOfRevisionAvg");
result = copy(result, metric, "ownerNumberOfRevisionMax");
result = copy(result, metric, "ownerNumberOfRevisionMin");
result = copy(result, metric, "ownerNumberOfRevisionStd");

result = copy(result, metric, "ownerNumberOfReview");

//File
result = copy(result, metric, "fileCountAvg");
result = copy(result, metric, "fileCountMax");
result = copy(result, metric, "fileCountMin");
result = copy(result, metric, "fileCountStd");
result = copy(result, metric, "fileTimeAvg");
result = copy(result, metric, "fileTimeMax");
result = copy(result, metric, "fileTimeMin");
result = copy(result, metric, "fileTimeStd");

result = copy(result, metric, "ownerFileCountAvg");
result = copy(result, metric, "ownerFileCountMax");
result = copy(result, metric, "ownerFileCountMin");
result = copy(result, metric, "ownerFileCountStd");
result = copy(result, metric, "ownerFileTimeAvg");
result = copy(result, metric, "ownerFileTimeMax");
result = copy(result, metric, "ownerFileTimeMin");
result = copy(result, metric, "ownerFileTimeStd");

result = copy(result, metric, "AvgNumberOfDeveloperWhoModifiedFiles");

//Messages
result = copy(result, metric, "ownerPreviousMessageCount");

result = copy(result, metric, "ownerChangesMessagesSum");
result = copy(result, metric, "ownerChangesMessagesAvgPerChanges");
result = copy(result, metric, "ownerChangesMessagesMaxPerChanges");
result = copy(result, metric, "ownerChangesMessagesMinPerChanges");
result = copy(result, metric, "ownerChangesMessagesStdPerChanges");

result = copy(result, metric, "changesMessagesSum");
result = copy(result, metric, "changesMessagesAvg");
result = copy(result, metric, "changesMessagesMax");
result = copy(result, metric, "changesMessagesMin");
result = copy(result, metric, "changesMessagesStd");

result = copy(result, metric, "nonBotAccountPreviousMessageSum");
result = copy(result, metric, "nonBotAccountPreviousMessageAvg");
result = copy(result, metric, "nonBotAccountPreviousMessageMax");
result = copy(result, metric, "nonBotAccountPreviousMessageMin");
result = copy(result, metric, "nonBotAccountPreviousMessageStd");

//Collaboration Graph
result = copy(result, metric, "degree_centrality");
result = copy(result, metric, "closeness_centrality");
result = copy(result, metric, "betweenness_centrality");
result = copy(result, metric, "eigenvector_centrality");
result = copy(result, metric, "clustering_coefficient");
result = copy(result, metric, "core_number");
*/