//Database
const Mongoose = require('mongoose');
const Config = require('../config.json')

let dbBaseUrl = getMainDatabaseUrl(Config.database_hostname, Config.database_port, Config.database_username, Config.database_password);

/*let libreOfficeDbName = 'libreOfficeDB';
let qtDbName = 'qtDB';
let openStackDbName = 'openstackDB';
let androidDbName = 'androidDB';

let libreOfficeDbUrl = dbBaseUrl + libreOfficeDbName;
let qtDbUrl = dbBaseUrl + qtDbName;
let openstackDbUrl = dbBaseUrl + openStackDbName;
let androidDbUrl = dbBaseUrl + androidDbName;*/

function getMainDatabaseUrl(hostname, port, username, password) {
    let newport = port ? port : 27017;
    if (username)
        return "mongodb://" + username + ":" + encodeURIComponent(password) + "@" + hostname + ":" + newport + "/";
    else
        return "mongodb://" + hostname + ":" + newport + "/";
}


function dbConnection(projectDBUrl) {
    return Mongoose.connect(projectDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Connected to the database");
            return Promise.resolve(true);
        })
        .catch(err => {
            console.log(err)
        });
}

function closeConnection() {
    return Mongoose.connection.close();
}

function getProjectDBName(projectName) {
    return Config.project[projectName]["db_name"] + "DB";
}

function getProjectDBUrl(projectName) {
    //console.log(dbBaseUrl + getProjectDBName(projectName));
    return dbBaseUrl + getProjectDBName(projectName) + "?authSource=admin";
}

module.exports = {
    dbConnection: dbConnection,
    closeConnection: closeConnection,
    getProjectDBName: getProjectDBName,
    getProjectDBUrl: getProjectDBUrl,
    /*databaseRoot: dbBaseUrl,
    libreOfficeDBUrl: libreOfficeDbUrl,
    qtDbUrl: qtDbUrl,
    openstackDbUrl: openstackDbUrl,
    androidDbUrl: androidDbUrl,
    port: Config.database_port ? Config.database_port : 27017*/
};