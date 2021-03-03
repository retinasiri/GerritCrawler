const Mongoose = require('mongoose');
const Moment = require('moment');
const MathJs = require('mathjs');
const dbUtils = require('./config/dbUtils');
const Database = require('./config/databaseConfig');
const Change = require('./models/change');
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
            //let csv = Utils.jsonToCsv(metricsJson);
            //Utils.saveFile("csv_metrics", csv, csv)
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

async function collectDocs(docs){
    if (!docs)
        return;
    let promiseArray = []
    for (let key in docs) {
        let promise = await collectInfo(docs[key]);
        promiseArray.push(promise);
    }
    return Promise.all(promiseArray);
}

async function collectInfo(json) {
    console.log(i + "/" + NUM_OF_CHANGES_LIMIT);
    i++;

    let changeId = json.change_id;
    if (!metricsJson[changeId])
        metricsJson[changeId] = {};

    add_long_id(json, metricsJson[changeId]);
    add_id(json, metricsJson[changeId]);
    add_id_num(json, metricsJson[changeId]);
    add_date_created(json, metricsJson[changeId]);
    add_date_created_time(json, metricsJson[changeId]);
    //add_date_submitted(json, metricsJson[changeId]);
    diff_created_updated(json, metricsJson[changeId]);
    add_lines_added(json, metricsJson[changeId]);
    add_lines_deleted(json, metricsJson[changeId]);
    add_subject_length(json, metricsJson[changeId]);
    add_subject_word_count(json, metricsJson[changeId]);
    add_change_file_count(json, metricsJson[changeId]);
    add_num_files_type(json, metricsJson[changeId]);
    add_num_directory(json, metricsJson[changeId]);
    add_num_subsystem(json, metricsJson[changeId]);
    add_is_a_bot(json, metricsJson[changeId]);
    await add_review_number(json, metricsJson[changeId]);

    add_date_updated(json, metricsJson[changeId]);
    add_date_updated_time(json, metricsJson[changeId]);


}

function add_id(inputJson, outputJson) {
    outputJson["id"] = inputJson.change_id;
}

function add_id_num(inputJson, outputJson) {
    outputJson["id_num"] = inputJson._number;
}

function add_long_id(inputJson, outputJson) {
    outputJson["long_id"] = inputJson.id;
}

function add_date_created(inputJson, outputJson) {
    outputJson["created"] = inputJson.created;
}

function add_date_updated(inputJson, outputJson) {
    outputJson["updated"] = inputJson.updated;
}

function add_date_submitted(inputJson, outputJson) {
    outputJson["submitted"] = inputJson.submitted;
}

function add_date_created_time(inputJson, outputJson) {
    outputJson["time_created"] = Moment(inputJson.created).toDate().getTime();
}

function add_date_updated_time(inputJson, outputJson) {
    outputJson["time_updated"] = Moment(inputJson.updated).toDate().getTime();
}

function diff_created_updated(inputJson, outputJson) {
    outputJson["diff_created_updated"] = diffCreatedUpdatedTime(inputJson);
}

function add_lines_added(inputJson, outputJson) {
    outputJson["lines_added_num"] = inputJson.insertions;
}

function add_lines_deleted(inputJson, outputJson) {
    outputJson["lines_deleted_num"] = inputJson.deletions;
}

function add_subject_length(inputJson, outputJson) {
    outputJson["subject_length"] = countSubjectLength(inputJson);
}

function add_subject_word_count(inputJson, outputJson) {
    outputJson["subject_word_count"] = numberOfWordInSubject(inputJson);
}

function add_change_file_count(inputJson, outputJson) {
    outputJson["num_change_file"] = num_files(inputJson);
}

function add_num_files_type(inputJson, outputJson) {
    outputJson["num_files_type"] = num_files_type(inputJson);
}

function add_num_directory(inputJson, outputJson) {
    outputJson["num_directory"] = num_directory(inputJson);
}

function add_num_subsystem(inputJson, outputJson) {
    outputJson["num_subsystem"] = num_subsystem(inputJson);
}

function add_is_a_bot(inputJson, outputJson) {
    outputJson["is_a_bot"] = is_a_bot(inputJson);
}

async function add_review_number(inputJson, outputJson) {
    let reviewJson = await review_num(inputJson);
    outputJson["change_num"] = reviewJson.change_num;
    outputJson["recent_change_num"] = reviewJson.recent_change_num;
    outputJson["review_num"] = reviewJson.review_num;
    outputJson["recent_review_num"] = reviewJson.recent_review_num;
    outputJson["merged_review_num"] = reviewJson.merged_review_num;
    outputJson["recent_merged_review_num"] = reviewJson.recent_merged_review_num;
    outputJson["merged_ratio"] = reviewJson.merged_ratio;
    outputJson["recent_merged_ratio"] = reviewJson.recent_merged_ratio;
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

function num_files(json) {
    let filesJson = get_files(json);
    return Object.keys(filesJson).length;

    /*for (let key in revisions) {
        let files = revisions[key].files;
        let numberOfFile = Object.keys(files).length;
        numberOfFilesArray.push(numberOfFile)
    }
    return MathJs.max(numberOfFilesArray);*/
}


function num_files_type(json) {
    let revisions = json.revisions
    //let numberOfTypesFilesArray = [];
    let filesExtJson = {};
    for (let key in revisions) {
        let files = revisions[key].files;
        for (let index in files) {
            let ext = index.substr(index.lastIndexOf('.') + 1);
            if (filesExtJson[ext]) {
                filesExtJson[ext] = filesExtJson[ext] + 1;
            } else {
                filesExtJson[ext] = 1;
            }
        }
    }

    return Object.keys(filesExtJson).length;
}

function num_directory(json) {
    let revisions = json.revisions;
    let directoryJson = {};
    for (let key in revisions) {
        let files = revisions[key].files;
        for (let index in files) {
            let dir = index.substr(0, index.lastIndexOf('/') + 1);
            //console.log("dir : " + dir);
            if (directoryJson[dir]) {
                directoryJson[dir] = directoryJson[dir] + 1;
            } else {
                directoryJson[dir] = 1;
            }
        }
    }
    //console.log("directoryJson" + JSON.stringify(directoryJson));
    return Object.keys(directoryJson).length;
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

    let returnJson =  {
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

function changes_files_modified(json) {
    let filesJson = get_files(json);
}