const Mongoose = require('mongoose');
const Moment = require('moment');
const MathJs = require('mathjs');
const jsnx = require('jsnetworkx');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const MetricsUtils = require('../compute_metrics/metrics-utils');
const Utils = require('../config/utils');
const ApiEndPoints = require('../config/apiEndpoints');
const PathLibrary = require('path');

const progressBar = new cliProgress.SingleBar({
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let projectJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = projectJson["projectDBUrl"];
let projectApiUrl = projectJson["projectApiUrl"];
let projectName = projectJson["projectName"];
let DATA_PATH = "data/";

let STARTING_POINT = 0;
let NUM_OF_CHANGES_LIMIT = 10000;
let i = 0;

//do reduce graph
//collect change in graph folder by number an compare to the previous

if (typeof require !== 'undefined' && require.main === module) {
    start(projectJson)
        .catch(err => {
            console.log(err)
        });
}

function start(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    console.log("Collecting account graph !!!!");

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished!!!!");
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

function getChanges(skip) {
    return Change
        .aggregate([
            {$sort: {_number: 1}},
            {
                $project: {
                    id: 1,
                    created: 1,
                    updated: 1,
                    _number: 1,
                    owner_id: "$owner._account_id",
                    reviewers_id: "$reviewers.REVIEWER._account_id"
                }
            },
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
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
    let previousJson = {};
    let graph_list = {};
    for (let key in docs) {
        let previousGraph = await collectGraph(docs[key], previousJson, graph_list)
            .then((result) => {
                updateProgress();
                return Promise.resolve(result);
            });
        previousJson = docs[key];
        graph_list = previousGraph;
    }
    return Promise.resolve(true);
}

function updateProgress() {
    progressBar.increment(1);
}

function buildChangeAccountInfoJson(json) {
    let id = json.id
    let owner_id = json.owner_id;
    let number = json._number;
    let reviewers_id = json.reviewers_id;
    return {id: id, number: number, owner_id: owner_id, reviewers_id: reviewers_id}
}

async function collectGraph(json, previousJson, graph_list) {
    return getIntermediaryUpdatedChanges(json, previousJson)
        .then((docs) => {
            if (docs.length > 0) {
                return addUpdatedChangesGraph(json, previousJson, docs, graph_list);
            } else {
                let id = json.id
                let changeAccountInfoJson = buildChangeAccountInfoJson(json);
                if (graph_list["changes"])
                    graph_list["changes"][id] = changeAccountInfoJson;
                return Promise.resolve(graph_list);
            }
        })
}

function addUpdatedChangesGraph(json, previousJson, updatedChanges, graph_list) {
    let id = json.id
    let owner_id = json.owner_id;
    let t1 = Promise.resolve(true);
    if (i > 0) {
        let path = PathLibrary.join(DATA_PATH, projectName, "graph-list");
        t1 = Utils.saveJSONInFile(path, String(i - 1), graph_list);
    }
    i++;

    if (!graph_list)
        graph_list = {};
    graph_list["graph"] = updateGraph(updatedChanges, id, owner_id, graph_list);
    graph_list["full_connected_graph"] = updateFullConnectedGraph(updatedChanges, id, owner_id, graph_list);
    if (!graph_list["changes"])
        graph_list["changes"] = {};
    graph_list["changes"][id] = buildChangeAccountInfoJson(json);

    return t1.then(() => {
        return Promise.resolve(graph_list)
    })
}

async function getIntermediaryUpdatedChanges(json, previousJson) {
    if (!previousJson)
        return true;

    if (!previousJson.created)
        return true;

    let created = json.created;
    let previous_created = previousJson.created;
    let pipeline = [
        {
            $match: {
                status: {$in: ['MERGED', 'ABANDONED']},
                updated: {$lte: created, $gte: previous_created}
            }
        },
        {$project: {id: 1, owner_id: "$owner._account_id", reviewers_id: "$reviewers.REVIEWER._account_id"}},
    ];
    return Change
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return false;
            if (docs.length > 0) {
                return docs;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err)
        });
}

async function updateGraph(docs, id, owner, previousGraph) {
    let graph = buildGraph(docs, id, owner);
    return mergeGraph(graph, previousGraph, id, owner);
}

async function updateFullConnectedGraph(docs, id, owner, previousGraph) {
    let graph = buildFullConnectedGraph(docs, id, owner);
    return mergeGraph(graph, previousGraph, id, owner);
}

function mergeGraph(graph, previousGraph, id, owner) {
    graph["id"] = id;
    graph["owner_id"] = owner;
    if (previousGraph["nodes"])
        graph["nodes"] = [...previousGraph["nodes"]];
    if (previousGraph["edges"])
        graph["edges"] = [...previousGraph["edges"]];
    return graph;
}

async function buildGraph(docs, id, owner) {
    let nodes = new Set();
    let edges = [];
    for (let i = 0; i < docs.length; i++) {
        let doc = docs[i];
        let owner_id = doc["owner_id"];
        if (!owner_id) continue;
        nodes.add(owner_id);
        let reviewersId = doc["reviewers_id"];
        if (reviewersId)
            for (let j = 0; j < reviewersId.length; j++) {
                let rev_id = reviewersId[j];
                //console.log(reviewersId[j]);
                if (!rev_id) continue;
                if (MetricsUtils.isABot(rev_id, projectName)) continue;
                nodes.add(rev_id);
                let edge = [owner_id, rev_id];
                edges.push(edge);
            }
    }
    let graph = {};
    graph["id"] = id;
    graph["owner_id"] = owner;
    graph["nodes"] = [...nodes];
    graph["edges"] = [...edges];
    return graph;
}

/*Array.prototype.except = function (val) {
    return this.filter(function (x) {
        return x !== val;
    });
};*/

let bot_filter = function (account_id) {
    return !MetricsUtils.isABot(account_id, projectName);
};

function excludeBot(array) {
    return array.filter(function (account_id) {
        return !MetricsUtils.isABot(account_id, projectName);
    });
}


function buildFullConnectedGraph(docs, id, owner) {
    let nodes = new Set();
    let edges = [];
    for (let i = 0; i < docs.length; i++) {
        let doc = docs[i];
        let owner_id = doc["owner_id"];
        if (!owner_id) continue;
        nodes.add(owner_id);
        let reviewersId = doc["reviewers_id"];
        if (reviewersId)
            for (let j = 0; j < reviewersId.length; j++) {
                let revId1 = reviewersId[j];
                if (MetricsUtils.isABot(revId1, projectName)) continue;
                nodes.add(revId1);
                let edge = [owner_id, revId1];
                edges.push(edge);

                for (let k = 0; k < reviewersId.length; k++) {
                    let revId2 = reviewersId[k];
                    if (MetricsUtils.isABot(revId2, projectName)) continue;
                    if (revId1 === revId2) continue;
                    let edge = [revId1, revId2];
                    edges.push(edge);
                }

            }
    }
    let graph = {};
    graph["id"] = id;
    graph["owner_id"] = owner;
    graph["nodes"] = [...nodes];
    graph["edges"] = [...edges];
    return graph;
}

let sortedArrayFunction = ([a, b], [c, d]) => a - c || d - b;

function compareGraph(first, second) {
    if (!first.nodes && !second.nodes && !first.edges && !second.edges)
        return false;

    let firstNodes = first.nodes.sort();
    let secondNodes = second.nodes.sort();
    let firstEdges = first.edges.sort(sortedArrayFunction);
    let secondEdges = second.edges.sort(sortedArrayFunction);
    let areNodesEqual = firstNodes.length === secondNodes.length && firstNodes.every((value, index) => value === secondNodes[index])
    let areEdgesEqual = firstEdges.length === secondEdges.length && firstEdges.every(
        (value, index) => JSON.stringify(value) === JSON.stringify(secondEdges[index]))

    return areNodesEqual && areEdgesEqual;
}

module.exports = {
    start: start
};