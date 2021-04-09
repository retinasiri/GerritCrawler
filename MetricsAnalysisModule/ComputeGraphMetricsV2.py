import json
from progress.bar import ChargingBar
from humanfriendly import format_timespan
import networkx as nx

FILE_NAME = "changes-participants.json";
G = nx.Graph()
metricsToSave = {}

class SlowBar(ChargingBar):
    suffix = '%(percent).1f%% | %(index)d / %(max)d | %(remaining_hours)s remaining'
    @property
    def remaining_hours(self):
        return format_timespan(self.eta)

bar = SlowBar('Processing Graph Metrics', max=97347)

def getJson() :
    with open(FILE_NAME) as json_file:
        json_data = json.load(json_file)
        return json_data

def processChanges () :
    jsonLoad = getJson()

    for id in jsonLoad :
        doc = jsonLoad[id]
        collectMetric(doc)
    
    saveMetricsFile(metricsToSave)
    bar.finish()
    print("Finish")
    return True

def collectMetric(doc):
    addAccountToGraph(doc);
    metrics = getOwnerMetrics(doc)
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
    
    id = doc["id"]
    metrics["id"] = doc["id"];
    metrics["degree_centrality"] = nx.degree_centrality(G)[ownerId]
    metrics["closeness_centrality"] = nx.closeness_centrality(G)[ownerId]
    metrics["betweenness_centrality"] = nx.betweenness_centrality(G, weight='weight')[ownerId]
    metrics["eigenvector_centrality"] = nx.eigenvector_centrality(G, max_iter=700, weight='weight')[ownerId]
    metrics["clustering_coefficient"] = nx.clustering(G)[ownerId]
    metrics["core_number"] = nx.core_number(G)[ownerId]

    metricsToSave[id] = metrics

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

def saveMetricsFile(metricsToSave):
    with open("graph-metrics.json", "wb") as f:
        f.write(json.dumps(metricsToSave, indent=4).encode("utf-8"))
        f.close()
    return 0;

processChanges()