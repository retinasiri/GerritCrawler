const Moment = require('moment');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
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
let NUM_OF_CHANGES_LIMIT = 35000;

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
                return saveMetadata(json);
            })
    }
    return Promise.resolve(true);
}

function saveMetadata(json) {
    return Change.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            return updateProgress();
        });
}

async function updateProgress() {
    progressBar.increment(1);
    return Promise.resolve(true);
}

async function collectMetadata(json) {
    let metadata = {};
    let messages = json.messages;
    metadata["meta_owner_id"] = json.owner._account_id;
    metadata["meta_msg_count"] = Object.keys(messages).length;
    metadata['meta_messages_per_account'] = {}
    for(let key in messages) {
        let author = messages[key].author._account_id;
        if(metadata['meta_messages_per_account'][author])
            metadata['meta_messages_per_account'][author] = metadata['messages_per_account'][author] + 1;
        else
            metadata['meta_messages_per_account'][author] = 1;
    }
    let revisions = json.revisions;
    metadata["meta_revisions_num"] = Object.keys(revisions).length
    metadata["meta_date_updated_date_created_diff"]= diffCreatedUpdatedTime(json);
    metadata["meta_reviewers_ids"] = getReviewersId(json);
    metadata["meta_not_bot_reviewers"] = MetricsUtils.getHumanReviewersID(json, projectName);
    metadata["meta_is_a_bot"] = MetricsUtils.isABot(json.owner, projectName);
    metadata["meta_first_revision"] = MetricsUtils.get_first_revision(json)
    metadata["meta_first_revision_kind"] = MetricsUtils.get_first_revision_kind(json)
    metadata["meta_is_trivial_rebase"] = MetricsUtils.is_trivial_rebase(json);

    return metadata;
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
    start: startComputeMetadata
};