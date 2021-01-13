//Library
const Axios = require('axios');
const Mongoose = require('mongoose');
const RateLimit = require('axios-rate-limit');
const Project = require('./models/project');
const Account = require('./models/account');
const ChangeSummary = require('./models/changeSummary');
const Change = require('./models/change');
const Database = require('./config/databaseConfig');
const ApiEndPoints = require('./config/apiEndpoints');

var projectParseUrl = Database.qtDbUrl;
var projectParseApiUrl = ApiEndPoints.qtApiUrl;

//limiter le nombre de requête par seconde
const axios = RateLimit(Axios.create(), {maxRPS: 80})
//const axios = RateLimit(Axios.create(), {maxRequests: 2, perMilliseconds: 1000, maxRPS: 2})

//Connect to the database
Mongoose.connect(projectParseUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Connected to the database");
        }
    });

//Get the projects
let projectBaseUrl = ApiEndPoints.getProjectsUrl(projectParseApiUrl)


getProjects(projectBaseUrl);
startCrawling(138500);

//Get Changes
//Get merged changed
//Get abandoned change
//Get Accounts
//Go to the next project

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function startCrawling(start) {
    try {
        const response = await getAllChanges(start);
        //console.log(response);
    } catch (error) {
        console.error(error);
    }
}

function getProjects(baseUrl) {
    return fetchFromApi(baseUrl, true, saveProject);
}

function getAllChanges(start) {
    return getChanges(start)
        .then(function (params) {
            if (params) {
                if (params._more_changes) {
                    if (params._more_changes === true) {
                        console.log("Changes : " + start + " - " + (start + 500));
                        getAllChanges(start + 500).then();
                    } else {
                        console.log("All Changes");
                    }
                }
            }
        })
}

/*function getChanges(){
    return fetchFromApi(ApiEndPoints.getChangesUrl(projectParseApiUrl), saveChange);
}*/

function getChangesBaseUrl (project, start) {
    return ApiEndPoints.getMergedChangeUrl(projectParseApiUrl, start)
}

function getChanges(start) {
    //console.log("StartFrom : " + start);
    return fetchFromApi(ApiEndPoints.getMergedChangeUrl(projectParseApiUrl, start), true, function (params) {
            //Save changes summary
            saveChangeSummary(params).then();

            //Get and save account owner of changes
            //fetchAndSaveAccount(params);

            //Get and save change details
            //fetchAndSaveChangesDetails(params);
        });
}

function fetchAndSaveChangesDetails(params) {
    if (params.id) {
        let id = params.id;
        return fetchFromApi(
            ApiEndPoints.getChangeDetailsUrl(projectParseApiUrl, id),
            false,
            saveChangeDetail
        ).then();
    }
}

//check if the user is already in the database
function fetchAndSaveAccount(params) {
    if (params.owner) {
        if (params.owner._account_id) {
            let accountId = params.owner._account_id;
            //console.log("_account_id : " + params.owner._account_id);
            //check first if the user is already in the DB

            return Account.count({_account_id: accountId})
                .then((err, count) => {
                    if (!count > 0) {
                        fetchFromApi(
                            ApiEndPoints.getAccountsDetail(projectParseApiUrl, accountId),
                            false,
                            saveAccount
                        ).then();
                    }
                })

        }
    }
}

function fetchFromApi(apiEndpoint, ResponseHasMultipleElement, functionToExecute) {
    return axios.get(apiEndpoint)
        .then(response => {
            var json = JSON.parse(response.data.slice(5));
            var lastJson;

            if (ResponseHasMultipleElement) {
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        functionToExecute(json[key]);
                        lastJson = json[key];
                    }
                }

                //console.log('Last json : ' + JSON.stringify(lastJson))

                if (lastJson._more_changes) {
                    console.log('More changes : ' + JSON.stringify(lastJson._more_changes))
                } else {
                    console.log('More changes : false')
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
            //console.log("Api Error : " + err)
            //console.log("Api Error : " + JSON.stringify(err.toJSON()));
            //catchError(err)
        });
}

//https://github.com/axios/axios
function catchError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Api Error data : " + error.response.data);
        console.log("Api Error status : " + error.response.status);
        console.log("Api Error headers : " + error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("Api Error request : " + error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Api Error message : " + error.message);
    }
    console.log("Api Error config : " + error.config);
}

//Save project to the database
function saveProject(projectJson) {
    return Project.updateOne({id: projectJson.id}, projectJson, {upsert: true})
        .then(() => {
            //console.log('Projects saved : ' + JSON.stringify(projectJson.id))
        });
}

//Save accounts to the database
function saveAccount(accountJson) {
    return Account.updateOne({_account_id: accountJson._account_id}, accountJson, {upsert: true})
        .then(() => {
            //console.log('Account saved : ' + JSON.stringify(accountJson._account_id))
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
        });
}