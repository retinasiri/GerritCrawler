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

function getMetrics(skip) {
    return Metrics
        .aggregate([
            {
                $match: {
                    status: {$in: ['MERGED', 'ABANDONED']},
                    //"is_a_bot" : false,
                    //"first_revision" : 1,
                }
            },
            {$sort: {number: 1}},
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
        //todo

        if (check_value_to_ignore(doc)) {
            skipped += 1;
            continue;
        }

        await collectMetrics(doc)
            .then((json) => {
                return saveMetrics(json);
            })
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
    if (metrics["first_revision_number"] !== 1)
        return true;
    if (metrics["is_a_bot"] === true)
        return true;

    if (check_self_review(metrics))
        return true;
    //todo

    let keys = ['fg_degree_centrality', 'num_segs_added', 'revisionTimeAvg']
    //let keys = ['fg_degree_centrality', 'num_segs_added']
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (metrics[key] == null || !metrics.hasOwnProperty(key) || !(key in metrics)) {
            bool = true;
        }
    }

    return bool;
}

function check_self_review(metrics) {
    if (metrics["is_owner_the_only_reviewer"])
        return true;
    if (metrics["labels_code_review_2_owner"] && metrics["labels_code_review_2_count"] === 1)
        return true;
    if (metrics["labels_code_review_minus_2_owner"] && metrics["labels_code_review_minus_2_count"] === 1)
        return true;

    return false;
}

async function saveMetrics(json) {
    let filename = projectName + "-metrics.csv";
    let path = PathLibrary.join(DATA_PATH, projectName);
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
    let name = key
    if (new_name !== "") {
        name = new_name
    }

    if (json[key] !== null) {
        if (typeof (json[key]) === "number") {
            result[name] = parseFloat(json[key]);
            if (convert_to_hours) {
                result[name] = Moment.duration(result[name]).asHours()
            }
        } else {
            result[name] = json[key];
        }
    } else {
        result[name] = DEFAULT_VALUE;
    }

    if (!json.hasOwnProperty(key))
        result[name] = DEFAULT_VALUE;

    if (!(key in json))
        result[name] = DEFAULT_VALUE;

    return result;
}

function match_review_kind_value(metric) {
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
}

let i = 1;

async function collectMetrics(metric) {

    let result = {};
    //Time metrics
    //result["n"] = i++
    result["id"] = metric["id"]
    result = copy(result, metric, "days_of_the_weeks_of_date_created");
    result = copy(result, metric, "is_created_date_a_weekend");
    result = copy(result, metric, "author_timezone");

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
    result["code_churn"] = result["insertions"] + result["deletions"]
    result = copy(result, metric, "num_files");
    result = copy(result, metric, "num_files_type");
    result = copy(result, metric, "num_programming_language");
    result = copy(result, metric, "num_directory");
    result = copy(result, metric, "modify_entropy", "change_entropy");
    result = copy(result, metric, "sum_loc");
    result = copy(result, metric, "sum_complexity");
    result = copy(result, metric, "num_segs_added");
    result = copy(result, metric, "num_segs_deleted");
    result = copy(result, metric, "num_segs_modify");

    /*result = copy(result, metric, "first_revision_kind", "kind_of_revision");
    result["kind_of_revision"] = match_review_kind_value(result["kind_of_revision"])*/

    //Text metrics
    result = copy(result, metric, "subject_length");
    result = copy(result, metric, "subject_word_count");
    result = copy(result, metric, "msg_length");
    result = copy(result, metric, "msg_word_count");
    result = copy(result, metric, "is_non_fonctional");
    result = copy(result, metric, "is_refactoring");
    result = copy(result, metric, "is_corrective");
    result = copy(result, metric, "is_preventive");
    result = copy(result, metric, "is_merge");
    result = copy(result, metric, "has_feature_addition");
    //result = copy(result, metric, "is_perfective");

    //Owner experience metrics
    result = copy(result, metric, "ownerPriorChangesCount", "owner_prior_changes");
    result = copy(result, metric, "ownerPriorMergedChangesCount", "owner_prior_merged_changes");
    result = copy(result, metric, "ownerPriorAbandonedChangesCount", "owner_prior_abandoned_changes");
    result["owner_non_close_changes"] = result["owner_prior_changes"] - result["owner_prior_merged_changes"] - result["owner_prior_abandoned_changes"]
    result = copy(result, metric, "ownerMergedRatio", "owner_merge_ratio");
    result = copy(result, metric, "mergedRatio", "merge_ratio");
    result = copy(result, metric, "priorSubsystemChangesCount", "prior_subsystem_changes");

    /*result = copy(result, metric, "priorChangeDurationMean", "prior_change_duration_mean", true);
    result = copy(result, metric, "priorChangeDurationMax", "prior_change_duration_max", true);
    result = copy(result, metric, "priorChangeDurationMin", "prior_change_duration_min", true);
    result = copy(result, metric, "priorChangeDurationStd", "prior_change_duration_std", true);*/

    result = copy(result, metric, "priorOwnerChangesDurationMean", "owner_prior_change_duration_mean");
    result = copy(result, metric, "priorOwnerChangesDurationMax", "owner_prior_change_duration_max");
    result = copy(result, metric, "priorOwnerChangesDurationMin", "owner_prior_change_duration_min");
    result = copy(result, metric, "priorOwnerChangesDurationStd", "owner_prior_change_duration_std");

    result = copy(result, metric, "priorOwnerSubsystemChangesCount", "prior_owner_subsystem_changes");
    result = copy(result, metric, "priorOwnerSubsystemChangesRatio", "prior_owner_subsystem_changes_ratio");

    result = copy(result, metric, "ownerNumberOfReview", "reviewed_changes_owner");

    result = copy(result, metric, "ownerPreviousMessageCount", "owner_previous_message");
    result = copy(result, metric, "ownerChangesMessagesSum", "owner_exchanged_messages");
    result = copy(result, metric, "ownerChangesMessagesAvgPerChanges", "owner_changes_messages_avg");
    result = copy(result, metric, "ownerChangesMessagesMaxPerChanges", "owner_changes_messages_max");
    result = copy(result, metric, "ownerChangesMessagesMinPerChanges", "owner_changes_messages_min");
    result = copy(result, metric, "ownerChangesMessagesStdPerChanges", "owner_changes_messages_std");
    result = copy(result, metric, "ownerNumberOfRevisionAvg", "owner_number_of_revision_avg");
    result = copy(result, metric, "ownerNumberOfRevisionMax", "owner_number_of_revision_max");
    result = copy(result, metric, "ownerNumberOfRevisionMin", "owner_number_of_revision_min");
    result = copy(result, metric, "ownerNumberOfRevisionStd", "owner_number_of_revision_std");
    result = copy(result, metric, "ownerNumberOfRevisionStd", "owner_number_of_revision_std");


    result = copy(result, metric, "ownerRateOfAutoReview", "owner_rate_of_auto_review");

    result = copy(result, metric, "revisionTimeAvg", "revision_time_avg");
    result = copy(result, metric, "revisionTimeMax", "revision_time_max");
    result = copy(result, metric, "revisionTimeMin", "revision_time_min");
    result = copy(result, metric, "revisionTimeStd", "revision_time_std");

    result = copy(result, metric, "ownerRevisionTimeAvg", "owner_revision_time_avg");
    result = copy(result, metric, "ownerRevisionTimeMax", "owner_revision_time_max");
    result = copy(result, metric, "ownerRevisionTimeMin", "owner_revision_time_min");
    result = copy(result, metric, "ownerRevisionTimeStd", "owner_revision_time_std");

    result = copy(result, metric, "ownerTimeBetweenRevisionAvg", "owner_time_between_revision_avg");
    result = copy(result, metric, "ownerTimeBetweenRevisionMax", "owner_time_between_revision_max");
    result = copy(result, metric, "ownerTimeBetweenRevisionMin", "owner_time_between_revision_min");
    result = copy(result, metric, "ownerTimeBetweenRevisionStd", "owner_time_between_revision_std");

    result = copy(result, metric, "ownerTimeToAddReviewerAvg", "owner_time_to_add_reviewer_avg");
    result = copy(result, metric, "ownerTimeToAddReviewerMax", "owner_time_to_add_reviewer_max");
    result = copy(result, metric, "ownerTimeToAddReviewerMin", "owner_time_to_add_reviewer_min");
    result = copy(result, metric, "ownerTimeToAddReviewerStd", "owner_time_to_add_reviewer_std");

    //branch metrics
    result = copy(result, metric, "branchBuildTimeAvg", "branch_build_time_avg")
    result = copy(result, metric, "branchBuildTimeMax", "branch_build_time_max");
    result = copy(result, metric, "branchBuildTimeMin", "branch_build_time_min");
    result = copy(result, metric, "branchBuildTimeStd", "branch_build_time_std");

    result = copy(result, metric, "branchRevisionTimeAvg", "branch_revision_time_avg");
    result = copy(result, metric, "branchRevisionTimeMax", "branch_revision_time_max");
    result = copy(result, metric, "branchRevisionTimeMin", "branch_revision_time_min");
    result = copy(result, metric, "branchRevisionTimeStd", "branch_revision_time_std");


    //file metrics
    result = copy(result, metric, "AvgNumberOfDeveloperWhoModifiedFiles", "developers_file");
    result = copy(result, metric, "fileTimeAvg", "file_changes_duration_avg");
    result = copy(result, metric, "fileTimeMax", "file_changes_duration_max");
    result = copy(result, metric, "fileTimeMin", "file_changes_duration_min");
    result = copy(result, metric, "fileTimeStd", "file_changes_duration_std");
    result = copy(result, metric, "fileCountAvg", "prior_changes_files_avg");
    result = copy(result, metric, "fileCountMax", "prior_changes_files_max");
    result = copy(result, metric, "fileCountMin", "prior_changes_files_min");
    result = copy(result, metric, "fileCountStd", "prior_changes_files_std");


    result = copy(result, metric, "filesBuildTimeAvg", "files_build_time_avg");
    result = copy(result, metric, "filesBuildTimeMax", "files_build_time_max");
    result = copy(result, metric, "filesBuildTimeMin", "files_build_time_min");
    result = copy(result, metric, "filesBuildTimeStd", "files_build_time_std");

    result = copy(result, metric, "filesRevisionTimeAvg", "files_revision_time_avg");
    result = copy(result, metric, "filesRevisionTimeMax", "files_revision_time_max");
    result = copy(result, metric, "filesRevisionTimeMin", "files_revision_time_min");
    result = copy(result, metric, "filesRevisionTimeStd", "files_revision_time_std");

    result = copy(result, metric, "filesNumFailsAvg", "files_num_fails_avg");
    result = copy(result, metric, "filesNumFailsMax", "files_num_fails_max");
    result = copy(result, metric, "filesNumFailsMin", "files_num_fails_min");
    result = copy(result, metric, "filesNumFailsStd", "files_num_fails_std");


    //metrics to predict
    //result = copy(result, metric, "diff_created_updated_in_hours");
    result = copy(result, metric, "date_updated_date_created_diff"); //todo
    return Promise.resolve(result);

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

}


module.exports = {
    start: startComputeMetrics
};