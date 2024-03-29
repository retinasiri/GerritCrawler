import dbutils
from utils import SlowBar as SlowBar
import networkx as nx

# todo multithread the collection of graph metrics
# todo save the graph then compute
# todo collect recent metrics
# todo make every metrics output a data file

STARTING_POINT = 0
G = nx.Graph()

Database = dbutils.Database(dbutils.LIBRE_OFFICE_DB_NAME)
count = Database.get_changes_count()
bar = SlowBar('Processing Graph Metrics', max=count)


def processChanges(skip):
    changes = Database.get_changes_list(skip)
    if len(changes) > 0:
        for doc in changes:
            collectMetric(doc)
        return processChanges(skip + dbutils.NUM_OF_CHANGES_LIMIT)
    else:
        bar.finish()
        print("Finish")
        return True


def collectMetric(doc):
    addAccountToGraph(doc)
    metrics = getOwnerMetrics(doc)
    Database.save_metrics(metrics)
    bar.next()
    return metrics


def addAccountToGraph(doc):
    ownerId = getOwnerId(doc)
    reviewersId = getHumanReviewersId(doc)
    if ownerId in reviewersId:
        reviewersId.remove(ownerId)

    G.add_node(ownerId)
    G.add_nodes_from(reviewersId)
    for revId in reviewersId:
        if G.has_edge(ownerId, revId):
            G[ownerId][revId]['weight'] += 1
        else:
            G.add_edge(ownerId, revId, weight=1) #date created 365

    return G


def getOwnerMetrics(doc):
    metrics = {}
    ownerId = getOwnerId(doc)

    if not G.has_node(ownerId):
        return metrics

    metrics["id"] = doc["id"]
    metrics["degree_centrality"] = nx.degree_centrality(G)[ownerId]
    metrics["closeness_centrality"] = nx.closeness_centrality(G)[ownerId]
    metrics["betweenness_centrality"] = nx.betweenness_centrality(G, weight='weight')[ownerId]
    metrics["eigenvector_centrality"] = nx.eigenvector_centrality(G, max_iter=700, weight='weight')[ownerId]
    metrics["clustering_coefficient"] = nx.clustering(G)[ownerId]
    metrics["core_number"] = nx.core_number(G)[ownerId]
    return metrics


def getOwnerId(doc):
    return doc["owner"]["_account_id"]


def getReviewersId(doc):
    if 'reviewers' not in doc:
        return []
    if 'REVIEWER' not in doc["reviewers"]:
        return []

    reviewers = list(doc["reviewers"]["REVIEWER"])
    reviewers_id = []
    for reviewer in reviewers:
        reviewers_id.append(reviewer["_account_id"])
    return reviewers_id


def getHumanReviewersId(doc):
    if 'reviewers' not in doc:
        return []
    if 'REVIEWER' not in doc["reviewers"]:
        return []

    reviewers = list(doc["reviewers"]["REVIEWER"])
    reviewers_id = []
    for reviewer in reviewers:
        if 'email' in reviewer:
            reviewers_id.append(reviewer["_account_id"])
    return reviewers_id


if __name__ == '__main__':
    processChanges(STARTING_POINT)
