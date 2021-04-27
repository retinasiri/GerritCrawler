const MathJs = require('mathjs');
const Moment = require('moment');
const Mongoose = require('mongoose');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const PathLibrary = require('path');

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectApiUrl = libreOfficeJson["projectApiUrl"];
let projectName = libreOfficeJson["projectName"];

let STARTING_POINT = 0;
let NUM_DAYS_FOR_RECENT = 120;
let NUM_OF_CHANGES_LIMIT = 1000;
let NUM_CONCURRENCY = Utils.getCPUCount() ? Utils.getCPUCount() : 4;
let DATA_PATH = "data/";

let metricsJson = {};

if (typeof require !== 'undefined' && require.main === module) {
    startComputeMetrics(libreOfficeJson).catch(err => {
        console.log(err)
    });
}

function startComputeMetrics(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUM_CONCURRENCY);
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, STARTING_POINT);

            let tasks = []
            for (let i = 0; i < NUM_CONCURRENCY; i++) {
                tasks.push(getChanges(NUM_OF_CHANGES_LIMIT * i))
            }

            return Promise.all(tasks);
        })
        .then(() => {
            let name = projectName + "-recent-metrics";
            let path = PathLibrary.join(DATA_PATH, projectName);
            return Utils.saveJSONInFile(path, name, metricsJson);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished!!!!");
            return Mongoose.connection.close();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip) {
    return Change
        .aggregate([
            {$sort: {_number: 1, created: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve(false)
            return docs.length ? collectDocs(docs) : Promise.resolve(false);
        })
        .then(result => {
            return result ? getChanges(skip + NUM_OF_CHANGES_LIMIT) : Promise.resolve(false);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        await collectMetrics(docs[key])
            .then((json) => {
                return saveMetrics(json);
            })
    }
    return Promise.resolve(true);
}

/**
 * @param {JSON} json Output json to save
 */
function saveMetrics(json) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true}).then(() => {
        metricsJson[json.id] = json;
        let prefix = Utils.getProjectName(projectApiUrl);
        let filename = prefix + "-recent-metrics.csv"
        return Utils.add_line_to_file(json, filename, DATA_PATH)
    }).then(() => {
        return updateProgress();
    });
}

async function updateProgress() {
    progressBar.increment(1);
    return Promise.resolve(true);
}

async function collectMetrics(json) {
    return getRecentMetrics(json).then((recentChange) => {
        let metric = {};
        metric["number"] = json._number;
        metric["id"] = json.id;

        metric["recent_num_change"] = recentChange.recent_num_change;
        metric["recent_total_num_merged"] = recentChange.recent_total_num_merged;
        metric["recent_total_num_abandoned"] = recentChange.recent_total_num_abandoned;
        metric["recent_total_num_non_close_change"] = recentChange.recent_total_num_non_close_change;

        metric["recent_owner_num_change"] = recentChange.recent_owner_num_change;
        metric["recent_owner_num_merged"] = recentChange.recent_owner_num_merged;
        metric["recent_owner_num_abandoned"] = recentChange.recent_owner_num_abandoned;
        metric["recent_owner_num_non_close_change"] = recentChange.recent_owner_num_non_close_change;

        metric["recent_total_merged_ratio"] = recentChange.recent_total_merged_ratio;
        metric["recent_owner_merged_ratio"] = recentChange.recent_owner_merged_ratio;
        metric["recent_owner_percentage_of_merged"] = recentChange.recent_owner_percentage_of_merged;

        metric["recent_review_num_mean"] = recentChange.recent_review_num_mean;
        metric["recent_reviews_non_close_mean"] = recentChange.recent_reviews_non_close_mean;
        metric["recent_review_num_max"] = recentChange.recent_review_num_max;
        metric["recent_reviews_non_close_max"] = recentChange.recent_reviews_non_close_max;
        return Promise.resolve(metric)
    });
}

function getRecentMetrics(json) {
    return getPreviousRecentChanges(json).then((previousRecentChanges) => {
        return computePreviousChange(json, previousRecentChanges);
    });
}

function getPreviousRecentChanges(json) {
    let endDate = Moment(json.created).toDate().toISOString();
    let startDate = Moment(json.created).subtract(NUM_DAYS_FOR_RECENT, 'days').toDate().toISOString();
    let number = json._number
    return Change
        .find({
            '_number': {$lte: number},
            'created': {$lte: endDate, $gte: startDate}
        })
        .exec()
        .then(docs => {
            if (!docs)
                return [];
            return docs;
        })
        .catch(err => {
            console.log(err)
        });
}

function computePreviousChange(json, previousRecentChanges) {

    let reviewers = {}

    let ownerId = json.owner._account_id;
    let recent_total_num_merged = 0;
    let recent_owner_num_merged = 0;
    let recent_owner_num_change = 0;
    let recent_num_change = 0;
    let recent_total_num_abandoned = 0;
    let recent_owner_num_abandoned = 0;
    let recent_total_num_non_close_change = 0;
    let recent_owner_num_non_close_change = 0;
    let date1 = Moment(json.created).toDate().getTime();
    let oNumber = json._number;

    for (let id in previousRecentChanges) {
        let rChange = previousRecentChanges[id];

        let rNumber = rChange._number;
        if (oNumber <= rNumber)
            continue;

        recent_num_change++;

        if (rChange.owner._account_id === ownerId) {
            recent_owner_num_change++;
        }

        let updateDate = Moment(rChange.updated).toDate().getTime();
        //console.log("updateDate : " + updateDate);
        //console.log("date1 " +  date1);
        if (date1 >= updateDate) {
            //console.log("date1 > updateDate");
            if (rChange.status === "MERGED") {
                recent_total_num_merged++;
                if (rChange.owner._account_id === ownerId) {
                    recent_owner_num_merged++;
                }
            } else if (rChange.status === "ABANDONED") {
                recent_total_num_abandoned++;
                if (rChange.owner._account_id === ownerId) {
                    recent_owner_num_abandoned++;
                }
            }
        } else {
            recent_total_num_non_close_change++;
            if (rChange.owner._account_id === ownerId) {
                recent_owner_num_non_close_change++;
            }
        }

        reviewers = collectReviewersMetrics(rChange, reviewers, date1, oNumber);

    }

    let humanReviewersID = MetricsUtils.getHumanReviewersID(json, projectName);
    let recent_reviews_tab = []
    let recent_reviews_non_close_tab = []

    for (let k in humanReviewersID) {
        let revId = humanReviewersID[k];

        if (reviewers[revId]) {
            recent_reviews_tab.push(reviewers[revId]["recent_review_num"])
            recent_reviews_non_close_tab.push(reviewers[revId]["recent_non_close_review_num"])
        }
    }

    let recent_review_num_mean = recent_reviews_tab.length > 0 ? MathJs.mean(recent_reviews_tab) : 0;
    let recent_review_num_max = recent_reviews_tab.length > 0 ? MathJs.max(recent_reviews_tab) : 0;

    let recent_reviews_non_close_mean = recent_reviews_non_close_tab.length > 0 ? MathJs.mean(recent_reviews_non_close_tab) : 0;
    let recent_reviews_non_close_max = recent_reviews_non_close_tab.length > 0 ? MathJs.max(recent_reviews_non_close_tab) : 0;

    let total_merged_ratio = recent_num_change !== 0 ? recent_total_num_merged / recent_num_change : 0;
    let owner_merged_ratio = recent_owner_num_change !== 0 ? recent_owner_num_merged / recent_owner_num_change : 0;
    let owner_percentage_of_merged = recent_total_num_merged !== 0 ? recent_owner_num_merged / recent_total_num_merged : 0;

    return {
        recent_num_change: recent_num_change,
        recent_total_num_merged: recent_total_num_merged,
        recent_total_num_abandoned: recent_total_num_abandoned,
        recent_total_num_non_close_change: recent_total_num_non_close_change,

        recent_owner_num_change: recent_owner_num_change,
        recent_owner_num_merged: recent_owner_num_merged,
        recent_owner_num_abandoned: recent_owner_num_abandoned,
        recent_owner_num_non_close_change: recent_owner_num_non_close_change,

        recent_total_merged_ratio: total_merged_ratio,
        recent_owner_merged_ratio: owner_merged_ratio,
        recent_owner_percentage_of_merged: owner_percentage_of_merged,

        recent_review_num_mean: recent_review_num_mean,
        recent_reviews_non_close_mean: recent_reviews_non_close_mean,
        recent_review_num_max: recent_review_num_max,
        recent_reviews_non_close_max: recent_reviews_non_close_max
    }
}

function collectReviewersMetrics(recentChange, reviewers, date1, oNumber) {
    let changeReviewersID = MetricsUtils.getHumanReviewersID(recentChange, projectName);

    for (let p in changeReviewersID) {
        let revId = changeReviewersID[p];

        if (oNumber <= recentChange._number)
            continue;

        reviewers[revId] = {};

        if (!reviewers[revId]["recent_review_num"])
            reviewers[revId]["recent_review_num"] = 0

        if (!reviewers[revId]["recent_non_close_review_num"])
            reviewers[revId]["recent_non_close_review_num"] = 0

        reviewers[revId]["recent_review_num"] += 1;

        let date_updated = Moment(recentChange.updated).toDate().getTime();

        if (date1 < date_updated) {
            reviewers[revId]["recent_non_close_review_num"] += 1;
        }
    }
    //console.log("reviewers 2 : " + JSON.stringify(reviewers))

    return reviewers;
}

module.exports = {
    start: startComputeMetrics
};