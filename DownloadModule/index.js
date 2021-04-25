//Library
//Get project
//Get user
//Get boots
//Collect project in once
//Upgrade the number of change to download
//save metrics on the right directory
//join python and java
//todo write test

//todo make a plan

const Database = require('./config/databaseConfig');
const DownloadCodeChanges = require('./prepare_code_change/download-code-changes');
const DownloadProjects = require('./prepare_code_change/download-project-info');
const AddChangesInDB = require('./prepare_code_change/add-code-change-in-db');
//const ComputeSimpleMetrics = require('./core/compute-simple-metrics');
const ApiEndPoints = require('./config/apiEndpoints');
const Config = require('./config');

let DATA_PATH = "data/"

let openStack = {
    projectApiUrl: ApiEndPoints.openstackApiUrl,
    projectDBUrl: Database.openstackDbUrl,
    directory: DATA_PATH
}
let android = {
    projectApiUrl: ApiEndPoints.androidApiUrl,
    projectDBUrl: Database.androidDbUrl,
    directory: DATA_PATH

}

let qt = {
    projectApiUrl: ApiEndPoints.qtApiUrl,
    projectDBUrl: Database.qtDbUrl,
    directory: DATA_PATH
}

let libreOffice = {
    projectApiUrl: ApiEndPoints.libreOfficeApiUrl,
    projectDBUrl: Database.libreOfficeDBUrl,
    directory: DATA_PATH
}

//collect changes

collectAllCodeChanges(libreOffice).then(() => {
    console.log("Finished !!!!");
});


function collectAllCodeChanges(projectJson) {
    return DownloadCodeChanges.start(projectJson);
}

//add metrics to database
//AddChangesInDB.start(libreOffice);

/*computeMetrics(libreOffice).then(() => {
    console.log("Finished !!!!");
});*/

/*function computeMetrics(projectJson) {
    return ComputeSimpleMetrics.start(projectJson)
        .catch(err => {
            console.log(err)
        });
}*/