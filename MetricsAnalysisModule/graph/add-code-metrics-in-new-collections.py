import os
import sys
from pymongo import results
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
    
    count = Database.get_previous_metrics_count()    
    global bar
    bar = SlowBar('Collecting graph metrics', max=count)

    transfer_metric(0)
    return 0


def transfer_metric(skip):
    metrics = Database.get_previous_metrics_list(skip)
    if len(metrics) > 0:
        for metric in metrics:
            mt = get_metrics(metric)
            #print(mt)
            if mt :
                Database.save_metrics(mt)
            bar.next()
        del metrics
        return transfer_metric(skip + dbutils.NUM_OF_CHANGES_LIMIT)
    print("\nFinish")
    bar.finish()
    return 0

def copy_metrics(result, metrics, metric_name):
    if metric_name in metrics:
        result[metric_name] = metrics[metric_name]
    return result

def get_metrics(metrics):
    result = {}
    result["id"] = metrics["id"]
    result = copy_metrics(result, metrics, "sum_changed_methods_count")
    result = copy_metrics(result, metrics, "sum_added_lines")
    result = copy_metrics(result, metrics, "sum_removed_lines")
    result = copy_metrics(result, metrics, "sum_loc")
    result = copy_metrics(result, metrics, "sum_complexity")

    #result = copy_metrics(result, metrics, "diff")
    #result = copy_metrics(result, metrics, "moy_loc")
    #result = copy_metrics(result, metrics, "moy_complexity")

    result = copy_metrics(result, metrics, "num_modify_modification")
    result = copy_metrics(result, metrics, "num_add_modification")
    result = copy_metrics(result, metrics, "num_copy_modification")
    result = copy_metrics(result, metrics, "num_delete_modification")
    result = copy_metrics(result, metrics, "num_rename_modification")
    result = copy_metrics(result, metrics, "num_unknown_modification")

    result = copy_metrics(result, metrics, "num_segs_added")
    result = copy_metrics(result, metrics, "num_segs_deleted")
    result = copy_metrics(result, metrics, "num_segs_modify")

    '''
    result["sum_changed_methods_count"] = metrics["sum_changed_methods_count"]
    result["sum_added_lines"] = metrics["sum_added_lines"]
    result["sum_removed_lines"] = metrics["sum_removed_lines"]

    result["sum_loc"] = metrics["sum_loc"]
    result["sum_complexity"] = metrics["sum_complexity"]
    #result["diff"] = metrics["diff"]
    #result["moy_loc"] = metrics["moy_loc"]
    #result["moy_complexity"] = metrics["moy_complexity"]

    result["num_modify_modification"] = metrics["num_modify_modification"]
    result["num_add_modification"] = metrics["num_add_modification"]
    result["num_copy_modification"] = metrics["num_copy_modification"]
    result["num_delete_modification"] = metrics["num_delete_modification"]
    result["num_rename_modification"] = metrics["num_rename_modification"]
    result["num_unknown_modification"] = metrics["num_unknown_modification"]

    result["num_segs_added"] = metrics["num_segs_added"]
    result["num_segs_deleted"] = metrics["num_segs_deleted"]
    result["num_segs_modify"] = metrics["num_segs_modify"]
    '''

    return result


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