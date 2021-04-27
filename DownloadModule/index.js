const Database = require('./config/databaseConfig');
const ApiEndPoints = require('./config/apiEndpoints');
const DownloadCodeChanges = require('./prepare_code_change/download-code-changes');
const DownloadProjects = require('./prepare_code_change/download-project-info');
const AddChangesInDB = require('./prepare_code_change/add-code-change-in-db');
const ComputeSimpleMetrics = require('./compute_metrics/compute-simple-metrics');
const ComputeOwnerMetrics = require('./compute_metrics/compute-owner-metrics');
const ComputeRecentMetrics = require('./compute_metrics/compute-recent-metrics');
const CollectGraph = require('./prepare_code_change/collect-graph');
const Config = require('./config');
const Yargs = require('yargs');
const Utils = require("./config/utils");


if (typeof require !== 'undefined' && require.main === module) {
    main();
}

function main() {

    const command = Yargs
        .command('download [project]', 'Download all the code changes of a projects.', {
            project: {
                description: 'The project from which codes changes are downloaded',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            downloadCodeChanges(argv)
        })
        .command('prepare [project]', 'Add the project in the database.', {
            project: {
                description: 'The project to add in the database.',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            prepareCodeChanges(argv)
        })
        .command('metrics [project]', 'Compute the metrics of a project.', {
            project: {
                description: 'The project from which metrics of codes changes are computed',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            computeMetrics(argv)
        })
        .command('buildGraph [project]', 'Build the graph of accounts in the project.', {
            project: {
                description: 'The project from which the graph is built',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            buildGraph(argv)
        })
        .help()
        .alias('help', 'h')
        .demandCommand()
        .argv;

}

function prepareCommand(argv) {
    let projectName = argv.project;
    let json = {}
    if (Config.project[projectName])
        json = Utils.getProjectParameters(projectName);
    else {
        console.log("The project you request hasn't been found on the config file. You can edit the Config.json file and add information about this project")
        return
    }
    return json;
}

function downloadCodeChanges(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return DownloadCodeChanges.start(projectJson)
            .catch(err => {
                console.log(err)
            });
}

//to do get graph
function prepareCodeChanges(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return AddChangesInDB.start(projectJson)
            .catch(err => {
                console.log(err)
            });
}

function buildGraph(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return CollectGraph.start(projectJson)
            .catch(err => {
                console.log(err)
            });
}

function computeMetrics(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return ComputeSimpleMetrics.start(projectJson)
            .then(() => {
                return ComputeRecentMetrics.start(projectJson)
            })
            /*.then(() => {
                return ComputeOwnerMetrics.start(projectJson)
            })*/
            .catch(err => {
                console.log(err)
            });
}