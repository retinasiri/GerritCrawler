const cliProgress = require('cli-progress');
const Database = require('./config/databaseConfig');
const Change = require('./models/change');
const ChangeWM = require('./models/changeWM');
const RelatedChange = require('./models/relatedChange');
const PathLibrary = require('path');
const fs = require("fs");
const Utils = require('./config/utils');
const Axios = require("axios");
const RateLimit = require('axios-rate-limit');
const Metrics = require("./models/metrics");
const MetricsWM = require("./models/metricsWM");
const axios = RateLimit(Axios.create(), {maxRPS: 30})
//const changes_graph_list = require("./res/openstack-changes-graph-list.json")


const progressBar = new cliProgress.SingleBar({
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let projectJson = Utils.getProjectParameters("openstack");
let projectApiUrl = projectJson["projectApiUrl"];
let projectDBUrl = projectJson["projectDBUrl"];
let projectName = projectJson["projectName"];
let OUTPUT_DATA_PATH = "data/"

let num_failed = 0;
let num_find = 0;
let num_add = 0;
let err_429 = 0;

let STARTING_POINT = 0;
let i = 1;

if (typeof require !== 'undefined' && require.main === module) {
    /*processIdRevisionList(projectJson).catch(err => {
        console.log(err)
    });*/

    processRelatedChanges(projectJson).catch(err => {
        console.log(err)
    });
}

function processIdRevisionList(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["output_directory"])
        OUTPUT_DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    return Database.dbConnection(projectDBUrl)
        .then(() => {
            return ChangeWM.estimatedDocumentCount({});
        })
        .then((count) => {
            let NUM_OF_CHANGES_LIMIT = 20000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT, NUM_OF_CHANGES_LIMIT);
        })
        .then(() => {
            progressBar.stop();
            let name = projectName + "-id-revision-list";
            let path = PathLibrary.join(OUTPUT_DATA_PATH, projectName);
            Utils.saveJSONInFile(path, name, id_revision_json)
            //Utils.saveFile(DATA_PATH, "openstack-graph-list-to-compute", Utils.getSetStr(graph_list), "txt")
            console.log("Finished !!!!");
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip, NUM_OF_CHANGES_LIMIT = 20000) {
    return ChangeWM
        .aggregate([
            {$sort: {_number: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT},
            {$project: {id: 1, change_id: 1, created: 1, owner_id: '$owner._account_id', updated: 1, revisions: 1}},
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
                return updateProgress(json);
            })
    }

    return Promise.resolve(true);
}

let id_revision_json = {}

async function collectMetrics(json) {
    //console.log("collectMetrics")
    let id = json.id;
    let created = json.created;
    let updated = json.updated;
    let change_id = json.change_id;
    let owner_id = json.owner_id;
    let first_revision_id = get_first_revision_id(json)
    id_revision_json[id] = {
        id: id,
        created: created,
        updated: updated,
        owner_id: owner_id,
        change_id: change_id,
        first_revision_id: first_revision_id
    };
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

/////////////////

function processRelatedChanges(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["output_directory"])
        OUTPUT_DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    let name = projectName + "-id-revision-list.json";
    let path = PathLibrary.join(OUTPUT_DATA_PATH, projectName, name);
    let id_revisions_list = require(path);

    return Database.dbConnection(projectDBUrl)
        .then(() => {
            let count = Object.keys(id_revisions_list).length;
            console.log("Processing data of " + projectName);
            progressBar.start(count, 0);
            return getRelatedChange(id_revisions_list);
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

/*async function getRelatedChange(id_revisions_list) {
    console.time("getRelatedChange")

    for (let key in id_revisions_list) {
        let change_info = id_revisions_list[key];
        await downloadRelatedChange(change_info)

    }
    console.timeEnd("getRelatedChange")
    return Promise.resolve(true);
}*/
let NUM_SKIPS = 250000
async function getRelatedChange(id_revisions_list) {
    console.time("getRelatedChange")

    let NUM_CONCURRENCY = 100;
    let queue = [];
    let ret = [];
    let iter = 0;
    for (let key in id_revisions_list) {
        let change_info = id_revisions_list[key];
        //console.log("loop : " + iter)
        iter = iter + 1;
        if(iter <= NUM_SKIPS){
            await updateProgress();
            continue;
        }

        //todo check if the related change is already there
        let id = change_info.id;
        let relatedChangeExists = await checkIfRelatedChangeExists(id);
        if(relatedChangeExists) {
            //console.log(relatedChangeExists)
            await updateProgress();
            continue;
        }

        let p = downloadRelatedChange(change_info)
            .then(() => {
                queue.splice(queue.indexOf(p), 1);
                return Promise.resolve(true);
            })
        queue.push(p);
        ret.push(p);

        // if max concurrent, wait for one to finish
        if (queue.length >= NUM_CONCURRENCY) {
            await Promise.race(queue);
            //await delay(3000);
        }
    }

    await Promise.all(queue);
    console.timeEnd("getRelatedChange")
    return Promise.resolve(true);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function checkIfRelatedChangeExists(id) {
    return RelatedChange.exists({id: id});
}

function get_related_change_id_url(id, revision_id) {
    return projectApiUrl + "changes/" + id + "/revisions/" + revision_id + "/related"
}

function downloadRelatedChange(change_info) {
    let id = change_info.id;
    let revision_id = change_info.first_revision_id;
    let url = get_related_change_id_url(id, revision_id);
    //console.log(url)
    return axios.get(url)
        .then(response => {
            let json = JSON.parse(response.data.slice(5));
            /*
            if (Object.keys(json).length === 0)
                return {};
            */
            json.id = id;
            json.revision_id = revision_id;
            json.created = change_info.created;
            json.updated = change_info.updated;
            json.owner_id = change_info.owner_id;
            json.change_id = change_info.change_id;
            json.num_changes = json.changes ? json.changes.length : 0;
            return json;
        })
        .then((relatedChangesJson) => {
            //console.log("saveRelatedChangeInDB");
            return saveRelatedChangeInDB(relatedChangesJson)
        })
        .then((relatedChangesJson) => {
            //console.log("getRelatedChangeMetrics");
            return getRelatedChangeMetrics(relatedChangesJson)
        })
        .then((metrics) => {
            return saveRelatedChangeMetrics(metrics);
        })
        .then(() => {
            return updateProgress();
        })
        .catch(function (err) {
            if (err.response) {
                num_failed += 1;
                if (err.response.status === 429 || err.response.status === 500 || err.response.status === 502 ) {
                    err_429 += 1
                    setTimeout(function () {
                        err_429 -= 1
                        return downloadRelatedChange(change_info);
                    }, 60000);
                }
                if (err.response.status !== 429) {
                    console.log("status : erreur " + err.response.status + " - " + id)
                }
            }
            progressBar.increment(0, {add: num_add, find: num_find, failed: num_failed, err_429: err_429});
        });
}

function saveRelatedChangeInDB(json) {
    //console.log("i" + json.id)
    return RelatedChange.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            //console.log("saved : " + json.id)
            return Promise.resolve(json)
        })
        .catch(err => {
            console.log(err)
        });
}

async function updateProgress() {
    progressBar.increment(1);
    return Promise.resolve(true);
}

async function getRelatedChangeMetrics(relatedChangesJson) {
    let changes_id = getRelatedChangesId(relatedChangesJson);
    let id = relatedChangesJson.id;
    let owner_id = relatedChangesJson.owner_id;
    let created = relatedChangesJson.created;
    let updated = relatedChangesJson.updated;
    let similar_change_id = await get_similar_change_id(id, created, relatedChangesJson.change_id)

    if (changes_id.length === 0) {
        return {
            id: id,
            number_of_similar_change_id: similar_change_id,
            number_of_related_changes: 0,
            number_of_merged_related_changes: 0,
            number_of_abandoned_related_changes: 0,
            number_of_not_owned_related_changes: 0,
            number_of_not_owned_merged_related_changes: 0,
            number_of_not_owned_abandoned_related_changes: 0,
            number_of_close_related_changes: 0,
            number_of_not_owned_close_related_changes: 0,
        }
    }

    let related_change = get_related_change(id, created, updated, changes_id);
    let merged_related_change = get_close_related_change(id, created, updated, changes_id, "MERGED");
    let abandoned_related_change = get_close_related_change(id, created, updated, changes_id, "ABANDONED");
    let related_not_owned_change = get_related_not_owned_change(id, created, updated, owner_id, changes_id);
    let merged_related_not_owned_change = get_close_related_not_owned_change(id, created, updated, owner_id, changes_id, "MERGED");
    let abandoned_related_not_owned_change = get_close_related_not_owned_change(id, created, updated, owner_id, changes_id, "ABANDONED");

    let values = [
        related_change,
        merged_related_change,
        abandoned_related_change,
        related_not_owned_change,
        merged_related_not_owned_change,
        abandoned_related_not_owned_change,
    ]

    return Promise.all(values)
        .then((results) => {
            let metrics = {
                number_of_similar_change_id: similar_change_id,
                number_of_related_changes: getResult(results, values, related_change),
                number_of_merged_related_changes: getResult(results, values, merged_related_change),
                number_of_abandoned_related_changes: getResult(results, values, abandoned_related_change),
                number_of_not_owned_related_changes: getResult(results, values, related_not_owned_change),
                number_of_not_owned_merged_related_changes: getResult(results, values, merged_related_not_owned_change),
                number_of_not_owned_abandoned_related_changes: getResult(results, values, abandoned_related_not_owned_change),
            }
            metrics["id"] = id;
            metrics["number_of_close_related_changes"] = metrics["number_of_merged_related_changes"] + metrics["number_of_abandoned_related_changes"];
            metrics["number_of_not_owned_close_related_changes"] = metrics["number_of_not_owned_merged_related_changes"] + metrics["number_of_not_owned_abandoned_related_changes"];
            return metrics;
        })
}

function getResult(results, values, index) {
    return results[values.indexOf(index)];
}

function saveRelatedChangeMetrics(json) {
    return ChangeWM.updateOne({id: json.id}, json)
        .then(() => {
            return MetricsWM.updateOne({id: json.id}, json);
        })
        .then(() => {
            return Change.updateOne({id: json.id}, json);
        })
        .then(() => {
            return Metrics.updateOne({id: json.id}, json);
        })
        .catch(err => {
            console.log(err)
        });
}

function getRelatedChangesId(relatedChangesJson) {
    let changes = relatedChangesJson.changes;
    let changes_id = []
    for (let i = 0; i < changes.length; i++) {
        let change = changes[i]
        changes_id.push(change.change_id);
    }
    return changes_id;
}

async function get_related_change(id, created, updated, changes_id) {
    let pipeline = [
        {
            $match: {
                id: {$ne: id},
                created: {$lte: created},
                change_id: {$in: changes_id}
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

async function get_close_related_change(id, created, updated, changes_id, TYPE) {
    let pipeline = [
        {
            $match: {
                id: {$ne: id},
                status: TYPE,
                created: {$lte: created},
                updated: {$lt: updated},
                change_id: {$in: changes_id}
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

async function get_related_not_owned_change(id, created, updated, ownerId, changes_id) {
    let pipeline = [
        {
            $match: {
                id: {$ne: id},
                created: {$lte: created},
                'owner._account_id': {$ne: ownerId},
                change_id: {$in: changes_id}
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

async function get_close_related_not_owned_change(id, created, updated, ownerId, changes_id, TYPE) {
    let pipeline = [
        {
            $match: {
                id: {$ne: id},
                status: TYPE,
                'owner._account_id': {$ne: ownerId},
                created: {$lte: created},
                updated: {$lt: updated},
                change_id: {$in: changes_id}
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

function dbRequest(pipeline) {
    return ChangeWM
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return [];
            return docs.length > 0 ? docs[0].count : 0;
        })
        .catch(err => {
            console.log(err)
        });
}

async function get_similar_change_id(id, created, change_id) {
    let pipeline = [
        {
            $match: {
                id: {$ne: id},
                created: {$lte: created},
                change_id: change_id
            }
        },
        {$count: "count"}
    ]
    return dbRequest(pipeline);
}

//let graph_list = new Set();

/*async function collectMetrics(json) {
    let id = json.id;
    let graph_number = changes_graph_list[id] + ".json"
    graph_list.add(graph_number)
    console.log(graph_number)
}*/
//promises.push()

/*
    let metrics = {};
    metrics["id"] = id;
    metrics["number_of_related_changes"] = get_related_change(created, updated, changes_id);
    metrics["number_of_merged_related_changes"] = get_close_related_change(created, updated, changes_id, "MERGED");
    metrics["number_of_abandoned_related_changes"] = get_close_related_change(created, updated, changes_id, "ABANDONED");
    metrics["number_of_close_related_changes"] = metrics["number_of_merged_related_changes"] + metrics["number_of_abandoned_related_changes"];
    metrics["number_of_not_owned_related_changes"] = get_related_not_owned_change(created, updated, owner_id, changes_id);
    metrics["number_of_not_owned_merged_related_changes"] = get_close_related_not_owned_change(created, updated, owner_id, changes_id, "MERGED");
    metrics["number_of_not_owned_abandoned_related_changes"] = get_close_related_not_owned_change(created, updated, owner_id, changes_id, "ABANDONED");
    metrics["number_of_not_owned_close_related_changes"] = metrics["number_of_merged_related_changes"] + metrics["number_of_abandoned_related_changes"];
    */