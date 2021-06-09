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
            {$match:{status: {$in: ['MERGED','ABANDONED']}}},
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

    //identification
    result["n"] = i++
    //result = copy(result, metric, "n");
    result = copy(result, metric, "number");
    result = copy(result, metric, "change_id");

    //time
    result = copy(result, metric, "date_created");
    result = copy(result, metric, "days_of_the_weeks_of_date_created");
    result = copy(result, metric, "is_created_date_a_weekend");
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

    //
    result = copy(result, metric, "sum_changed_methods_count");
    //result = copy(result, metric, "sum_added_lines");
    //result = copy(result, metric, "sum_removed_lines");
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

    //Text metrics
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

    //Owner experience metrics
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

    //metrics to predict
    result = copy(result, metric, "diff_created_updated_in_hours");

    return result;
}


module.exports = {
    start: startComputeMetrics
};