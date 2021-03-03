//Library
const Axios = require('axios');
const Mongoose = require('mongoose');
const Project = require('../models/project');
const Account = require('../models/account');
const Change = require('../models/changeSummary');
const ChangeDetail = require('../models/change');
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');

var projectParseUrl = Database.libreOfficeDBUrl;
var projectParseApiUrl = ApiEndPoints.libreOfficeApiUrl;

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
Axios.get(ApiEndPoints.getProjectsUrl(projectParseApiUrl))
    .then(response => {
        var json = JSON.parse(response.data.slice(5));
        var array = [];
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                array.push(json[key]);
            }
        }
        Project.insertMany(array)
            .then(() => console.log('Number of projects saved : ' + array.length));
    })
    .catch(function (err) {
        console.log("error" + err);
    });

//Get the changes
Axios.get(ApiEndPoints.getChangesUrl(projectParseApiUrl))
    .then(response => {
        var json = JSON.parse(response.data.slice(5));
        var array = [];
        var accountIdJson = {};
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                array.push(json[key]);
                if (json[key].owner)
                    if (json[key].owner._account_id) {
                        if (accountIdJson[json[key].owner._account_id]){
                            accountIdJson[json[key].owner._account_id]._account_id = json[key].owner._account_id;
                            accountIdJson[json[key].owner._account_id].number_of_changes = accountIdJson[json[key].owner._account_id].number_of_changes + 1;
                        }else {
                            accountIdJson[json[key].owner._account_id] = {}
                            accountIdJson[json[key].owner._account_id]._account_id = json[key].owner._account_id;
                            accountIdJson[json[key].owner._account_id].number_of_changes = 1;
                        }
                    }
            }
        }
        Change.insertMany(array)
            .then(() => console.log('Number of changes saved : ' + array.length));

        //Account.insertMany(arrayAccount)
        return [json, accountIdJson];
    })
    //Save Account
    .then(response => {
        var json = response[0];
        var accountIdJson = response[1];

        for (var key in accountIdJson) {
            if (accountIdJson.hasOwnProperty(key)) {
                Axios.get(ApiEndPoints.getAccountsDetail(projectParseApiUrl, key))
                    .then(response => {
                        var accountJson = JSON.parse(response.data.slice(5));
                        if(accountJson._account_id){
                            accountJson.number_of_changes = accountIdJson[accountJson._account_id].number_of_changes;
                            Account.updateOne({_account_id: accountJson._account_id}, accountJson, {upsert: true})
                                .then(() => {
                                    console.log('Account saved : ' + JSON.stringify(accountJson._account_id))
                                });
                        }
                    })
                    .catch(function (err) {
                        console.log("error" + err);
                    });
            }
        }

        return json;
    })
    //Save change detail
    .then(response => {
        var json = response;
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                var id = json[key].id;
                Axios.get(ApiEndPoints.getChangeDetailsUrl(projectParseApiUrl, id))
                    .then(response => {
                        var chanceDetailJson = JSON.parse(response.data.slice(5));
                        ChangeDetail.updateOne({id: chanceDetailJson.id}, chanceDetailJson, {upsert: true})
                            .then(() => {
                                console.log('Change saved : ' + JSON.stringify(chanceDetailJson.id))
                            });
                    })
                    .catch(function (err) {
                        console.log("error" + err);
                    });
            }
        }
        return json;
    })
    .catch(function (err) {
        console.log("error" + err);
    });


///
function fetchAndSaveChangesDetails(params) {
    if (params.id) {
        let id = params.id;
        return fetchFromApi(
            ApiEndPoints.getChangeDetailsUrl(projectApiUrl, id),
            false,
            saveChangeDetail
        ).then();
    }
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
                        fetchFromApi(ApiEndPoints.getAccountsDetail(projectApiUrl, accountId),
                            0,
                            false,
                            saveAccount
                        ).then();
                    }
                })
        }
    }
}