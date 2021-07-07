const Moment = require('moment');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');

const progressBar = new cliProgress.SingleBar({
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | delete_nums : {delete_change_nums}',
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectName = libreOfficeJson["projectName"];

let DATA_PATH = "data/"
let STARTING_POINT = 0;
let NUM_OF_CHANGES_LIMIT = 35000;
let delete_change_nums = 0;

if (typeof require !== 'undefined' && require.main === module) {
    startComputeMetadata(libreOfficeJson).catch(err => {
        console.log(err)
    });
}

function startComputeMetadata(json) {
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
            //NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUMBER_DATABASE_REQUEST);
            NUM_OF_CHANGES_LIMIT = 10000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished !!!!");
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
            {$match: {meta_is_a_bot: true}},
            {$sort: {_number: 1}},
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
        await collectMetadata(docs[key])
            .then((json) => {
                if (typeof json === 'boolean') {
                    if (!json) {
                        return deleteChange(json)
                    }
                }
                return saveMetadata(json);
            })
    }
    return Promise.resolve(true);
}

function deleteChange(json) {
    console.log('deleteChange : ' + json.id)
    return Change.deleteOne({id: json.id})
        .then(() => {
            console.log('deleted')
            return updateProgress();
        }).catch(err => {
            console.log(err)
        });
}

function saveMetadata(json) {
    return Change.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            return updateProgress();
        }).catch(err => {
            console.log(err)
        });
}

async function updateProgress() {
    progressBar.increment(1, {delete_change_nums: delete_change_nums});
    return Promise.resolve(true);
}

async function collectMetadata(json) {
    let metadata = {};
    metadata["id"] = json.id;

    let messages = json.messages;

    if (json.owner) {
        let ownerId = json.owner._account_id;
        metadata["meta_owner_id"] = ownerId;
        metadata["meta_is_a_bot"] = MetricsUtils.isABot(ownerId, projectName);
        if (metadata["meta_is_a_bot"])
            return Promise.resolve(false)
    }

    if (messages)
        metadata["meta_messages_count"] = Object.keys(messages).length;

    metadata['meta_messages_per_account'] = {}
    metadata['meta_messages_human_count'] = 0
    metadata['meta_messages_bot_count'] = 0

    for (let key in messages) {
        if (!messages[key].author)
            continue;
        let author = messages[key].author._account_id;
        if (!metadata['meta_messages_per_account'][author])
            metadata['meta_messages_per_account'][author] = 1;
        else
            metadata['meta_messages_per_account'][author] = metadata['meta_messages_per_account'][author] + 1;

        //console.log(messages[key].author)
        if (MetricsUtils.isABot(author, projectName)) {
            metadata['meta_messages_bot_count'] += 1
        } else {
            metadata['meta_messages_human_count'] += 1
        }
    }
    let revisions = json.revisions;
    if (revisions) {
        metadata["meta_revisions_num"] = Object.keys(revisions).length
        metadata["meta_first_revision"] = MetricsUtils.get_first_revision_number(json)
        metadata["meta_first_revision_kind"] = MetricsUtils.get_first_revision_kind(json)
        metadata["meta_is_trivial_rebase"] = MetricsUtils.is_trivial_rebase(json);
    }

    metadata["meta_date_updated_date_created_diff"] = diffCreatedUpdatedTime(json);
    if (json.reviewers) {
        metadata["meta_reviewers_ids"] = getReviewersId(json);
        metadata["meta_not_bot_reviewers"] = MetricsUtils.getHumanReviewersID(json, projectName);
    }

    metadata["close_time"] = get_close_time(json)
    metadata["is_close_time_updated_time"] = is_equal(metadata["close_time"], json.updated)
    metadata["meta_date_updated_date_created_diff"] = timeDiff(json.created, metadata["close_time"])
    metadata["previous_updated"] = json["updated"]
    metadata["updated"] = metadata["close_time"];

    return metadata;
}

function is_equal(time1, time2) {
    return time1 === time2;
}

function get_close_time(json) {
    let labels = json["labels"];
    let time = json.updated

    if (!!!labels)
        return time;

    let code_review = []
    if (labels["Code-Review"]) {
        if (labels["Code-Review"]["all"])
            code_review = labels["Code-Review"]["all"];
        else
            return time;
    } else {
        return time;
    }


    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let value = review.value;
        if (value === 2 || value === -2) {
            time = review.date
        }
    }

    return time;
}

function timeDiff(time1, time2) {
    let createdTime = Moment.utc(time1);
    let updatedTime = Moment.utc(time2);
    let time = Math.abs(createdTime.toDate() - updatedTime.toDate());
    return Moment.duration(time).asHours()
}

function diffCreatedUpdatedTime(json) {
    let createdTime = Moment.utc(json.created);
    let updatedTime = Moment.utc(json.updated);
    let time = Math.abs(createdTime.toDate() - updatedTime.toDate());
    return Moment.duration(time).asHours()
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
    start: startComputeMetadata
};