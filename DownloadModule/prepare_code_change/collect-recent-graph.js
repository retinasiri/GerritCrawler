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
let NUM_DAYS_FOR_RECENT = 90;
let NUM_OF_CHANGES_LIMIT = 10000;
let NUMBER_DATABASE_REQUEST = Utils.getCPUCount() ? Utils.getCPUCount() : 4;
//let overAllGraphJson = {};
//let overAllFullConnectedGraphJson = {};
//let overAllChangesAccountInfo = {};
let changes_graph_list = {}

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
    if (json["numberOfDays"])
        NUM_DAYS_FOR_RECENT = json["numberOfDays"];

    console.log("Collecting account graph !!!!");

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            //NUM_OF_CHANGES_LIMIT = MathJs.ceil(count / NUMBER_DATABASE_REQUEST);
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT);
        })
        .then(() => {
            /*let name1 = projectName + "-graph";
            let name2 = projectName + "-full-connected-graph";
            let name3 = projectName + "-changes-account-info";
            let path = PathLibrary.join(DATA_PATH, projectName);
            let t1 = Utils.saveJSONInFile(path, name1, overAllGraphJson);
            let t2 = Utils.saveJSONInFile(path, name2, overAllFullConnectedGraphJson);
            let t3 = Utils.saveJSONInFile(path, name3, overAllChangesAccountInfo);
            return Promise.all([t1, t2, t3]);*/

            let name = projectName + "-changes-graph-list-" + NUM_DAYS_FOR_RECENT + "-days";
            let path = PathLibrary.join(DATA_PATH, projectName);
            return Utils.saveJSONInFile(path, name, changes_graph_list);
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
                //console.log(result)
                return Promise.resolve(result);
            });
        previousJson = docs[key];
        graph_list = previousGraph;
        //console.log("echo")
    }
    return Promise.resolve(true);
}

function updateProgress() {
    progressBar.increment(1);
}

//let graph_list = {}
//let previous_graph_list = {}

function buildChangeAccountInfoJson(json) {
    let id = json.id
    let owner_id = json.owner_id;
    let number = json._number;
    let reviewers_id = json.reviewers_id;
    return {id: id, number: number, owner_id: owner_id, reviewers_id: reviewers_id}
}


async function collectGraph(json, previousJson, graph_list) {
    return getIntermediaryUpdatedChanges(json, previousJson)
        .then((hasChanged) => {
            if (hasChanged) {
                return getPriorChangesGraph(json, previousJson, graph_list);
            } else {
                let id = json.id
                //let changeAccountInfoJson = buildChangeAccountInfoJson(json);
                //let path = PathLibrary.join(DATA_PATH, projectName, "changes-account");
                //let t1 = Utils.saveJSONInFile(path, id, changeAccountInfoJson);
                /*if (graph_list["changes"])
                    graph_list["changes"][id] = changeAccountInfoJson;*/
                changes_graph_list[id] = i;
                //let t2 = Promise.resolve(graph_list);
                return Promise.resolve(graph_list);
                /*return Promise.all([t1, t2])
                    .then((results) => {
                        return Promise.resolve(results[1])
                    });*/
            }
        })
}
function getPriorChangesGraph(json, previousJson, graph_list){
    return getPriorChanges(json)
        .then((results) => {
            let id = json.id
            let owner_id = json.owner_id;
            //let changeAccountInfoJson = buildChangeAccountInfoJson(json);
            //let path = PathLibrary.join(DATA_PATH, projectName, "changes-account");
            let t1 = buildGraph(results, id, owner_id);
            //let t2 = buildFullConnectedGraph(results, id, owner_id);
            let t3 = getIntermediaryUpdatedChanges(json, previousJson)
            //let t4 = Promise.resolve(changeAccountInfoJson);
            //let t5 = Utils.saveJSONInFile(path, id, changeAccountInfoJson);
            //return Promise.all([t1, t2, t3, t4, t5]);
            //return Promise.all([t1, t2, t3, t4]);
            //return Promise.all([t1, t2, t3]);
            return Promise.all([t1, t3]);
        })
        .then((results) => {
            let id = json.id;
            let graph = results[0];
            //let fullConnectedGraph = results[1];
            let hasChanged = results[1];
            //let changeAccountInfoJson = results[3];
            let suffix = "-" + NUM_DAYS_FOR_RECENT + "-days";
            //let path1 = PathLibrary.join(DATA_PATH, projectName, "changes-graph" + suffix);
            //let path2 = PathLibrary.join(DATA_PATH, projectName, "changes-full-connected-graph" + suffix);

            //let t1 = Utils.saveJSONInFile(path1, id, graph);
            //let t2 = Utils.saveJSONInFile(path2, id, fullConnectedGraph);
            //overAllGraphJson[id] = graph;
            //overAllFullConnectedGraphJson[id] = fullConnectedGraph;

            //compare to the previous graph
            let path3 = PathLibrary.join(DATA_PATH, projectName, "graph-list" + suffix);
            let t3 = Promise.resolve(true);
            if (hasChanged) {

                if (i > 0) {
                    t3 = Utils.saveJSONInFile(path3, String(i - 1), graph_list);
                }
                i++;

                graph_list = {};
                graph_list["graph"] = graph;
                //graph_list["full_connected_graph"] = fullConnectedGraph;
                changes_graph_list[id] = i;
                //graph_list["changes"] = {};
                //graph_list["changes"][id] = changeAccountInfoJson;

            } else {
                //if (graph_list["changes"])
                //    graph_list["changes"][id] = changeAccountInfoJson;
                changes_graph_list[id] = i;
            }
            let t4 = Promise.resolve(graph_list)
            //return Promise.all([t1, t2, t3, t4]);
            return Promise.all([t3, t4]);
        })
        .then((results) => {
            return Promise.resolve(results[1])
        })
        .catch(err => {
            console.log(err)
        });
}

async function getIntermediaryUpdatedChanges(json, previousJson) {
    if (!previousJson)
        return true;

    if (!previousJson.created)
        return true;

    let created = json.created;
    let previous_created = previousJson.created;
    let created_minus_recent_days = Moment(json.created).subtract(NUM_DAYS_FOR_RECENT, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');
    let previous_created_minus_recent_days = Moment(previousJson.created).subtract(NUM_DAYS_FOR_RECENT, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');
    let pipeline = [
        {
            $match: {
                status: {$in: ['MERGED', 'ABANDONED']},
                $or: [
                    {updated: {$lte: created, $gte: previous_created}},
                    {updated: {$lte: created_minus_recent_days, $gte: previous_created_minus_recent_days}},
                ]
            }
        },
        {$count: "count"},
    ];
    return Change
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            //hasChanged?
            if (!docs)
                return false;
            if (docs.length > 0) {
                return docs[0].count > 0;
            } else {
                return false;
            }
            //return docs.length > 0 ? (docs[0].count > 0) : false;
        })
        .catch(err => {
            console.log(err)
        });
}

function getPriorChanges(json) {
    let priorResults = [[], []];
    return getPriorChangesFromDB(0, json, priorResults);
}

function getPriorChangesFromDB(skip, json, priorResults) {
    let number = json._number;
    let endDate = json.created;
    let startDate = Moment(json.created).subtract(NUM_DAYS_FOR_RECENT, 'days').format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS');
    let pipeline = [
        {
            $match: {
                status: {$in: ['MERGED', 'ABANDONED']},
                updated: {$lte: endDate},
                created: {$lte: endDate, $gte: startDate},
                _number: {$lt: number},
            }
        },
        {$project: {id: 1, owner_id: "$owner._account_id", reviewers_id: "$reviewers.REVIEWER._account_id"}},
        {$skip: skip},
        {$limit: 2000}
    ];
    //console.log("startDate : " + startDate);
    //console.log("endDate : " + endDate);
    return dbRequest(skip, json, pipeline, priorResults);
}

function dbRequest(skip, json, pipeline, previousResults) {
    return Change
        .aggregate(pipeline)
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve([]);
            return docs.length > 0 ? Promise.resolve(docs) : Promise.resolve(true);
        })
        .then(result => {
            if (typeof result === "boolean") {
                return Promise.resolve(previousResults)
            } else {
                previousResults.push(...result)
                return getPriorChangesFromDB(skip + 1000, json, previousResults)
            }
        })
        .catch(err => {
            console.log(err)
        });
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
    //graph["id"] = id;
    //graph["owner_id"] = owner;
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
    //graph["id"] = id;
    //graph["owner_id"] = owner;
    graph["nodes"] = [...nodes];
    graph["edges"] = [...edges];
    return graph;
}

/*let sortedArrayFunction = function(a, b) {
    if (a[0] == b[0]) {
        return a[1] - b[1];
    }
    return a[0] - b[0];
};*/

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