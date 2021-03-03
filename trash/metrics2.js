const stringify = require("json-stringify-pretty-compact");
const Mongoose = require('mongoose');
const Moment = require('moment');
const MathJs = require('mathjs');
const fsExtra = require("fs-extra");
const path = require('path');
const fs = require('fs');
const Change = require('../models/change');
const dbUtils = require('../config/dbUtils');
const Database = require('../config/databaseConfig');

//variable globale
let metricsUserJson = {};
let socialGraphAccountJson = {};
let socialGraphMessageJson = {};

//lire les fichiers
let pathRacine = "/Users/jeefer/Workplace/data/libreoffice/abandoned-changes/";
let racinePath = "/Users/jeefer/Workplace/data/libreoffice/";
let abandonedPath = racinePath + "abandoned-changes/";
let mergedPath = racinePath + "merged-changes/";
let openPath = racinePath + "open-changes/";

//have the list of metrics
//import data to mongoDB
let projectDBUrl = Database.libreOfficeDBUrl;

mainFunction();

function mainFunction() {
    dbConnection();
    getFilesChain()
        .then(response => {
            console.log("Finished !!!!")
        })
        .catch(err => {
            console.log(err)
        });
}

function dbConnection() {
    return Mongoose.connect(projectDBUrl,
        {useNewUrlParser: true, useUnifiedTopology: true},
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Connected to the database");
            }
        });
}

function getFilesChain() {
    return getFiles(openPath)
        .then(response => {
            return getFiles(abandonedPath);
        })
        .then(response => {
            return getFiles(mergedPath);
        })
        .catch(err => {
            console.log(err)
        });
}

async function getFiles(path) {
    return fs.promises.readdir(path)
        .then(filenames => {
            return info(path, filenames);
        }).catch(err => {
            console.log(err)
        });
}

async function info(path, filenames) {
    for (let filename of filenames) {
        await addInformationToDB(path, filename);
    }
}

function getFilePath(path, filename) {
    return path + filename;
}

async function addInformationToDB(path, filename) {
    console.log(path + filename);
    if (filename.includes(".DS_Store"))
        return;
    let json = JSON.parse(fs.readFileSync(getFilePath(path, filename), 'utf8'));
    let promiseArray = []

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            let promise = await addJSONToDB(json[key]);
            promiseArray.push(promise);
        }
    }
    return Promise.all(promiseArray);
}

function addJSONToDB(json) {
    return dbUtils.saveChange(json);
}
