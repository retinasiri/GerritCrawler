const Git = require("nodegit");
const url = require('url');
const lineByLine = require('n-readlines');
const shell = require('shelljs');
const fsExtra = require('fs-extra');

let PATH_TO_FILE = "data/repositories-to-clone.txt";
let REPOSITORIES_PATH = "/Volumes/SEAGATE-II/data/repositories";

mainFunction(REPOSITORIES_PATH)
    .catch(err => {
        console.log(err)
    });

function mainFunction(path) {
    return readFileOfRepo()
        .then((array) => {
            return clone_repositories(array, path)
        })
}

//https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
async function readFileOfRepo() {
    const liner = new lineByLine(PATH_TO_FILE);
    let line;
    let repoArray = [];
    while (line = liner.next()) {
        let str = line.toString('ascii').replace('\r', '');
        if (str.trim().length)
            repoArray.push(line.toString('ascii').replace('\r', ''));
    }
    return repoArray;
}

function clone_repositories(repoArray, root_path) {
    for (let id in repoArray) {
        let repoUrl = repoArray[id];
        let command = "git clone " + repoUrl;
        let path = root_path;
        //let path = root_path + (new URL(repoUrl)).pathname;
        fsExtra.ensureDirSync(path);
        clone(path, command);
    }
}

function clone(path, command) {
    shell.cd(path)
    shell.exec(command, {silent:true}, function(code, stdout, stderr) {
        //console.log('Exit code:', code);
        //console.log('Program output:', stdout);
        //console.log('Program stderr: ' +  stderr);
    })
}

/*
async function cloneRepo(repoArray) {
    let tasks = []

    //https://github.com/nodegit/nodegit/issues/1732
    //https://stackoverflow.com/questions/64029362/how-to-get-a-status-progress-when-cloning-a-repo-via-nodegit
    let opts = {
        fetchOpts: {
            callbacks: {
                transferProgress: function (progress) {
                    console.log(JSON.stringify(progress));
                }
            }
        }
    };

    for (let id in repoArray) {
        let repoUrl = repoArray[id];
        let directory_name = new URL(repoArray[id]).pathname;
        //console.log("repoArray : " + repoArray[id]);
        let t1 = Git.Clone.clone(repoUrl, REPOSITORIES_PATH + directory_name, opts)
        tasks.push(t1);
    }
    return Promise.all(tasks);
}
*/
