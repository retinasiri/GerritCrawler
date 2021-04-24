const Mongoose = require('mongoose');
const fs = require('fs');
const dbUtils = require('../config/dbUtils');
const Utils = require('../config/utils')
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');
const cliProgress = require('cli-progress');


//lire les fichiers
//let DATA_PATH = "data/";
const multibar = new cliProgress.MultiBar({
    format: '{type} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {name}',
    clearOnComplete: false,
    hideCursor: true
}, cliProgress.Presets.shades_classic);
let DATA_PATH = "/Volumes/SEAGATE-II/Data/";
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
        console.log("Adding files to the database !!!!");
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
            multibar.stop();
            console.log("Finished !!!!");
            return Mongoose.connection.close();
        })
        .catch(err => {
            console.log(err)
        });
}

function getFilesLoad() {
    const b1 = multibar.create(0, 0, {type: 'Open Changes     '});
    return getFiles(getOpenPath(), b1)
        .then(() => {
            const b2 = multibar.create(0, 0, {type: 'Abandoned Changes'});
            return getFiles(getAbandonedPath(), b2);
        })
        .then(() => {
            const b3 = multibar.create(0, 0, {type: 'Merged Changes   '});
            return getFiles(getMergedPath(), b3);
        })
}

async function getFiles(path, b) {
    return fs.promises.readdir(path)
        .then(filenames => {
            return info(path, filenames, b);
        }).catch(err => {
            console.log(err)
        });
}

async function info(path, filenames, b) {
    let total =  filenames.length;
    b.setTotal(total)
    for (let filename of filenames) {
        await addInformationToDB(path, filename).then(() => {
            b.increment(1, {name: filename});
        });
    }
}

async function addInformationToDB(path, filename) {
    //console.log(path + filename);
    if (filename.includes(".DS_Store"))
        return Promise.resolve(true);
    let json = JSON.parse(fs.readFileSync(getFilePath(path, filename), 'utf8'));

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            //Add user
            let changeJson = json[key]
            let participants = getParticipants(changeJson);
            changeJson["files_list"] = get_files_list(changeJson);
            await addParticipantsInDB(participants);
            await saveChangeInDB(changeJson);
        }
    }
    return Promise.resolve(true);
}

function getFilePath(path, filename) {
    return path + filename;
}

function saveChangeInDB(json) {
    return dbUtils.saveChange(json);
}

async function addParticipantsInDB(participants) {
    for (let id in participants) {
        account[participants[id]._account_id] = participants[id];
        if (participants[id].email)
            humanAccount[participants[id]._account_id] = participants[id];
        else
            botAccount[participants[id]._account_id] = participants[id];
        await dbUtils.saveAccount(participants[id])
    }
    return Promise.resolve(true);
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

function get_files_list(json) {
    let revisions = json.revisions
    let files_list = [];
    for (let key in revisions) {
        //Get only the first revision
        let revision_number = revisions[key]._number;
        if (revision_number !== 1)
            continue;
        for (let name in revisions[key].files) {
            files_list.push(name + "")
        }
    }
    return files_list;
}