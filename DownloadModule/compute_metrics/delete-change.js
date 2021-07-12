const Moment = require('moment');
const MathJs = require('mathjs');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');

const progressBar = new cliProgress.SingleBar({
    //format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | delete_nums : {delete_change_nums}',
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectName = libreOfficeJson["projectName"];

let DATA_PATH = "data/"
let STARTING_POINT = 0;
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
            let NUM_OF_CHANGES_LIMIT = 3000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT, NUM_OF_CHANGES_LIMIT);
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
function getChanges(skip, NUM_OF_CHANGES_LIMIT = 20000) {
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
            .then((data) => {
                let json = data.data;
                let keep = data.keep;
                if (typeof keep === 'boolean') {
                    if (!json) {
                        return deleteChange(docs[key])
                    }
                }
                return saveMetadata(json);
            })
    }
    return Promise.resolve(true);
}

function deleteChange(json) {
    return Change.deleteOne({id: json.id})
        .then(() => {
            delete_change_nums += 1;
            return updateProgress();
        }).catch(err => {
            console.log(err)
        });
}

function deleteUnnecessary(json) {
    delete json["actions"]
    delete json["hashtags"]
    delete json["labels"]
    delete json["messages"]
    delete json["pending_reviewers"]
    delete json["removable_reviewers"]
    delete json["requirements"]
    delete json["reviewer_updates"]
    delete json["total_comment_count"]
    delete json["unresolved_comment_count"]
    delete json["mergeable"]
    delete json["revisions"] //todo delete all but 1st revision
    return json
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
    //let metadata = json;
    let keep = true;
    json = deleteUnnecessary(json)
    let time_diff = json["diff_created_close_time"]
    let inactive_time_before_review = json["max_inactive_time_before_review"]
    let created = json["created"]
    let updated = json["updated"]

    if (created === updated)
        keep = false;

    //duration > 10 min
    if(time_diff < 0.166667)
        keep = false;

    //inactive time > 3 months //2190 //1460 //730
    if(inactive_time_before_review > 1460)
        keep = false;

    return {
        data: json,
        keep: keep,
    };
}