const Axios = require('axios');
const cliProgress = require('cli-progress');
const RateLimit = require('axios-rate-limit');
const PathLibrary = require('path');
const Database = require('../config/databaseConfig');
const fs = require('fs');
const Change = require('../models/change');
const Utils = require("../config/utils");
const dbUtils = require('../config/dbUtils');
const axios = RateLimit(Axios.create(), {maxRPS: 10})

const progressBar = new cliProgress.SingleBar({
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | add : {add} | failed: {failed} | find: {find} | err_429: {err_429} ',
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let prefix = "https://android-review.googlesource.com/changes/?q=change:"
let id = "Ic4d52a8be7cc2f9bbeb260c2506db88712a8d910"
let suffix = "&o=DETAILED_LABELS&o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=DETAILED_ACCOUNTS" +
    "&o=MESSAGES&o=DOWNLOAD_COMMANDS&o=WEB_LINKS&o=CHANGE_ACTIONS&o=REVIEWER_UPDATES&o=COMMIT_FOOTERS&o=PUSH_CERTIFICATES&o=TRACKING_IDS";

let projectJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = projectJson["projectDBUrl"];
let projectApiUrl = projectJson["projectApiUrl"];
let DIRECTORY_NAME = projectJson["projectName"];
let OUTPUT_DATA_PATH = "data/"
let num_failed = 0;
let num_find = 0;
let num_add = 0;
let err_429 = 0;
let projectName = "android";

//load all id
//check if the id is in the db
//if not download

function readChangeIdList(projectName, DATA_PATH) {
    let filename = projectName + "-changes-id-list.txt"
    let filename_path = PathLibrary.join(DATA_PATH, projectName, filename);
    if (fs.existsSync(filename_path)) {
        let text = fs.readFileSync(filename_path);
        return text.toString().split("\n")
    } else {
        return ""
    }
}

async function startDownload(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["output_directory"])
        OUTPUT_DATA_PATH = json["output_directory"];
    if (json["projectName"]) {
        DIRECTORY_NAME = json["projectName"];
        projectName = json["projectName"];
    }

    await Database.dbConnection(projectDBUrl);
    let changesIdList = readChangeIdList(json["projectName"], OUTPUT_DATA_PATH)

    //changesIdList = changesIdList.slice(446362, changesIdList.length-1)
    //changesIdList = changesIdList.slice(446000+108600+2391, changesIdList.length-1)
    //changesIdList = changesIdList.slice(600000, changesIdList.length-1)
    //changesIdList = changesIdList.slice(686700, changesIdList.length-1)

    progressBar.start(changesIdList.length, 0, {add: num_add, find: num_find, failed: num_failed, err_429: err_429});
    if (!changesIdList || changesIdList.length === 0) {
        console.log("Change Id list is empty")
        return Promise.resolve(true)
    }
    return process(changesIdList)
}

function checkIfChangeExists(id) {
    return Change.exists({change_id: id});
}

function get_change_id_url(id) {
    return prefix + id + suffix
}

async function process(changesIdList) {
    let tasks = []
    let NUM_CONCURRENCY = 200;
    let n = 0;
    for (let i = 0; i < changesIdList.length; i++) {

        let id = changesIdList[i];
        let t = checkIfChangeExists(id)
            .then((result) => {
                if (result) {
                    num_find += 1;
                    progressBar.increment(1, {add: num_add, find: num_find, failed: num_failed, err_429: err_429});
                    return Promise.resolve(true)
                } else {
                    return get_change_id(id)
                }
            })
            .catch(err => {
                console.log(err)
            });
        tasks.push(t)
        n++;
        if (n >= NUM_CONCURRENCY) {
            await Promise.all(tasks).then(() => {
                n = 0;
                tasks = [];
            })
        }
    }

}

function saveChangeInDB(jsonArray) {
    //let tasks = []
    for (let i = 0; i < jsonArray.length; i++) {
        let json = jsonArray[i]
        //let t = dbUtils.saveChange(json).then(() => {
        let path = PathLibrary.join(OUTPUT_DATA_PATH, projectName, projectName + "-codes-changes");
        //let dt = new Date().getTime();
        Utils.saveJSONInFile(path, json.id, json)
        num_add += 1;
        progressBar.increment(1, {add: num_add, find: num_find, failed: num_failed, err_429: err_429});
        //})
        //tasks.push(t)
    }
    //return Promise.all(tasks);
    return Promise.resolve(true);
}

async function get_change_id(id) {
    let url = get_change_id_url(id);
    return axios.get(url)
        .then(response => {
            let json = JSON.parse(response.data.slice(5));
            if (Object.keys(json).length === 0)
                return {};
            return json;
        })
        .then((jsonArray) => {
            return saveChangeInDB(jsonArray)
        })
        .catch(function (err) {
            if (err.response) {
                num_failed += 1;
                if (err.response.status === 429) {
                    err_429 += 1
                    setTimeout(function () {
                        err_429 -= 1
                        return get_change_id(id);
                    }, 60000);
                }
                if (err.response.status !== 429) {
                    console.log("status : erreur " + err.response.status + " - " + id)
                }
            }
            progressBar.increment(0, {add: num_add, find: num_find, failed: num_failed, err_429: err_429});
        });
}

module.exports = {
    start: startDownload
};