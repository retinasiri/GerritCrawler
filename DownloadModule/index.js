const DownloadCodeChanges = require('./prepare_code_change/download-code-changes');
const DownloadCodeChangesById = require('./prepare_code_change/download-code-changes-by-id');
const DownloadProjects = require('./prepare_code_change/download-project-info');
const AddChangesInDB = require('./prepare_code_change/add-code-change-in-db');
const ComputeSimpleMetrics = require('./compute_metrics/compute-simple-metrics');
const ComputeChangesMetrics = require('./compute_metrics/compute-changes-metrics');
const ComputeMetadata = require('./compute_metrics/metrics-metadata');
const ComputeMetadata_2 = require('./compute_metrics/metrics-metadata-2');
const ExtractMetrics = require('./compute_metrics/extract-metrics');
const DeleteChanges = require('./compute_metrics/delete-change');
const CollectRecentGraph = require('./prepare_code_change/collect-recent-graph');
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
        .command('downloadById [project]', 'Download all the code changes of a projects using changes id.', {
            project: {
                description: 'The project from which codes changes are downloaded',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            downloadCodeChangesById(argv)
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
        .command('deleteChanges [project]', 'Delete unnecessary code changes.', {
            project: {
                description: 'The project.',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            deleteCodeChanges(argv)
        })
        .command('metrics [project]', 'Compute the metrics of a project.', {
            project: {
                description: 'The project from which metrics of codes changes are computed',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            computeSimpleMetrics(argv)
        })
        .command('computeMetrics [project]', 'Compute the changes metrics of a project.', {
            project: {
                description: 'The project from which metrics of codes changes are computed',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            computeChangesMetrics(argv)
        })
        .command('extract [project]', 'Extract the metrics of a project.', {
            project: {
                description: 'The project from which metrics of codes changes are computed',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            extractMetrics(argv)
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
        .command('metadata [project]', 'Add metadata to code changes.', {
            project: {
                description: 'The project from which metadata of codes changes are computed',
                alias: 'p',
                type: 'string',
            }
        }, function (argv) {
            computeMetadata(argv)
        })
        .option('start', {
            alias: 's',
            type: 'number',
            description: 'start of code changes processing'
        })
        .option('end', {
            alias: 'e',
            type: 'number',
            description: 'end of of code changes processing'
        })
        .option('days', {
            alias: 'd',
            type: 'number',
            description: 'days limit for collecting recent metrics'
        })
        .help()
        .alias('help', 'h')
        .demandCommand()
        .argv;

}

function prepareCommand(argv) {
    let projectName = argv.project;
    let start = argv.start;
    let end = argv.end;
    let days = argv.days;
    let json = {}
    if (Config.project[projectName]) {
        if (start !== undefined && end !== undefined) {
            if (start < end) {
                json = Utils.getProjectParameters(projectName);
                json["start"] = start;
                json["end"] = end;
            } else {
                console.log("the end should be greater than the start");
            }
        } else {
            json = Utils.getProjectParameters(projectName);
        }
        if (days !== undefined)
            json["NUM_DAYS_FOR_RECENT"] = days
    } else {
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

function downloadCodeChangesById(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return DownloadCodeChangesById.start(projectJson)
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
        return CollectRecentGraph.start(projectJson)
            .catch(err => {
                console.log(err)
            });
}

function extractMetrics(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return ExtractMetrics.start(projectJson)
            .catch(err => {
                console.log(err)
            });
}

function computeSimpleMetrics(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return ComputeSimpleMetrics.start(projectJson)
            .catch(err => {
                console.log(err)
            });
}

function computeChangesMetrics(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return ComputeChangesMetrics.start(projectJson)
            .catch(err => {
                console.log(err)
            });
}

function computeMetadata(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return ComputeMetadata.start(projectJson)
            .catch(err => {
                console.log(err)
            });
    /*return ComputeMetadata_2.start(projectJson)
        .catch(err => {
            console.log(err)
        });*/
}

function deleteCodeChanges(argv) {
    let projectJson = prepareCommand(argv);
    if (projectJson)
        return DeleteChanges.start(projectJson)
            .catch(err => {
                console.log(err)
            });
}
