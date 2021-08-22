const cliProgress = require('cli-progress');
const Database = require('./config/databaseConfig');
const Change = require('./models/change');
const Utils = require('./config/utils');
const changes_graph_list = require("./res/openstack-changes-graph-list.json")


const progressBar = new cliProgress.SingleBar({
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);
const PathLibrary = require('path');
const fs = require("fs");

let projectJson = Utils.getProjectParameters("openstack");
let projectDBUrl = projectJson["projectDBUrl"];
let projectName = projectJson["projectName"];

let DATA_PATH = "data/"
let STARTING_POINT = 0;
let i = 1;

if (typeof require !== 'undefined' && require.main === module) {
    /*startComputeMetrics(projectJson).catch(err => {
        console.log(err)
    });*/
}

function startComputeMetrics(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    return Database.dbConnection(projectDBUrl)
        .then(() => {
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            let NUM_OF_CHANGES_LIMIT = 50000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT, NUM_OF_CHANGES_LIMIT);
        })
        .then(() => {
            progressBar.stop();
            Utils.saveFile(DATA_PATH, "openstack-graph-list-to-compute", Utils.getSetStr(graph_list), "txt")
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
            {$limit: NUM_OF_CHANGES_LIMIT},
            {$project: {id: 1, _number: 1}},
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
    }
    return Promise.resolve(true);
}

let graph_list = new Set();

async function collectMetrics(json) {
    let id = json.id;
    let graph_number = changes_graph_list[id] + ".json"
    graph_list.add(graph_number)
    console.log(graph_number)
}
//promises.push()
