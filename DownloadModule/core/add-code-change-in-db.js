const Mongoose = require('mongoose');
const fs = require('fs');
const dbUtils = require('../config/dbUtils');
const Utils = require('../config/utils')
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');

//lire les fichiers
let racinePath = "/Users/jeefer/Workplace/data/";
let projectName = "libreoffice";

let account = {};
let botAccount = {};
let humanAccount = {};

let projectDBUrl = Database.qtDbUrl;
let projectApiUrl = ApiEndPoints.qtApiUrl;

addChangeInDB(projectDBUrl)
    .then(() => {
        console.log("Finished !!!!");
    })
    .catch(err => {
        console.log(err)
    });

function addChangeInDB(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["racinePath"])
        racinePath = json["racinePath"];

    projectName = ApiEndPoints.getProjectsUrl(projectApiUrl);

    dbConnection(projectDBUrl);
    return getFilesLoad()
        .then(() => {
            // save file of account
            let promises = [];
            promises.push(Utils.saveJsonToFile(projectName + "-account", account));
            promises.push(Utils.saveJsonToFile(projectName + "-bot-account", botAccount));
            promises.push(Utils.saveJsonToFile(projectName + "-human-account", humanAccount));
            return Promise.all(promises);
        });
}

function dbConnection(DBUrl) {
    return Mongoose.connect(DBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Connected to the database");
            return Promise.resolve(true);
        })
        .catch(err => {
            console.log(err)
        });
}

function getFilesLoad() {
    return getFiles(getOpenPath())
        .then(response => {
            return getFiles(getAbandonedPath());
        })
        .then(response => {
            return getFiles(getMergedPath());
        })
        .catch(err => {
            console.log(err)
        });
}

async function getFiles(path) {
    return fs.promises.readdir(path)
        .then(filenames => {
            return info(path, filenames);
        }).catch(err => {
            console.log(err)
        });
}

async function info(path, filenames) {
    for (let filename of filenames) {
        await addInformationToDB(path, filename);
    }
}

async function addInformationToDB(path, filename) {
    console.log(path + filename);
    if (filename.includes(".DS_Store"))
        return;
    let json = JSON.parse(fs.readFileSync(getFilePath(path, filename), 'utf8'));
    let promiseArray = []

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            //Add user
            let participants = getParticipants(json);
            promiseArray.push(addParticipantsInDB(participants));
            //Add changes
            promiseArray.push(addChangeInDB(json[key]));
        }
    }
    return Promise.all(promiseArray);
}

function getFilePath(path, filename) {
    return path + filename;
}

function addChangeInDB(json) {
    return dbUtils.saveChange(json);
}

function addParticipantsInDB(participants) {
    let promises = [];
    for (let id in participants) {

        account[participants[id]._account_id] = participants[id];

        if (participants[id].email)
            humanAccount[participants[id]._account_id] = participants[id];
        else
            botAccount[participants[id]._account_id] = participants[id];

        promises.push(dbUtils.saveAccount(participants[id]));
    }
    return Promise.all(promises);
}

function getParticipants(json) {
    let participant = [];
    let owner = json.owner;
    participant.push(owner);
    let reviewers = json.reviewers.REVIEWER
    for (let id in reviewers) {
        participant.push(reviewers[id])
    }
    return participant;
}

function getAbandonedPath(){
    return racinePath + projectName + "/abandoned-changes/";
}

function getMergedPath(){
    return racinePath + projectName + "/merged-changes/";
}

function getOpenPath(){
    return racinePath + projectName + "/open-changes/";
}

module.exports = {
    addChangeInDB: addChangeInDB
};