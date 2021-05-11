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
let projectApiUrl = libreOfficeJson["projectApiUrl"];
let projectName = libreOfficeJson["projectName"];

let DATA_PATH = "data/"
let STARTING_POINT = 0;
let NUM_OF_CHANGES_LIMIT = 35000;
let NUMBER_DATABASE_REQUEST = 2;
let metricsJson = {};
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
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            //NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUMBER_DATABASE_REQUEST);
            NUM_OF_CHANGES_LIMIT = 10000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT);
        })
        .then(() => {
            let name = projectName + "-simple-metrics";
            let path = PathLibrary.join(DATA_PATH, projectName);
            return Utils.saveJSONInFile(path, name, metricsJson);
        })
        .then(() => {
            //free memory
            Object.keys(metricsJson).forEach(function (key) {
                delete metricsJson[key];
            })
            metricsJson = null;
            progressBar.stop();
            console.log("Finished !!!!");
            //return Database.freeMemory();
        })
        .then(() => {
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip) {
    return Change
        .aggregate([
            {$sort: {updated: 1, _number: 1}},
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
            metricsJson[json.id] = json;
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

//function (checkMetrics)

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
}

/**
 * @param {JSON} json Input Json
 * @param {JSON} metric Output Json
 */
function collectTimeMetrics(json, metric) {
    metric["date_created"] = json.created;
    metric["date_created_time"] = get_date_created_time(json);
    metric["date_updated"] = json.updated;
    metric["date_updated_time"] = get_date_updated_time(json);
    metric["date_commit"] = get_commit_date(json);
    metric["date_commit_time"] = get_commit_date_time(json);
    metric["days_of_the_weeks_of_date_created"] = get_days_of_the_weeks_date_created(json);
    metric["days_of_the_weeks_of_date_updated"] = get_days_of_the_weeks_date_updated(json);
    metric["is_created_date_a_weekend"] = is_created_date_a_weekend(json);
    metric["is_updated_date_a_weekend"] = is_updated_date_a_weekend(json);
    metric["committer_timezone"] = get_timezone(json).committer;
    metric["author_timezone"] = get_timezone(json).author;

    //metrics to forecast
    metric["diff_created_updated"] = diffCreatedUpdatedTime(json);
    metric["diff_created_updated_in_days"] = diff_date_days(json);
    metric["diff_created_updated_in_days_ceil"] = MathJs.ceil(diff_date_days(json));
    //metric["date_submitted"] = get_date_submitted(json);
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
}

/**
 * @param {JSON} json Input Json
 * @param {JSON} metric Output Json
 */
function collectOwnerMetrics(json, metric) {
    metric["is_a_bot"] = MetricsUtils.isABot(json.owner, projectName);
    metric["num_human_reviewer"] = MetricsUtils.getHumanReviewersCount(json, projectName);
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
}

// date
function get_date_submitted(json) {
    return (json.submitted) ? json.submitted : 0;
}

function get_date_created_time(json) {
    return Moment(json.created).toDate().getTime();
}

function get_date_updated_time(json) {
    return Moment(json.updated).toDate().getTime();
}

function get_days_of_the_weeks(json) {
    return Moment(json.created).isoWeekday();
}

function get_days_of_the_weeks_date_created(json) {
    return Moment(json.created).isoWeekday();
}

function get_days_of_the_weeks_date_updated(json) {
    return Moment(json.updated).isoWeekday();
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
    return Moment(date).toDate().getTime()
}

function is_created_date_a_weekend(json) {
    let date = Moment(json.created).isoWeekday();
    return (date === 6) || (date === 7)
}

function is_updated_date_a_weekend(json) {
    let date = Moment(json.updated).isoWeekday();
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
            //console.log("rev_experience" + average(rev_experience));

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

    //console.log("MathJs.mean(number_per_review) " + MathJs.mean(number_per_review));
    //console.log("MathJs.mean(time_per_review) " + MathJs.mean(time_per_review));

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


function get_files_info(json) {

    let revisions = json.revisions
    let fileInfo = {};
    let filesJson = {};
    let filesExtJson = {};
    let directoryJson = {};
    let addFiles = [];
    let removeFiles = [];

    fileInfo.num_files = 0;
    fileInfo.num_files_type = 0;
    fileInfo.num_file_added = 0;
    fileInfo.num_file_deleted = 0;
    fileInfo.num_binary_file = 0;
    fileInfo.num_programming_language = 0;

    //let insertions = json.insertions;
    //let deletions = json.deletions;
    //let som = insertions + deletions
    let modificationArray = [];
    let entropyArray = [];

    fileInfo.modify_entropy = 0;

    for (let key in revisions) {

        //Get only the first revision
        let revision_number = revisions[key]._number;
        if (revision_number !== 1)
            continue;

        let files = revisions[key].files;
        let num_lines_added_for_all_files = 0;
        let num_lines_deleted_for_all_files = 0;
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
            if (filesExtJson[ext]) {
                filesExtJson[ext] = filesExtJson[ext] + 1;
            } else {
                filesExtJson[ext] = 1;
            }

            //count dir
            let dir = index.substr(0, index.lastIndexOf('/') + 1);
            //console.log("dir : " + dir);
            if (directoryJson[dir]) {
                directoryJson[dir] = directoryJson[dir] + 1;
            } else {
                directoryJson[dir] = 1;
            }

            //count files
            if (filesJson[index]) {
                filesJson[index] = filesJson[index] + 1;
            } else {
                filesJson[index] = 1;
            }

            let number = plusFn(files[index].lines_inserted, files[index].lines_deleted);
            //console.log("number" + number);
            modificationArray.push(number);
        }

        //calculate the entropy
        let entropy = calculate_entropy(modificationArray);
        entropyArray.push(entropy);

    }

    fileInfo.num_files = Object.keys(filesJson).length;
    fileInfo.num_files_type = Object.keys(filesExtJson).length;
    fileInfo.num_file_added = Object.keys(addFiles).length;
    fileInfo.num_file_deleted = Object.keys(removeFiles).length;
    fileInfo.num_directory = Object.keys(directoryJson).length;
    fileInfo.modify_entropy = average(entropyArray);

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

function is_owner_a_bot(json) {
    let owner = json.owner;
    return (owner.email) ? 0 : 1;
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
    let createdTime = Moment(json.created);
    let updatedTime = Moment(json.updated);
    return Math.abs(createdTime.toDate() - updatedTime.toDate());
}

function diff_date_days(json) {
    let createdTime = Moment(json.created).toDate();
    let updatedTime = Moment(json.updated).toDate();
    let time = Math.abs(createdTime - updatedTime);
    return Moment.duration(time).asDays();
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

function get_commit_msg(json) {
    let revisions = json.revisions;
    let messages = [];
    for (let i in revisions) {
        let revision = revisions[i];
        if (revision.commit) {
            let message = revision.commit.message;
            messages.push(message);
        }
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

    return num > 0;
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

module.exports = {
    start: startComputeMetrics
};