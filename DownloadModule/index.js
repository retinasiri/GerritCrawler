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
const DownloadCodeChanges = require('./core/download-code-changes');
const DownloadProjects = require('./core/download-project-info');
const AddChangesInDB = require('./core/add-code-change-in-db');
//const ComputeSimpleMetrics = require('./core/compute-simple-metrics');
const ApiEndPoints = require('./config/apiEndpoints');

let DATA_PATH = "/Volumes/SEAGATE-II/Data/"

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
/*
collectAllCodeChanges(qt).then(() => {
    console.log("Finished !!!!");
});
*/

function collectAllCodeChanges(projectJson) {
    return DownloadCodeChanges.start(projectJson);
}

//add metrics to database
AddChangesInDB.start(libreOffice);

/*computeMetrics(libreOffice).then(() => {
    console.log("Finished !!!!");
});*/

function computeMetrics(projectJson) {
    return ComputeSimpleMetrics.start(projectJson)
        .catch(err => {
            console.log(err)
        });
}