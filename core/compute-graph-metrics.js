const Mongoose = require('mongoose');
const Moment = require('moment');
const MathJs = require('mathjs');
const jsnx = require('jsnetworkx');
const dbUtils = require('../config/dbUtils');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Metrics = require('../models/metrics');
const Utils = require('../config/utils');
const Extension = require('../res/extension.json');
const Keywords = require('../res/keywords.json');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

let projectDBUrl = Database.libreOfficeDBUrl;

let NUM_DAYS_FOR_RECENT = 120;
let NUM_OF_CHANGES_LIMIT = 80000;

let i = 0;

mainFunction()
    .then(() => {
        progressBar.stop();
        console.log("Finished!!!!");
        process.exit();
    })
    .catch(err => {
        console.log(err)
    });

function mainFunction() {
    return dbConnection()
        .then(() => {
            console.log("Processing data...");
            progressBar.start(NUM_OF_CHANGES_LIMIT, 0);
            return getChanges();
        })
        /*.then(() => {
            return Utils.saveJsonToFile("metrics", metricsJson);
        })*/
        .catch(err => {
            console.log(err)
        });
}

async function dbConnection() {
    return Mongoose.connect(projectDBUrl, { useNewUrlParser: true, useUnifiedTopology: true },
        function(err) {
            if (err) {
                console.log(err);
            } else {
                //console.log("Connected to the database");
            }
        });
}


//get changes id
function getChanges() {

    return Change
        //.find({})
        .aggregate([
            { $sort: { created: 1 } },
            { $limit: NUM_OF_CHANGES_LIMIT }
        ])
        .allowDiskUse(true)
        //.sort({'created': 1})
        .limit(NUM_OF_CHANGES_LIMIT)
        .exec()
        .then(docs => {
            /*for (let key in docs) {
                console.log("doc : " + docs[key].created);
            }*/
            return collectDocs(docs);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return;
    let promiseArray = []
    for (let key in docs) {
        let promise = await collectMetrics(docs[key])
            .then((json) => {
                return saveMetrics(json);
            })
        promiseArray.push(promise);
    }
    return Promise.all(promiseArray);
}

function saveMetrics(json) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            return Utils.add_line_to_file(json)
        });
}

function updateProgress() {
    progressBar.update(i);
    i++;
}

async function collectMetrics(json) {
    updateProgress();
    let metric = {};
    let socialGraph = getSocialGraph(json);
    metric["id"] = json.id;
    metric["change_id"] = json.change_id;
    metric["degree_centrality"] = socialGraph.degree_centrality;
    metric["closeness_centrality"] = socialGraph.closeness_centrality;
    metric["betweenness_centrality"] = socialGraph.betweenness_centrality;
    metric["eigenvector_centrality"] = socialGraph.eigenvector_centrality;
    metric["clustering_coefficient"] = socialGraph.clustering_coefficient;
    metric["k_coreness"] = socialGraph.coreness;
    return metric;
}

let G = new jsnx.Graph();

function getSocialGraph(json) {

    let ownerId = json.owner._account_id;
    let usersId = getParticipantId(json);

    //add node in graph
    for (let id in usersId) {
        G.addNode(usersId[id]);
    }

    for (let i in usersId) {
        let user1 = usersId[i];
        for (let j in usersId) {
            let user2 = usersId[j];
            if (user1 !== user2) {
                let w = 1;
                if (G.edge.get(user1).get(user2)) {
                    w = G.edge.get(user1).get(user2).weight + 1;
                }
                G.addEdge(user1, user2, { weight: w });
                //console.log("jsnx.getEdgeAttributes(G)" + JSON.stringify(jsnx.getEdgeAttributes(G, 'weight')));
            }
        }
    }

    let degree = jsnx.degree(G);
    let edge_num = G.edges().length;
    let degree_centrality = MathJs.divide(degree.get(ownerId), (edge_num - 1));
    let closeness_centrality = closenessCentrality(G, ownerId);
    let betweennessCentrality = jsnx.betweennessCentrality(G, { weight: true });
    let eigenvector_centrality = jsnx.eigenvectorCentrality(G, { maxIter: 500 });
    let clustering_coefficient = jsnx.clustering(G);
    //console.log("degree_centrality = " + degree_centrality);
    //console.log("closeness_centrality = " + closenessCentrality(G, ownerId));
    //console.log("betweenness_centrality = " + betweennessCentrality.get(ownerId));
    //console.log("eigenvector_centrality = " + eigenvector_centrality.get(ownerId));
    //console.log("clustering_coefficient = " + clustering_coefficient.get(ownerId))
    //console.log(G.edges());
    //console.log(G.edges().length);
    //console.log(G.nodes());
    //console.log("distance " + jsnx.shortestPathLength(G, {source: 1000023, target: 1000031}));
    let coreness = core_number(G);
    //console.log("coreness : " + JSON.stringify(coreness));

    let bcArray = [];
    let ecArray = [];
    let ccArray = [];
    for (let i in usersId) {
        let user = usersId[i];
        let bc = betweennessCentrality.get(user);
        let ec = eigenvector_centrality.get(user);
        let cc = clustering_coefficient.get(user);
        bc ? bcArray.push(bc) : bcArray.push(0);
        ec ? ecArray.push(ec) : bcArray.push(0);
        cc ? ccArray.push(ec) : bcArray.push(0);
    }

    let moy_bc = bcArray.length > 0 ? MathJs.mean(bcArray) : 0;
    let moy_ec = ecArray.length > 0 ? MathJs.mean(ecArray) : 0;
    let moy_cc = ccArray.length > 0 ? MathJs.mean(ccArray) : 0;

    return {
        degree: degree.get(ownerId),
        degree_centrality: degree_centrality,
        closeness_centrality: closeness_centrality,
        betweenness_centrality: betweennessCentrality.get(ownerId),
        eigenvector_centrality: eigenvector_centrality.get(ownerId),
        clustering_coefficient: clustering_coefficient.get(ownerId),
        coreness: coreness[ownerId],
        moy_betweenness_centrality: moy_bc,
        moy_eigenvector_centrality: moy_ec,
        moy_clustering_coefficient: moy_cc
    }
}

/*References
----------
.. [1] An O(m) Algorithm for Cores Decomposition of Networks
Vladimir Batagelj and Matjaz Zaversnik, 2003.
https://arxiv.org/abs/cs.DS/0310049
*/
function core_number(G) {

    let node = []
    let degree = jsnx.degree(G)._numberValues;

    Object.keys(degree).forEach(function(key) {
        let u = {};
        u[key] = degree[key];
        node.push(u);
    })

    order_node_by_degree(node);
    let core = degree;

    for (let i in node) {
        let key_v = Object.keys(node[i])[0];
        key_v = parseInt(key_v);
        core[key_v] = degree[key_v];
        let neighbors = jsnx.neighbors(G, key_v);
        //console.log("key_v = " + key_v);
        //console.log("neighbors = " + neighbors);
        for (let j in neighbors) {
            let key_u = neighbors[j];
            key_u = parseInt(key_u);
            //console.log("d[" + key_v + "] - d[" + key_u + "] = " + degree[key_v] + " - " + degree[key_u]);
            ////console.log("key_v - key_u = " + key_v +" - " + key_u);
            ////console.log("d[key_v] - d[key_u] = " + degree[key_v] +" - " + degree[key_u]);
            if (degree[key_u] > degree[key_v]) {
                degree[key_u] = degree[key_u] - 1;
                order_node_by_degree(node);
            }
        }
    }
    //console.log("degree = " + JSON.stringify(jsnx.degree(G)._numberValues));
    //console.log("core = " + JSON.stringify(core));
    return degree;
}

function order_node_by_degree(node) {
    node.sort(function(a, b) {
        return a[Object.keys(a)[0]] - b[Object.keys(b)[0]];
    });
}

function closenessCentrality(graph, nodeSource) {
    let nodes = graph.nodes();
    let nodes_num = graph.nodes().length; //todo remove G
    let edges = graph.edges();
    let distance_sum = 0;
    for (let i in nodes) {
        let node = nodes[i];
        if (jsnx.hasPath(graph, { source: nodeSource, target: node })) {
            let distance = jsnx.shortestPathLength(graph, { source: nodeSource, target: node }); //todo remove G
            distance_sum = distance_sum + distance;
        }
    }
    let inv = MathJs.divide(1, distance_sum);
    return MathJs.multiply((nodes_num - 1), inv);
}

//human reviewers

function get_human_reviewers(json) {
    let reviewers = getReviewers(json);
    let rev = [];
    for (let i in reviewers) {
        if (reviewers[i].email) {
            rev.push(reviewers[i])
        }
    }

    return rev;
}

function get_num_human_reviewer(json) {
    let reviewers = get_human_reviewers(json);
    return reviewers.length;
}

function get_num_revisions(json) {
    let revisions = json.revisions;
    return Object.keys(revisions).length
}


function getReviewers(json) {
    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id])
    }
    return reviewerArray;
}

function getReviewersId(json) {
    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id]._account_id)
    }
    return reviewerArray;
}

function getParticipantId(json) {
    let ownerId = json.owner._account_id;
    let reviewersId = getReviewersId(json);
    let user = []
    //add user
    user.push(ownerId);
    for (let i in reviewersId) {
        user.push(reviewersId[i]);
    }
    return user;
}