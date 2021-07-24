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
        
        '''
        if(i == 0):
            graph = nx.Graph()
            full_connected_graph = nx.Graph()
            save_graph(graph, full_connected_graph, str(i))
        '''

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
                "updated": {"$lt": created, "$gte": previous_created}
            }
        },
        {"$project": {"id": 1, "owner_id": "$owner._account_id", "reviewers_id": "$reviewers.REVIEWER._account_id"}},
    ]
    changes_collection = Database.get_changes_collection()
    return list(changes_collection.aggregate(pipeline, allowDiskUse=True))


def add_updated_changes_in_graph(json, updatedChanges, graph, full_connected_graph):
    id = json["id"]
    owner_id = json["owner_id"]
    global i
    
    #if (i > 0):
    if (i == 0):
        save_graph(graph, full_connected_graph, str(i))
    i+=1
    changes_graph_list[id] = i
    graph = update_graph(updatedChanges, owner_id, graph);
    full_connected_graph = updateFullConnectedGraph(updatedChanges, owner_id, full_connected_graph);
    #todo
    save_graph(graph, full_connected_graph, str(i))
    return[graph, full_connected_graph]


def save_graph(G, FG, filename):
    pathForSimple = os.path.join(GRAPHS_GPICKLE_PATH, filename + ".gpickle")
    pathForFullSimple = os.path.join(FULL_GRAPHS_GPICKLE_PATH, filename + ".gpickle")
    nx.write_gpickle(G, pathForSimple)
    nx.write_gpickle(FG, pathForFullSimple)
    '''
    pathForSimpleJson = os.path.join(JSON_GRAPHS_GPICKLE_PATH, filename)
    pathForFullSimpleJson = os.path.join(JSON_FULL_GRAPHS_GPICKLE_PATH, filename)
    save_graph_json(G, pathForSimpleJson)
    save_graph_json(FG, pathForFullSimpleJson)
    '''

    pass


def save_graph_json(G, fname):
    graph = dict()
    graph["graph"] = {}
    graph["graph"]["nodes"] = [n for n in G.nodes()]
    graph["graph"]["edges"] = []
    for u,v in G.edges():
        for i in range(G[u][v]['weight']):
            graph["graph"]["edges"].append([u,v])
    json.dump(graph, open(fname + ".json", 'w'), indent=2)


def update_graph(updatedChanges, owner_id, graph):
    if(graph is None):
        graph = nx.Graph()
    for doc in updatedChanges:
        owner_id = doc["owner_id"]

        if ("reviewers_id" in doc):
            reviewers_id = exclude_bot(doc["reviewers_id"])
        else:
            reviewers_id = []

        graph.add_node(owner_id)
        graph.add_nodes_from(reviewers_id)
        for rev_id in reviewers_id:
            if graph.has_edge(owner_id, rev_id):
                graph[owner_id][rev_id]['weight'] += 1
            else:
                graph.add_edge(owner_id, rev_id, weight=1)
    graph.remove_edges_from(nx.selfloop_edges(graph))
    return graph


def updateFullConnectedGraph(updatedChanges, owner_id, graph):
    if(graph is None):
        graph = nx.Graph()
    for doc in updatedChanges:
        owner_id = doc["owner_id"]
        if ("reviewers_id" in doc):
            reviewers_id = exclude_bot(doc["reviewers_id"])
        else:
            reviewers_id = []
        graph.add_node(owner_id)
        graph.add_nodes_from(reviewers_id)
        for rev_id in reviewers_id:
            if graph.has_edge(owner_id, rev_id):
                graph[owner_id][rev_id]['weight'] += 1
            else:
                graph.add_edge(owner_id, rev_id, weight=1)

            for rev_id2 in reviewers_id:
                if(rev_id == rev_id2):
                    continue
                if graph.has_edge(rev_id, rev_id2):
                    graph[rev_id][rev_id2]['weight'] += 1
                else:
                    graph.add_edge(rev_id, rev_id2, weight=1)
    graph.remove_edges_from(nx.selfloop_edges(graph))
    return graph


def exclude_bot(reviewers_id):
    return [a for a in reviewers_id if a not in BOT_ACCOUNT]


if __name__ == '__main__':
    utils.launch(start)
    
    '''
    pathlib(GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(FULL_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(JSON_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(JSON_FULL_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    collect_changes(0)
    '''

    '''
    pathlib(JSON_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(JSON_FULL_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    '''

    '''
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
    '''
    

    

