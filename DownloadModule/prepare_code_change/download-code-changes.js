const Mongoose = require('mongoose');
const Moment = require('moment');
const Axios = require('axios');
const fsExtra = require("fs-extra");
const RateLimit = require('axios-rate-limit');
const Crawling = require('../models/crawling');
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');
const Utils = require("../config/utils");
const PathLibrary = require('path');

const axios = RateLimit(Axios.create(), {maxRPS: 80})
const TIMEOUT = 20 * 60 * 1000;
let LAST_YEAR_TO_COLLECT = 2000;
let NUMBER_OF_CHANGES_REQUESTED = 250;

let projectJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = projectJson["projectDBUrl"];
let projectApiUrl = projectJson["projectApiUrl"];
let DIRECTORY_NAME = projectJson["projectName"];
let OUTPUT_DATA_PATH = "data/"


function startDownload(json) {
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

    return startCrawling(projectApiUrl, projectDBUrl)
        .then(() => {
            let project_name = new URL(projectApiUrl).hostname
            console.log(project_name + " Finished !!!!");
            return Mongoose.connection.close();
        })
        .catch(err => {
            console.log(err)
        });
}

async function startCrawling(projectApiUrl, projectDBUrl) {
    await Database.dbConnection(projectDBUrl);
    let response = await initCrawlingProgression(projectApiUrl);
    let openChangesUrl = ApiEndPoints.getOpenChangeUrl(projectApiUrl, response.number_of_open_changes_collected);
    let mergedChangesUrl = ApiEndPoints.getMergedChangeUrl(projectApiUrl, response.number_of_merged_changes_collected);
    let abandonedChangesUrl = ApiEndPoints.getAbandonedChangeUrl(projectApiUrl, response.number_of_abandoned_changes_collected);
    let openChangePromise = getAllChanges(openChangesUrl);
    let mergedChangePromise = getAllChanges(mergedChangesUrl);
    let abandonedChangedPromise = getAllChanges(abandonedChangesUrl);
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
 */
function getAllChanges(changesUrl) {

    let start = Number(changesUrl.getStartValue());
    let typeOfChange = changesUrl.searchParams.get('q');
    changesUrl = changesUrl.numChanges(NUMBER_OF_CHANGES_REQUESTED)
    console.log(getTime() + typeOfChange + " - changes : " + getStartRange(changesUrl));

    return getChanges(changesUrl.href)
        .then(function (json) {
            let bool = hasToDownloadMoreChange(json, changesUrl);
            if (bool) {
                changesUrl = changesUrl.startAt(start + NUMBER_OF_CHANGES_REQUESTED);
                changesUrl = changesUrl.numChanges(NUMBER_OF_CHANGES_REQUESTED)
                return getAllChanges(changesUrl);
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
 */
function getChanges(changesUrl) {
    return fetchFromApi(changesUrl)
        .then((json) => {
            return saveFiles(changesUrl, json)
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
 */
function fetchFromApi(apiEndpoint) {
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
            return getAllChanges(new URL(apiEndpoint));
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
 * @param {json} json The date
 */
async function saveFiles(changeUrlString, json) {
    if (Object.keys(json).length === 0)
        return Promise.resolve(json);
    let changeUrl = new URL(changeUrlString)
    let type = changeUrl.searchParams.get('q');
    let start = new Number(changeUrl.getStartValue());
    let subDirname = (type.split(":"))[1] + "-changes";
    let dirname = PathLibrary.join(OUTPUT_DATA_PATH, DIRECTORY_NAME, subDirname)
    let filename = (start + "-" + (start + NUMBER_OF_CHANGES_REQUESTED) + ".json")
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
 */
function initCrawlingProgression(url) {
    let initData = new Crawling({
        "project_name": new URL(url).hostname,
        "url": url,
        "number_of_open_changes_collected": 0,
        "number_of_merged_changes_collected": 0,
        "number_of_abandoned_changes_collected": 0
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