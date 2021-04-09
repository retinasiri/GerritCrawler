const Mongoose = require('mongoose');
const Moment = require('moment');
const Axios = require('axios');
const fsExtra = require("fs-extra");
const RateLimit = require('axios-rate-limit');
const Crawling = require('../models/crawling');
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');

const axios = RateLimit(Axios.create(), { maxRPS: 80 })
const TIMEOUT = 20 * 60 * 1000;
const RACINE_PATH = "data/"

let projectDBUrl = Database.qtDbUrl;
let projectApiUrl = ApiEndPoints.qtApiUrl;
let LAST_YEAR_TO_COLLECT = 2021;
let NUMBER_OF_CHANGES_REQUESTED = 500;

function crawling(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["LAST_YEAR_TO_COLLECT"])
        LAST_YEAR_TO_COLLECT = json["LAST_YEAR_TO_COLLECT"];
    if (json["NUMBER_OF_CHANGES_REQUESTED"])
        NUMBER_OF_CHANGES_REQUESTED = json["NUMBER_OF_CHANGES_REQUESTED"];

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
}

function getTime() {
    let dt = new Date();
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " : ";
}

function getStartRange(url) {
    let start = Number(url.getStartValue());
    return start + " - " + (start + NUMBER_OF_CHANGES_REQUESTED);
}

/**
 * @param {URL} changesUrl The date
 */
function getAllChanges(changesUrl) {

    let start = Number(changesUrl.getStartValue());
    let typeOfChange = changesUrl.searchParams.get('q');
    console.log(getTime() + typeOfChange + " - changes : " + getStartRange(changesUrl));
    //console.log(getTime() + "ChangesUrl : " + changesUrl);

    return getChanges(changesUrl.href)
        .then(function(params) {
            if (params) {
                if (params.created) {
                    let date = Moment(params.created).toDate();
                    if (date.getFullYear() > LAST_YEAR_TO_COLLECT) {
                        if (params._more_changes) {
                            if (params._more_changes === true) {
                                //console.log("changesUrl + 500 : " + changesUrl);
                                changesUrl = changesUrl.startAt(start + NUMBER_OF_CHANGES_REQUESTED);
                                return saveCrawlingProgression(changesUrl, start + NUMBER_OF_CHANGES_REQUESTED).then(() => {
                                    return getAllChanges(changesUrl).then();
                                });
                            }
                        }
                    }
                }
            }
            return Promise.resolve(false);
        })
        .catch(function(err) {
            console.log("Error : " + JSON.stringify(err.toString()));
        });
}

/**
 * @param {String} changesUrl The date
 */
function getChanges(changesUrl) {
    return fetchFromApi(changesUrl, function(params) {
        return saveFiles(changesUrl, params);
    });
}

/**
 * @param {String} apiEndpoint The date
 * @param {function} functionToExecute The date
 */
function fetchFromApi(apiEndpoint, functionToExecute) {
    //console.log("apiEndpoint : " + apiEndpoint);
    return axios.get(apiEndpoint, { timeout: TIMEOUT })
        .then(response => {
            //console.log("fetchFromApi start : " + start);
            let json = JSON.parse(response.data.slice(5));
            let lastJson;

            functionToExecute(json);

            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    lastJson = json[key];
                }
            }
            if (lastJson)
                if (lastJson._more_changes) {
                    let typeOfChange = (new URL(apiEndpoint)).searchParams.get('q');
                    console.log(getTime() + typeOfChange + ' - more changes : ' + JSON.stringify(lastJson._more_changes))
                }

            return lastJson;
        })
        .catch(function(err) {
            console.log("Api Error : " + err);
            return getAllChanges(new URL(apiEndpoint));
        });
}

/**
 * @param {String} changeUrlString The date
 * @param {json} json The date
 */
function saveFiles(changeUrlString, json) {
    //console.log('saveFiles : ' + changeUrl);
    let changeUrl = new URL(changeUrlString)
    let type = changeUrl.searchParams.get('q');
    let start = new Number(changeUrl.getStartValue());
    let subDirname = (type.split(":"))[1] + "-changes";
    let dirname = RACINE_PATH + (changeUrl.hostname.split("."))[1];
    let fileName = dirname + "/" + subDirname + "/" + start + "-" + (start + NUMBER_OF_CHANGES_REQUESTED) + ".json";
    let data = JSON.stringify(json, null, 2);

    fsExtra.ensureDirSync(dirname + "/" + subDirname);
    return fsExtra.outputFile(fileName, data);
}

/**
 * @param {URL} url The date
 * @param {Number} number The date
 */
function saveCrawlingProgression(url, number) {
    let type = url.searchParams.get('q');
    let json = {}
    if (type === ApiEndPoints.openChangeQuery) {
        json = { number_of_open_changes_collected: number };
    } else if (type === ApiEndPoints.mergedChangeQuery) {
        json = { number_of_merged_changes_collected: number };
    } else if (type === ApiEndPoints.abandonedChangeQuery) {
        json = { number_of_abandoned_changes_collected: number };
    }
    return Crawling.updateOne({ url: projectApiUrl }, json);
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

    return Crawling.findOne({ url: url })
        .then(result => {
            if (result) {
                return Promise.resolve(result);
            } else {
                return initData.save().then();
            }
        });
}

module.exports = {
    crawling: crawling
};