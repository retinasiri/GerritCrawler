//Library
const Mongoose = require('mongoose');
const Moment = require('moment');
const RateLimit = require('axios-rate-limit');
const Project = require('../models/project');
const Account = require('../models/account');
const ChangeSummary = require('../models/changeSummary');
const Change = require('../models/change');
const Crawling = require('../models/crawling');
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');

const Axios = require('axios');
const axios = RateLimit(Axios.create(), {maxRPS: 80})
//limiter le nombre de requête par seconde
//const axios = RateLimit(Axios.create(), {maxRequests: 2, perMilliseconds: 1000, maxRPS: 2})
//TODO insert many

var projectDBUrl = Database.libreOfficeDBUrl;
var projectApiUrl = ApiEndPoints.libreOfficeApiUrl;
var LAST_YEAR_TO_COLLECT = 2014;
var NUMBER_OF_CHANGES_REQUESTED = 500;

//Connect to the database
function dbConnection() {
    return Mongoose.connect(projectDBUrl,
        {useNewUrlParser: true, useUnifiedTopology: true},
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Connected to the database");
            }
        });
}

//Mongoose.set("useCreateIndex", true);

//Get the projects

startCrawling(projectApiUrl, 0);

//\ajouter les nouvelles variables dans la BD
//\Save les dans la table change et non dans summaries
//\Faire un système pour collecter les changements jusqu'en 2014
//\Savegarger les comptes utilisateur
//\Faire un système pour enchainer la collection de données
//\resumer le crawling
//Faire la classe pour collecter les métriques

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function startCrawling(projectApiUrl, start) {

    try {

        await dbConnection();
        //Mongoose.set("useCreateIndex", true);

        let response = await initCrawlingProgression(projectApiUrl);

        let basicChangesStartingPoint = response.number_of_open_changes_collected;
        let mergedChangesStartingPoint = response.number_of_merged_changes_collected;
        let abandonedChangesStartingPoint = response.number_of_abandoned_changes_collected;

        let projectBaseUrl = ApiEndPoints.getProjectsUrl(projectApiUrl);
        let basicChangesUrl = ApiEndPoints.getOpenChangeUrl(projectApiUrl, basicChangesStartingPoint);
        let mergedChangesUrl = ApiEndPoints.getMergedChangeUrl(projectApiUrl, mergedChangesStartingPoint);
        let abandonedChangesUrl = ApiEndPoints.getAbandonedChangeUrl(projectApiUrl, abandonedChangesStartingPoint);

        //getProjects(projectBaseUrl).then();
        getAllChanges(basicChangesUrl).then();
        //getAllChanges(mergedChangesUrl).then();
        //getAllChanges(abandonedChangesUrl).then();

        //saveCrawlingProgression(ApiEndPoints.getMergedChangeUrl(projectApiUrl, 125000), 125000).then();

    } catch (error) {
        console.error(error);
    }
}

/**
 * @param {URL} baseUrl The date
 */
function getProjects(baseUrl) {
    console.log("Collecting projects")
    return fetchFromApi(baseUrl.href, true, saveProject);
}

/**
 * @param {URL} changesUrl The date
 */
function getAllChanges(changesUrl) {
    let start = Number(changesUrl.getStartValue());
    //console.log("changesUrl : " + changesUrl);
    let typeOfChange = changesUrl.searchParams.get('q');
    console.log(typeOfChange + " changes : " + start + " - " + (start + NUMBER_OF_CHANGES_REQUESTED));
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
                                console.log("No more changes for " + typeOfChange);
                            }
                        } else {
                            console.log("No more changes for " + typeOfChange);
                        }
                    } else {
                        console.log("Data limit of collected changes reach for " + typeOfChange);
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
    return fetchFromApi(changesUrl, true, function (params) {
        //Save changes summary
        //saveChangeSummary(params).then();
        saveChangeDetail(params).then();
        //saveChanges(params).then();

        //Save Account
        //getAndSaveAccount(params);
    });
}

/**
 * @param {String} apiEndpoint The date
 * @param {boolean} ResponseHasMultipleElement The date
 * @param {function} functionToExecute The date
 */
function fetchFromApi(apiEndpoint, ResponseHasMultipleElement, functionToExecute) {
    //console.log("apiEndpoint : " + apiEndpoint);
    return axios.get(apiEndpoint)
        .then(response => {
            //console.log("fetchFromApi start : " + start);
            var json = JSON.parse(response.data.slice(5));
            var lastJson;

            if (ResponseHasMultipleElement) {
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        //functionToExecute(json[key]);
                        lastJson = json[key];
                        functionToExecute(json);
                    }
                }
                //console.log('Last json : ' + JSON.stringify(lastJson))
                if (lastJson._more_changes) {
                    let url = new URL(apiEndpoint);
                    let typeOfChange = url.searchParams.get('q');
                    console.log(typeOfChange + ' more changes : ' + JSON.stringify(lastJson._more_changes))
                }
            } else {
                functionToExecute(json);
                lastJson = json;
                if (lastJson.change_id) {
                    console.log('Last changes inserted')
                }
            }
            return lastJson;
        })
        .catch(function (err) {
            //console.log("Api Error : " + JSON.stringify(err.toJSON()));
            console.log("Api Error : " + JSON.stringify(err));
        });
}

function getAndSaveAccount(params) {
    //console.log("getAndSaveAccount : " + JSON.stringify(params));
    let owner = params.owner;
    let submitter = params.submitter;

    if (owner) {
        if (params.owner._account_id) {
            saveAccount(owner).then();
        }
    }

    if (submitter) {
        if (params.submitter._account_id) {
            saveAccount(submitter).then();
        }
    }

    let reviewers = params.reviewers;

    if (reviewers) {
        let reviewerArray = reviewers.REVIEWER;
        if (reviewerArray) {
            for (let i = 0; i < reviewerArray.length; i++) {
                saveAccount(reviewerArray[i]).then();
            }
        }
    }
}

//Save project to the database
function saveProject(projectJson) {
    return Project.updateOne({id: projectJson.id}, projectJson, {upsert: true})
        .then(() => {
            //console.log('Projects saved : ' + JSON.stringify(projectJson.id))
        })
        .catch(function (err) {
            console.log("saveProject Error : " + JSON.stringify(err));
        });
}

//Save accounts to the database
function saveAccount(accountJson) {
    return Account.updateOne({_account_id: accountJson._account_id}, accountJson, {upsert: true})
        .then(() => {
            //console.log('Account saved : ' + JSON.stringify(accountJson._account_id))
        })
        .catch(function (err) {
            console.log("saveAccount Error : " + JSON.stringify(err));
        });
}

//saves changes to the database
function saveChangeSummary(changeJson) {
    return ChangeSummary.updateOne({id: changeJson.id}, changeJson, {upsert: true})
        .then(() => {
            //console.log('Change saved : ' + JSON.stringify(changeJson.id))
        });
}

//saves changes to the database
function saveChangeDetail(changeJson) {
    return Change.updateOne({id: changeJson.id}, changeJson, {upsert: true})
        .then(() => {
            //console.log('Change saved : ' + JSON.stringify(changeJson.id))
        })
        .catch(function (err) {
            console.log("saveChangeDetail Error : " + JSON.stringify(err));
        });
}

function saveChanges(changesJson) {
    console.log('changes Json')
    return Change.insertMany(changesJson)
        .then(() => {
            console.log('Changes saved')
        })
        .catch(function (err) {
            console.log("Error : " + err );
        });
}

/**
 * @param {URL} url The date
 * @param {Number} number The date
 */
function saveCrawlingProgression(url, number) {
    //console.log("saveCrawlingProgression : ");
    let type = url.searchParams.get('q');
    name = url.hostname;
    if (type === ApiEndPoints.openChangeQuery) {
        /*console.log("saveCrawlingProgression : " + type);
        console.log("projectApiUrl : " + projectApiUrl);
        console.log("number : " + number);*/
        return Crawling.updateOne({url: projectApiUrl}, {number_of_open_changes_collected: number})
            .then((doc)=>{
                console.log("number save : " + type + " " + JSON.stringify(doc));
            })
            .catch(function (err) {
                console.log("Error : " + JSON.stringify(err));
            });
    } else if (type === ApiEndPoints.mergedChangeQuery) {
        /*console.log("saveCrawlingProgression : " + type);
        console.log("projectApiUrl : " + projectApiUrl);
        console.log("number : " + number);*/
        return Crawling.updateOne({url: projectApiUrl}, {number_of_merged_changes_collected: number})
            .then((doc)=>{
                console.log("number save : " + type + " " + JSON.stringify(doc));
            })
            .catch(function (err) {
                console.log("Error : " + JSON.stringify(err));
            });

    } else if (type === ApiEndPoints.abandonedChangeQuery) {
        /*console.log("saveCrawlingProgression : " + type);
        console.log("projectApiUrl : " + projectApiUrl);
        console.log("number : " + number);*/
        return Crawling.updateOne({url: projectApiUrl}, {number_of_abandoned_changes_collected: number})
            .then((doc)=>{
                console.log("number save : " + type + " " + JSON.stringify(doc));
            })
            .catch(function (err) {
                console.log("Error : " + JSON.stringify(err));
            });
    } else{
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