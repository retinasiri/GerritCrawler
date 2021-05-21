const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Metrics = require('../models/metrics');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');

const progressBar = new cliProgress.SingleBar({
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);
const PathLibrary = require('path');

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectName = libreOfficeJson["projectName"];
let DATA_PATH = "data/"
let NUM_OF_CHANGES_LIMIT = 10000;


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
            progressBar.start(count, 0);
            return getMetrics(0);
        })
        /*.then(() => {
            let name = projectName + "-metrics";
            let path = PathLibrary.join(DATA_PATH, projectName);
            return Utils.saveJSONInFile(path, name, metricsJson);
        })*/
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

        if (doc["status"])
            if (doc["status"].includes("NEW"))
                continue;

        await collectMetrics(docs[key])
            .then((json) => {
                return saveMetrics(json);
            })
            .then(() => {
                return updateProgress();
            })

    }
    return Promise.resolve(true);
}

async function saveMetrics(json) {
    let filename = projectName + "-metrics.csv";
    let path = PathLibrary.join(DATA_PATH, projectName);
    return Utils.add_line_to_file(json, filename, path)
}

async function updateProgress() {
    progressBar.increment(1);
    return Promise.resolve(true);
}

function copy(result, json, key) {

    if (json[key] !== null) {
        result[key] = json[key];
    } else {
        result[key] = 0;
    }

    if (!json.hasOwnProperty(key))
        result[key] = 0;

    if (!(key in json))
        result[key] = 0;

    /*if(json[key] === undefined){
        result[key] = 0;
    }*/

    return result;
}

let i = 1;

async function collectMetrics(metric) {
    let result = {};
    //todo skip NEW code changes

    //identification
    result["n"] = i++
    //result = copy(result, metric, "n");
    result = copy(result, metric, "number");
    //result = copy(result, metric, "id");
    result = copy(result, metric, "change_id");
    //result = copy(result, metric, "status");

    //time
    result = copy(result, metric, "date_created");
    //result = copy(result, metric, "date_created_time");
    //result = copy(result, metric, "date_updated");
    //result = copy(result, metric, "date_updated_time");
    //result = copy(result, metric, "date_commit");
    //result = copy(result, metric, "date_commit_time");
    result = copy(result, metric, "days_of_the_weeks_of_date_created");
    //result = copy(result, metric, "days_of_the_weeks_of_date_updated");
    result = copy(result, metric, "is_created_date_a_weekend");
    //result = copy(result, metric, "is_updated_date_a_weekend");
    result = copy(result, metric, "committer_timezone");
    result = copy(result, metric, "author_timezone");

    //code
    result = copy(result, metric, "lines_added_num");
    result = copy(result, metric, "lines_deleted_num");
    result = copy(result, metric, "diff_lines_added_line_deleted");
    result = copy(result, metric, "num_files");
    result = copy(result, metric, "num_files_type");
    result = copy(result, metric, "num_directory");
    result = copy(result, metric, "num_file_added");
    result = copy(result, metric, "num_file_deleted");
    result = copy(result, metric, "num_binary_file");
    result = copy(result, metric, "modify_entropy");
    result = copy(result, metric, "num_subsystem");
    result = copy(result, metric, "num_programming_language");
    result = copy(result, metric, "num_data_language");
    result = copy(result, metric, "num_prose_language");
    result = copy(result, metric, "num_markup_language");
    result = copy(result, metric, "is_a_bot");
    result = copy(result, metric, "num_human_reviewer");
    result = copy(result, metric, "first_revision");

    result = copy(result, metric, "sum_changed_methods_count");
    result = copy(result, metric, "sum_added_lines");
    result = copy(result, metric, "sum_removed_lines");
    result = copy(result, metric, "sum_loc");
    result = copy(result, metric, "moy_loc");
    result = copy(result, metric, "sum_complexity");
    result = copy(result, metric, "moy_complexity");
    result = copy(result, metric, "num_modify_modification");
    result = copy(result, metric, "num_add_modification");
    result = copy(result, metric, "num_copy_modification");
    result = copy(result, metric, "num_delete_modification");
    result = copy(result, metric, "num_rename_modification");
    result = copy(result, metric, "num_unknown_modification");
    result = copy(result, metric, "num_segs_added");
    result = copy(result, metric, "num_segs_deleted");
    result = copy(result, metric, "num_segs_modify");

    //commit message and subject
    result = copy(result, metric, "subject_length");
    result = copy(result, metric, "subject_word_count");
    result = copy(result, metric, "msg_length");
    result = copy(result, metric, "msg_word_count");
    result = copy(result, metric, "is_corrective");
    result = copy(result, metric, "is_merge");
    result = copy(result, metric, "is_non_fonctional");
    result = copy(result, metric, "is_perfective");
    result = copy(result, metric, "is_preventive");
    result = copy(result, metric, "is_refactoring");

    //recent
    result = copy(result, metric, "recent_num_change");
    result = copy(result, metric, "recent_total_num_merged");
    result = copy(result, metric, "recent_total_num_abandoned");
    result = copy(result, metric, "recent_total_num_non_close_change");
    result = copy(result, metric, "recent_owner_num_change");
    result = copy(result, metric, "recent_owner_num_merged");
    result = copy(result, metric, "recent_owner_num_abandoned");
    result = copy(result, metric, "recent_owner_num_non_close_change");
    result = copy(result, metric, "recent_total_merged_ratio");
    result = copy(result, metric, "recent_owner_merged_ratio");
    result = copy(result, metric, "recent_owner_percentage_of_merged");
    result = copy(result, metric, "recent_review_num_mean");
    result = copy(result, metric, "recent_reviews_non_close_mean");
    result = copy(result, metric, "recent_review_num_max");
    result = copy(result, metric, "recent_reviews_non_close_max");

    //changes
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
    result = copy(result, metric, "priorMergedChangeMeanTime");
    result = copy(result, metric, "priorMergedChangeMaxTime");
    result = copy(result, metric, "priorMergedChangeMinTime");
    result = copy(result, metric, "priorMergedChangeStdTime");
    result = copy(result, metric, "priorAbandonedChangeMeanTime");
    result = copy(result, metric, "priorAbandonedChangeMaxTime");
    result = copy(result, metric, "priorAbandonedChangeMinTime");
    result = copy(result, metric, "priorAbandonedChangeStdTime");

    //owner
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
    result = copy(result, metric, "priorOwnerMergedChangesMeanTime");
    result = copy(result, metric, "priorOwnerMergedChangesMaxTime");
    result = copy(result, metric, "priorOwnerMergedChangesMinTime");
    result = copy(result, metric, "priorOwnerMergedChangesStdTime");
    result = copy(result, metric, "priorOwnerAbandonedChangesMeanTime");
    result = copy(result, metric, "priorOwnerAbandonedChangesMaxTime");
    result = copy(result, metric, "priorOwnerAbandonedChangesMinTime");
    result = copy(result, metric, "priorOwnerAbandonedChangesStdTime");
    result = copy(result, metric, "ownerNumberOfReview");
    result = copy(result, metric, "ownerNumberOfRevisionMergedAvg");
    result = copy(result, metric, "ownerNumberOfRevisionMergedMax");
    result = copy(result, metric, "ownerNumberOfRevisionMergedMin");
    result = copy(result, metric, "ownerNumberOfRevisionMergedStd");
    result = copy(result, metric, "ownerNumberOfRevisionAbandonedAvg");
    result = copy(result, metric, "ownerNumberOfRevisionAbandonedMax");
    result = copy(result, metric, "ownerNumberOfRevisionAbandonedMin");
    result = copy(result, metric, "ownerNumberOfRevisionAbandonedStd");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesSum");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesAvg");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesMax");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesMin");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesStd");
    result = copy(result, metric, "ownerChangesWithSameReviewersSum");
    result = copy(result, metric, "ownerChangesWithSameReviewersAvg");
    result = copy(result, metric, "ownerChangesWithSameReviewersMax");
    result = copy(result, metric, "ownerChangesWithSameReviewersMin");
    result = copy(result, metric, "ownerChangesWithSameReviewersStd");

    //reviewers
    result = copy(result, metric, "reviewersMergedChangesCountAvg");
    result = copy(result, metric, "reviewersMergedChangesCountMax");
    result = copy(result, metric, "reviewersMergedChangesCountMin");
    result = copy(result, metric, "reviewersMergedChangesCountStd");
    result = copy(result, metric, "reviewersMergedChangesTimeAvg");
    result = copy(result, metric, "reviewersMergedChangesTimeMax");
    result = copy(result, metric, "reviewersMergedChangesTimeMin");
    result = copy(result, metric, "reviewersMergedChangesTimeStd");
    result = copy(result, metric, "reviewersMergedChangesPercentageAvg");
    result = copy(result, metric, "reviewersMergedChangesRatioAvg");
    result = copy(result, metric, "reviewersAbandonedChangesCountAvg");
    result = copy(result, metric, "reviewersAbandonedChangesCountMax");
    result = copy(result, metric, "reviewersAbandonedChangesCountMin");
    result = copy(result, metric, "reviewersAbandonedChangesCountStd");
    result = copy(result, metric, "reviewersAbandonedChangesTimeAvg");
    result = copy(result, metric, "reviewersAbandonedChangesTimeMax");
    result = copy(result, metric, "reviewersAbandonedChangesTimeMin");
    result = copy(result, metric, "reviewersAbandonedChangesTimeStd");
    result = copy(result, metric, "reviewersAbandonedChangesPercentageAvg");
    result = copy(result, metric, "reviewersAbandonedChangesRatioAvg");
    result = copy(result, metric, "reviewersTotalPreviousMessagesCount");

    //Messages
    result = copy(result, metric, "ownerPreviousMessageCount");
    result = copy(result, metric, "ownerChangesMessagesSum");
    result = copy(result, metric, "ownerChangesMessagesAvgPerChanges");
    result = copy(result, metric, "ownerChangesMessagesMaxPerChanges");
    result = copy(result, metric, "ownerChangesMessagesMinPerChanges");
    result = copy(result, metric, "ownerChangesMessagesStdPerChanges");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesMessagesSum");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesMessagesAvg");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesMessagesMax");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesMessagesMin");
    result = copy(result, metric, "ownerAndReviewerCommonsChangesMessagesStd");
    result = copy(result, metric, "ownerChangesMessagesWithSameReviewersSum");
    result = copy(result, metric, "ownerChangesMessagesWithSameReviewersAvg");
    result = copy(result, metric, "ownerChangesMessagesWithSameReviewersMax");
    result = copy(result, metric, "ownerChangesMessagesWithSameReviewersMin");
    result = copy(result, metric, "ownerChangesMessagesWithSameReviewersStd");

    //file
    result = copy(result, metric, "AvgNumberOfDeveloperWhoChangesFileInChanges");
    result = copy(result, metric, "mergedFileCountAvg");
    result = copy(result, metric, "mergedFileCountMax");
    result = copy(result, metric, "mergedFileCountMin");
    result = copy(result, metric, "mergedFileCountStd");
    result = copy(result, metric, "mergedFileTimeAvg");
    result = copy(result, metric, "mergedFileTimeMax");
    result = copy(result, metric, "mergedFileTimeMin");
    result = copy(result, metric, "mergedFileTimeStd");
    result = copy(result, metric, "abandonedFileCountAvg");
    result = copy(result, metric, "abandonedFileCountMax");
    result = copy(result, metric, "abandonedFileCountMin");
    result = copy(result, metric, "abandonedFileCountStd");
    result = copy(result, metric, "abandonedFileTimeAvg");
    result = copy(result, metric, "abandonedFileTimeMax");
    result = copy(result, metric, "abandonedFileTimeMin");
    result = copy(result, metric, "abandonedFileTimeStd");
    result = copy(result, metric, "ownerMergedFileCountAvg");
    result = copy(result, metric, "ownerMergedFileCountMax");
    result = copy(result, metric, "ownerMergedFileCountMin");
    result = copy(result, metric, "ownerMergedFileCountStd");
    result = copy(result, metric, "ownerMergedFileTimeAvg");
    result = copy(result, metric, "ownerMergedFileTimeMax");
    result = copy(result, metric, "ownerMergedFileTimeMin");
    result = copy(result, metric, "ownerMergedFileTimeStd");
    result = copy(result, metric, "ownerAbandonedFileCountAvg");
    result = copy(result, metric, "ownerAbandonedFileCountMax");
    result = copy(result, metric, "ownerAbandonedFileCountMin");
    result = copy(result, metric, "ownerAbandonedFileCountStd");
    result = copy(result, metric, "ownerAbandonedFileTimeAvg");
    result = copy(result, metric, "ownerAbandonedFileTimeMax");
    result = copy(result, metric, "ownerAbandonedFileTimeMin");
    result = copy(result, metric, "ownerAbandonedFileTimeStd");
    result = copy(result, metric, "reviewersMergedFileCountAvg");
    result = copy(result, metric, "reviewersMergedFileTimeAvg");
    result = copy(result, metric, "reviewersAbandonedFileCountAvg");
    result = copy(result, metric, "reviewersAbandonedFileTimeAvg");

    //graph
    result = copy(result, metric, "degree_centrality");
    result = copy(result, metric, "closeness_centrality");
    result = copy(result, metric, "betweenness_centrality");
    result = copy(result, metric, "eigenvector_centrality");
    result = copy(result, metric, "clustering_coefficient");
    result = copy(result, metric, "core_number");

    //result
    //result = copy(result, metric, "diff_created_updated")
    //result = copy(result, metric, "date_updated");
    result = copy(result, metric, "diff_created_updated_in_days");
    //result = copy(result, metric, "status");
    //result = copy(result, metric, "diff_created_updated_in_days_ceil")

    /*if (result["n"] === 7107) {
        console.log(metric["date_created"])
    }*/

    return result;
}


module.exports = {
    start: startComputeMetrics
};