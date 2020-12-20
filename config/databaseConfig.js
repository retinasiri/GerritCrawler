//Database
let libreOfficeDbName = 'libreOfficeDB';
let qtDbName = 'qtDB';
let openStackDbName = 'openstackDB';
let androidDbName = 'androidDB';

let dbBaseUrl = "mongodb://localhost:27017/";

let libreOfficeDbUrl = dbBaseUrl + libreOfficeDbName;
let qtDbUrl = dbBaseUrl + qtDbName;
let openstackDbUrl = dbBaseUrl + openStackDbName;
let androidDbUrl = dbBaseUrl + androidDbName;

module.exports = {
    databaseRoot: dbBaseUrl,
    libreOfficeDBUrl: libreOfficeDbUrl,
    qtDbUrl: qtDbUrl,
    openstackDbUrl: openstackDbUrl,
    androidDbUrl: androidDbUrl,
    port: 27017
};