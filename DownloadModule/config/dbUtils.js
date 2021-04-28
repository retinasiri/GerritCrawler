const Mongoose = require('mongoose');
const Moment = require('moment');
const RateLimit = require('axios-rate-limit');
const Project = require('../models/project');
const Account = require('../models/account');
const ChangeSummary = require('../models/changeSummary');
const Change = require('../models/change');
const Message = require('../models/message');
const Crawling = require('../models/crawling');
const Database = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');

//Save project to the database
function saveProject(projectJson) {
    return Project.updateOne({id: projectJson.id}, projectJson, {upsert: true})
        /*.then(() => {
            //console.log('Projects saved : ' + JSON.stringify(projectJson.id))
        })*/
        .catch(function (err) {
            console.log("saveProject Error : " + JSON.stringify(err));
        });
}

//Save accounts to the database
function saveAccount(accountJson) {
    return Account.updateOne({_account_id: accountJson._account_id}, accountJson, {upsert: true})
        /*.then(() => {
            //console.log('Account saved : ' + JSON.stringify(accountJson._account_id))
        })*/
        .catch(function (err) {
            console.log("saveAccount Error : " + JSON.stringify(err));
        });
}

//saves changes to the database
function saveChangeSummary(changeJson) {
    return ChangeSummary.updateOne({id: changeJson.id}, changeJson, {upsert: true})
        /*.then(() => {
            //console.log('Change saved : ' + JSON.stringify(changeJson.id))
        });*/
}

//saves changes to the database
function saveChange(changeJson) {
    return Change.updateOne({id: changeJson.id}, changeJson, {upsert: true})
        /*.then(() => {
            //console.log('Change saved : ' + JSON.stringify(changeJson.id))
        })*/
        .catch(function (err) {
            console.log("save Change Error : " + changeJson.id + " " + JSON.stringify(err));
        });
}

function saveChanges(changesJson) {
    //console.log('changes Json');
    return Change.updateMany({id: changesJson.id}, changesJson, {upsert: true})
        /*.then(() => {
            //console.log('Change saved : ' + JSON.stringify(changeJson.id))
        })*/
        .catch(function (err) {
            console.log("save Change Error : "  + changesJson.id + " "  + JSON.stringify(err));
        });
    /*return Change.insertMany(changesJson)
        .then(() => {
            console.log('Changes saved')
        })
        .catch(function (err) {
            console.log("Error : " + err );
        });*/
}

//saves changes to the database
function saveMessage(message) {
    //console.log(message);
    return Message.findOneAndUpdate({id: message.id}, message, {upsert: true, new: true})
        /*.then((savedDoc) => {
            //console.log('Change saved : ' + JSON.stringify(changeJson.id))
        })*/
        .catch(function (err) {
            console.log("save Message Error : " + message.id + " " + JSON.stringify(err));
        });
}


module.exports = {
    saveChange: saveChange,
    saveChanges : saveChanges,
    saveChangeSummary: saveChangeSummary,
    saveAccount: saveAccount,
    saveProject: saveProject,
    saveMessage: saveMessage
};