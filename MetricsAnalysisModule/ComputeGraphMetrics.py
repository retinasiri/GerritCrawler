import DBUtils
from Utils import SlowBar as SlowBar
import networkx as nx

#todo multithread the collection of graph metrics
#save the graph then compute
#todo collect recent metrics
#make every metrics output a data file

STARTING_POINT = 0;
G = nx.Graph()

Database = DBUtils.Database(DBUtils.LIBRE_OFFICE_DB_NAME)
count = Database.getChangesCount()
bar = SlowBar('Processing Graph Metrics', max=count)

def processChanges (skip) :
    changes = Database.getChangesList(skip)
    if len(changes) > 0:
        for doc in changes:
            collectMetric(doc)
        return processChanges(skip + DBUtils.NUM_OF_CHANGES_LIMIT)
    else :
        bar.finish()
        print("Finish")
        return True

def collectMetric(doc):
    addAccountToGraph(doc);
    metrics = getOwnerMetrics(doc)
    Database.saveMetrics(metrics)
    bar.next()
    return metrics

def addAccountToGraph(doc):
    ownerId = getOwnerId(doc)
    reviewersId = getHumanReviewersId(doc)
    if ownerId in reviewersId: reviewersId.remove(ownerId)

    G.add_node(ownerId)
    G.add_nodes_from(reviewersId)
    for revId in reviewersId:
        if G.has_edge(ownerId, revId):
            G[ownerId][revId]['weight'] += 1
        else:
            G.add_edge(ownerId, revId, weight=1)

    return G

def getOwnerMetrics(doc):
    metrics = {}
    ownerId = getOwnerId(doc)

    if not G.has_node(ownerId) :
        return metrics;
    
    metrics["id"] = doc["id"];
    metrics["degree_centrality"] = nx.degree_centrality(G)[ownerId]
    metrics["closeness_centrality"] = nx.closeness_centrality(G)[ownerId]
    metrics["betweenness_centrality"] = nx.betweenness_centrality(G, weight='weight')[ownerId]
    metrics["eigenvector_centrality"] = nx.eigenvector_centrality(G, max_iter=700, weight='weight')[ownerId]
    metrics["clustering_coefficient"] = nx.clustering(G)[ownerId]
    metrics["core_number"] = nx.core_number(G)[ownerId]

    return metrics;

def getOwnerId(doc) :
    return doc["owner"]["_account_id"]

def getReviewersId(doc) :
    if 'reviewers' not in doc: return []
    if 'REVIEWER' not in doc["reviewers"]: return []

    reviewers = list(doc["reviewers"]["REVIEWER"])
    reviewersId = []
    for reviewer in reviewers:
        reviewersId.append(reviewer["_account_id"])
    return reviewersId

def getHumanReviewersId(doc):
    if 'reviewers' not in doc: return []
    if 'REVIEWER' not in doc["reviewers"]: return []

    reviewers = list(doc["reviewers"]["REVIEWER"])
    reviewersId = []
    for reviewer in reviewers:
        if 'email' in reviewer : reviewersId.append(reviewer["_account_id"])
    return reviewersId

processChanges(STARTING_POINT)