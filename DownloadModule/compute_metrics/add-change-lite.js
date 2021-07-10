const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const ChangeLite = require('../models/changeLite');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');

const progressBar = new cliProgress.SingleBar({
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectName = libreOfficeJson["projectName"];

let DATA_PATH = "data/"
let STARTING_POINT = 0;
let NUM_OF_CHANGES_LIMIT_PER_QUERY = 20000;

if (typeof require !== 'undefined' && require.main === module) {
    start(libreOfficeJson).catch(err => {
        console.log(err)
    });
}

function start(json) {
    console.time('ComputeMetrics')
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            NUM_OF_CHANGES_LIMIT_PER_QUERY = 10000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT_PER_QUERY);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT);
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
function getChanges(skip) {
    return Change
        .aggregate([
            {$sort: {_number: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT_PER_QUERY}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve(false)
            return docs.length ? collectDocs(docs) : Promise.resolve(false);
        })
        .then(result => {
            return result ? getChanges(skip + NUM_OF_CHANGES_LIMIT_PER_QUERY) : Promise.resolve(false);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        await collectChangeLite(docs[key])
            .then((json) => {
                return saveChanges(json);
            })
    }
    return Promise.resolve(true);
}

function saveChanges(json) {
    return ChangeLite.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            return updateProgress();
        });
}

async function updateProgress() {
    progressBar.increment(1);
    return Promise.resolve(true);
}

async function collectChangeLite(json) {
    let change_lite = {};
    change_lite._id = json.id;
    change_lite["id"] = json.id;
    change_lite["_number"] = json._number;
    change_lite["project"] = json.project;
    change_lite["branch"] = json.branch;
    change_lite["change_id"] = json.change_id;
    change_lite["status"] = json.status;
    change_lite["subject"] = json.subject;
    change_lite["created"] = json.created;
    change_lite["updated"] = json.updated;
    change_lite["diff_date_updated_date_created"] = MetricsUtils.diffCreatedUpdatedTime(json);
    change_lite["insertions"] = json.insertions;
    change_lite["deletions"] = json.deletions;
    change_lite["files_list"] = json.files_list;
    change_lite["files_list_count"] = json.files_list.length;

    if (json.topic)
        change_lite["topic"] = json.topic;
    if (json.total_comment_count)
        change_lite["total_comment_count"] = json.total_comment_count;
    if (json.unresolved_comment_count)
        change_lite["unresolved_comment_count"] = json.unresolved_comment_count;
    if (json.has_review_started)
        change_lite["has_review_started"] = json.has_review_started;
    if (json.submit_type)
        change_lite["submit_type"] = json.submit_type;
    if (json.mergeable)
        change_lite["mergeable"] = json.mergeable;

    let revisions = json.revisions;
    if (revisions) {
        change_lite["revisions_num"] = Object.keys(revisions).length
        change_lite["first_revision"] = MetricsUtils.get_first_revision_number(json)
        change_lite["first_revision_kind"] = MetricsUtils.get_first_revision_kind(json)
        change_lite["is_trivial_rebase"] = MetricsUtils.is_trivial_rebase(json);
    }

    change_lite = add_participants(json, change_lite)
    change_lite = add_messages(json, change_lite)
    change_lite = add_revision_info(json, change_lite)
    change_lite = add_code_review(json, change_lite)

    return change_lite;
}

function add_participants(json, change_lite) {
    if (json.owner) {
        let ownerId = json.owner._account_id;
        change_lite["owner"] = json.owner;
        change_lite["owner_id"] = ownerId;
        change_lite["owner_is_a_bot"] = MetricsUtils.isABot(ownerId, projectName);
    }

    if (json.submitter) {
        let submitter = json.submitter._account_id;
        change_lite["submitter_id"] = submitter;
        change_lite["submitter_is_a_bot"] = MetricsUtils.isABot(submitter, projectName);
    }

    if (json.reviewers) {
        change_lite["reviewers_ids"] = MetricsUtils.getReviewersId(json);
        change_lite["human_reviewers"] = MetricsUtils.getHumanReviewersID(json, projectName);
    }
    return change_lite;
}

function add_messages(json, change_lite) {
    let messages = json.messages;

    if (messages)
        change_lite["messages_count"] = Object.keys(messages).length;

    change_lite['messages_per_account'] = []
    change_lite['messages_human_count'] = 0
    change_lite['messages_bot_count'] = 0

    let messages_per_account = {}
    for (let key in messages) {
        if (!messages[key].author)
            continue;
        let author = messages[key].author._account_id;
        if (!messages_per_account[author])
            messages_per_account[author] = 1;
        else
            messages_per_account[author] = messages_per_account[author] + 1;

        //console.log(messages[key].author)
        if (MetricsUtils.isABot(author, projectName)) {
            change_lite['messages_bot_count'] += 1
        } else {
            change_lite['messages_human_count'] += 1
        }
    }

    Object.keys(messages_per_account).forEach(function (key) {
        let obj = {}
        obj['author_id'] = key;
        obj['messages_number'] = messages_per_account[key];
        change_lite['messages_per_account'].push(obj)
    })

    return change_lite
}

function add_revision_info(json, change_lite) {

    change_lite["is_owner_the_only_huaman_reviewer"] = is_owner_the_only_huaman_reviewer(json);

    let self_review = is_self_reviewed_note(json);
    change_lite["labels_code_review_2_owner"] = self_review.check_code_review_2_owner;
    change_lite["labels_code_review_2_count"] = self_review.check_code_review_2_count;
    change_lite["labels_code_review_minus_2_owner"] = self_review.check_code_review_minus_2_owner;
    change_lite["labels_code_review_minus_2_count"] = self_review.check_code_review_minus_2_count;

    change_lite["labels_code_review_human_length"] = self_review.check_code_review_human_length;
    change_lite["labels_code_review_length"] = self_review.check_code_review_length;

    change_lite["labels_verified_2_owner"] = self_review.check_verified_2_owner;
    change_lite["labels_verified_2_count"] = self_review.check_verified_2_count;
    change_lite["labels_verified_minus_2_owner"] = self_review.check_verified_minus_2_owner;
    change_lite["labels_verified_minus_2_count"] = self_review.check_verified_minus_2_count;

    change_lite["labels_verified_human_length"] = self_review.count_verified_human_length;
    change_lite["labels_verified_length"] = self_review.count_verified_length;

    change_lite["check_code_review_1_owner"] = self_review.check_code_review_1_owner;
    change_lite["check_code_review_1_count"] = self_review.check_code_review_1_count;
    change_lite["check_code_review_minus_1_owner"] = self_review.check_code_review_minus_1_owner;
    change_lite["check_code_review_minus_1_count"] = self_review.check_code_review_minus_1_count;
    change_lite["check_verified_1_owner"] = self_review.check_verified_1_owner;
    change_lite["check_verified_1_count"] = self_review.check_verified_1_count;
    change_lite["check_verified_minus_1_owner"] = self_review.check_verified_minus_1_owner;
    change_lite["check_verified_minus_1_count"] = self_review.check_verified_minus_1_count;

    change_lite["check_verified_0_owner"] = self_review.check_verified_0_owner;
    change_lite["check_verified_0_count"] = self_review.check_verified_0_count;
    change_lite["check_code_review_0_owner"] = self_review.check_code_review_0_owner;
    change_lite["check_code_review_0_count"] = self_review.check_code_review_0_count;

    change_lite["is_self_review"] = is_self_review(change_lite);

    return change_lite
}

function add_code_review(json, change_lite) {

    let labels = json["labels"]

    if (labels["Code-Review"])
        if (labels["Code-Review"]["all"])
            change_lite["Code-Review"] = get_review(json, "Code-Review");

    if (labels["Verified"])
        if (labels["Verified"]["all"])
            change_lite["Verified"] = get_review(json, "Verified");

    return change_lite;
}

function get_review(json, fields) {

    let array = []
    let labels = json["labels"]

    if (labels[fields])
        if (labels[fields]["all"])
            array = labels[fields]["all"];

    for (let i = 0; i < array.length; i++) {
        let obj = array[i];
        delete obj["status"]
        //delete obj["permitted_voting_range"]
        delete obj["name"]
        delete obj["email"]
        delete obj["username"]

        if (obj["permitted_voting_range"]) {
            obj["permitted_voting_range_min"] = obj["permitted_voting_range"]["min"]
            obj["permitted_voting_range_max"] = obj["permitted_voting_range"]["max"]
        }
        delete obj["permitted_voting_range"]
    }


    return array
}

function is_owner_the_only_huaman_reviewer(json) {
    let humanReviewersID = MetricsUtils.getHumanReviewersID(json, projectName);
    let ownerId = json.owner._account_id;
    if (humanReviewersID.length === 1) {
        if (ownerId === humanReviewersID[0])
            return 1
    }
    return 0;
}

function is_self_review(metrics) {
    let bool = false;
    if (metrics["check_code_review_2_owner"] >= 1 && metrics["check_code_review_length"] <= 1) {
        bool = true;
    }
    if (metrics["check_code_review_minus_2_owner"] >= 1 && metrics["check_code_review_human_length"] <= 1) {
        bool = true;
    }
    return bool;
}

function is_self_reviewed_note(json) {
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

    let check_code_review_human_length = count_human_review(json, code_review);
    let check_code_review_length = code_review.length;
    let count_verified_human_length = count_human_review(json, verified);
    let count_verified_length = verified.length;

    let check_code_review_2_owner = check_review_owner(code_review, owner_id, 2);
    let check_code_review_2_count = check_review_count(code_review, 2);
    let check_verified_2_owner = check_review_owner(verified, owner_id, 2);
    let check_verified_2_count = check_review_count(verified, 2);

    let check_code_review_minus_2_owner = check_review_owner(code_review, owner_id, -2);
    let check_code_review_minus_2_count = check_review_count(code_review, -2);
    let check_verified_minus_2_owner = check_review_owner(verified, owner_id, -2);
    let check_verified_minus_2_count = check_review_count(verified, -2);

    let check_code_review_1_owner = check_review_owner(code_review, owner_id, 1);
    let check_code_review_1_count = check_review_count(code_review, 1);
    let check_verified_1_owner = check_review_owner(verified, owner_id, 1);
    let check_verified_1_count = check_review_count(verified, 1);

    let check_code_review_minus_1_owner = check_review_owner(code_review, owner_id, -1);
    let check_code_review_minus_1_count = check_review_count(code_review, -1);
    let check_verified_minus_1_owner = check_review_owner(verified, owner_id, -1);
    let check_verified_minus_1_count = check_review_count(verified, -1);

    let check_verified_0_owner = check_review_owner(verified, owner_id, 0);
    let check_verified_0_count = check_review_count(verified, 0);
    let check_code_review_0_owner = check_review_owner(code_review, owner_id, 0);
    let check_code_review_0_count = check_review_count(code_review, 0);

    return {

        check_code_review_human_length: check_code_review_human_length,
        check_code_review_length: check_code_review_length,
        count_verified_human_length: count_verified_human_length,
        count_verified_length: count_verified_length,

        check_code_review_2_owner: check_code_review_2_owner,
        check_code_review_2_count: check_code_review_2_count,
        check_verified_2_owner: check_verified_2_owner,
        check_verified_2_count: check_verified_2_count,

        check_code_review_minus_2_owner: check_code_review_minus_2_owner,
        check_code_review_minus_2_count: check_code_review_minus_2_count,
        check_verified_minus_2_owner: check_verified_minus_2_owner,
        check_verified_minus_2_count: check_verified_minus_2_count,

        check_code_review_1_owner: check_code_review_1_owner,
        check_code_review_1_count: check_code_review_1_count,
        check_verified_1_owner: check_verified_1_owner,
        check_verified_1_count: check_verified_1_count,

        check_code_review_minus_1_owner: check_code_review_minus_1_owner,
        check_code_review_minus_1_count: check_code_review_minus_1_count,
        check_verified_minus_1_owner: check_verified_minus_1_owner,
        check_verified_minus_1_count: check_verified_minus_1_count,

        check_verified_0_owner: check_verified_0_owner,
        check_verified_0_count: check_verified_0_count,
        check_code_review_0_owner: check_code_review_0_owner,
        check_code_review_0_count: check_code_review_0_count,
    }

}

function count_human_review(json, code_review) {
    let count = 0;
    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let _account_id = review._account_id
        if (!MetricsUtils.isABot(_account_id, projectName)) {
            count++;
        }
    }
    return count;
}

function check_review_owner(code_review, owner_id, VALUE) {
    let check = true;
    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let _account_id = review._account_id
        if (_account_id !== owner_id) {
            continue;
        }
        let value = review.value;
        if (value === VALUE)
            check = false;
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

module.exports = {
    start: start
};