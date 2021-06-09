const Mongoose = require('mongoose');
const fs = require('fs');
const dbUtils = require('../config/dbUtils');
const Utils = require('../config/utils')
const Database = require('../config/databaseConfig');
const cliProgress = require('cli-progress');
const PathLibrary = require('path');
const Message = require('../models/message');
const Changes = require('../models/change');

let DATA_PATH = "data/";

let account = {};
let botAccount = {};
let humanAccount = {};

let projectJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = projectJson["projectDBUrl"];
let projectApiUrl = projectJson["projectApiUrl"];
let projectName = projectJson["projectName"];


const multibar = new cliProgress.MultiBar({
    format: '{type} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {name}',
    barCompleteChar: '#',
    barIncompleteChar: '-',
    clearOnComplete: false,
    hideCursor: true
}, cliProgress.Presets.shades_classic);

function addChangesInDB(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    console.log("Adding files to the database !!!!");

    return Database.dbConnection(projectDBUrl).then(() => {
        return getFilesLoad()
    })
        .then(() => {
            // save file of account
            let promises = [];
            let path = PathLibrary.join(DATA_PATH, projectName);
            promises.push(Utils.saveJSONInFile(path, projectName + "-account", account));
            promises.push(Utils.saveJSONInFile(path, projectName + "-bot-account", botAccount));
            promises.push(Utils.saveJSONInFile(path, projectName + "-human-account", humanAccount));
            promises.push(Utils.saveJSONInFile(path, projectName + "-changes-commit-and-fetch", changes_commit_json));
            promises.push(Utils.saveJSONInFile(path, projectName + "-refspec", refspec));
            promises.push(Utils.saveFile(path, projectName + "-repositories-to-clone", Utils.getSetStr(repositories_list), "txt"))
            return Promise.all(promises);
        })
        .then(() => {
            multibar.stop();
            console.log("Finished !!!!");
            return Database.freeMemory();
        })
        .then(() => {
            return Mongoose.connection.close();
            //return Database.closeConnection();
        })
        .catch(err => {
            console.log("addChangesInDB : " + err)
        });
}

function getFilesLoad() {
    const b1 = multibar.create(0, 0, {type: 'Open Changes     '});
    return getFiles(getOpenPath(), b1)
        //return getFiles(getOpenPath())
        .then(() => {
            const b2 = multibar.create(0, 0, {type: 'Abandoned Changes'});
            return getFiles(getAbandonedPath(), b2);
            //return getFiles(getAbandonedPath());
        })
        .then(() => {
            const b3 = multibar.create(0, 0, {type: 'Merged Changes   '});
            return getFiles(getMergedPath(), b3);
            //return getFiles(getMergedPath());
        })
        .catch(err => {
            console.log("getFilesLoad : " + err)
        });
}

async function getFiles(path, b) {
//async function getFiles(path) {
    //console.log("getFiles : " + path)
    return fs.promises.readdir(path)
        .then(filenames => {
            return info(path, filenames, b);
            //return info(path, filenames);
        }).catch(err => {
            console.log(err)
        })
        .catch(err => {
            console.log("getFiles : " + err)
        });
}

function getLastNumber(filenames){
    filenames.sort((a, b) => a.localeCompare(b, undefined, {numeric: true, ignorePunctuation: true}))
    let lastName = filenames[filenames.length - 1]
    return parseInt(lastName.split("-")[0]);
}

async function info(path, filenames, b) {
    //let total = filenames.length;
    let total = getLastNumber(filenames);
    b.setTotal(total)

    for (let filename of filenames) {
        if (filename.includes(".DS_Store") || filename.includes("._.DS_Store"))
            return Promise.resolve(true);

        if (!filename.includes(".json"))
            return Promise.resolve(true);

        await addInformationToDB(path, filename, b)
            /*.then(() => {
                b.increment(1, {name: filename});
            });
             */
    }
}

async function addInformationToDB(path, filename, b) {

    let json = {}
    try {
        json = JSON.parse(fs.readFileSync(getFilePath(path, filename), 'utf8'));
    } catch (e) {
    }

    if (Object.keys(json).length === 0)
        return Promise.resolve(false);

    let name = b.getTotal() + "-"
    if(filename.includes(name)){
        let total = b.getTotal() + Object.keys(json).length;
        b.setTotal(total)
    }

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            //Add user
            let changeJson = json[key]
            let participants = getParticipants(changeJson);
            changeJson["files_list"] = get_files_list(changeJson);
            let task = [];
            task.push(addParticipantsInDB(participants));
            task.push(collectRepo(changeJson));
            task.push(saveChangeInDB(changeJson));
            await Promise.all(task);
        }
        b.increment(1, {name: filename})
    }
    return Promise.resolve(true);
}

function getFilePath(path, filename) {
    return PathLibrary.join(path, filename)
}

function saveChangeInDB(json) {
    return dbUtils.saveChange(json)
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
    return Promise.resolve(true)
        .catch(err => {
            console.log("saveChangeInDB : " + err)
        });
}

function getParticipants(json) {
    let participant = [];
    let owner = json.owner;
    participant.push(owner);
    if (json.reviewers) {
        let reviewers = json.reviewers.REVIEWER
        for (let id in reviewers) {
            participant.push(reviewers[id])
        }
    } else {
        if(!!!json["labels"]){
            json["reviewers"] = {};
            json["reviewers"]["REVIEWER"] = [];
            return []
        }

        if(!!!json["labels"]["Code-Review"]){
            json["reviewers"] = {};
            json["reviewers"]["REVIEWER"] = [];
            return []
        }

        let codeReviews = json["labels"]["Code-Review"]["all"];

        if(!!!codeReviews){
            json["reviewers"] = {};
            json["reviewers"]["REVIEWER"] = [];
            return []
        }

        let accounts = []

        Object.keys(codeReviews).forEach(function (key) {
            let codeReview = codeReviews[key]
            if (codeReview["_account_id"] !== owner._account_id) {
                let account = {}
                account["_account_id"] = codeReview["_account_id"];
                account["name"] = codeReview["name"];
                account["email"] = codeReview["email"];
                account["username"] = codeReview["username"];
                accounts.push(account);
            }
        })
        json["reviewers"] = {};
        json["reviewers"]["REVIEWER"] = accounts;

        for (let id in accounts) {
            participant.push(accounts[id])
        }
    }

    return participant;
}

function getAbandonedPath() {
    return PathLibrary.join(DATA_PATH, projectName, "abandoned-changes");
}

function getMergedPath() {
    return PathLibrary.join(DATA_PATH, projectName, "merged-changes");
}

function getOpenPath() {
    return PathLibrary.join(DATA_PATH, projectName, "open-changes");
}

function get_files_list(json) {
    let revisions = json.revisions
    let files_list = [];
    if (revisions)
        for (let key in revisions) {
            //Get only the first revision
            let revision_number = revisions[key]._number;
            if (revision_number !== 1) {
                delete revisions[key].files
                continue;
            }
            for (let name in revisions[key].files) {
                files_list.push(name + "")
            }
        }
    return files_list;
}

let changes_commit_json = {}
let repositories_list = new Set()
let refspec = {}

async function collectRepo(doc) {
    let id = doc.id
    changes_commit_json[id] = {}
    let revisions = doc.revisions;
    let fetch_url = "";
    let fetch_refs = "";
    let commit = "";

    if (!revisions)
        return Promise.resolve(true);

    Object.keys(revisions).forEach(function (key) {
        if (revisions[key]) {
            let number = revisions[key]["_number"];
            if (number === 1) {
                let has_commit = !!revisions[key]["commit"];
                if (has_commit) {
                    if (revisions[key]["fetch"])
                        if (revisions[key]["fetch"]["anonymous http"]) {
                            fetch_url = revisions[key]["fetch"]["anonymous http"]["url"];
                            fetch_refs = revisions[key]["fetch"]["anonymous http"]["ref"];
                        } else if (revisions[key]["fetch"]["http"]) {
                            fetch_url = revisions[key]["fetch"]["http"]["url"];
                            fetch_refs = revisions[key]["fetch"]["http"]["ref"];
                        }
                    commit = key;
                    /*if (revisions[key]["commit"]["parents"][0])
                        commit = revisions[key]["commit"]["parents"][0]["commit"];
                    else
                        commit = "parents = " + JSON.stringify(revisions[key]["commit"]["parents"]);
                     */
                }
            }
        }
    })

    changes_commit_json[id]["id"] = id;
    changes_commit_json[id]["fetch_url"] = fetch_url;
    changes_commit_json[id]["fetch_ref"] = fetch_refs;
    changes_commit_json[id]["commit"] = commit
    repositories_list.add(changes_commit_json[id]["fetch_url"]);

    if (!refspec[fetch_url])
        refspec[fetch_url] = {"fetch_url": fetch_url, "fetch_refs": [], "commits": []};

    refspec[fetch_url]["fetch_refs"].push(fetch_refs);
    refspec[fetch_url]["commits"].push(commit);

    return Promise.resolve(true);
}

module.exports = {
    start: addChangesInDB
};

