const Git = require("nodegit");
const lineByLine = require('n-readlines');

let PATH_TO_FILE = "data/repositories-to-clone.txt";
let REPOSITORIES_PATH = "/Volumes/SEAGATE-II/data/repositories";

mainFunction()
    .catch(err => {
        console.log(err)
    });

function mainFunction() {
    //console.log("Processing data...");
    return readFileOfRepo()
        .then((array) => {
            return cloneRepo(array)
        })
}

//https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
async function readFileOfRepo() {
    const liner = new lineByLine(PATH_TO_FILE);
    let line;
    let repoArray = [];
    while (line = liner.next()) {
        repoArray.push(line.toString('ascii').replace('\r', ''));
    }
    //console.log(repoArray);
    return repoArray;
}

async function cloneRepo(repoArray) {
    let tasks = []

    //https://github.com/nodegit/nodegit/issues/1732
    //https://stackoverflow.com/questions/64029362/how-to-get-a-status-progress-when-cloning-a-repo-via-nodegit
    let opts = {
        fetchOpts: {
            callbacks: {
                transferProgress: function(progress) {
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