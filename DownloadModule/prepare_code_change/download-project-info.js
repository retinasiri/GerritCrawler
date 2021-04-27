//Library
const Axios = require('axios');
const fsExtra = require("fs-extra");
const RateLimit = require('axios-rate-limit');
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');
const Utils = require("../config/utils");
const axios = RateLimit(Axios.create(), {maxRPS: 80})

const TIMEOUT = 20 * 60 * 1000;

let projectJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = projectJson["projectDBUrl"];
let projectApiUrl = projectJson["projectApiUrl"];

function start(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];

    return startCrawling(projectApiUrl).then(() => {
        let project_name = new URL(projectApiUrl).hostname
        console.log(project_name + " Finished !!!!");
    });
}

async function startCrawling(projectApiUrl) {
    let projectUrl = ApiEndPoints.getProjectsUrlHref(projectApiUrl);
    return getAllProjects(projectUrl);
}


/**
 * @param {String} changesUrl The date
 */
function getAllProjects(changesUrl) {
    return fetchFromApi(changesUrl).then((json) => {
        return saveFiles(changesUrl, json);
    });
}

/**
 * @param {String} apiEndpoint The date
 */
function fetchFromApi(apiEndpoint) {
    return axios.get(apiEndpoint, {timeout: TIMEOUT})
        .then(response => {
            return JSON.parse(response.data.slice(5));
        })
        .catch(function (err) {
            console.log("Api Error : " + err);
        });
}

/**
 * @param {String} changeUrlString The date
 * @param {json} json The date
 */
function saveFiles(changeUrlString, json) {
    let racine = "data/";
    let changeUrl = new URL(changeUrlString)
    let website = (changeUrl.hostname.split("."))[1]
    let dirname = racine + website;
    let fileName = dirname +  "/" + "projects-of-" + website + ".json";
    let data = JSON.stringify(json, null, 2);
    fsExtra.ensureDirSync(dirname);
    return fsExtra.outputFile(fileName, data);
}

module.exports = {
    start: start
};
