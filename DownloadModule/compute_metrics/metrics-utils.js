//const BotAccounts = require('../res/libreoffice-bot-account.json');
const Config = require('../config.json');
const PathLibrary = require('path');
const fs = require('fs');
const AllBotAccountJson = loadAllBotAccounts();

function getHumanReviewers(json, projectName) {
    let reviewers = json.reviewers.REVIEWER;
    let reviewerArray = [];
    for (let id in reviewers) {
        let reviewerId = reviewers[id]._account_id;
        if (!isABot(reviewerId, projectName))
            reviewerArray.push(reviewers[id])
    }
    return reviewerArray;
}

function getHumanReviewersID(json, projectName) {
    let reviewers = json.reviewers.REVIEWER;
    let reviewersIDArray = [];
    for (let id in reviewers) {
        let reviewerId = reviewers[id]._account_id;
        if (!isABot(reviewerId, projectName))
            reviewersIDArray.push(reviewers[id]._account_id)
    }
    return reviewersIDArray;
}

function getHumanReviewersCount(json, projectName) {
    return getHumanReviewersID(json, projectName)? getHumanReviewersID(json, projectName).length : 0;
}

function isABot(accountId, projectName) {
    let bot = false;
    let BotAccounts = AllBotAccountJson[projectName]
    for (let key in BotAccounts) {
        let botId = BotAccounts[key]._account_id;
        if (botId === accountId)
            bot = true;
    }
    return bot;
}

/*function isABot(accountId) {
    let bot = false;
    for (let key in BotAccounts) {
        let botId = BotAccounts[key]._account_id;
        if (botId === accountId)
            bot = true;
    }
    return bot;
}*/

function getBotAccountFromConfig(projectName){
    let filename = projectName + "-bot-account.json";
    let filePath = PathLibrary.join(Config.output_data_path, Config.project[projectName]["db_name"], filename)
    //let botAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    try {
        if (fs.existsSync(filePath)) {
            return require(filePath)
        }
    } catch(err) {
        console.error(err)
    }
    return {};
}

function loadAllBotAccounts(){
    let project = Config.project;
    let allBotAccountJson = {};
    Object.keys(project).forEach(function (key) {
        allBotAccountJson[key] = getBotAccountFromConfig(key);
    })
    return allBotAccountJson;
}


module.exports = {
    getHumanReviewers: getHumanReviewers,
    getHumanReviewersID: getHumanReviewersID,
    getHumanReviewersCount : getHumanReviewersCount,
    isABot: isABot
};