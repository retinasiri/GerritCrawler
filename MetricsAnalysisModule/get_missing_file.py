import os
import sys
import utils
import dbutils
import json
import statistics as st
from utils import SlowBar as SlowBar


PROJET_NAME = "libreoffice"
GRAPHS_METRICS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/metrics/libreoffice-graph-metrics'
GRAPHS_FULL_METRICS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/metrics/libreoffice-graph-metrics'
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
    #bar = SlowBar('Adding graph metrics to DB', max=count)

    #global GRAPHS_METRICS_PATH
    #GRAPHS_METRICS_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, PROJET_NAME + "-graph-metrics")
    
    global GRAPHS_FULL_METRICS_PATH
    GRAPHS_FULL_METRICS_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, PROJET_NAME + "-graph-full-metrics")

    #global CHANGES_GRAPHS_LIST_PATH
    #CHANGES_GRAPHS_LIST_PATH = os.path.join(DATA_DIR_NAME, PROJET_NAME, PROJET_NAME + "-changes-graph-list.json")

    #collect_metric(GRAPHS_METRICS_PATH, prefix="")
    print()

    #bar = SlowBar('Adding full graph metrics to DB', max=count)
    get_missing_files(GRAPHS_FULL_METRICS_PATH)
    return 0


def get_missing_files(path_to_graph):
    list_files = [int(a.replace('.json', '')) for a in os.listdir(path_to_graph) if a.endswith('.json')]
    maximum = max(list_files)
    list = [x for x in range(maximum)]
    temp3 = [x for x in range(maximum) if x not in list_files]
    for x in temp3:
        print(str(x)+'.json')
    #print(temp3)
    #print(len(list_files))
    #print(len(list))

def load_json(path):
    if os.path.exists(path):
        with open(path) as f:
            json_file = json.load(f)
            f.close()
        return json_file
    else:
        return None


def invert_graph_list(CHANGES_GRAPHS_LIST_PATH):
    changes_graph_list_json = utils.load_json(CHANGES_GRAPHS_LIST_PATH)
    graph_dict = {}
    for id in changes_graph_list_json:
        graph_number = changes_graph_list_json[id]
        graph_dict[graph_number] = id



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