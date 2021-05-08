const MathJs = require('mathjs');
const Moment = require('moment');
const Change = require('../models/change');
const MetricsUtils = require('./metrics-utils');

let NUM_DAYS_FOR_RECENT = 120;
let projectName = "libreoffice";

if (typeof require !== 'undefined' && require.main === module) {
    startComputeMetrics(projectName).catch(err => {
        console.log(err)
    });
}

function startComputeMetrics(projectJson) {
    if (projectJson["projectName"])
        projectName = projectJson["projectName"];
    return MetricsUtils.startComputeMetrics(projectName, "recent", function(json){
        return collectMetrics(json)
        //return Promise.resolve(true)
    });
}

async function collectMetrics(json) {
    //return Promise.resolve(metric)
    return getRecentMetrics(json).then((recentChange) => {
        let metric = {};
        metric["number"] = json._number;
        metric["id"] = json.id;
        Object.keys(recentChange).forEach(function (key) {
            metric[key] = recentChange[key];
        })
        return Promise.resolve(metric)
    });
}

function getRecentMetrics(json) {
    return getPreviousRecentChanges(json).then((previousRecentChanges) => {
        //return Promise.resolve(true)
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
        if (date1 >= updateDate) {
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
    return reviewers;
}

module.exports = {
    start: startComputeMetrics
};