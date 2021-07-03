const Mongoose = require('mongoose');
const Moment = require('moment');
const Axios = require('axios');
const fsExtra = require("fs-extra");
const fs = require('fs');
const RateLimit = require('axios-rate-limit');
const Crawling = require('../models/crawling');
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');
const Utils = require("../config/utils");
const PathLibrary = require('path');

const axios = RateLimit(Axios.create(), {maxRPS: 20})
const TIMEOUT = 20 * 60 * 1000;
let LAST_YEAR_TO_COLLECT = 2000;
let NUMBER_OF_CHANGES_REQUESTED = 250;

let projectJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = projectJson["projectDBUrl"];
let projectApiUrl = projectJson["projectApiUrl"];
let DIRECTORY_NAME = projectJson["projectName"];
let OUTPUT_DATA_PATH = "data/"

//todo list project from file
//todo loop starting project by project
//todo crawl by project
//todo test
//todo download code fetch
//todo clone repo
//todo get code change id
//todo download code change by id

//todo add service user to bot

function readProjectList(projectName, DATA_PATH) {
    let filename = projectName + "-repositories-list.txt"
    let filename_path = PathLibrary.join(DATA_PATH, projectName, filename);
    //console.log(filename_path)
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
    if (json["last_year"])
        LAST_YEAR_TO_COLLECT = json["last_year"];
    if (json["number_of_changes"])
        NUMBER_OF_CHANGES_REQUESTED = json["number_of_changes"];
    if (json["output_directory"])
        OUTPUT_DATA_PATH = json["output_directory"];
    if (json["projectName"])
        DIRECTORY_NAME = json["projectName"];

    await Database.dbConnection(projectDBUrl);

    let projectList = readProjectList(json["projectName"], OUTPUT_DATA_PATH)

    if (!projectList || projectList.length === 0) {
        return return_start_crawling(projectApiUrl, projectDBUrl, "")
            .then(() => {
                let project_name = new URL(projectApiUrl).hostname
                console.log(project_name + " Finished !!!!");
                return Mongoose.connection.close();
            })
            .catch(err => {
                console.log(err)
            });
    } else {
        let tasks = []
        let NUM_CONCURRENCY = 500;
        let n = 0;
        for (let i = 0; i < projectList.length; i++) {
            let project = projectList[i]
            let t = return_start_crawling(projectApiUrl, projectDBUrl, project)
                .then(() => {
                    console.log(project + " Finished !!!!");
                })
                .catch(err => {
                    console.log(err)
                });

            tasks.push(t)
            n++;
            /*if (n >= NUM_CONCURRENCY) {
                await Promise.all(tasks).then(() => {
                    n = 0;
                    tasks = [];
                })
            }*/
        }
        await Promise.all(tasks);
        console.log("Finished !!!!");
        return Promise.resolve(true);
    }

}

function return_start_crawling(projectApiUrl, projectDBUrl, project = "") {
    return startCrawling(projectApiUrl, projectDBUrl, project)
}


async function startCrawling(projectApiUrl, projectDBUrl, project = "") {
    let response = await initCrawlingProgression(projectApiUrl, project);
    let openChangesUrl = ApiEndPoints.getOpenChangeUrl(projectApiUrl, response.number_of_open_changes_collected, project);
    let mergedChangesUrl = ApiEndPoints.getMergedChangeUrl(projectApiUrl, response.number_of_merged_changes_collected, project);
    let abandonedChangesUrl = ApiEndPoints.getAbandonedChangeUrl(projectApiUrl, response.number_of_abandoned_changes_collected, project);
    let openChangePromise = getAllChanges(openChangesUrl, project);
    let mergedChangePromise = getAllChanges(mergedChangesUrl, project);
    let abandonedChangedPromise = getAllChanges(abandonedChangesUrl, project);
    return Promise.all([openChangePromise, mergedChangePromise, abandonedChangedPromise])
        .catch(err => {
            console.log(err)
        });
}

function getTime() {
    let dt = new Date();
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " : ";
}

function getStartRange(url) {
    let start = Number(url.getStartValue());
    let number = Number(url.getNumChanges());
    return start + " - " + (start + number);
}

/**
 * @param {URL} changesUrl The date
 * @param {String} project The date
 */
function getAllChanges(changesUrl, project = "") {

    let start = Number(changesUrl.getStartValue());
    let typeOfChange = changesUrl.searchParams.get('q');
    changesUrl = changesUrl.numChanges(NUMBER_OF_CHANGES_REQUESTED)
    console.log(getTime() + typeOfChange + " - changes : " + getStartRange(changesUrl));

    return getChanges(changesUrl.href, project)
        .then(function (json) {
            let bool = hasToDownloadMoreChange(json, changesUrl);
            if (bool) {
                changesUrl = changesUrl.startAt(start + NUMBER_OF_CHANGES_REQUESTED);
                changesUrl = changesUrl.numChanges(NUMBER_OF_CHANGES_REQUESTED)
                return getAllChanges(changesUrl, project);
            }
            return Promise.resolve(true);
        })
        .catch(function (err) {
            console.log("Error : " + JSON.stringify(err.toString()));
        });
}

function hasToDownloadMoreChange(json, changesUrl) {

    let lastJson = getLastJson(json);
    if (lastJson)
        if (lastJson._more_changes) {
            let typeOfChange = changesUrl.searchParams.get('q');
            console.log(getTime() + typeOfChange + ' - more changes : ' + JSON.stringify(lastJson._more_changes))
        }

    let bool = false;
    if (lastJson) {
        if (lastJson.created) {
            let lastChangeYear = Moment(lastJson.created).toDate().getFullYear();
            if (lastChangeYear > LAST_YEAR_TO_COLLECT)
                if (lastJson._more_changes)
                    if (lastJson._more_changes === true)
                        bool = true;
        }
    }

    return bool;
}

/**
 * @param {String} changesUrl The date
 * @param {String} project The date
 */
function getChanges(changesUrl, project = "") {
    return fetchFromApi(changesUrl, project)
        .then((json) => {
            return saveFiles(changesUrl, json, project)
        })
        .then((json) => {
            let url = new URL(changesUrl);
            let start = Number(url.getStartValue());
            return saveCrawlingProgression(url, start + NUMBER_OF_CHANGES_REQUESTED)
                .then(() => {
                    return Promise.resolve(json);
                })
        })
}

/**
 * @param {String} apiEndpoint The url of the code changes
 * @param {String} project The url of the code changes
 */
function fetchFromApi(apiEndpoint, project="") {
    return axios.get(apiEndpoint, {timeout: TIMEOUT})
        .then(response => {
            let json = JSON.parse(response.data.slice(5));
            if (Object.keys(json).length === 0)
                return {};
            return json;
        })
        .catch(function (err) {
            let typeOfChange = (new URL(apiEndpoint)).searchParams.get('q');
            console.log(getTime() + typeOfChange + "- Api Error : " + err);
            return getAllChanges(new URL(apiEndpoint), project);
        });
}

function getLastJson(json) {
    let lastJson;
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            lastJson = json[key];
        }
    }
    return lastJson
}

/**
 * @param {String} changeUrlString The date
 * @param {JSON} json The date
 * @param {String} project The date
 */
async function saveFiles(changeUrlString, json, project = "") {
    if (Object.keys(json).length === 0)
        return Promise.resolve(json);
    let changeUrl = new URL(changeUrlString)
    let type = changeUrl.searchParams.get('q');

    if (type.includes("merged"))
        type = "merged";
    if (type.includes("abandoned"))
        type = "abandoned";
    if (type.includes("open"))
        type = "open";

    let start = new Number(changeUrl.getStartValue());
    //let subDirname = (type.split(":"))[1] + "-changes";
    let subDirname = type + "-changes";
    let dirname = PathLibrary.join(OUTPUT_DATA_PATH, DIRECTORY_NAME, subDirname)
    let filename = start + "-" + (start + NUMBER_OF_CHANGES_REQUESTED)
    if (!(!project || project.length === 0))
        filename =  filename + "-" + encodeURIComponent(project);
    filename = filename + ".json"
    let filePath = PathLibrary.join(dirname, filename)
    let data = JSON.stringify(json, null, 2);
    await fsExtra.ensureDirSync(dirname);
    return fsExtra.outputFile(filePath, data).then(() => {
        return Promise.resolve(json)
    });
}

/**
 * @param {URL} url The date
 */
function getUrlHost(url) {
    return (url.hostname.split("."))[1]
}

/**
 * @param {URL} url The date
 * @param {Number} number The date
 */
function saveCrawlingProgression(url, number) {
    let type = url.searchParams.get('q');
    let json = {}
    if (type === ApiEndPoints.openChangeQuery) {
        json = {number_of_open_changes_collected: number};
    } else if (type === ApiEndPoints.mergedChangeQuery) {
        json = {number_of_merged_changes_collected: number};
    } else if (type === ApiEndPoints.abandonedChangeQuery) {
        json = {number_of_abandoned_changes_collected: number};
    }
    return Crawling.updateOne({url: projectApiUrl}, json)
        .catch(err => {
            console.log(err)
        });
}

/**
 * @param {String} url The date
 * @param {String} project The project
 */
function initCrawlingProgression(url, project = "") {
    if (!project || project.length === 0)
        project = new URL(url).hostname;

    let initData = new Crawling({
        _id: project,
        project: project,
        project_name: new URL(url).hostname,
        url: url,
        number_of_open_changes_collected: 0,
        number_of_merged_changes_collected: 0,
        number_of_abandoned_changes_collected: 0
    });

    return Crawling.findOne({url: url})
        .then(result => {
            if (result) {
                return Promise.resolve(result);
            } else {
                return initData.save().then();
            }
        });
}


module.exports = {
    start: startDownload
};