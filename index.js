//Library
//Get project
//Get user
//Get boots
//Collect project in once
const Database = require('./config/databaseConfig');
const DownloadCodeChanges = require('./core/download-code-changes');
const DownloadProjects = require('./core/download-project-info');
const ApiEndPoints = require('./config/apiEndpoints');

let openStack = {projectApiUrl: ApiEndPoints.openstackApiUrl, projectDBUrl: Database.openstackDbUrl}
let android = {projectApiUrl: ApiEndPoints.androidApiUrl, projectDBUrl: Database.androidDbUrl}
let qt = {projectApiUrl: ApiEndPoints.qtApiUrl, projectDBUrl: Database.qtDbUrl}
let libreOffice= {projectApiUrl: ApiEndPoints.libreOfficeApiUrl, projectDBUrl: Database.libreOfficeDBUrl}

collectAllCodeChanges().then(() => {
    console.log("Finished !!!!");
});

function collectAllCodeChanges() {
    return DownloadCodeChanges.crawling(qt);
}



