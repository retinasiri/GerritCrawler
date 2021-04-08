//Database
const Mongoose = require('mongoose');

let libreOfficeDbName = 'libreOfficeDB';
let qtDbName = 'qtDB';
let openStackDbName = 'openstackDB';
let androidDbName = 'androidDB';

let dbBaseUrl = "mongodb://localhost:27017/";

let libreOfficeDbUrl = dbBaseUrl + libreOfficeDbName;
let qtDbUrl = dbBaseUrl + qtDbName;
let openstackDbUrl = dbBaseUrl + openStackDbName;
let androidDbUrl = dbBaseUrl + androidDbName;

function dbConnection(projectDBUrl) {
    return Mongoose.connect(projectDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected to the database");
            return Promise.resolve(true);
        })
        .catch(err => {
            console.log(err)
        });
}

function closeConnection(){
    return Mongoose.connection.close();
}

module.exports = {
    dbConnection: dbConnection,
    closeConnection: closeConnection,
    databaseRoot: dbBaseUrl,
    libreOfficeDBUrl: libreOfficeDbUrl,
    qtDbUrl: qtDbUrl,
    openstackDbUrl: openstackDbUrl,
    androidDbUrl: androidDbUrl,
    port: 27017
};