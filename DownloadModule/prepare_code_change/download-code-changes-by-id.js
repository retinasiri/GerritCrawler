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
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | add : {add} | failed: {failed} | find: {find} ',
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let prefix = "https://android-review.googlesource.com/changes/"
let id = "Ic4d52a8be7cc2f9bbeb260c2506db88712a8d910"
let suffix = "/detail/?o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=MESSAGES&o=WEB_LINKS&o=COMMIT_FOOTERS&o=PUSH_CERTIFICATES&o=TRACKING_IDS"

let projectJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = projectJson["projectDBUrl"];
let projectApiUrl = projectJson["projectApiUrl"];
let DIRECTORY_NAME = projectJson["projectName"];
let OUTPUT_DATA_PATH = "data/"
let num_failed = 0;
let num_find = 0;
let num_add = 0;
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
    if (json["projectName"]){
        DIRECTORY_NAME = json["projectName"];
        projectName = json["projectName"];
    }

    await Database.dbConnection(projectDBUrl);

    let changesIdList = readChangeIdList(json["projectName"], OUTPUT_DATA_PATH)

    progressBar.start(changesIdList.length, 0);

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
    let NUM_CONCURRENCY = 500;
    let n = 0;
    for (let i = 0; i < changesIdList.length; i++) {
        let id = changesIdList[i];
        let t = checkIfChangeExists(id)
            .then((result) => {
                if(!result){
                    return get_change_id(id)
                } else {
                    num_find+=1;
                    progressBar.increment(1, {add: num_add, find: num_find, failed: num_failed});
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

function getTime() {
    let dt = (new Date());
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " : ";
}

function saveChangeInDB(json) {
    return dbUtils.saveChange(json).then(()=>{
        let path = PathLibrary.join(OUTPUT_DATA_PATH, projectName, "downloaded_changes");
        Utils.saveJSONInFile(path, json.id, json)

        num_add+=1;
        progressBar.increment(1, {add: num_add, find: num_find, failed: num_failed});
    })
}

async function get_change_id(id){
    let url = get_change_id_url(id);
    axios.get(url)
        .then(response => {
            let json = JSON.parse(response.data.slice(5));
            if (Object.keys(json).length === 0)
                return {};
            return json;
        })
        .then((json)=>{
            return saveChangeInDB(json)
        })
        .catch(function (err) {
            if (err.response) {
                num_failed +=1;
                if (err.response) {
                    //console.log(getTime() + id + " - Api Error : " + err.response.status);
                    progressBar.increment(1, {add: num_add, find: num_find, failed: num_failed});

                    /*if(err.response.status !== 400)
                        return get_change_id(id);
                    else if (err.response.status === 426){
                        setTimeout(function(){
                            return get_change_id(id);
                        },60000);
                    }
                    else
                        return Promise.resolve(false);
                     */
                }
            }
        });
}

module.exports = {
    start: startDownload
};