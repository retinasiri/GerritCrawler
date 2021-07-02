import dbutils
import utils
import json
import os
import networkx as nx 
from networkx.readwrite import json_graph
from pathlib import Path as pathlib
from utils import SlowBar as SlowBar


DATA_DIR_NAME = "/Volumes/SEAGATE-II/Data/libreoffice/"
GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-gpickle'
FULL_GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-full-gpickle'
CHANGES_GRAPH_LIST_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/changes-graph-list.json'
'''
JSON_GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-json'
JSON_FULL_GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-full-json'
'''
PROJET_NAME = "libreoffice"
BOT_ACCOUNT = utils.get_bot_accounts(PROJET_NAME)
#NUM_DAYS_FOR_RECENT = 180

Database = None
bar = None
changes_graph_list = {}
i = 0


def start(json):
    global PROJET_NAME
    PROJET_NAME = json["project_name"]

    global DATA_DIR_NAME
    DATA_DIR_NAME = json["output_data_path"]

    global GRAPHS_GPICKLE_PATH
    GRAPHS_GPICKLE_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, PROJET_NAME + "-graph-gpickle")
    
    global FULL_GRAPHS_GPICKLE_PATH
    FULL_GRAPHS_GPICKLE_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, PROJET_NAME + "-graph-full-gpickle")
    
    global CHANGES_GRAPH_LIST_PATH
    CHANGES_GRAPH_LIST_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, PROJET_NAME + "-changes-graph-list.json")

    global BOT_ACCOUNT
    BOT_ACCOUNT = utils.get_bot_accounts(PROJET_NAME)

    pathlib(GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(FULL_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)

    global Database
    Database = dbutils.getDatabaseFromJson(json)
    
    global count
    count = Database.get_changes_count()
    
    global bar
    bar = SlowBar('Collecting graph', max=count)

    collect_changes(0)
    return 0


def collect_changes(skip):
    changes = Database.get_changes_list_for_graph(skip)
    previous_json = {}
    graph = nx.Graph()
    full_connected_graph = nx.Graph()
    if len(changes) > 0:
        for doc in changes:
            result = collect_graph(doc, previous_json, graph, full_connected_graph)
            previous_json = doc
            graph = result[0]
            full_connected_graph = result[1]
            bar.next()
        del changes
        return collect_changes(skip + dbutils.NUM_OF_CHANGES_LIMIT)
    print("\nFinish")
    save_json(changes_graph_list, CHANGES_GRAPH_LIST_PATH)
    bar.finish()
    return 0


def save_json(json_graph, path):
    dir_path = pathlib(path)
    dir_path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as f:
        f.write(json.dumps(json_graph, indent=4).encode("utf-8"))
        f.close()
    return 0

    
def collect_graph(json, previous_json, graph, full_connected_graph):
    updated_changes = getIntermediaryUpdatedChanges(json, previous_json)    
    if(len(updated_changes)>0):
        return add_updated_changes_in_graph(json, updated_changes, graph, full_connected_graph)
    else:
        global i
        id = json["id"]
        changes_graph_list[id] = i
        return [graph, full_connected_graph]
    

def getIntermediaryUpdatedChanges(json, previous_json):
    if(not previous_json):
        return []

    if (not "created" in previous_json):
        return []

    created = json["created"]
    previous_created = previous_json["created"]
    pipeline = [
        {
            "$match": {
                "status": {"$in": ['MERGED', 'ABANDONED']},
                "updated": {"$lte": created, "$gte": previous_created}
            }
        },
        {"$project": {"id": 1, "owner_id": "$owner._account_id", "reviewers_id": "$reviewers.REVIEWER._account_id"}},
    ]
    changes_collection = Database.get_changes_collection()
    return list(changes_collection.aggregate(pipeline, allowDiskUse=True))


def add_updated_changes_in_graph(json, updatedChanges, graph, full_connected_graph):
    id = json["id"]
    global i
    i+=1
    changes_graph_list[id] = i
    return[graph, full_connected_graph]


if __name__ == '__main__':
    utils.launch(start)
  
    

