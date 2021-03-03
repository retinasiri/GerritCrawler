//Library
const Mongoose = require('mongoose');
const Moment = require('moment');
const fs = require('fs');
const fsExtra = require("fs-extra");
const RateLimit = require('axios-rate-limit');
const Project = require('./models/project');
const Account = require('./models/account');
const ChangeSummary = require('./models/changeSummary');
const Change = require('./models/change');
const Crawling = require('./models/crawling');
const Database = require('./config/databaseConfig');
const ApiEndPoints = require('./config/apiEndpoints');

const Axios = require('axios');
const axios = RateLimit(Axios.create(), {maxRPS: 80})

let projectDBUrl = Database.openstackDbUrl;
let projectApiUrl = ApiEndPoints.openstackApiUrl;

let LAST_YEAR_TO_COLLECT = 2013;
let NUMBER_OF_CHANGES_REQUESTED = 500;

//Connect to the database
function dbConnection() {
    return Mongoose.connect(projectDBUrl,
        {useNewUrlParser: true, useUnifiedTopology: true},
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(getTime() + "Connected to the database");
            }
        });
}

startCrawling(projectApiUrl, 0).then();

async function startCrawling(projectApiUrl, start) {

    try {

        await dbConnection();
        //Mongoose.set("useCreateIndex", true);

        let response = await initCrawlingProgression(projectApiUrl);
        let basicChangesStartingPoint = response.number_of_open_changes_collected;
        let mergedChangesStartingPoint = response.number_of_merged_changes_collected;
        let abandonedChangesStartingPoint = response.number_of_abandoned_changes_collected;

        let basicChangesUrl = ApiEndPoints.getOpenChangeUrl(projectApiUrl, basicChangesStartingPoint);
        //let mergedChangesUrl = ApiEndPoints.getMergedChangeUrl(projectApiUrl, mergedChangesStartingPoint);
        let mergedChangesUrl = ApiEndPoints.getMergedChangeUrl(projectApiUrl, mergedChangesStartingPoint);
        let abandonedChangesUrl = ApiEndPoints.getAbandonedChangeUrl(projectApiUrl, abandonedChangesStartingPoint);

        //getAllChanges(basicChangesUrl).then();
        getAllChanges(mergedChangesUrl).then();
        //getAllChanges(abandonedChangesUrl).then();

    } catch (error) {
        console.error(error);
    }
}

function getTime(){
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return  hours + ":" + minutes + ":" + seconds + " : ";
}

function getStartRange(url){
    let start = Number(url.getStartValue());
    return start + " - " + (start + NUMBER_OF_CHANGES_REQUESTED);
}

/**
 * @param {URL} changesUrl The date
 */
function getAllChanges(changesUrl) {

    let start = Number(changesUrl.getStartValue());
    console.log(getTime() + "ChangesUrl : " + changesUrl);
    let typeOfChange = changesUrl.searchParams.get('q');
    console.log(getTime() + typeOfChange + " changes : " + getStartRange(changesUrl));

    return getChanges(changesUrl.href)
        .then(function (params) {
            if (params) {
                if (params.created) {
                    var date = Moment(params.created).toDate();
                    if (date.getFullYear() > LAST_YEAR_TO_COLLECT) {
                        if (params._more_changes) {
                            if (params._more_changes === true) {
                                //console.log("changesUrl + 500 : " + changesUrl);
                                changesUrl = changesUrl.startAt(start + NUMBER_OF_CHANGES_REQUESTED);

                                return saveCrawlingProgression(changesUrl, start + NUMBER_OF_CHANGES_REQUESTED).then(() => {
                                    return getAllChanges(changesUrl).then();
                                });

                            } else {
                                console.log(getTime() + "No more changes for " + typeOfChange);
                            }
                        } else {
                            console.log(getTime() + "No more changes for " + typeOfChange);
                        }
                    } else {
                        console.log(getTime() + "Data limit of collected changes reach for " + typeOfChange);
                    }
                }
            }
        })
        .catch(function (err) {
            console.log("Error : " + JSON.stringify(err.toString()));
        });
}

/**
 * @param {String} changesUrl The date
 */
function getChanges(changesUrl) {
    return fetchFromApi(changesUrl, function (params) {
        saveFiles(changesUrl, params);
    });
}

/**
 * @param {String} apiEndpoint The date
 * @param {function} functionToExecute The date
 */
function fetchFromApi(apiEndpoint, functionToExecute) {
    //console.log("apiEndpoint : " + apiEndpoint);
    return axios.get(apiEndpoint)
        .then(response => {
            //console.log("fetchFromApi start : " + start);
            var json = JSON.parse(response.data.slice(5));
            var lastJson;

            functionToExecute(json);

            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    lastJson = json[key];
                }
            }
            if (lastJson)
                if (lastJson._more_changes) {
                    let url = new URL(apiEndpoint);
                    let typeOfChange = url.searchParams.get('q');
                    console.log(getTime() + typeOfChange + ' more changes : ' + JSON.stringify(lastJson._more_changes))
                }

            return lastJson;
        })
        .catch(function (err) {
            //console.log("Api Error : " + JSON.stringify(err.toJSON()));
            console.log("Api Error : " + err);
            getAllChanges(new URL(apiEndpoint));
        });
}

function saveFiles(changeUrl, json) {
    //console.log('saveFiles : ' + changeUrl);
    changeUrl = new URL(changeUrl)
    let type = changeUrl.searchParams.get('q');
    let start = new Number(changeUrl.getStartValue());
    let name = (type.split(":"))[1] + "-changes" ;
    let website = (changeUrl.hostname.split("."))[1];
    let fileName = website + "/" + name + "/" + start + "-" + (start + NUMBER_OF_CHANGES_REQUESTED) + ".json";
    let data = JSON.stringify(json, null, 2);

    //fs.existsSync(name) || fs.mkdirSync(name);
    fsExtra.ensureDirSync(website + "/" + name);

    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
        console.log(getTime() + 'Data written to file : ' + getStartRange(changeUrl));
    });

}

/**
 * @param {URL} url The date
 * @param {Number} number The date
 */
function saveCrawlingProgression(url, number) {
    let type = url.searchParams.get('q');
    name = url.hostname;
    if (type === ApiEndPoints.openChangeQuery) {
        return Crawling.updateOne({url: projectApiUrl}, {number_of_open_changes_collected: number})
            .then((doc) => {
                console.log(getTime() + "Number save : " + type + " " + JSON.stringify(doc));
            })
            .catch(function (err) {
                console.log("Error : " + JSON.stringify(err));
            });
    } else if (type === ApiEndPoints.mergedChangeQuery) {
        return Crawling.updateOne({url: projectApiUrl}, {number_of_merged_changes_collected: number})
            .then((doc) => {
                console.log(getTime() + "Number save : " + type + " " + JSON.stringify(doc));
            })
            .catch(function (err) {
                console.log("Error : " + JSON.stringify(err));
            });

    } else if (type === ApiEndPoints.abandonedChangeQuery) {
        return Crawling.updateOne({url: projectApiUrl}, {number_of_abandoned_changes_collected: number})
            .then((doc) => {
                console.log(getTime() + "Number save : " + type + " " + JSON.stringify(doc));
            })
            .catch(function (err) {
                console.log("Error : " + JSON.stringify(err));
            });
    } else {
        return Promise.resolve();
    }

}

function initCrawlingProgression(url) {
    name = new URL(url).hostname;

    var initData = new Crawling({
        "project_name": name,
        "url": url,
        "number_of_open_changes_collected": 0,
        "number_of_merged_changes_collected": 0,
        "number_of_abandoned_changes_collected": 0
    });

    return Crawling.findOne({url: url})
        .then(result => {
            if (result) {
                // user exists...
                return Promise.resolve(result);
            } else {
                return initData.save().then();
            }
        });

}