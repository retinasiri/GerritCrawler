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

function getBotArray(projectName) {
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
    //console.log(BotAccounts)
    if (BotAccounts[accountId])
        bot = true;
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
function startComputeMetrics(projectName, start, end, collectMetrics) {

    let Project = new Utils.Project(projectName)
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
            return getChanges(skip, NUM_OF_CHANGES_LIMIT, Project, progressBar, collectMetrics);
        })
        .then(() => {
            progressBar.stop();
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip, step, Project, progressBar, collectMetrics) {
    return Change
        .aggregate([
            {$sort: {created: 1}},
            //{$sort: {_number: 1}},
            //{$sort: {created: 1, _number: 1}},
            {$skip: skip},
            {$limit: step}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve(false)
            if (docs.length) {
                return collectDocs(docs, Project, progressBar, collectMetrics);
            } else
                return Promise.resolve(true);
        })
        /*.then(result => {
            return result ? getChanges(skip + step) : Promise.resolve(false);
        })*/
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs, Project, progressBar, collectMetrics) {
    console.time('collectDocs')
    let CONCURRENT = 500
    if (!docs)
        return Promise.resolve(true);

    let queue = [];
    let ret = [];
    for (let key in docs) {
        let p = collectMetrics(docs[key])
            .then((json) => {
                queue.splice(queue.indexOf(p), 1);
                return saveMetrics(json, Project, progressBar);
            })

        queue.push(p);
        ret.push(p);
        // if max concurrent, wait for one to finish
        if (queue.length >= CONCURRENT) {
            await Promise.race(queue);
        }
    }

    await Promise.all(queue);
    console.timeEnd('collectDocs')
    return Promise.resolve(true);
}


/*async function collectDocs(docs, Project, progressBar, collectMetrics) {
    console.time('collectDocs')
    if (!docs)
        return Promise.resolve(true);

    let tasks = []
    for (let key in docs) {
        let t = collectMetrics(docs[key])
            .then((json) => {
                return saveMetrics(json, Project, progressBar);
            })

        tasks.push(t)
        await delay(300)
    }

    return Promise.all(tasks).then(result => {
        console.timeEnd('collectDocs')
        return Promise.resolve(true);
    });
}*/

function saveMetrics(json, Project, progressBar) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true}).then(() => {
        return updateProgress(progressBar);
    })
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function updateProgress(progressBar) {
    progressBar.increment(1);
    return Promise.resolve(true);
}

function mixDoc(array) {
    let temp = []
    for (let i = 0; i < array.length; i++) {
        if (isOdd(i))
            temp.push(array[i])
        else
            temp.push(array[array.length - i])
    }
    return temp
}

function isOdd(num) {
    return num % 2;
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

function is_trivial_rebase(json) {
    let kind = get_first_revision_kind(json);
    return kind.includes("TRIVIAL_REBASE");
}

function diffCreatedUpdatedTime(json) {
    let createdTime = Moment(json.created);
    let updatedTime = Moment(json.updated);
    return Math.abs(createdTime.toDate() - updatedTime.toDate());
}

function getReviewersId(json) {
    if (!json.reviewers)
        return []

    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id]._account_id)
    }
    return reviewerArray;
}

function timeDiff(time1, time2) {
    let createdTime = Moment.utc(time1);
    let updatedTime = Moment.utc(time2);
    let time = Math.abs(createdTime.toDate() - updatedTime.toDate());
    return Moment.duration(time).asHours()
}


//autoreview

function check_self_review(json, projectName) {
    let status = json.status
    let is_merged_or_abandoned = (status === "MERGED" || status === "ABANDONED")

    if (isOwnerTheOnlyReviewer(json) && is_merged_or_abandoned)
        return true;

    let self_review = is_self_reviewed_note(json, projectName);

    if (self_review.check_code_review_2_owner && self_review.check_code_review_2_count === 1)
        return true;

    if (self_review.check_code_review_minus_2_owner && self_review.check_code_review_minus_2_count === 1)
        return true;

    return false;
}


function isSelfReviewed(json, projectName) {
    let humanReviewersID = getHumanReviewersID(json, projectName);
    let ownerId = json.owner._account_id;
    if (humanReviewersID.length === 1) {
        if (ownerId === humanReviewersID[0])
            return 1
    }
    return 0;
}

function isOwnerAReviewer(json) {
    let reviewersId = getReviewersId(json);
    let ownerId = json.owner._account_id;
    return reviewersId.includes(ownerId);
}

function isOwnerTheOnlyReviewer(json) {
    let reviewersId = getReviewersId(json);
    let ownerId = json.owner._account_id;
    return reviewersId.includes(ownerId) && reviewersId.length === 1;
}

function is_self_reviewed_note(json, projectName) {
    let labels = json["labels"];

    if (!!!labels)
        return false;

    let code_review = []
    if (labels["Code-Review"])
        if (labels["Code-Review"]["all"])
            code_review = labels["Code-Review"]["all"];

    let verified = []
    if (labels["Verified"])
        if (labels["Verified"]["all"])
            verified = labels["Verified"]["all"];

    let owner_id = json.owner._account_id;

    let check_code_review_2_owner = check_review_owner(code_review, owner_id, 2);
    let check_code_review_2_count = check_review_count(code_review, 2);
    let check_code_review_minus_2_owner = check_review_owner(code_review, owner_id, -2);
    let check_code_review_minus_2_count = check_review_count(code_review, -2);
    let check_code_review_human_length = count_human_review(json, code_review, projectName);
    let check_code_review_length = code_review.length;

    let check_verified_2_owner = check_review_owner(verified, owner_id, 2);
    let check_verified_2_count = check_review_count(verified, 2);
    let check_verified_minus_2_owner = check_review_owner(verified, owner_id, -2);
    let check_verified_minus_2_count = check_review_count(verified, -2);
    let count_verified_human_length = count_human_review(json, verified, projectName);
    let count_verified_length = verified.length;

    let check_code_review_1_owner = check_review_owner(code_review, owner_id, 1);
    let check_code_review_1_count = check_review_count(code_review, 1);
    let check_code_review_minus_1_owner = check_review_owner(code_review, owner_id, -1);
    let check_code_review_minus_1_count = check_review_count(code_review, -1);

    let check_verified_1_owner = check_review_owner(verified, owner_id, 1);
    let check_verified_1_count = check_review_count(verified, 1);
    let check_verified_minus_1_owner = check_review_owner(verified, owner_id, -1);
    let check_verified_minus_1_count = check_review_count(verified, -1);

    return {
        check_code_review_2_owner: check_code_review_2_owner,
        check_code_review_2_count: check_code_review_2_count,
        check_code_review_minus_2_owner: check_code_review_minus_2_owner,
        check_code_review_minus_2_count: check_code_review_minus_2_count,
        check_code_review_human_length: check_code_review_human_length,
        check_code_review_length: check_code_review_length,
        check_verified_2_owner: check_verified_2_owner,
        check_verified_2_count: check_verified_2_count,
        check_verified_minus_2_owner: check_verified_minus_2_owner,
        check_verified_minus_2_count: check_verified_minus_2_count,
        count_verified_human_length: count_verified_human_length,
        count_verified_length: count_verified_length,

        check_code_review_1_owner: check_code_review_1_owner,
        check_code_review_1_count: check_code_review_1_count,
        check_code_review_minus_1_owner: check_code_review_minus_1_owner,
        check_code_review_minus_1_count: check_code_review_minus_1_count,
        check_verified_1_owner: check_verified_1_owner,
        check_verified_1_count: check_verified_1_count,
        check_verified_minus_1_owner: check_verified_minus_1_owner,
        check_verified_minus_1_count: check_verified_minus_1_count,
    }

}

function count_human_review(json, code_review, projectName) {
    let count = 0;
    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let _account_id = review._account_id
        if (!isABot(_account_id, projectName)) {
            count++;
        }
    }
    return count;
}

function check_review_owner(code_review, owner_id, VALUE) {
    let check = false;
    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let _account_id = review._account_id
        if (_account_id !== owner_id) {
            continue;
        }
        let value = review.value;
        if (value === VALUE)
            check = true;
    }
    return check;
}

function check_review_count(code_review, VALUE) {
    let count = 0;
    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let value = review.value;
        if (value === VALUE)
            count += 1;
    }
    return count;
}

function add_suffix_to_json(json, suffix, id_to_conserved = null) {
    let new_json = {}
    if (json) {
        Object.keys(json).forEach(function (key) {
            if (id_to_conserved !== null) {
                if (id_to_conserved.includes(key)) {
                    new_json[key] = json[key]
                } else {
                    new_json[key + suffix] = json[key]
                }
            } else {
                new_json[key + suffix] = json[key]
            }
        })
    }
    return new_json;
}

function safeDivision(number1, number2) {
    return number2 !== 0 ? MathJs.divide(number1, number2) : 0;
}

function get_timezone(json) {
    let tz = {"committer": 0, "author": 0};
    let revisions = json.revisions
    for (let id in revisions) {
        let revision = revisions[id]
        if (!!revision["commit"]) {
            if (!!revision["commit"]["committer"])
                tz.committer = revision.commit.committer.tz;
            if (!!revision["commit"]["author"])
                tz.author = revision.commit.author.tz;
            break;
        }
    }
    return tz;
}

function stringEqual(string1, string2){
    if(!string1)
        return false;
    if(!string2)
        return false
    let t1 = string1.toLowerCase().trim();
    let t2 = string2.toLowerCase().trim();
    return(t1 === t2)
}

function get_timezone_owner(json) {
    let owner_name = json.owner.name;
    let owner_email = json.owner.name;
    let revisions = json.revisions
    for (let id in revisions) {
        let revision = revisions[id]
        if (!!revision["commit"]) {
            if (!!revision["commit"]["committer"]){
                let committer_name = revision.commit.committer.name;
                let committer_email = revision.commit.committer.email;
                if(stringEqual(committer_name, owner_name) || stringEqual(owner_email, committer_email)){
                    return revision.commit.committer.tz;
                }
            }
            if (!!revision["commit"]["author"]){
                let committer_name = revision.commit.author.name;
                let committer_email = revision.commit.author.email;
                if(stringEqual(committer_name, owner_name) || stringEqual(owner_email, committer_email)){
                    return revision.commit.author.tz;
                }
            }
            break;
        }
    }
    return 0;
}

function get_month(dateString) {
    return Moment.utc(dateString, "YYYY-MM-DD hh:mm:ss.SSSSSSSSS").format('MMMM')
}

function get_month_for_owner(dateString, offset) {
    return Moment.utc(dateString, "YYYY-MM-DD hh:mm:ss.SSSSSSSSS").utcOffset(offset).format('MMMM')
}

module.exports = {
    getHumanReviewers: getHumanReviewers,
    getHumanReviewersID: getHumanReviewersID,
    getHumanReviewersCount: getHumanReviewersCount,
    isABot: isABot,
    getBotArray: getBotArray,
    startComputeMetrics: startComputeMetrics,
    get_first_revision_kind: get_first_revision_kind,
    get_first_revision: get_first_revision,
    get_first_revision_number: get_first_revision_number,
    get_first_revision_id: get_first_revision_id,
    is_trivial_rebase: is_trivial_rebase,
    diffCreatedUpdatedTime: diffCreatedUpdatedTime,
    getReviewersId: getReviewersId,
    timeDiff: timeDiff,
    check_self_review: check_self_review,
    add_suffix_to_json: add_suffix_to_json,
    safeDivision: safeDivision,
    get_timezone: get_timezone,
    get_timezone_owner: get_timezone_owner,
    get_month: get_month,
    get_month_for_owner: get_month_for_owner,
    is_self_reviewed_note: is_self_reviewed_note,
};