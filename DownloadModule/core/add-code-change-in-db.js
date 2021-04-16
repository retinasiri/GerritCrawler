const Mongoose = require('mongoose');
const fs = require('fs');
const dbUtils = require('../config/dbUtils');
const Utils = require('../config/utils')
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');

//lire les fichiers
let DATA_PATH = "data/";
let projectName = "libreoffice";

let account = {};
let botAccount = {};
let humanAccount = {};

let projectDBUrl = Database.qtDbUrl;
let projectApiUrl = ApiEndPoints.qtApiUrl;

/*addChangeInDB(projectDBUrl)
    .catch(err => {
        console.log(err)
    });*/

function addChangesInDB(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["directory"])
        DATA_PATH = json["directory"];

    projectName = Utils.getProjectName(ApiEndPoints.getProjectsUrl(projectApiUrl));

    return Database.dbConnection(projectDBUrl).then(() => {
        console.log("Start !!!!");
        return getFilesLoad()
    })
        .then(() => {
            // save file of account
            let promises = [];
            let path = DATA_PATH + projectName + "/"
            promises.push(Utils.saveJSONInFile(path, projectName + "-account", account));
            promises.push(Utils.saveJSONInFile(path, projectName + "-bot-account", botAccount));
            promises.push(Utils.saveJSONInFile(path, projectName + "-human-account", humanAccount));
            return Promise.all(promises);
        })
        .then(() => {
            console.log("Finished !!!!");
            return Mongoose.connection.close();
        })
        .catch(err => {
            console.log(err)
        });
}

function getFilesLoad() {
    console.log("Adding Open Changes !!!!");
    return getFiles(getOpenPath())
        .then(response => {
            console.log("Adding Abandoned Changes !!!!");
            return getFiles(getAbandonedPath());
        })
        .then(response => {
            console.log("Adding Merged Changes !!!!");
            return getFiles(getMergedPath());
        })
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
    //let promiseArray = []

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            //Add user
            let changeJson = json[key]
            let participants = getParticipants(changeJson);
            //promiseArray.push(addParticipantsInDB(participants));
            //Add changes
            //promiseArray.push(saveChangeInDB(changeJson));
            await addParticipantsInDB(participants);
            await saveChangeInDB(changeJson);
        }
    }
    return Promise.resolve(true);
    //return Promise.all(promiseArray);
}

function getFilePath(path, filename) {
    return path + filename;
}

function saveChangeInDB(json) {
    return dbUtils.saveChange(json);
}

async function addParticipantsInDB(participants) {
    //let promises = [];
    for (let id in participants) {

        account[participants[id]._account_id] = participants[id];

        if (participants[id].email)
            humanAccount[participants[id]._account_id] = participants[id];
        else
            botAccount[participants[id]._account_id] = participants[id];

        //promises.push(dbUtils.saveAccount(participants[id]));
        await dbUtils.saveAccount(participants[id])
    }
    return Promise.resolve(true);
    //return Promise.all(promises);
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

function getAbandonedPath() {
    return DATA_PATH + projectName + "/abandoned-changes/";
}

function getMergedPath() {
    return DATA_PATH + projectName + "/merged-changes/";
}

function getOpenPath() {
    return DATA_PATH + projectName + "/open-changes/";
}

module.exports = {
    start: addChangesInDB
};