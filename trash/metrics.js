const stringify = require("json-stringify-pretty-compact");
const Mongoose = require('mongoose');
const Moment = require('moment');
const MathJs = require('mathjs');
const fsExtra = require("fs-extra");
const path = require('path');
const fs = require('fs');

//variable globale
let metricsUserJson = {};
let socialGraphAccountJson = {};
let socialGraphMessageJson = {};

//lire les fichiers
let pathRacine = "/Users/jeefer/Workplace/data/libreoffice/abandoned-changes/";
let racinePath = "/Users/jeefer/Workplace/data/libreoffice/";
let abandonedPath = racinePath + "abandoned-changes/";
let mergedPath = racinePath + "merged-changes/";
let openPath = racinePath + "open-changes/";

//mainFunction();
createCSV();

function mainFunction() {
    return getFiles(openPath)
        .then(response => {
            return getFiles(abandonedPath);
        })
        .then(response => {
            return getFiles(mergedPath);
        })
        .then(response => {
            compute_min_max_moy_std(metricsUserJson);
            saveJsonToFile("metrics", metricsUserJson);
            saveJsonToFile("socialGraphAccountJson", socialGraphAccountJson);
            //let csv = jsonToCsv(socialGraphAccountJson);
            //saveFile("socialGraphAccountCSV", csv, "csv");
        })
        .catch(err => {
            console.log(err)
        });
}

function createCSV() {
    let json = require('./data/socialGraphAccountJson.json')
    let array = createCSVArray(json);
    let csv = arrayToCSV(array);
    saveFile("socialGraphAccountCSV", csv, "csv");
    console.log("createCSV finished");
}

/*getFiles(pathRacine)
    .then(response => {
        compute_min_max_moy_std(metricsUserJson);
        //let output = stringify(metricsUserJson, {maxLength: 1000, indent: 2});
        saveFiles("metrics", metricsUserJson);
        saveFiles("socialGraphAccountJson", socialGraphAccountJson);
        //saveFiles("socialGraphMessageJson", socialGraphMessageJson);
    });*/

function getFilePath(path, filename) {
    return path + filename;
}

function getFiles(path) {
    return fs.promises.readdir(path)
        .then(filenames => {
            let promiseArray = []
            for (let filename of filenames) {
                let promise = getInformationInFiles(path, filename);
                promiseArray.push(promise);
            }
            return Promise.all(promiseArray);
        }).catch(err => {
            console.log(err)
        });
}

function getInformationInFiles(path, filename) {
    console.log(path + filename);
    if (filename.includes(".DS_Store"))
        return;
    let json = JSON.parse(fs.readFileSync(getFilePath(path, filename), 'utf8'));
    //console.log(json);
    let promiseArray = []

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            //processPatchData(json[key]);
            let promise1 = processOwnerData(json[key]);
            let promise2 = processReviewerData(json[key]);
            let promise3 = computeSocialGraph(json[key]);

            promiseArray.push(promise1);
            promiseArray.push(promise2);
            promiseArray.push(promise3);
        }
    }

    return Promise.all(promiseArray);
}

function computeSocialGraph(json) {
    let accountId = json.owner._account_id;
    if (!socialGraphAccountJson[accountId])
        socialGraphAccountJson[accountId] = {};
    //reviewers
    let reviewers = getReviewers(json);
    for (let key in reviewers) {
        let reviewerId = reviewers[key]._account_id;
        if (!socialGraphAccountJson[reviewerId])
            socialGraphAccountJson[reviewerId] = {};
        add_social_graph_unit(accountId, reviewerId, socialGraphAccountJson);

        for (let key2 in reviewers) {
            let reviewerId2 = reviewers[key2]._account_id;
            if (!socialGraphAccountJson[reviewerId2])
                socialGraphAccountJson[reviewerId2] = {};
            add_social_graph_unit(reviewerId, reviewerId2, socialGraphAccountJson);
        }
    }
}

function add_social_graph_unit(accountId, reviewerId, outputJson) {

    /*if (accountId === reviewerId)
        return;*/

    if (!outputJson[accountId]) {
        outputJson[accountId] = {};
    }

    if (!outputJson[reviewerId]) {
        outputJson[reviewerId] = {};
    }

    if (outputJson[accountId][reviewerId])
        outputJson[accountId][reviewerId] += 1;
    else
        outputJson[accountId][reviewerId] = 1;

    if (outputJson[reviewerId][accountId])
        outputJson[reviewerId][accountId] += 1;
    else
        outputJson[reviewerId][accountId] = 1;
}


function compute_min_max_moy_std(json) {
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            compute_min_max_moy_std_number_of_commits(json[key]);
            compute_min_max_moy_std_subject(json[key]);
            compute_min_max_moy_std_subject_word_count(json[key]);
            compute_min_max_moy_std_diff_time(json[key]);
        }
    }
}

function compute_min_max_moy_std_base(outputJson, text) {
    let arrayOfCommits = outputJson[text];
    //console.log(arrayOfCommits);
    if (outputJson[text]) {
        if (outputJson[text].length !== 0) {
            //max
            outputJson["max_" + text] = MathJs.max(arrayOfCommits);
            //min
            outputJson["min_" + text] = MathJs.min(arrayOfCommits);
            //moy
            outputJson["moy_" + text] = MathJs.mean(arrayOfCommits);
            //std
            outputJson["std_" + text] = MathJs.std(arrayOfCommits);
        }
    }
    outputJson[text] = JSON.stringify(arrayOfCommits);
}

function add_account_id(json, accountId) {
    json[accountId] = accountId;
}

function is_a_bot(inputJson, outputJson) {
    if (inputJson.owner.name === "Jenkins" || inputJson.owner.name === "Pootle bot")
        outputJson["is_a_bot"] = 1;
    else
        outputJson["is_a_bot"] = 0;
}

function number_of_changes_base(outputJson, text) {
    if (outputJson[text])
        outputJson[text] += 1;
    else
        outputJson[text] = 1;
}

function number_of_changes_as_owner(outputJson) {
    number_of_changes_base(outputJson, "number_of_changes_as_owner");
}

function number_of_changes_as_submitter(inputJson, outputJson) {
    if (inputJson.submitter) {
        let submitterId = inputJson.submitter._account_id;
        if (submitterId === inputJson.owner._account_id)
            if (outputJson["number_of_changes_as_submitter"])
                outputJson["number_of_changes_as_submitter"] += 1;
            else
                outputJson["number_of_changes_as_submitter"] = 1;
    }
}

function number_of_types_of_changed(inputJson, outputJson) {
    if (inputJson.status === "NEW") {
        if (outputJson["number_of_wip_as_owner"])
            outputJson["number_of_wip_as_owner"] += 1;
        else
            outputJson["number_of_wip_as_owner"] = 1;
    } else if (inputJson.status === "MERGED") {
        if (outputJson["number_of_merged_as_owner"])
            outputJson["number_of_merged_as_owner"] += 1;
        else
            outputJson["number_of_merged_as_owner"] = 1;
    } else if (inputJson.status === "ABANDONED") {
        if (outputJson["number_of_abandoned_as_owner"])
            outputJson["number_of_abandoned_as_owner"] += 1;
        else
            outputJson["number_of_abandoned_as_owner"] = 1;
    }

}

function number_of_commits_per_changes_as_owner(inputJson, outputJson) {
    let count = num_commits(inputJson);
    if (outputJson["number_of_commits_per_changes_as_owner"])
        outputJson["number_of_commits_per_changes_as_owner"].push(count);
    else {
        outputJson["number_of_commits_per_changes_as_owner"] = [count];
    }
}

function compute_min_max_moy_std_number_of_commits(outputJson) {
    compute_min_max_moy_std_base(outputJson, "number_of_commits_per_changes_as_owner");
}

function subject_length(inputJson, outputJson) {
    let count = countSubjectLength(inputJson);
    if (outputJson["subject_length_as_owner"])
        outputJson["subject_length_as_owner"].push(count);
    else {
        outputJson["subject_length_as_owner"] = [count];
    }
}

function compute_min_max_moy_std_subject(outputJson) {
    compute_min_max_moy_std_base(outputJson, "subject_length_as_owner");
}

function subject_word_count(inputJson, outputJson) {
    let count = numberOfWordInSubject(inputJson);
    if (outputJson["subject_word_count_as_owner"])
        outputJson["subject_word_count_as_owner"].push(count);
    else {
        outputJson["subject_word_count_as_owner"] = [count];
    }
}

function compute_min_max_moy_std_subject_word_count(outputJson) {
    compute_min_max_moy_std_base(outputJson, "subject_word_count_as_owner");
}

function diff_created_submitted_as_owner(inputJson, outputJson) {
    let count = diffCreatedSubmittedTime(inputJson);
    if (outputJson["diff_created_submitted_as_owner"])
        outputJson["diff_created_submitted_as_owner"].push(count);
    else {
        outputJson["diff_created_submitted_as_owner"] = [count];
    }
}

function diff_submitted_updated_as_owner(inputJson, outputJson) {
    let count = diffSubmittedUpdatedTime(inputJson);
    if (outputJson["diff_submitted_updated_as_owner"])
        outputJson["diff_submitted_updated_as_owner"].push(count);
    else {
        outputJson["diff_submitted_updated_as_owner"] = [count];
    }
}

function diff_created_updated_as_owner(inputJson, outputJson) {
    let count = diffCreatedUpdatedTime(inputJson);
    if (outputJson["diff_created_updated_as_owner"])
        outputJson["diff_created_updated_as_owner"].push(count);
    else {
        outputJson["diff_created_updated_as_owner"] = [count];
    }
}

function compute_min_max_moy_std_diff_time(outputJson) {
    compute_min_max_moy_std_base(outputJson, "diff_created_submitted_as_owner");
    compute_min_max_moy_std_base(outputJson, "diff_submitted_updated_as_owner");
    compute_min_max_moy_std_base(outputJson, "diff_created_updated_as_owner");
}

function processOwnerData(json) {
    //let resultJson = {};
    let accountId = json.owner._account_id;
    if (!metricsUserJson[accountId])
        metricsUserJson[accountId] = {};

    //accountId
    add_account_id(metricsUserJson[accountId], accountId)
    //is a bot
    is_a_bot(json, metricsUserJson[accountId]);
    //number of changes
    number_of_changes_as_owner(metricsUserJson[accountId])
    //submitter
    number_of_changes_as_submitter(json, metricsUserJson[accountId]);
    //number_of_merged_changed
    number_of_types_of_changed(json, metricsUserJson[accountId]);
    //number_of_commits_per_changes_as_owner
    number_of_commits_per_changes_as_owner(json, metricsUserJson[accountId]);
    //subject_length
    subject_length(json, metricsUserJson[accountId]);
    //subject_word_count
    subject_word_count(json, metricsUserJson[accountId]);

    //time
    diff_created_submitted_as_owner(json, metricsUserJson[accountId]);
    diff_submitted_updated_as_owner(json, metricsUserJson[accountId]);
    diff_created_updated_as_owner(json, metricsUserJson[accountId]);

    //subsystem
    count_number_of_project(json, metricsUserJson[accountId]);
}

function processReviewerData(json) {
    //reviewers
    let reviewers = getReviewers(json);
    for (let key in reviewers) {
        let accountId = reviewers[key]._account_id;
        if (!metricsUserJson[accountId])
            metricsUserJson[accountId] = {};

        //accountId
        add_account_id(metricsUserJson[accountId], accountId)

        //is a bot
        if (reviewers[key].name === "Jenkins" || reviewers[key].name === "Pootle bot")
            metricsUserJson[accountId]["is_a_bot"] = 1;
        else
            metricsUserJson[accountId]["is_a_bot"] = 0;

        number_of_changes_as_reviewer(metricsUserJson[accountId]);

    }

}

function number_of_changes_as_reviewer(outputJson) {
    if (outputJson["number_of_changes_as_reviewer"])
        outputJson["number_of_changes_as_reviewer"] += 1;
    else
        outputJson["number_of_changes_as_reviewer"] = 1;
}

//count the number of time of subsystem
function count_number_of_project(inputJson, outputJson) {
    let project = inputJson.project;
    if (outputJson["list_of_subsystem"]) {
        if (!outputJson["list_of_subsystem"].includes(project)) {
            outputJson["list_of_subsystem"].push(project);
            outputJson["number_of_subsystem"] += 1;
        }
    } else {
        outputJson["list_of_subsystem"] = [project];
        outputJson["number_of_subsystem"] = 1;
    }
}


function processPatchData(json) {
    let descriptionLength = countSubjectLength(json);
    let descriptionWord = numberOfWordInSubject(json);
    let submitter = getSubmitterId(json);
    //let reviewers = getReviewersId(json);
    let time = diffCreatedSubmittedTime(json);
    let countFile = num_files(json);
    let fileExtension = num_type_files(json);
    let fileList = files_list(json);
    console.log(fileList);
    //console.log(descriptionLength + " " + descriptionWord + " " + submitter + " " + reviewers);
}

//Word dimension

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

function has_word(text, word) {
    let txt = word.lowercase;
    return txt.includes(text);
}

function has_bug(text) {
    return has_word(text, "bug");
}

function has_feature(text) {
    return has_word(text, "feature");
}

function has_improve(text) {
    return has_word(text, "improve");
}

function has_document(text) {
    return has_word(text, "document");
}

function has_refactor(text) {
    return has_word(text, "refactor");
}

//code dimension
function path_set_number(json) {
    return json._number;
}

function num_lines_added(json) {
    return json.insertions;
}

function num_lines_deleted(json) {
    return json.deletions;
}

function diff_lines_added_lines_deleted(json) {
    return num_lines_added(json) - num_lines_deleted(json);
}

function num_commits(json) {
    let revisions = json.revisions
    return Object.keys(revisions).length;
}

/*function files_list(json) {
    let revisions = json.revisions
    let filesPerRevisionsArray = [];
    for (let key in revisions) {
        let files = revisions[key].files;
        let filesArray = [];
        for (let index in files) {
            filesArray.push(index);
        }
        filesPerRevisionsArray.push(filesArray);
    }
    return filesPerRevisionsArray;
}*/

function files_list(json) {
    let revisions = json.revisions
    let filesArray = [];
    for (let key in revisions) {
        let files = revisions[key].files;
        for (let index in files) {
            if (!filesArray.includes(index))
                filesArray.push(index);
        }
    }
    return filesArray;
}

function num_files(json) {
    let revisions = json.revisions
    let numberOfFilesArray = [];
    for (let key in revisions) {
        let files = revisions[key].files;
        let numberOfFile = Object.keys(files).length;
        numberOfFilesArray.push(numberOfFile)
    }
    return numberOfFilesArray;
}

function num_type_files(json) {
    let revisions = json.revisions
    let numberOfTypesFilesArray = [];
    for (let key in revisions) {
        let files = revisions[key].files;
        let filesExtJson = {};
        /*
        let numberOfFile = Object.keys(files).length;
        for (let index in files) {
            let ext = index.substr(index.lastIndexOf('.') + 1);
            if (filesExtJson[ext]) {
                if (filesExtJson[ext].number)
                    filesExtJson[ext].number = filesExtJson[ext].number + 1;
                else
                    filesExtJson[ext] = {"number": 1};
            } else {
                filesExtJson[ext] = {"number": 1};
            }
        }*/

        for (let index in files) {
            let ext = index.substr(index.lastIndexOf('.') + 1);
            if (filesExtJson[ext]) {
                filesExtJson[ext] = filesExtJson[ext] + 1;
            } else {
                filesExtJson[ext] = 1;
            }
        }
        numberOfTypesFilesArray.push(filesExtJson);
    }
    return numberOfTypesFilesArray;
}

function count_sub_system(json) {

}

//Owner dimension

function getOwnerId(json) {
    return json.owner._account_id;
}

function getSubmitterId(json) {
    return json.submitter._account_id;
}

function getReviewers(json) {
    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []

    for (let id in reviewers) {
        //console.log(reviewers[id]);
        reviewerArray.push(reviewers[id])
    }

    return reviewerArray;
}

function getReviewersId(json) {
    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []

    for (let id in reviewers) {
        //console.log(reviewers[id]);
        reviewerArray.push(reviewers[id]._account_id)
    }

    return reviewerArray;
}

function diffCreatedUpdatedTime(json) {
    let createdTime = Moment(json.created);
    let updatedTime = Moment(json.updated);
    //return Moment.duration(createdTime.diff(updatedTime));
    return Math.abs(createdTime.toDate() - updatedTime.toDate());
}

function diffCreatedSubmittedTime(json) {
    let createdTime = Moment(json.created);
    let submittedTime = Moment(json.submitted);
    //return Moment.duration(createdTime.diff(submittedTime)).asMilliseconds();
    return Math.abs(createdTime.toDate() - submittedTime.toDate());
}

function diffSubmittedUpdatedTime(json) {
    let submittedTime = Moment(json.submitted);
    let updatedTime = Moment(json.updated);
    //return Moment.duration(updatedTime.diff(submittedTime));
    return Math.abs(updatedTime.toDate() - submittedTime.toDate());
}

function numberOfCommit(json) {

}

//get the json

//collecter les données dans une BD

///Save files

function saveFile(name, data, ext) {
    let fileName = "data/" + name + "." + ext;
    let dt = JSON.stringify(data, null, 2);
    fsExtra.ensureDirSync("data");
    fs.writeFile(fileName, dt, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

function saveJsonToFile(name, json) {
    saveFile(name, json, "json");
}

//
function prettyPrintArray(json) {
    if (typeof json === 'string') {
        json = JSON.parse(json);
    }
    output = JSON.stringify(json, function (k, v) {
        if (v instanceof Array)
            return JSON.stringify(v);
        return v;
    }, 2).replace(/\\/g, '')
        .replace(/\"\[/g, '[')
        .replace(/\]\"/g, ']')
        .replace(/\"\{/g, '{')
        .replace(/\}\"/g, '}');

    return output;
}

//json to csv
/*function jsonToCsv(inputJson) {
    let json = inputJson.items
    let fields = Object.keys(json[0])
    let replacer = function (key, value) {
        return value === null ? '' : value
    }
    let csv = json.map(function (row) {
        return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    return csv
}*/

function createCSVArray(json) {
    //console.log(json)
    let listOfUser = []
    let csvArray = [];
    let count = 0;
    for (let key in json) {
        listOfUser.push(key);
        csvArray[count] = [];
        count += 1;
    }
    //console.log(listOfUser);
    //let csvArray = new Array(count);
    let firstLine = listOfUser.slice();
    firstLine.unshift("0")
    csvArray[0] = [];
    csvArray[0].push(firstLine);
    //console.log(firstLine);

    let i = 1;
    for (let id1 in listOfUser) {
        let newArray = []
        let userId1 = listOfUser[id1]
        newArray.push(userId1);
        //console.log(newArray);
        for (let id2 in listOfUser) {
            //let userIdJson = json[userId];
            let userId2 = listOfUser[id2]
            let number = 0;
            if (json[[userId1]])
                if (json[userId1][userId2]) {
                    number = json[userId1][userId2];
                }
            else
                number = 0
            newArray.push(number);
        }
        csvArray[i] = [];
        csvArray[i].push(newArray);
        i++;
    }

    //console.log(csvArray);
    return csvArray;
}

function arrayToCSV(array) {
    //let csvContent = "data:text/csv;charset=utf-8,";
    let csvContent = "";

    array.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + '\r\n';
    });

    return csvContent;
}