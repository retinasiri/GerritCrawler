//const BotAccounts = require('../res/libreoffice-bot-account.json');
const fs = require('fs');
const MathJs = require('mathjs');
const PathLibrary = require('path');
const Utils = require('../config/utils');
const Config = require('../config.json');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const Database = require('../config/databaseConfig');
const cliProgress = require('cli-progress');

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
    return getHumanReviewersID(json, projectName) ? getHumanReviewersID(json, projectName).length : 0;
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
    let project = Config.project;
    let allBotAccountJson = {};
    Object.keys(project).forEach(function (key) {
        allBotAccountJson[key] = getBotAccount(key);
    })
    return allBotAccountJson;
}

//collect metrics


//function startComputeMetrics({projectName, projectDBUrl, DATA_PATH, type}, collectMetrics) {
/**
 * @param {Project} projectName The url of the code changes
 * @param {String} metricsType The url of the code changes
 * @param {function} collectMetrics The url of the code changes
 */
function startComputeMetrics(projectName, metricsType, collectMetrics) {

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
            let NUM_CONCURRENCY = 1;
            let NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUM_CONCURRENCY);
            let STEP = 5000
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            let tasks = []
            for (let i = 0; i < NUM_CONCURRENCY; i++) {
                let t = getChanges(NUM_OF_CHANGES_LIMIT * i, STEP, NUM_OF_CHANGES_LIMIT,
                        Project, MetricsJson, progressBar, collectMetrics);
                tasks.push(t);
            }
            //return getChanges(0, 1000, Project, MetricsJson, progressBar, collectMetrics)
            return Promise.all(tasks);
        })
        .then(() => {
            let name = Project.getName + "-" + MetricsJson.getType + "-metrics";
            return Utils.saveJSONInFile(Project.getOutputDirectory, name, MetricsJson.getMetricsJSON);
        })
        .then(() => {
            //free memory
            Object.keys(MetricsJson.getMetricsJSON).forEach(function (key) {
                delete MetricsJson.getMetricsJSON[key];
            })
            progressBar.stop();
            //console.log("Finished !!!!");
            return Database.freeMemory();
        })
        .then(() => {
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip, STEP, NUM_OF_CHANGES, Project, MetricsJson, progressBar, collectMetrics) {
    let num_collect = 0;
    return Change
        .aggregate([
            {$sort: {_number: 1, created: 1}},
            {$skip: skip},
            {$limit: STEP}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve(false)
            if (docs.length)
                return collectDocs(docs, Project, MetricsJson, progressBar, collectMetrics);
            else
                return Promise.resolve(true);
        })
        .then(result => {
            num_collect = num_collect + STEP;
            let rest = NUM_OF_CHANGES - num_collect;
            if (rest >= 0) {
                if (rest >= STEP) {
                    return getChanges(skip, STEP, NUM_OF_CHANGES, Project, MetricsJson, progressBar, collectMetrics)
                } else {
                    return getChanges(skip, rest, NUM_OF_CHANGES, Project, MetricsJson, progressBar, collectMetrics)
                }
            } else {
                return Promise.resolve(false);
            }
            //return result ? getChanges(skip, STEP, NUM_OF_CHANGES, Project, MetricsJson, progressBar, collectMetrics) : Promise.resolve(false);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs, Project, MetricsJson, progressBar, collectMetrics) {
    let NUMBER_OF_CONCURRENT_OPERATIONS = Utils.getCPUCount();
    let tasks = [];
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        let t = await collectMetrics(docs[key])
            .then((json) => {
                return saveMetrics(json, Project, MetricsJson, progressBar);
            })

        tasks.push(t);
        if (tasks.length >= NUMBER_OF_CONCURRENT_OPERATIONS) {
            await Promise.all(tasks).then(()=>{
                tasks = []
            });
        }
    }
    return Promise.resolve(true);
}

function saveMetrics(json, Project, MetricsJson, progressBar) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true}).then(() => {
        MetricsJson.getMetricsJSON[json.id] = json;
        let filename = Project.getName + "-" + MetricsJson.getType + "-metrics.csv";
        return Utils.add_line_to_file(json, filename, Project.getOutputDirectory);
    }).then(() => {
        return updateProgress(progressBar);
    });
}

async function updateProgress(progressBar) {
    progressBar.increment(1);
    return Promise.resolve(true);
}

module.exports = {
    getHumanReviewers: getHumanReviewers,
    getHumanReviewersID: getHumanReviewersID,
    getHumanReviewersCount: getHumanReviewersCount,
    isABot: isABot,
    startComputeMetrics: startComputeMetrics
};