const Mongoose = require('mongoose');
const Moment = require('moment');
const MathJs = require('mathjs');
const dbUtils = require('./config/dbUtils');
const Database = require('./config/databaseConfig');
const Change = require('./models/change');
const Metrics = require('./models/metrics');
const Utils = require('./config/utils');

let projectDBUrl = Database.libreOfficeDBUrl;

let NUM_DAYS_FOR_RECENT = 120;
let NUM_OF_CHANGES_LIMIT = 2000;

let metricsJson = {};

let i = 0;

mainFunction()
    .then(() => {
        console.log("Finished!!!!");
    })
    .catch(err => {
        console.log(err)
    });

function mainFunction() {
    dbConnection();
    return getChanges()
        .then(() => {
            return Utils.saveJsonToFile("metrics", metricsJson);
        })
        .catch(err => {
            console.log(err)
        });
}

function dbConnection() {
    return Mongoose.connect(projectDBUrl,
        {useNewUrlParser: true, useUnifiedTopology: true},
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Connected to the database");
            }
        });
}

//get changes id
function getChanges() {
    return Change
        .find({})
        .sort({'created': 1})
        .limit(NUM_OF_CHANGES_LIMIT)
        .exec()
        .then(docs => {
            /*for (let key in docs) {
                console.log("doc : " + docs[key].created);
            }*/
            return collectDocs(docs);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return;
    let promiseArray = []
    for (let key in docs) {
        let promise = await collectMetrics(docs[key]).then((json) => {
            return saveMetrics(json);
        });
        promiseArray.push(promise);
    }
    return Promise.all(promiseArray);
}

function saveMetrics(json) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            console.log('Metrics saved : ' + json.id)
        });
}

async function collectMetrics(json) {

    console.log(i + "/" + NUM_OF_CHANGES_LIMIT);
    i++;

    let metric = {};

    metric["n"] = i;
    metric["number"] = json._number;
    metric["id"] = json.id;
    metric["change_id"] = json.change_id;
    metric["date_created"] = json.created;
    metric["date_updated"] = json.updated;
    metric["date_submitted"] = get_date_submitted(json);
    metric["date_created_time"] = get_date_created_time(json);
    metric["date_updated_time"] = get_date_updated_time(json);
    metric["diff_created_updated"] = diffCreatedUpdatedTime(json);
    metric["lines_added_num"] = json.insertions;
    metric["lines_deleted_num"] = json.deletions;
    metric["subject_length"] = countSubjectLength(json);
    metric["subject_word_count"] = numberOfWordInSubject(json);

    let fileInfo = get_files_info(json);

    metric["num_files"] = fileInfo.num_files;
    metric["num_files_type"] = fileInfo.num_files_type;
    metric["num_directory"] = fileInfo.num_directory;
    metric["num_file_added"] = fileInfo.num_file_added;
    metric["num_file_deleted"] = fileInfo.num_file_deleted;
    metric["num_binary_file"] = fileInfo.num_binary_file;

    metric["num_subsystem"] = num_subsystem(json);
    metric["is_a_bot"] = is_a_bot(json);
    /*metric["modify_entropy"] = get_modify_entropy(json);
    metric["num_language"] = get_num_language(json);
    metric["num_lines_added"] = get_num_segs_added(json);
    metric["num_lines_deleted"] = get_num_segs_deleted(json);
    metric["changes_files_modified"] = get_changes_files_modified(json);

    metric["file_developer_num"] = get_file_developer_num(json);
    metric["change_num"] = get_change_num(json);
    metric["recent_change_num"] = get_recent_change_num(json);
    metric["subsystem_change_num"] = get_subsystem_change_num(json);
    metric["review_num"] = get_review_num(json);
    metric["merged_ratio"] = get_merged_ratio(json);
    metric["recent_merged_ratio"] = get_recent_merged_ratio(json);
    metric["subsystem_merged_ratio"] = get_subsystem_merged_ratio(json);

    metric["msg_length"] = get_msg_length(json);
    metric["has_bug"] = get_has_feature(json);
    metric["has_feature"] = get_has_feature(json);
    metric["has_improve"] = get_has_improve(json);
    metric["has_document"] = get_has_document(json);
    metric["has_refactor"] = get_has_refactor(json);*/

    return metric;
}

function get_date_submitted(json) {
    if (json.submitted)
        return json.submitted;
    else
        return 0;
}

function get_date_created_time(json) {
    return Moment(json.created).toDate().getTime();
}

function get_date_updated_time(json) {
    return Moment(json.updated).toDate().getTime()
}

//function

function countSubjectLength(json) {
    return countLetter(json.subject);
}

function numberOfWordInSubject(json) {
    return countWord(json.subject);
}

function countLetter(word) {
    if (word)
        return word.length;
    else
        return 0;
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

function diffCreatedUpdatedTime(json) {
    let createdTime = Moment(json.created);
    let updatedTime = Moment(json.updated);
    return Math.abs(createdTime.toDate() - updatedTime.toDate());
}

function is_a_bot(json) {
    let owner = json.owner;
    if (owner.email)
        return 0;
    else
        return 1;
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
    fileInfo.num_segs_added = 0;

    for (let key in revisions) {
        let files = revisions[key].files;
        for (let index in files) {
            let status = files[index].status;
            let filename = files[index];
            if (status) {
                if (status === "A") {
                    if(addFiles.indexOf(index) === -1){
                        addFiles.push(index);
                    }
                } else if (status === "D") {
                    if(removeFiles.indexOf(index) === -1){
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
        }
    }

    fileInfo.num_files = Object.keys(filesJson).length;
    fileInfo.num_files_type = Object.keys(filesExtJson).length;
    fileInfo.num_file_added = Object.keys(addFiles).length;
    fileInfo.num_file_deleted = Object.keys(removeFiles).length;
    fileInfo.num_directory = Object.keys(directoryJson).length;

    return fileInfo;
}


function num_subsystem(json) {
    let subsystem = [];
    subsystem.push(json.project);
    return Object.keys(subsystem).length;
}

async function get_prior_change(json) {
    let inputDate = Moment(json.created).toDate().toISOString();
    //console.log("inputDate : " + inputDate);
    return await Change
        .find({
            'created': {$lte: inputDate}
        })
        .limit(NUM_OF_CHANGES_LIMIT)
        .exec()
        .then(docs => {
            if (!docs)
                return [];
            //console.log("docs" + JSON.stringify(docs));
            return docs;
        })
        .catch(err => {
            console.log(err)
        });
}

function diff_date_days(date1, date2) {
    let time1 = Moment(date1).toDate();
    let time2 = Moment(date2).toDate();
    let time = Math.abs(time1 - time2);
    return Moment.duration(time).asDays();
}

async function review_num(json) {
    let ownerId = json.owner._account_id;
    let date1 = json.created;
    let priorChanges = await get_prior_change(json);
    let change_num = 0;
    let recent_change_num = 0;
    let review_num = 0;
    let recent_review_num = 0;
    let merged_review_num = 0;
    let recent_merged_review_num = 0;
    let merged_ratio = 0;
    let recent_merged_ratio = 0;

    for (let key in priorChanges) {
        let thisOwnerId = priorChanges[key].owner._account_id;
        let date2 = priorChanges[key].created;
        let duration = diff_date_days(date1, date2)

        if (thisOwnerId === ownerId) {
            change_num++;
            if (duration < NUM_DAYS_FOR_RECENT)
                recent_change_num++;

            if (priorChanges[key].status === "MERGED") {
                merged_review_num++;
                if (duration < NUM_DAYS_FOR_RECENT)
                    recent_merged_review_num++;
            }

        }

        let reviewersId = await getReviewersId(json);
        for (let id in reviewersId) {
            if (ownerId === reviewersId[id]) {
                review_num++;
                if (duration < NUM_DAYS_FOR_RECENT)
                    recent_review_num++;
            }
        }
    }

    if (change_num !== 0)
        merged_ratio = merged_review_num / change_num;
    else
        merged_ratio = 0;

    if (recent_review_num !== 0)
        recent_merged_ratio = recent_merged_review_num / recent_review_num;
    else
        recent_merged_ratio = 0;

    let returnJson = {
        change_num: change_num,
        recent_change_num: recent_change_num,
        review_num: review_num,
        recent_review_num: recent_review_num,
        merged_review_num: merged_review_num,
        recent_merged_review_num: recent_merged_review_num,
        merged_ratio: merged_ratio,
        recent_merged_ratio: recent_merged_ratio
    }
    //console.log("returnJson " + JSON.stringify(returnJson));
    return returnJson;
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
