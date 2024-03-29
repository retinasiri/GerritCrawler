const Moment = require('moment');
const MathJs = require('mathjs');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');

/*const progressBar = new cliProgress.SingleBar({
    //format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | added: {added} | deleted: {deleted}',
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | deleted: {deleted} | kept: {kept}',
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);*/

const multibar = new cliProgress.MultiBar({
    format: '{type} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | deleted: {deleted} | kept: {kept}',
    barCompleteChar: '#',
    barIncompleteChar: '-',
    clearOnComplete: false,
    hideCursor: true
}, cliProgress.Presets.shades_classic);
let bar1 = null;

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectName = libreOfficeJson["projectName"];

let DATA_PATH = "data/"
let STARTING_POINT = 0;
let deleted_change_nums = 0;
let added_change_nums = 0;
let kept_change_nums = 0;
let delete_id_list = [];

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
            let NUM_OF_CHANGES_LIMIT = 10000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            bar1 = multibar.create(0, 0, {type: 'Counting changes'});
            bar1.setTotal(count)
            return getChanges(STARTING_POINT, NUM_OF_CHANGES_LIMIT);
        })
        .then(() => {
            multibar.stop();
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
        .then(result => {
            return deleteAllDocs();
        })
        .catch(err => {
            console.log(err)
        });
}

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var R = [];
        for (var i = 0; i < this.length; i += chunkSize)
            R.push(this.slice(i, i + chunkSize));
        return R;
    }
});

async function deleteAllDocs() {
    const bar2 = multibar.create(0, 0, {type: 'Deleting changes'});
    bar2.setTotal(delete_id_list.length);

    let delete_id_list_chunk = delete_id_list.chunk(100000)

    for (let i = 0; i < delete_id_list_chunk.length; i++){
        let toDelete = delete_id_list_chunk[i];
        await Change.deleteMany({id: {$in: toDelete}})
            .then(() => {
                return Metrics.deleteMany({id: {$in: toDelete}})
            })
            .then(() => {
                bar2.increment(toDelete.length);
                return Promise.resolve(true)
            })
            .catch(err => {
                console.log(err)
            });
    }

    return Promise.resolve(true);
}


async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        await collectMetadata(docs[key])
            .then((toDelete) => {
                if (typeof toDelete === 'boolean') {
                    if (toDelete) {
                        deleted_change_nums += 1;
                        delete_id_list.push(docs[key].id)
                    } else {
                        kept_change_nums += 1;
                    }
                }
            })
            .then(() => {
                return updateProgress(bar1, deleted_change_nums, kept_change_nums, added_change_nums);
            })
    }
    return Promise.resolve(true);
}

function deleteChange(id) {
    return Change.deleteOne({id: id})
        .then(() => {
            return Metrics.deleteOne({id: id})
        })
        .catch(err => {
            console.log(err)
        });
}

async function updateProgress(bar, deleted, kept, added) {
    bar.increment(1, {deleted: deleted, kept: kept, added: added});
    return Promise.resolve(true);
}

const MINIMUM_NUM_HOURS = 0.1 //1
const MAXIMUM_NUM_HOURS = 2190 //336 , 2190 = 3 mois
const MAXIMUM_INACTIVE_TIME = 336 //336

async function collectMetadata(json) {
    let toDelete = false;

    let time_diff = json["date_updated_date_created_diff"]
    let inactive_time_before_review = json["max_inactive_time_before_close"]
    let messages_count = json["messages_count"]
    let has_reviewers = json["has_reviewers"]
    let num_files = json["num_files"]
    let is_a_cherry_pick = json["is_a_cherry_pick"]
    let first_revision = json["first_revision"]

    let status = json["status"]
    if (status === "NEW") {
        /*if (time_diff > MAXIMUM_NUM_HOURS)
            return true;*/
        if (num_files === 0)
            return true;
        /*
        if (is_a_cherry_pick === true)
            return true;
        if (inactive_time_before_review > MAXIMUM_INACTIVE_TIME)
            return true;
        if (first_revision !== 1)
            return true;
             */
        return false;
    } else {
        //duration > 1h
        if (time_diff === 0)
            return true;
        /*if (time_diff < 1 && status === "ABANDONED")
            return true;*/
        /*if (time_diff < MINIMUM_NUM_HOURS)
            return true;
        if (time_diff > MAXIMUM_NUM_HOURS)
            return true;*/
        //inactive time > 336H (2 weeks) - 3 months //2190 //1460 //730
        if (messages_count <= 1)
            return true;
        if (num_files === 0)
            return true;

        /*
        if (is_a_cherry_pick === true)
            return true;
        if (first_revision !== 1)
            return true;
        if (inactive_time_before_review > MAXIMUM_INACTIVE_TIME)
            return true;
          */
        /*if (json.hasOwnProperty("has_reviewers"))
            if (has_reviewers === false)
                return true;*/
        return false;
    }
}


/*function deleteUnnecessary(json) {
    delete json["actions"]
    delete json["hashtags"]
    //delete json["labels"]
    delete json["messages"]
    delete json["pending_reviewers"]
    delete json["removable_reviewers"]
    delete json["requirements"]
    delete json["reviewer_updates"]
    delete json["total_comment_count"]
    delete json["unresolved_comment_count"]
    delete json["mergeable"]
    delete json["submitter"]
    return json
}

function replaceDocuments(json) {
    //return Change.replaceOne({id: json.id}, json)
    return Change.updateOne({id: json.id}, json)
        .then(() => {
            return updateProgress();
        }).catch(err => {
            console.log(err)
        });
}*/

/*metadata["id"] = json["id"];
   metadata["updated_original"] = json["updated"]
   metadata["updated"] = json["close_time"]
   metadata["status_original"] = json["status"]
   metadata["status"] = json["new_status"]
   metadata["date_updated_date_created_diff_original"] = json["date_updated_date_created_diff"]
   metadata["date_updated_date_created_diff"] = json["diff_created_close_time"]*/

/*
async function collectMetadata(json) {
    //let metadata = json;
    let keep = true;
    let time_diff = json["diff_created_close_time"]
    let inactive_time_before_review = json["max_inactive_time_before_close"]
    let first_revision = json["first_revision"]
    let created = json["created"]
    let updated = json["updated"]
    let is_a_bot = json["is_a_bot"]

    json["updated_original"] = json["updated"]
    json["updated"] = json["close_time"]
    json["status_original"] = json["status"]
    json["status"] = json["new_status"]
    json["date_updated_date_created_diff_original"] = json["date_updated_date_created_diff"]
    json["date_updated_date_created_diff"] = json["diff_created_close_time"]

    let revisions = json.revisions
    for (let i in revisions) {
        let rev = revisions[i]
        if (rev._number !== 1)
            delete json["revisions"][i]
    }
    json = deleteUnnecessary(json)


    let labels = json.labels
    for (let i in labels) {
        if (i !== "Code-Review")
            delete labels[i]
    }

    if (created === updated)
        keep = false;

    //duration > 2 min
    if (time_diff <= 0.1)
        keep = false;

    if (time_diff >= 1000)
        keep = false;

    //inactive time > 3 months //2190 //1460 //730
    if (inactive_time_before_review >= 730)
        keep = false;

    if (first_revision !== 1)
        keep = false;

    if (is_a_bot === true)
        keep = false;

    return {
        data: json,
        keep: keep,
    };
}
*/

module.exports = {
    start: startComputeMetadata
};