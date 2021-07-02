import os
import sys
import utils
import dbutils
import statistics as st
from utils import SlowBar as SlowBar


PROJET_NAME = "libreoffice"
GRAPHS_METRICS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/metrics/libreoffice-graph-metrics'
GRAPHS_FULL_METRICS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/metrics/libreoffice-graph-metrics'
CHANGES_GRAPHS_LIST_PATH = "/Volumes/SEAGATE-II/server-data-sync/libreoffice/metrics/libreoffice-changes-graph-list.json"
DATA_DIR_NAME = "/Volumes/SEAGATE-II/Data/libreoffice/"
Database = None
bar = None


def start(json):
    global PROJET_NAME
    PROJET_NAME = json["project_name"]

    global DATA_DIR_NAME
    DATA_DIR_NAME = json["output_data_path"]

    global Database
    Database = dbutils.getDatabaseFromJson(json)
    
    count = Database.get_changes_count()    
    global bar
    bar = SlowBar('Adding graph metrics to DB', max=count)

    global GRAPHS_METRICS_PATH
    GRAPHS_METRICS_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, PROJET_NAME + "-graph-metrics")
    
    global GRAPHS_FULL_METRICS_PATH
    GRAPHS_FULL_METRICS_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, PROJET_NAME + "-graph-full-metrics")

    global CHANGES_GRAPHS_LIST_PATH
    CHANGES_GRAPHS_LIST_PATH = os.path.join(DATA_DIR_NAME, PROJET_NAME, PROJET_NAME + "-changes-graph-list.json")

    collect_metric(GRAPHS_METRICS_PATH, prefix="")

    bar = SlowBar('Adding full graph metrics to DB', max=count)
    collect_metric(GRAPHS_FULL_METRICS_PATH, prefix="fg_")
    return 0


def collect_metric(graph_metrics_path, prefix="", suffix=""):
    changes_graph_list_json = utils.load_json(CHANGES_GRAPHS_LIST_PATH)
    n=0
    for id in changes_graph_list_json:
        '''
        if(n<22570):
            n+=1
            bar.next()
            continue
        '''
        graph_file = changes_graph_list_json[id]
        metrics_filepath = os.path.join(graph_metrics_path, str(graph_file) + ".json")
        temp = utils.load_json(metrics_filepath)
        if temp is not None: 
            metrics_json = temp["metrics"]
            changes = get_change(id)
            for change in changes:
                owner_id = change['owner_id']
                owner_metrics = get_owner_metrics(metrics_json, id, owner_id, prefix, suffix)
                Database.save_metrics(owner_metrics)
                all_account_metrics = get_all_account_metrics(metrics_json, id, prefix, suffix)
                Database.save_metrics(all_account_metrics)
            bar.next()
            del metrics_json
    bar.finish()
    return 0


def get_change(id):
    pipeline = [
        {"$match": { "id" : id}},
        {"$project": {"id": 1, "owner_id": "$owner._account_id", "reviewers_id": "$reviewers.REVIEWER._account_id"}},
    ]
    changes_collection = Database.get_changes_collection()
    return list(changes_collection.aggregate(pipeline, allowDiskUse=True))


def get_owner_metrics(metrics_json, id, ownerId, prefix="", suffix=""):
    results = {}
    results["id"] = id
    results[prefix + "degree_centrality" + suffix] = xf(metrics_json, "degree_centrality", ownerId)
    results[prefix + "closeness_centrality" + suffix] = xf(metrics_json, "closeness_centrality", ownerId)
    results[prefix + "betweenness_centrality" + suffix] = xf(metrics_json, "betweenness_centrality", ownerId)
    results[prefix + "eigenvector_centrality" + suffix] = xf(metrics_json, "eigenvector_centrality", ownerId)
    results[prefix + "clustering_coefficient" + suffix] = xf(metrics_json, "clustering_coefficient", ownerId)
    results[prefix + "core_number" + suffix ] = xf(metrics_json, "core_number", ownerId)
    return results


def xf(metrics_json, metric_name, ownerId):
    result = 0
    if(metrics_json[metric_name] == 0):
        return 0
    if str(ownerId) in metrics_json[metric_name]:
        result = metrics_json[metric_name][str(ownerId)]
    return result


def zf(metrics_json, metric_name):
    if(metrics_json[metric_name] == 0):
        return [0]
    else:
        return [x for x in metrics_json[metric_name].values()]


def get_all_account_metrics(metrics_json, id, prefix="", suffix=""):
    results = {}
    results["id"] = id

    degree_centrality = zf(metrics_json, "degree_centrality")
    closeness_centrality = zf(metrics_json, "closeness_centrality")
    betweenness_centrality = zf(metrics_json, "betweenness_centrality")
    eigenvector_centrality = zf(metrics_json, "eigenvector_centrality")
    clustering_coefficient = zf(metrics_json, "clustering_coefficient")
    core_number = zf(metrics_json, "core_number")

    results = add(results, degree_centrality, prefix + "degree_centrality" + suffix)
    results = add(results, closeness_centrality, prefix + "closeness_centrality" + suffix)
    results = add(results, betweenness_centrality, prefix + "betweenness_centrality" + suffix)
    results = add(results, eigenvector_centrality, prefix + "eigenvector_centrality" + suffix)
    results = add(results, clustering_coefficient, prefix + "clustering_coefficient" + suffix)
    results = add(results, core_number, prefix + "core_number" + suffix)

    results['number_of_nodes'] = len(degree_centrality)
    
    return results

def add(results, metric, metric_name):
    mean_name = metric_name + "_mean"
    max_name = metric_name + "_max"
    min_name = metric_name + "_min"
    std_name = metric_name + "_std"
    results[mean_name] = st.mean(metric)
    results[max_name] = max(metric)
    results[min_name] = min(metric)
    results[std_name] = st.pstdev(metric)
    return results

if __name__ == '__main__':
    argument = sys.argv[1:]
    if(argument):
        projectName = argument[0]
        projectJson = utils.get_project_json(projectName)
        if(projectJson is not None):
            start(projectJson)
        else:
            print ("The project you request can't not be found in the Config.json file")
    else:
        print ("Please provide an argument")
    