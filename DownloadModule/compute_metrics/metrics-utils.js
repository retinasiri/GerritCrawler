const BotAccounts = require('../res/libreoffice-bot-account.json')

function getHumanReviewers(json) {
    let reviewers = json.reviewers.REVIEWER;
    let reviewerArray = [];
    for (let id in reviewers) {
        let reviewerId = reviewers[id]._account_id;
        if (!isABot(reviewerId))
            reviewerArray.push(reviewers[id])
    }
    return reviewerArray;
}

function getHumanReviewersID(json) {
    let reviewers = json.reviewers.REVIEWER;
    let reviewersIDArray = [];
    for (let id in reviewers) {
        let reviewerId = reviewers[id]._account_id;
        if (!isABot(reviewerId))
            reviewersIDArray.push(reviewers[id]._account_id)
    }
    return reviewersIDArray;
}

function getHumanReviewersCount(json) {
    return getHumanReviewersID? getHumanReviewersID.length : 0;
}

function isABot(accountId) {
    let bot = false;
    for (let key in BotAccounts) {
        let botId = BotAccounts[key]._account_id;
        if (botId === accountId)
            bot = true;
    }
    return bot;
}


module.exports = {
    getHumanReviewers: getHumanReviewers,
    getHumanReviewersID: getHumanReviewersID,
    getHumanReviewersCount : getHumanReviewersCount,
    isABot: isABot
};