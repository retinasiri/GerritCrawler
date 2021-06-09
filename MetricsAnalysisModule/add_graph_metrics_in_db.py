import os
import sys
import utils
import dbutils
import statistics as st
import code_metrics
from utils import SlowBar as SlowBar


PROJET_NAME = "libreoffice"
GRAPHS_METRICS = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/metrics/libreoffice-graph-metrics'
CHANGES_GRAPHS_LIST_PATH = "/Volumes/SEAGATE-II/server-data-sync/libreoffice/metrics/libreoffice-changes-graph-list.json"
Database = None
bar = None


def start(json):
    global PROJET_NAME
    PROJET_NAME = json["project_name"]

    global Database
    Database = dbutils.getDatabaseFromJson(json)
    
    count = Database.get_changes_count()    
    global bar
    bar = SlowBar('Collecting graph metrics', max=count)

    collect_metric()
    return 0


def get_owner_metrics(metrics_json, id, ownerId):
    results = {}
    results["id"] = id
    results["degree_centrality"] = xf(metrics_json, "degree_centrality", ownerId)
    results["closeness_centrality"] = xf(metrics_json, "closeness_centrality", ownerId)
    results["betweenness_centrality"] = xf(metrics_json, "betweenness_centrality", ownerId)
    results["eigenvector_centrality"] = xf(metrics_json, "eigenvector_centrality", ownerId)
    results["clustering_coefficient"] = xf(metrics_json, "clustering_coefficient", ownerId)
    results["core_number"] = xf(metrics_json, "core_number", ownerId)
    return results

def xf(metrics_json, metric_name, ownerId):
    result = 0
    #print(ownerId)
    #print(metrics_json[metric_name])
    if(metrics_json[metric_name] == 0):
        return 0

    if str(ownerId) in metrics_json[metric_name]:
        result = metrics_json[metric_name][str(ownerId)]
        #print(ownerId)
        #print(result)

    return result


def df(metrics_json, metrics, metric_name, revId):
    #print(metrics_json)
    if revId in metrics_json[metric_name]:
        metrics.append(metrics_json[metric_name][revId])
    else:
        metrics.append(0)
    return metrics

def add(results, metric, metric_name):
    mean = metric_name + "_mean"
    max = metric_name + "_mean"
    min = metric_name + "_mean"
    std = metric_name + "_mean"
    results[mean] = st.mean(metric)
    results[max] = max(metric)
    results[min] = min(metric)
    results[std] = st.pstdev(metric)


def get_reviewers_metrics(metrics_json, id, reviewers_id):
    results = {}
    results["id"] = id

    degree_centrality_reviewers = []
    closeness_centrality_reviewers = []
    betweenness_centrality_reviewers = []
    eigenvector_centrality_reviewers = []
    clustering_coefficient_reviewers = []
    core_number_reviewers = []

    for revId in reviewers_id:
        degree_centrality_reviewers = df(metrics_json, degree_centrality_reviewers, "degree_centrality", revId)
        closeness_centrality_reviewers = df(metrics_json, closeness_centrality_reviewers, "closeness_centrality", revId)
        betweenness_centrality_reviewers = df(metrics_json, betweenness_centrality_reviewers, "betweenness_centrality", revId)
        eigenvector_centrality_reviewers = df(metrics_json, eigenvector_centrality_reviewers, "eigenvector_centrality", revId)
        clustering_coefficient_reviewers = df(metrics_json, clustering_coefficient_reviewers, "clustering_coefficient", revId)
        core_number_reviewers = df(metrics_json, core_number_reviewers, "core_number_reviewers", revId)

    add(results, degree_centrality_reviewers, "degree_centrality_reviewers")
    add(results, closeness_centrality_reviewers, "closeness_centrality_reviewers")
    add(results, betweenness_centrality_reviewers, "betweenness_centrality_reviewers")
    add(results, eigenvector_centrality_reviewers, "eigenvector_centrality_reviewers")
    add(results, clustering_coefficient_reviewers, "clustering_coefficient_reviewers")
    add(results, core_number_reviewers, "core_number_reviewers")

    return results


def get_change(id):
    pipeline = [
        {"$match": { "id" : id}},
        {"$project": {"id": 1, "owner_id": "$owner._account_id", "reviewers_id": "$reviewers.REVIEWER._account_id"}},
    ]
    changes_collection = Database.get_changes_collection()
    return list(changes_collection.aggregate(pipeline, allowDiskUse=True))


def collect_metric():
    changes_graph_list_json = utils.load_json(CHANGES_GRAPHS_LIST_PATH)
    for id in changes_graph_list_json:
        graph_file = changes_graph_list_json[id]
        metrics_filepath = os.path.join(GRAPHS_METRICS, str(graph_file) + ".json")
        metrics_json = utils.load_json(metrics_filepath)["metrics"]
        changes = get_change(id)
        for change in changes:
            owner_id = change['owner_id']
            #reviewers_id = change['reviewers_id']
            owner_metrics = get_owner_metrics(metrics_json, id, owner_id)
            #reviewers_metrics = get_reviewers_metrics(metrics_json, id, reviewers_id)
            Database.save_metrics(owner_metrics)
            #Database.save_metrics(reviewers_metrics)
        bar.next()
        del metrics_json
    bar.finish()
    return 0

if __name__ == '__main__':
    argument = sys.argv[1:]
    if(argument):
        projectName = argument[0]
        projectJson = code_metrics.get_project_json(projectName)
        if(projectJson is not None):
            start(projectJson)
        else:
            print ("The project you request can't not be found in the Config.json file")
    else:
        print ("Please provide an argument")
    