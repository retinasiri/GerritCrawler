const fs = require('fs');
const Moment = require('moment');
const MathJs = require('mathjs');
const Utils = require('../config/utils');
const Config = require('../config.json');
const ChangeLite = require('../models/changeLite');
const Metrics = require('../models/metrics');
const Database = require('../config/databaseConfig');
const cliProgress = require('cli-progress');

const AllBotAccountJson = loadAllBotAccounts();

/**
 * @param {Project} projectName The url of the code changes
 * @param {number} start Beginning of codes changes processing
 * @param {number} end Ending of codes changes processing
 * @param {function} collectMetrics The url of the code changes
 */
function startComputeMetrics(projectName, start, end, collectMetrics) {
    console.time('ComputeMetrics')
    let Project = new Utils.Project(projectName)
    const progressBar = new cliProgress.SingleBar({
        barCompleteChar: '#',
        barIncompleteChar: '-',
    }, cliProgress.Presets.shades_classic);

    return Database.dbConnection(Project.getDBUrl)
        .then(() => {
            return ChangeLite.estimatedDocumentCount({});
        })
        .then((count) => {
            let skip = 0;
            let NUM_OF_CHANGES_LIMIT = 1000;
            if (start !== undefined && end !== undefined) {
                skip = start;
                NUM_OF_CHANGES_LIMIT = end - start;
            }
            console.log("Processing changes from " + skip + " to " + (NUM_OF_CHANGES_LIMIT + start));
            progressBar.start(NUM_OF_CHANGES_LIMIT, 0);
            return getChanges(skip, NUM_OF_CHANGES_LIMIT, progressBar, collectMetrics);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished !!!!");
            console.timeEnd('ComputeMetrics')
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip, step, progressBar, collectMetrics) {
    return ChangeLite
        .aggregate([
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
                return collectDocs(docs, progressBar, collectMetrics);
            }
            else
                return Promise.resolve(true);
        })
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

async function collectDocs(docs, progressBar, collectMetrics) {
    const CONCURRENCY_NUM = 4;
    if (!docs)
        return Promise.resolve(true);
    let tasks = []
    for (let key in docs) {
        let t =  collectMetrics(docs[key])
            .then((json) => {
                return saveMetrics(json, progressBar);
            })
        tasks.push(t)

        if(tasks.length >= CONCURRENCY_NUM){
            await Promise.all(tasks).then((json) => {
                tasks = []
                return Promise.resolve(true);
            })
        }
    }
    return Promise.resolve(true);
}

function saveMetrics(json, progressBar) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true}).then(() => {
        return updateProgress(progressBar);
    })
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
    return bot;
}

function loadAllBotAccounts() {
    let allBotAccountJson = {};
    let bot = require('../res/bot-account.json');
    Object.keys(bot).forEach(function (key) {
        allBotAccountJson[key] = bot[key]["bot_account"];
    })
    return allBotAccountJson;
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