const Moment = require('moment');
const MathJs = require('mathjs');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Metric = require('../models/metrics');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');
const ComputeSimpleMetrics = require('./compute-simple-metrics');

const progressBar = new cliProgress.SingleBar({
    //format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | delete_nums : {delete_change_nums}',
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectName = libreOfficeJson["projectName"];

let DATA_PATH = "data/"
let STARTING_POINT = 0;
let delete_change_nums = 0;
const MAX_INACTIVE_TIME_DELAY = 730;

if (typeof require !== 'undefined' && require.main === module) {
    startComputeMetadata(libreOfficeJson).catch(err => {
        console.log(err)
    });
}

function startComputeMetadata(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            let NUM_OF_CHANGES_LIMIT = 10000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count - STARTING_POINT, 0);
            return getChanges(STARTING_POINT, NUM_OF_CHANGES_LIMIT);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished !!!!");
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip, NUM_OF_CHANGES_LIMIT = 20000) {
    return Change
        .aggregate([
            {$sort: {created: 1, _number: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT},
            {$project: {id: 1, date_updated_date_created_diff: 1, avg_time_to_add_human_reviewers_before_close: 1}}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve(false)
            return docs.length ? collectDocs(docs) : Promise.resolve(false);
        })
        .then(result => {
            return result ? getChanges(skip + NUM_OF_CHANGES_LIMIT) : Promise.resolve(false);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        await collectMetadata(docs[key])
            .then((json) => {
                if (json.id === null) {
                    console.log(docs[key].id)
                    return Promise.resolve(true)
                }
                return saveMetadata(json);
            })
    }
    return Promise.resolve(true);
}

function saveMetadata(json) {
    return Change.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            return Metric.updateOne({id: json.id}, json, {upsert: true})
        })
        .then(() => {
            return updateProgress();
        }).catch(err => {
            console.log(err)
        });
}

async function updateProgress() {
    progressBar.increment(1, {delete_change_nums: delete_change_nums});
    return Promise.resolve(true);
}

let i = 1;

async function collectMetadata(json) {
    let metadata = {};
    metadata["id"] = json.id
    //metadata["n"] = i++

    /*
    metadata["owner_timezone"] = MetricsUtils.get_timezone_owner(json)
    metadata["month_date_created"] = MetricsUtils.get_month(json.created);
    metadata["month_date_created_for_owner"] = MetricsUtils.get_month_for_owner(json.created, MetricsUtils.get_timezone(json).author);
    metadata["month_date_updated"] = MetricsUtils.get_month(json.updated);
    metadata["month_date_updated_for_owner"] = MetricsUtils.get_month_for_owner(json.updated, MetricsUtils.get_timezone(json).author);
    //metadata["file_extension_list"] =
    //metadata["base_folder"] =
    let extension_info = get_extension_list(json);
    metadata["extensions_list"] = extension_info.extensions;
    metadata["directories_list"] = extension_info.directories;
    metadata["base_directories_list"] = extension_info.base_directories;

    metadata["num_files"] = Object.keys(json.files_list).length;
    metadata["has_reviewers"] = has_human_reviewers(json)
    metadata["num_human_reviewer"] = MetricsUtils.getHumanReviewersCount(json, projectName);

    //if(json.close_time === json.avg_time_to_add_human_reviewers){}
    let close_time = json["close_time"]
    let time_to_add_human_reviewers = get_time_to_add_human_reviewers(json, close_time);
    metadata["avg_time_to_add_human_reviewers"] = time_to_add_human_reviewers.avg_time_to_add_human_reviewers;
    metadata["avg_time_to_add_human_reviewers_before_close"] = time_to_add_human_reviewers.avg_time_to_add_human_reviewers_before_close;

    let self_review = MetricsUtils.is_self_reviewed_note(json, projectName);
    metadata["num_code_review_minus_2"] = self_review.check_code_review_minus_2_count;
    metadata["num_code_review_2"] = self_review.check_code_review_2_count;
    metadata["num_code_review"] = self_review.check_code_review_length;

     */
    let avg_time_to_add_human_reviewers_before_close = json["avg_time_to_add_human_reviewers_before_close"] ? json["avg_time_to_add_human_reviewers_before_close"] : 0;
    metadata["effective_revision_time_diff"] = Math.abs(json["date_updated_date_created_diff"] - avg_time_to_add_human_reviewers_before_close)

    return metadata;
}

function timeDiff(time1, time2) {
    let createdTime = Moment.utc(time1);
    let updatedTime = Moment.utc(time2);
    let time = Math.abs(createdTime.toDate() - updatedTime.toDate());
    return Moment.duration(time).asHours()
}

function get_time_to_add_human_reviewers(json, close_time) {
    let reviewers_updated = json["reviewer_updates"]; //todo correct
    let date_created = json["created"]
    let dateDiff = []
    let dateDiff_before_close = []
    if (!reviewers_updated)
        return {
            avg_time_to_add_human_reviewers: undefined,
            avg_time_to_add_human_reviewers_before_close: undefined
        };

    for (let i = 0; i < reviewers_updated.length; i++) {
        let updated = reviewers_updated[i];
        let reviewer_id = updated["reviewer"]["_account_id"];
        if (!MetricsUtils.isABot(reviewer_id, projectName)) {
            let date = updated["updated"];
            dateDiff.push(timeDiff(date_created, date))
            if (date < close_time)
                dateDiff_before_close.push(timeDiff(date_created, date))
        }
    }
    return {
        avg_time_to_add_human_reviewers: avg(dateDiff),
        avg_time_to_add_human_reviewers_before_close: avg(dateDiff_before_close)
    }
}

function avg(num_array) {
    return num_array.length > 0 ? MathJs.mean(num_array) : 0;
}

function has_human_reviewers(json) {
    let reviewers_updated = json["reviewer_updates"];
    if (!reviewers_updated)
        return false
    for (let i = 0; i < reviewers_updated.length; i++) {
        let updated = reviewers_updated[i];
        let reviewer_id = updated["reviewer"]["_account_id"];
        if (!MetricsUtils.isABot(reviewer_id, projectName)) {
            return true
        }
    }
    return false
}

function get_extension_list(json) {
    let files_list = json.files_list ? json.files_list : [];
    let extensions_set = new Set();
    let directories_set = new Set();
    let base_directories_set = new Set();
    for (let index in files_list) {
        let file_path = files_list[index];
        let ext = file_path.substr(file_path.lastIndexOf('.') + 1);
        let dir = file_path.substr(0, file_path.lastIndexOf('/') + 1);
        let base_dir = file_path.substr(0, file_path.indexOf('/') + 1);
        extensions_set.add(ext);
        directories_set.add(dir);
        base_directories_set.add(base_dir);
    }

    let extensions = Array.from(extensions_set);
    let directories = Array.from(directories_set);
    let base_directories = Array.from(base_directories_set);

    return {
        extensions: extensions,
        directories: directories,
        base_directories: base_directories,
    }
}

module.exports = {
    start: startComputeMetadata
};