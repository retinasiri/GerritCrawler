const exportDb = require('exportmongodatabase');
const Mongoose = require('mongoose');
const Metrics = require('./models/metrics');
const Database = require('./config/databaseConfig');

let projectDBUrl = Database.libreOfficeDBUrl;

Mongoose.connect(projectDBUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    function (err) {
        if (err) {
            console.log(err);
        } else {
            //exportDb.exportDataBase(projectDBUrl);
            console.log("Connected to the database");
        }
    });

let dotenv =  require('dotenv').config();
const dumpCollectionAsCSV = require('./index')

const options = {
    mongoConnectionString: projectDBUrl,
    collectionName: "metrics",
    outputPath: './data/met'
}

const mongoConnectionString = process.env.MONGO_URL
const collectionName = process.env.COLLECTION_NAME
//const options = { mongoConnectionString, collectionName }
//dotenv.config(options)
//dotenv.dumpCollectionAsCSV(options)


