const Moment = require('moment');
const MathJs = require('mathjs');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const Utils = require('../config/utils');
const Extension = require('../res/extension.json');
const Keywords = require('../res/keywords.json');
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
let STARTING_POINT = 0;
let i = 1;

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
        .then(() => {
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            let NUM_OF_CHANGES_LIMIT = 20000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
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
            {$sort: {_number: 1}},
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
    return Metrics.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            let filename = projectName + "-simple-metrics.csv";
            let path = PathLibrary.join(DATA_PATH, projectName);
            return Utils.add_line_to_file(json, filename, path);
        }).then(() => {
            return updateProgress();
        });
}

async function updateProgress() {
    progressBar.increment(1);
    return Promise.resolve(true);
}

/**
 * @param {JSON} json Output json to save
 * @return {JSON} metric
 */
async function collectMetrics(json) {
    let metric = {};
    collectIdentityMetrics(json, metric);
    collectTimeMetrics(json, metric);
    collectCodeMetrics(json, metric);
    collectFileMetrics(json, metric);
    collectOwnerMetrics(json, metric);
    collectMsgMetrics(json, metric);
    return metric;
}

/**
 * @param {JSON} json Input Json
 * @param {JSON} metric Output Json
 */
function collectIdentityMetrics(json, metric) {
    metric["n"] = i++;
    metric["number"] = json._number;
    metric["id"] = json.id;
    metric["change_id"] = json.change_id;
    metric["status"] = json.status;
    metric["project"] = json.project;
    metric["branch"] = json.branch;
}

/**
 * @param {JSON} json Input Json
 * @param {JSON} metric Output Json
 */
function collectTimeMetrics(json, metric) {
    metric["date_created"] = json.created;
    metric["date_updated"] = json.updated;
    metric["date_created_time"] = get_date_time(json.created);
    metric["date_updated_time"] = get_date_time(json.updated);
    metric["days_of_the_weeks_of_date_created"] = get_days_of_the_weeks(json.created);
    metric["days_of_the_weeks_of_date_updated"] = get_days_of_the_weeks(json.updated);
    metric["days_of_the_weeks_date_created_precise"] = get_precise_days_of_the_weeks(json.created);
    metric["days_of_the_weeks_of_date_updated_precise"] = get_precise_days_of_the_weeks(json.created);
    metric["hours_of_the_days_date_created"] = get_hours_of_the_days(json.created);
    metric["hours_of_the_days_date_updated"] = get_hours_of_the_days(json.updated);
    metric["hours_of_the_days_date_created_for_owner"] = get_hours_of_the_days_for_owner_timezone(json.created, get_timezone(json).author);
    metric["hours_of_the_days_date_updated_for_owner"] = get_hours_of_the_days_for_owner_timezone(json.updated, get_timezone(json).author);
    metric["is_created_date_a_weekend"] = is_date_a_weekend(json.created);
    metric["is_updated_date_a_weekend"] = is_date_a_weekend(json.updated);
    metric["days_of_the_weeks_of_date_created_for_owner_timezone"] = get_days_of_the_weeks_for_owner_timezone(json.created, get_timezone(json).author);
    metric["is_created_date_a_weekend_for_owner_timezone"] = is_date_a_weekend_for_owner_timezone(json.created, get_timezone(json).author);
    metric["date_commit"] = get_commit_date(json);
    metric["date_commit_time"] = get_commit_date_time(json);
    metric["committer_timezone"] = get_timezone(json).committer;
    metric["author_timezone"] = get_timezone(json).author;
    metric["month_date_created"] = get_month(json.created);
    metric["month_date_created_for_owner"] = get_month_for_owner(json.created, get_timezone(json).author);
    metric["month_date_updated"] = get_month(json.updated);
    metric["month_date_updated_for_owner"] = get_month_for_owner(json.updated, get_timezone(json).author);

    //metrics to forecast
    metric["diff_created_updated"] = diffCreatedUpdatedTime(json);
    metric["diff_created_updated_in_days"] = diff_date_days(json);
    metric["diff_created_updated_in_days_ceil"] = MathJs.ceil(diff_date_days(json));
    metric["diff_created_updated_in_hours"] = diff_date_hours(json);

    metric["date_updated_date_created_diff"] = json['date_updated_date_created_diff'];
    metric["diff_created_close_time"] = json['diff_created_close_time'];
    metric["max_inactive_time_before_close"] = json['max_inactive_time_before_close'];
    metric["max_inactive_time"] = json['max_inactive_time'];
    metric["is_self_review"] = json['is_self_review'];
    metric["is_a_cherry_pick"] = json['is_a_cherry_pick'];
    metric["project"] = json['project'];
    metric["branch"] = json['branch'];
    //metric["diff_created_updated_in_hours_ceil"] = MathJs.ceil(diff_date_hours(json));
    //metric["date_submitted"] = get_date_submitted(json);
    //metric["diff_created_updated_in_hours"] = json["meta_date_updated_date_created_diff"]
}

/**
 * @param {JSON} json Input Json
 * @param {JSON} metric Output Json
 */
function collectCodeMetrics(json, metric) {
    metric["lines_added_num"] = json.insertions;
    metric["lines_deleted_num"] = json.deletions;
    metric["diff_lines_added_line_deleted"] = json.insertions - json.deletions;
}

/**
 * @param {JSON} json Input Json
 * @param {JSON} metric Output Json
 */
function collectFileMetrics(json, metric) {
    let fileInfo = get_files_info(json);
    metric["num_files"] = fileInfo.num_files;
    metric["num_files_type"] = fileInfo.num_files_type;
    metric["num_directory"] = fileInfo.num_directory;
    metric["num_file_added"] = fileInfo.num_file_added;
    metric["num_file_deleted"] = fileInfo.num_file_deleted;
    metric["num_binary_file"] = fileInfo.num_binary_file;
    metric["modify_entropy"] = fileInfo.modify_entropy;
    metric["num_subsystem"] = num_subsystem(json);
    metric["num_programming_language"] = fileInfo.num_programming_language;
    metric["num_data_language"] = fileInfo.num_data_language;
    metric["num_prose_language"] = fileInfo.num_prose_language;
    metric["num_markup_language"] = fileInfo.num_markup_language;
    metric["first_revision_insertions"] = fileInfo.first_revision_insertions;
    metric["first_revision_deletions"] = fileInfo.first_revision_deletions;
    metric["first_revision_number"] = get_first_revision_number(json);
    metric["first_revision_kind"] = get_first_revision_kind(json);

    metric["first_revision_code_churn"] = fileInfo.first_revision_insertions + fileInfo.first_revision_deletions;
    metric["first_revision_code_churn_size"] = get_code_churn_size(fileInfo.first_revision_insertions + fileInfo.first_revision_deletions);
}

const ChurnSize = {
    XS: 10,
    SMALL: 50,
    MEDIUM: 250,
    LARGE: 1000,
}

function get_code_churn_size(churn) {
    if (isNaN(churn) || churn === 0) {
        return null;
    }
    if (churn < ChurnSize.XS) {
        return 'XS';
    } else if (churn < ChurnSize.SMALL) {
        return 'S';
    } else if (churn < ChurnSize.MEDIUM) {
        return 'M';
    } else if (churn < ChurnSize.LARGE) {
        return 'L';
    } else {
        return 'XL';
    }
}

/**
 * @param {JSON} json Input Json
 * @param {JSON} metric Output Json
 */
function collectMsgMetrics(json, metric) {
    metric["subject_length"] = countSubjectLength(json);
    metric["subject_word_count"] = numberOfWordInSubject(json);
    metric["msg_length"] = get_msg_length(json);
    metric["msg_word_count"] = get_msg_word_count(json);
    metric["is_corrective"] = msg_is_corrective(json);
    metric["is_merge"] = msg_is_merge(json);
    metric["is_non_fonctional"] = msg_is_non_fonctional(json);
    metric["is_perfective"] = msg_is_perfective(json);
    metric["is_preventive"] = msg_is_preventive(json);
    metric["is_refactoring"] = msg_is_refactoring(json);
    metric["has_feature_addition"] = msg_has_feature_addition(json);
    //metric["is_refactoring"] = msg_is_refactoring(json);
}

/**
 * @param {JSON} json Input Json
 * @param {JSON} metric Output Json
 */
function collectOwnerMetrics(json, metric) {
    if (json.owner)
        metric["is_a_bot"] = MetricsUtils.isABot(json.owner._account_id, projectName);

    metric["num_human_reviewer"] = MetricsUtils.getHumanReviewersCount(json, projectName);
    metric["is_self_reviewed"] = isSelfReviewed(json);
    metric["is_owner_a_reviewer"] = isOwnerAReviewer(json);
    metric["is_owner_the_only_reviewer"] = isOwnerTheOnlyReviewer(json);

    let self_review = is_self_reviewed_note(json);
    metric["labels_code_review_2_owner"] = self_review.check_code_review_2_owner;
    metric["labels_code_review_2_count"] = self_review.check_code_review_2_count;
    metric["labels_code_review_minus_2_owner"] = self_review.check_code_review_minus_2_owner;
    metric["labels_code_review_minus_2_count"] = self_review.check_code_review_minus_2_count;

    metric["labels_code_review_human_length"] = self_review.check_code_review_human_length;
    metric["labels_code_review_length"] = self_review.check_code_review_length;

    metric["labels_verified_2_owner"] = self_review.check_verified_2_owner;
    metric["labels_verified_2_count"] = self_review.check_verified_2_count;
    metric["labels_verified_minus_2_owner"] = self_review.check_verified_minus_2_owner;
    metric["labels_verified_minus_2_count"] = self_review.check_verified_minus_2_count;

    metric["labels_verified_human_length"] = self_review.count_verified_human_length;
    metric["labels_verified_length"] = self_review.count_verified_length;

    metric["check_code_review_1_owner"] = self_review.check_code_review_1_owner;
    metric["check_code_review_1_count"] = self_review.check_code_review_1_count;
    metric["check_code_review_minus_1_owner"] = self_review.check_code_review_minus_1_owner;
    metric["check_code_review_minus_1_count"] = self_review.check_code_review_minus_1_count;
    metric["check_verified_1_owner"] = self_review.check_verified_1_owner;
    metric["check_verified_1_count"] = self_review.check_verified_1_count;
    metric["check_verified_minus_1_owner"] = self_review.check_verified_minus_1_owner;
    metric["check_verified_minus_1_count"] = self_review.check_verified_minus_1_count;
}

function isSelfReviewed(json) {
    let humanReviewersID = MetricsUtils.getHumanReviewersID(json, projectName);
    let ownerId = json.owner._account_id;
    if (humanReviewersID.length === 1) {
        if (ownerId === humanReviewersID[0])
            return 1
    }
    return 0;
}

function isOwnerAReviewer(json) {
    let reviewersId = MetricsUtils.getReviewersId(json);
    let ownerId = json.owner._account_id;
    return reviewersId.includes(ownerId);
}

function isOwnerTheOnlyReviewer(json) {
    let reviewersId = MetricsUtils.getReviewersId(json);
    let ownerId = json.owner._account_id;
    return reviewersId.includes(ownerId) && reviewersId.length === 1;
}

function is_self_reviewed_note(json) {
    let labels = json["labels"];

    if (!!!labels)
        return false;

    let code_review = []
    if (labels["Code-Review"])
        if (labels["Code-Review"]["all"])
            code_review = labels["Code-Review"]["all"];

    let verified = []
    if (labels["Verified"])
        if (labels["Verified"]["all"])
            verified = labels["Verified"]["all"];

    let owner_id = json.owner._account_id;

    let check_code_review_2_owner = check_review_owner(code_review, owner_id, 2);
    let check_code_review_2_count = check_review_count(code_review, 2);
    let check_code_review_minus_2_owner = check_review_owner(code_review, owner_id, -2);
    let check_code_review_minus_2_count = check_review_count(code_review, -2);
    let check_code_review_human_length = count_human_review(json, code_review);
    let check_code_review_length = code_review.length;

    let check_verified_2_owner = check_review_owner(verified, owner_id, 2);
    let check_verified_2_count = check_review_count(verified, 2);
    let check_verified_minus_2_owner = check_review_owner(verified, owner_id, -2);
    let check_verified_minus_2_count = check_review_count(verified, -2);
    let count_verified_human_length = count_human_review(json, verified);
    let count_verified_length = verified.length;

    let check_code_review_1_owner = check_review_owner(code_review, owner_id, 1);
    let check_code_review_1_count = check_review_count(code_review, 1);
    let check_code_review_minus_1_owner = check_review_owner(code_review, owner_id, -1);
    let check_code_review_minus_1_count = check_review_count(code_review, -1);

    let check_verified_1_owner = check_review_owner(verified, owner_id, 1);
    let check_verified_1_count = check_review_count(verified, 1);
    let check_verified_minus_1_owner = check_review_owner(verified, owner_id, -1);
    let check_verified_minus_1_count = check_review_count(verified, -1);

    return {
        check_code_review_2_owner: check_code_review_2_owner,
        check_code_review_2_count: check_code_review_2_count,
        check_code_review_minus_2_owner: check_code_review_minus_2_owner,
        check_code_review_minus_2_count: check_code_review_minus_2_count,
        check_code_review_human_length: check_code_review_human_length,
        check_code_review_length: check_code_review_length,
        check_verified_2_owner: check_verified_2_owner,
        check_verified_2_count: check_verified_2_count,
        check_verified_minus_2_owner: check_verified_minus_2_owner,
        check_verified_minus_2_count: check_verified_minus_2_count,
        count_verified_human_length: count_verified_human_length,
        count_verified_length: count_verified_length,

        check_code_review_1_owner: check_code_review_1_owner,
        check_code_review_1_count: check_code_review_1_count,
        check_code_review_minus_1_owner: check_code_review_minus_1_owner,
        check_code_review_minus_1_count: check_code_review_minus_1_count,
        check_verified_1_owner: check_verified_1_owner,
        check_verified_1_count: check_verified_1_count,
        check_verified_minus_1_owner: check_verified_minus_1_owner,
        check_verified_minus_1_count: check_verified_minus_1_count,
    }

}

function count_human_review(json, code_review) {
    let count = 0;
    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let _account_id = review._account_id
        if (!MetricsUtils.isABot(_account_id, projectName)) {
            count++;
        }
    }
    return count;
}

function check_review_owner(code_review, owner_id, VALUE) {
    let check = false;
    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let _account_id = review._account_id
        if (_account_id !== owner_id) {
            continue;
        }
        let value = review.value;
        if (value === VALUE)
            check = true;
    }
    return check;
}

function check_review_count(code_review, VALUE) {
    let count = 0;
    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let value = review.value;
        if (value === VALUE)
            count += 1;
    }
    return count;
}


// date
function get_date_submitted(json) {
    return (json.submitted) ? json.submitted : 0;
}

function get_date_created_time(json) {
    return Moment.utc(json.created).toDate().getTime();
}

function get_date_updated_time(json) {
    return Moment.utc(json.updated).toDate().getTime();
}

function get_date_time(dateString) {
    return Moment.utc(dateString).toDate().getTime();
}

function get_days_of_the_weeks_date_created(json) {
    return Moment.utc(json.created).isoWeekday();
}

function get_days_of_the_weeks(dateString) {
    return Moment.utc(dateString).isoWeekday();
}

function get_month(dateString) {
    return Moment.utc(dateString, "YYYY-MM-DD hh:mm:ss.SSSSSSSSS").format('MMMM')
}

function get_month_for_owner(dateString, offset) {
    return Moment.utc(dateString, "YYYY-MM-DD hh:mm:ss.SSSSSSSSS").utcOffset(offset).format('MMMM')
}

function get_hours_of_the_days(dateString) {
    let date = Moment.utc(dateString);
    return Moment.duration(date.format("hh:mm:ss.SSSSSSSSS")).asDays()
}

function get_hours_of_the_days_for_owner_timezone(dateString, offset) {
    let date = Moment.utc(dateString).utcOffset(offset);
    return Moment.duration(date.format("hh:mm:ss.SSSSSSSSS")).asDays()
}

function get_precise_days_of_the_weeks(dateString) {
    let date = Moment.utc(dateString);
    return date.isoWeekday() + Moment.duration(date.format("hh:mm:ss.SSSSSSSSS")).asDays()
}

function get_days_of_the_weeks_for_owner_timezone(dateString, offset) {
    return Moment.utc(dateString).utcOffset(offset).isoWeekday();
}

function get_days_of_the_weeks_date_updated(json) {
    return Moment.utc(json.updated).isoWeekday();
}

function get_commit_date(json) {
    let cd = 0;
    try {
        cd = json.revisions.commit.committer.date;
    } catch (e) {

    }
    return cd;
}

function get_commit_date_time(json) {
    let date = get_commit_date(json);
    return Moment.utc(date).toDate().getTime()
}

function is_date_a_weekend_for_owner_timezone(dateString, offset) {
    let date = Moment.utc(dateString).utcOffset(offset).isoWeekday();
    return (date === 6) || (date === 7)
}

function is_created_date_a_weekend(json) {
    let date = Moment.utc(json.created).isoWeekday();
    return (date === 6) || (date === 7)
}

function is_updated_date_a_weekend(json) {
    let date = Moment.utc(json.updated).isoWeekday();
    return (date === 6) || (date === 7)
}

function is_date_a_weekend(dateString) {
    let date = Moment.utc(dateString).isoWeekday();
    return (date === 6) || (date === 7)
}

function get_timezone(json) {
    let tz = {"committer": 0, "author": 0};
    let revisions = json.revisions
    for (let id in revisions) {
        let revision = revisions[id]
        if (!!revision["commit"]) {
            if (!!revision["commit"]["committer"])
                tz.committer = revision.commit.committer.tz;
            if (!!revision["commit"]["author"])
                tz.author = revision.commit.author.tz;
            break;
        }
    }
    return tz;
}

let owner = {};

function initOwner(ownerId) {
    if (!(owner.hasOwnProperty(ownerId))) {
        owner[ownerId] = {
            num_changed: 0,
            sub_sys: [],
            num_merged: 0,
            sub_sys_merged: [],
            num_review: 0,
        };
    }
}

function get_owner_property(json) {
    let ownerId = json.owner._account_id;

    initOwner(ownerId);

    owner[ownerId]["num_changed"] = owner[ownerId]["num_changed"] + 1;

    if (!(json.project in owner[ownerId].sub_sys))
        owner[ownerId].sub_sys.push(json.project)

    if (json.status === "MERGED") {
        owner[ownerId]["num_merged"] = owner[ownerId]["num_merged"] + 1;
        if (!(json.project in owner[ownerId]["sub_sys_merged"]))
            owner[ownerId]["sub_sys_merged"].push(json.project);
    }

    //console.log("owner[ownerId][\"num_changed\"]" + owner[ownerId]["num_changed"]);
    let num_merged_ratio = 0;
    if (owner[ownerId]["num_changed"] !== 0)
        num_merged_ratio = MathJs.divide(owner[ownerId]["num_merged"], owner[ownerId]["num_changed"])

    let sub_sys_merged_ratio = 0;
    if (owner[ownerId]["sub_sys"].length > 0) {
        sub_sys_merged_ratio = MathJs.divide(owner[ownerId]["sub_sys_merged"].length, owner[ownerId]["sub_sys"].length);
    }

    let reviewers = MetricsUtils.getHumanReviewers(json, projectName);
    for (let id in reviewers) {
        let reviewerId = reviewers[id]._account_id;
        initOwner(reviewerId);
        owner[ownerId]["num_review"] = owner[ownerId]["num_review"] + 1;
    }

    return {
        owner_num_changed: owner[ownerId]["num_changed"],
        owner_num_review: owner[ownerId]["num_review"],
        owner_num_merged: owner[ownerId]["num_merged"],
        owner_num_merged_ratio: num_merged_ratio,
        owner_sub_sys_merged: owner[ownerId]["sub_sys_merged"].length,
        owner_sub_sys_merged_ratio: sub_sys_merged_ratio,
        owner_project: Object.keys(owner[ownerId].sub_sys).length
    }
}

let files_change_json = {};

function get_changes_files_modified(json) {
    let revisions = json.revisions;
    let ownerId = json.owner._account_id;
    let time_per_review = [];
    let number_per_review = [];
    let number_of_dev = [];
    let dev_experience = [];
    let dev_experience_time = [];
    let rev_experience = [];
    let rev_experience_time = [];
    let time = [];
    let number = [];

    for (let key in revisions) {
        //Get only the first revision
        let revision_number = revisions[key]._number;
        if (revision_number !== 1)
            continue;

        let reviewersIds = MetricsUtils.getHumanReviewersID(json, projectName);
        //console.log(json.id);

        let files = revisions[key].files;
        for (let index in files) {
            if (!files_change_json[index]) {
                files_change_json[index] = {number_of_modif: 0, time_of_modif: [], dev: {}, reviewer: {}};
            }
            files_change_json[index]["number_of_modif"] = files_change_json[index]["number_of_modif"] + 1;
            let diff_time = diffCreatedUpdatedTime(json)
            files_change_json[index]["time_of_modif"].push(diff_time);

            if (ownerId in files_change_json[index]["dev"]) {
                files_change_json[index]["dev"][ownerId]["number_of_modif"] = files_change_json[index]["dev"][ownerId]["number_of_modif"] + 1;
                files_change_json[index]["dev"][ownerId]["time_of_modif"].push(diff_time);
            } else {
                files_change_json[index]["dev"][ownerId] = {};
                files_change_json[index]["dev"][ownerId]["number_of_modif"] = 1;
                files_change_json[index]["dev"][ownerId]["time_of_modif"] = [diff_time];
            }
            dev_experience_time.push(files_change_json[index]["dev"][ownerId]["time_of_modif"])

            let count_dev = Object.keys(files_change_json[index]["dev"]).length;
            number_of_dev.push(count_dev);

            let number_of_modif = files_change_json[index]["dev"][ownerId]["number_of_modif"];
            dev_experience.push(number_of_modif);

            number.push(files_change_json[index]["number_of_modif"]);
            time.push(files_change_json[index]["time_of_modif"]);

            //reviewer experience
            for (let k in reviewersIds) {
                let reviewerId = reviewersIds[k];
                if (reviewerId in files_change_json[index]["reviewer"]) {
                    files_change_json[index]["reviewer"][reviewerId]["number_of_modif"] = files_change_json[index]["reviewer"][reviewerId]["number_of_modif"] + 1;
                    files_change_json[index]["reviewer"][reviewerId]["time_of_modif"].push(diff_time);
                } else {
                    files_change_json[index]["reviewer"][reviewerId] = {};
                    files_change_json[index]["reviewer"][reviewerId]["number_of_modif"] = 1;
                    files_change_json[index]["reviewer"][reviewerId]["time_of_modif"] = [diff_time];
                }
            }

            for (let k in reviewersIds) {
                let reviewerId = reviewersIds[k];
                rev_experience.push(files_change_json[index]["reviewer"][reviewerId]["number_of_modif"])
                rev_experience_time.push(files_change_json[index]["reviewer"][reviewerId]["time_of_modif"])
            }
        }
        time_per_review.push(average(time));
        number_per_review.push(average(number));
    }

    let num_dev = average(number_of_dev);
    let dev_exp = average(dev_experience);
    let moy_number_per_review = average(number_per_review);
    let moy_time_per_review = average(time_per_review);
    let moy_time_owner_pass_on_change_files = average(dev_experience_time);
    let moy_number_of_time_reviewer_review_the_files = average(rev_experience);
    let moy_time_reviewer_pass_on_this_files = average(rev_experience_time);

    return {
        num_dev: num_dev,
        dev_exp: dev_exp,
        moy_time_per_review: moy_time_per_review,
        moy_number_per_review: moy_number_per_review,
        moy_time_owner_pass_on_change_files: moy_time_owner_pass_on_change_files,
        moy_number_of_time_reviewer_review_the_files: moy_number_of_time_reviewer_review_the_files,
        moy_time_reviewer_pass_on_this_files: moy_time_reviewer_pass_on_this_files
    }
}

function initFileInfoData() {
    return {
        num_files: 0,
        num_files_type: 0,
        num_file_added: 0,
        num_file_deleted: 0,
        num_binary_file: 0,
        num_directory: 0,
        num_programming_language: 0,
        first_revision_insertions: 0,
        first_revision_deletions: 0,
        modify_entropy: 0,
        num_markup_language: 0,
        num_data_language: 0,
        num_prose_language: 0,
        first_revision: 0,
    }
}


function get_files_info(json) {

    let fileInfo = initFileInfoData();
    let filesJson = {};
    let filesExtJson = {};
    let directoryJson = {};
    let addFiles = [];
    let removeFiles = [];
    let modificationArray = [];
    let entropyArray = [];

    let first_revision = get_first_revision(json);
    let files = first_revision.files;

    for (let index in files) {
        let status = files[index].status;
        let filename = files[index];
        if (status) {
            if (status === "A") {
                if (addFiles.indexOf(index) === -1) {
                    addFiles.push(index);
                }
            } else if (status === "D") {
                if (removeFiles.indexOf(index) === -1) {
                    removeFiles.push(index);
                }
            }
        }

        if (files[index].binary)
            if (files[index].binary === true)
                fileInfo.num_binary_file++;

        let ext = index.substr(index.lastIndexOf('.') + 1);
        filesExtJson[ext] ? filesExtJson[ext] = filesExtJson[ext] + 1 : filesExtJson[ext] = 1;

        //count dir
        let dir = index.substr(0, index.lastIndexOf('/') + 1);
        directoryJson[dir] ? directoryJson[dir] = directoryJson[dir] + 1 : directoryJson[dir] = 1;

        //count files
        filesJson[index] ? filesJson[index] = filesJson[index] + 1 : filesJson[index] = 1;
        fileInfo.first_revision_insertions += files[index].lines_inserted ? files[index].lines_inserted : 0;
        fileInfo.first_revision_deletions += files[index].lines_deleted ? files[index].lines_deleted : 0;
        let number = plusFn(files[index].lines_inserted, files[index].lines_deleted);
        modificationArray.push(number);
    }

    //calculate the entropy
    let entropy = calculate_entropy(modificationArray);
    entropyArray.push(entropy);

    //}

    fileInfo.num_files = Object.keys(filesJson).length;
    fileInfo.num_files_type = Object.keys(filesExtJson).length;
    fileInfo.num_file_added = Object.keys(addFiles).length;
    fileInfo.num_file_deleted = Object.keys(removeFiles).length;
    fileInfo.num_directory = Object.keys(directoryJson).length;
    fileInfo.modify_entropy = average(entropyArray);
    //fileInfo.insertions = insertions;
    //fileInfo.deletions = deletions;
    fileInfo.num_programming_language = get_num_of_language(filesExtJson);
    fileInfo.num_markup_language = get_num_of_markup_type(filesExtJson);
    fileInfo.num_data_language = get_num_of_data_type(filesExtJson);
    fileInfo.num_prose_language = get_num_of_prose_type(filesExtJson);

    return fileInfo;
}

function calculate_entropy(array) {
    let entropy = 0;
    if (array.length > 0) {
        let som = MathJs.sum(array);
        for (let k in array) {
            let lk = array[k];
            let pk = 1;
            if (som !== 0)
                pk = MathJs.divide(lk, som);
            let log2Pk = MathJs.log2(pk);
            let pk_log2Pk;
            if (pk !== 0) pk_log2Pk = MathJs.multiply(pk, log2Pk)
            else
                pk_log2Pk = 0;
            entropy = MathJs.sum(entropy, pk_log2Pk);
        }
        entropy = MathJs.multiply(entropy, -1);
    }
    return entropy;
}

//function
function average(array) {
    return (array.length > 0) ? MathJs.mean(array) : 0;
}

function get_files(json) {
    let revisions = json.revisions
    let filesJson = {};
    for (let key in revisions) {
        let files = revisions[key].files;
        for (let index in files) {
            if (filesJson[index]) {
                filesJson[index] = filesJson[index] + 1;
            } else {
                filesJson[index] = 1;
            }
        }
    }
    return filesJson;
}

function get_files_names_list(json) {
    let revisions = json.revisions;
    let filesArray = [];
    for (let key in revisions) {
        let files = revisions[key].files;
        filesArray.concat(files);
    }
    return filesArray;
}

function get_num_files(json) {
    let filesArray = get_files_names_list(json);
    return Object.keys(filesArray).length;
}

function plusFn(l, r) {
    if (typeof l === 'undefined')
        return typeof r === 'undefined' ? 0 : r;
    if (typeof r === 'undefined')
        if (typeof l === 'undefined')
            return 0;
        else
            return l;
    return l + r;
}

function get_num_of_language(extJson) {
    return get_num_of_extension_type(extJson, Extension.programming)
}

function get_num_of_markup_type(extJson) {
    return get_num_of_extension_type(extJson, Extension.markup)
}

function get_num_of_data_type(extJson) {
    return get_num_of_extension_type(extJson, Extension.data)
}

function get_num_of_prose_type(extJson) {
    return get_num_of_extension_type(extJson, Extension.prose)
}

function get_num_of_extension_type(json, extTypeJson) {
    let programming_list_json = extTypeJson;
    let number = 0;
    let prog_list = new Set;
    for (let extension in json) {
        if (programming_list_json[extension]) {
            if (!prog_list.has(programming_list_json[extension][0])) {
                number++
            }
            programming_list_json[extension].forEach(item => prog_list.add(item))
        }
    }
    return number;
}

function num_subsystem(json) {
    let subsystem = [];
    subsystem.push(json.project);
    return Object.keys(subsystem).length;
}

function diffCreatedUpdatedTime(json) {
    let createdTime = Moment.utc(json.created);
    let updatedTime = Moment.utc(json.updated);
    return Math.abs(createdTime.toDate() - updatedTime.toDate());
}

function diff_date_days(json) {
    let createdTime = Moment.utc(json.created).toDate();
    let updatedTime = Moment.utc(json.updated).toDate();
    let time = Math.abs(createdTime - updatedTime);
    return Moment.duration(time).asDays();
}

function diff_date_hours(json) {
    let createdTime = Moment.utc(json.created).toDate();
    let updatedTime = Moment.utc(json.updated).toDate();
    let time = Math.abs(createdTime - updatedTime);
    return Moment.duration(time).asHours();
}

function getReviewers(json) {
    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id])
    }
    return reviewerArray;
}

function getReviewersId(json) {
    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id]._account_id)
    }
    return reviewerArray;
}

function getParticipantId(json) {
    let ownerId = json.owner._account_id;
    let reviewersId = getReviewersId(json);
    let user = []
    //add user
    user.push(ownerId);
    for (let i in reviewersId) {
        user.push(reviewersId[i]);
    }
    return user;
}

function get_human_reviewers(json) {
    let reviewers = getReviewers(json);
    let rev = [];
    for (let i in reviewers) {
        if (reviewers[i].email) {
            rev.push(reviewers[i])
        }
    }
    return rev;
}

function get_num_human_reviewer(json) {
    let reviewers = get_human_reviewers(json);
    return reviewers.length;
}

function get_num_revisions(json) {
    let revisions = json.revisions;
    return Object.keys(revisions).length
}

//msg metrics
function countSubjectLength(json) {
    return countLetter(json.subject);
}

function numberOfWordInSubject(json) {
    return countWord(json.subject);
}

function countLetter(word) {
    return (word) ? word.length : 0;
}

function countWord(phrase) {
    if (phrase)
        return phrase.split(' ')
            .filter(function (n) {
                return n != ''
            })
            .length;
    else
        return 0;
}

function get_first_revision_id(json) {
    let revisions = json.revisions;
    let first_revision_number = null;
    let revision_id = 0;
    for (let i in revisions) {
        let number = revisions[i]._number;
        if (first_revision_number === null) {
            first_revision_number = number;
            revision_id = i;
        }

        if (number <= first_revision_number) {
            first_revision_number = number;
            revision_id = i;
        }
    }
    return revision_id;
}

function get_first_revision_number(json) {
    let first_revision = get_first_revision(json)
    return first_revision["_number"];
}

function get_first_revision(json) {
    let revisions = json.revisions;
    let first_revision_number = get_first_revision_id(json);
    return revisions[first_revision_number];
}

function get_first_revision_kind(json) {
    let first_revision = get_first_revision(json)
    let kind = first_revision["kind"]
    if (kind) {
        return kind;
    } else {
        return "UNDEFINED";
    }
}

function get_commit_msg(json) {
    let first_revision = get_first_revision(json)
    let messages = [];
    if (first_revision.commit) {
        let message = first_revision.commit.message;
        messages.push(message);
    }
    return messages;
}

function get_msg_length(json) {
    let messages = get_commit_msg(json);
    return countLetter(messages[0]);
}

function get_msg_word_count(json) {
    let messages = get_commit_msg(json);
    return countWord(messages[0]);
}

function msg_has_words(json, wordArray) {
    let messages = get_commit_msg(json);
    let concatMsg = "";
    for (let i in messages) {
        concatMsg += messages[i].toLowerCase();
    }

    let num = 0;
    for (let j in wordArray) {
        if (concatMsg.indexOf(wordArray[j].toLowerCase()) >= 0) {
            num = num + 1;
        }
    }

    return num > 0 ? 1 : 0;
}

function msg_has_bug(json) {
    let wordArray = ['bug', 'bugs', 'debug', 'bugdoc', 'fixture', 'resolve'];
    return msg_has_words(json, wordArray);
}

function msg_has_feature(json) {
    let wordArray = ['feature', 'features'];
    return msg_has_words(json, wordArray);
}

function msg_has_improve(json) {
    let wordArray = ['improve', 'improves', 'improvements', 'improvement', 'correction', 'better', 'remove'];
    return msg_has_words(json, wordArray);
}

function msg_has_document(json) {
    let wordArray = ['document', 'documentation', 'doc', 'docs'];
    return msg_has_words(json, wordArray);
}

function msg_has_refactor(json) {
    let wordArray = ['refactor', 'cleanup', 'refactoring', 'clean', 'cleaning'];
    return msg_has_words(json, wordArray);
}

function msg_is_corrective(json) {
    let wordArray = Keywords.corrective;
    return msg_has_words(json, wordArray);
}

function msg_is_merge(json) {
    let wordArray = Keywords.merge;
    return msg_has_words(json, wordArray);
}

function msg_is_non_fonctional(json) {
    let wordArray = Keywords["non-functional"];
    return msg_has_words(json, wordArray);
}

function msg_is_perfective(json) {
    let wordArray = Keywords.perfective;
    return msg_has_words(json, wordArray);
}

function msg_is_preventive(json) {
    let wordArray = Keywords.preventive;
    return msg_has_words(json, wordArray);
}

function msg_is_refactoring(json) {
    let wordArray = Keywords.refactoring;
    return msg_has_words(json, wordArray);
}

function msg_has_feature_addition(json) {
    let wordArray = Keywords["feature-addition"];
    return msg_has_words(json, wordArray);
}

module.exports = {
    start: startComputeMetrics,
    get_first_revision_kind: get_first_revision_kind,
    get_first_revision: get_first_revision,
    get_first_revision_number: get_first_revision_number,
    get_first_revision_id: get_first_revision_id
};
