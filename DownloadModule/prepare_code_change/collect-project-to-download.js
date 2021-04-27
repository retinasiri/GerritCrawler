const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Utils = require('../config/utils');
const ApiEndPoints = require('../config/apiEndpoints');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let DATA_PATH = "data/";

let projectJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = projectJson["projectDBUrl"];
let projectApiUrl = projectJson["projectApiUrl"];

let STARTING_POINT = 0;
let NUM_OF_CHANGES_LIMIT = 10000;

let projects = {};
let repoToDownload = new Set();

mainFunction(projectDBUrl)
    .catch(err => {
        console.log(err)
    });

function mainFunction(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["projectApiUrl"])
        projectApiUrl = json["projectApiUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({})
        })
        .then((count) => {
            console.log("Processing data...");
            progressBar.start(count, 0);
            return getChanges(STARTING_POINT);
        })
        .then(() => {
            let task1 = Utils.saveFile("data/", "repositories-to-clone", getSetStr(repoToDownload), "txt")
            let task2 = Utils.saveJSONInFile("data/", "projects-repo", projects)
            return Promise.all([task1, task2]);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished!!!!");
            return Database.closeConnection();
            //process.exit();
        })
        .catch(err => {
            console.log(err)
        });
}

function getSetStr(setCol) {
    let str = ''
    setCol.forEach(function (line) {
        str += line + "\r\n";
    })
    return str;
}

//get changes id
function getChanges(skip) {
    return Change
        .aggregate([
            {$sort: {created: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            return docs.length ? processDocs(docs) : Promise.resolve(false);
        })
        .then(result => {
            return result ? getChanges(skip + NUM_OF_CHANGES_LIMIT) : Promise.resolve(false);
        })
        .catch(err => {
            console.log(err)
        });
}

async function processDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        await collectRepo(docs[key]).then(() => {
            progressBar.increment(1);
        })
    }
    return Promise.resolve(true);
}

async function collectRepo(doc) {
    let id = doc.id
    projects[id] = {}
    let revisions = doc.revisions;
    let prev_number_save = Infinity;
    Object.keys(revisions).forEach(function (key) {
        let number = revisions[key]["_number"]
        let has_commit = !!revisions[key]["commit"];
        if (has_commit) {
            if (number <= prev_number_save) {
                projects[id]["id"] = id;
                projects[id]["fetch_url"] = revisions[key]["fetch"]["anonymous http"]["url"];
                projects[id]["fetch_ref"] = revisions[key]["fetch"]["anonymous http"]["ref"];
                projects[id]["commit"] = revisions[key]["commit"]["parents"][0]["commit"];
                repoToDownload.add(projects[id]["fetch_url"]);
                prev_number_save = number;
            }
        }
    })

    return Promise.resolve(true);
}