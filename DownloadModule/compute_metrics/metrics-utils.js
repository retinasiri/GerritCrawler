//const BotAccounts = require('../res/libreoffice-bot-account.json');
const fs = require('fs');
const Moment = require('moment');
const MathJs = require('mathjs');
const PathLibrary = require('path');
const Utils = require('../config/utils');
const Config = require('../config.json');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const Database = require('../config/databaseConfig');
const cliProgress = require('cli-progress');

const AllBotAccountJson = loadAllBotAccounts();
//console.log(AllBotAccountJson)
//const AllBotAccountJson = require('../res/bot-account.json');

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
        //console.log(reviewerId)
        if (!isABot(reviewerId, projectName))
            reviewersIDArray.push(reviewers[id]._account_id)
    }
    //console.log(reviewersIDArray)
    return reviewersIDArray;
}

function getBotArray(projectName){
    let BotAccounts = AllBotAccountJson[projectName];
    let botArray = [];
    Object.keys(BotAccounts).forEach(function (key) {
        botArray.push(BotAccounts[key]._account_id);
    })
    return botArray;
}

function getHumanReviewersCount(json, projectName) {
    return getHumanReviewersID(json, projectName) ? getHumanReviewersID(json, projectName).length : 0;
}

function isABot(accountId, projectName) {
    let bot = false;
    let BotAccounts = AllBotAccountJson[projectName]
    if(BotAccounts[accountId])
        bot = true;
    /*for (let key in BotAccounts) {
        let botId = BotAccounts[key]._account_id;
        if (botId === accountId)
            bot = true;
    }*/
    /*if(bot === true)
        console.log(accountId)*/
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

function getBotAccount(projectName) {
    let filename = projectName + "-bot-account.json";
    let filePath = PathLibrary.join("..", "res", projectName, filename);
    //return require(filePath);
    //let filePath = PathLibrary.join(Config.output_data_path, Config.project[projectName]["db_name"], filename)
    //let botAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    try {
        if (fs.existsSync(filePath)) {
            return require(filePath)
        }
    } catch (err) {
        console.error("Bot account" + err)
    }
    return {};
}

function loadAllBotAccounts() {
    //let project = Config.project;
    let allBotAccountJson = {};
    let bot = require('../res/bot-account.json');

    Object.keys(bot).forEach(function (key) {
        //allBotAccountJson[key] = getBotAccount(key);
        allBotAccountJson[key] = bot[key]["bot_account"];
    })
    return allBotAccountJson;
}

//collect metrics


//function startComputeMetrics({projectName, projectDBUrl, DATA_PATH, type}, collectMetrics) {
/**
 * @param {Project} projectName The url of the code changes
 * @param {number} start Beginning of codes changes processing
 * @param {number} end Ending of codes changes processing
 * @param {String} metricsType The url of the code changes
 * @param {function} collectMetrics The url of the code changes
 */
function startComputeMetrics(projectName, start, end, metricsType, collectMetrics) {

    let Project = new Utils.Project(projectName)
    let MetricsJson = new Utils.Metrics(metricsType)
    const progressBar = new cliProgress.SingleBar({
        barCompleteChar: '#',
        barIncompleteChar: '-',
    }, cliProgress.Presets.shades_classic);

    return Database.dbConnection(Project.getDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            //let NUM_CONCURRENCY = Utils.getCPUCount() ? Utils.getCPUCount() : 4;
            //let NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUM_CONCURRENCY);
            let skip = 0;
            let NUM_OF_CHANGES_LIMIT = 1000;
            if (start !== undefined && end !== undefined) {
                skip = start;
                NUM_OF_CHANGES_LIMIT = end - start;
            }
            console.log("Processing changes from " + skip + " to " + (NUM_OF_CHANGES_LIMIT + start));
            progressBar.start(NUM_OF_CHANGES_LIMIT, 0);
            return getChanges(skip, NUM_OF_CHANGES_LIMIT, Project, MetricsJson, progressBar, collectMetrics);
        })
        .then(() => {
            let name = Project.getName + "-" + MetricsJson.getType + "-metrics";
            //return Utils.saveJSONInFile(Project.getOutputDirectory, name, MetricsJson.getMetricsJSON);
            return Promise.resolve(true)
        })
        .then(() => {
            //free memory
            Object.keys(MetricsJson.getMetricsJSON).forEach(function (key) {
                delete MetricsJson.getMetricsJSON[key];
            })
            progressBar.stop();
            //console.log("Finished !!!!");
            //return Database.freeMemory();
        })
        .then(() => {
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip, step, Project, MetricsJson, progressBar, collectMetrics) {
    return Change
        .aggregate([
            //{$match: {priorChangesCount : {$exists : false}}},
            //{$sort: {updated: 1, _number: 1}},
            {$sort: {_number: 1}},
            {$skip: skip},
            {$limit: step}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve(false)
            if (docs.length){
                return collectDocs(docs, Project, MetricsJson, progressBar, collectMetrics);
            }
            else
                return Promise.resolve(true);
        })
        /*.then(result => {
            return result ? getChanges(skip + step) : Promise.resolve(false);
        })*/
        .catch(err => {
            console.log(err)
        });
}

function mixDoc(array){
    let temp = []
    for (let i = 0; i < array.length; i++){
        if(isOdd(i))
            temp.push(array[i])
        else
            temp.push(array[array.length - i])
    }
    return temp
}
function isOdd(num) { return num % 2;}

async function collectDocs(docs, Project, MetricsJson, progressBar, collectMetrics) {
    console.time('collectDocs')
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        //console.log("docs._number : " + docs[key]._number);
        await collectMetrics(docs[key])
            .then((json) => {
                return saveMetrics(json, Project, MetricsJson, progressBar);
            })
    }
    console.timeEnd('collectDocs')
    return Promise.resolve(true);
}


function saveMetrics(json, Project, MetricsJson, progressBar) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true}).then(() => {
        //MetricsJson.getMetricsJSON[json.id] = json;
        //let filename = Project.getName + "-" + MetricsJson.getType + "-metrics.csv";
        //return Utils.add_line_to_file(json, filename, Project.getOutputDirectory);
        return updateProgress(progressBar);
    })
    /*.then(() => {
        return updateProgress(progressBar);
    });*/
}

async function updateProgress(progressBar) {
    progressBar.increment(1);
    return Promise.resolve(true);
}


function get_first_revision_id(json) {
    let revisions = json.revisions;
    let first_revision_number = null;
    let revision_id = 0;
    for (let i in revisions) {
        let number = revisions[i]._number;
        if (first_revision_number === null) {
            first_revision_number = number;
            revision_id = i;
        }

        if (number <= first_revision_number) {
            first_revision_number = number;
            revision_id = i;
        }
    }
    return revision_id;
}

function get_first_revision_number(json) {
    let first_revision = get_first_revision(json)
    return first_revision["_number"];
}

function get_first_revision(json) {
    let revisions = json.revisions;
    let first_revision_number = get_first_revision_id(json);
    return revisions[first_revision_number];
}

function get_first_revision_kind(json) {
    let first_revision = get_first_revision(json)
    let kind = first_revision["kind"]
    if (kind) {
        return kind;
    } else {
        return "UNDEFINED";
    }
}

function is_trivial_rebase(json){
    let kind = get_first_revision_kind(json);
    return kind.includes("TRIVIAL_REBASE");
}

function diffCreatedUpdatedTime(json) {
    let createdTime = Moment(json.created);
    let updatedTime = Moment(json.updated);
    return Math.abs(createdTime.toDate() - updatedTime.toDate());
}

function getReviewersId(json) {

    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id]._account_id)
    }
    return reviewerArray;
}

module.exports = {
    getHumanReviewers: getHumanReviewers,
    getHumanReviewersID: getHumanReviewersID,
    getHumanReviewersCount: getHumanReviewersCount,
    isABot: isABot,
    getBotArray: getBotArray,
    startComputeMetrics: startComputeMetrics,
    get_first_revision_kind: get_first_revision_kind,
    get_first_revision:get_first_revision,
    get_first_revision_number: get_first_revision_number,
    get_first_revision_id: get_first_revision_id,
    is_trivial_rebase: is_trivial_rebase,
    diffCreatedUpdatedTime: diffCreatedUpdatedTime,
    getReviewersId: getReviewersId
};