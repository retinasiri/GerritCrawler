import dbutils
import utils
import json
import os
import moment
from datetime import datetime
import networkx as nx 
from networkx.readwrite import json_graph
from pathlib import Path as pathlib
from utils import SlowBar as SlowBar


GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-gpickle'
FULL_GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-full-gpickle'

JSON_GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-json'
JSON_FULL_GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-full-json'

PROJET_NAME = "libreoffice"
BOT_ACCOUNT = utils.get_bot_accounts(PROJET_NAME)
NUM_DAYS_FOR_RECENT = 180

Database = dbutils.Database(dbutils.LIBRE_OFFICE_DB_NAME)
count = Database.get_changes_count()
bar = SlowBar('Collecting graph', max= count)
changes_graph_list = {}
i = 0


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
    bar.finish()
    return 0

    
def collect_graph(json, previous_json, graph, full_connected_graph):
    updated_changes = getIntermediaryUpdatedChanges(json, previous_json)    
    if(len(updated_changes)>0):
        return add_updated_changes_in_graph(json, updated_changes, graph, full_connected_graph)
    else:
        global i
        id = json["id"]
        changes_graph_list[id] = i
        
        if(i == 0):
            graph = nx.Graph()
            full_connected_graph = nx.Graph()
            save_graph(graph, full_connected_graph, str(i))
            i+=1

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


def getRemoveIntermediaryUpdatedChanges(json, previous_json):
    if(not previous_json):
        return []

    if (not "created" in previous_json):
        return []

    created_minus_recent_days = moment.date(json["created"]).subtract(days=NUM_DAYS_FOR_RECENT).format('YYYY-MM-DD HH:mm:ss.000000000');
    previous_created_minus_recent_days = moment.date(previous_json["created"]).subtract(days=NUM_DAYS_FOR_RECENT).format('YYYY-MM-DD HH:mm:ss.000000000');
    
    pipeline = [
        {
            "$match": {
                "status": {"$in": ['MERGED', 'ABANDONED']},
                "updated": {"$lte": created_minus_recent_days, "$gte": previous_created_minus_recent_days}
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
    if (i > 0):
        save_graph(graph, full_connected_graph, str(i-1))
    i+=1
    changes_graph_list[id] = i
    graph = update_graph(updatedChanges, owner_id, graph);
    full_connected_graph = updateFullConnectedGraph(updatedChanges, owner_id, full_connected_graph);
    return[graph, full_connected_graph]


def save_graph(G, FG, filename):
    pathForSimple = os.path.join(GRAPHS_GPICKLE_PATH, filename + ".gpickle")
    pathForFullSimple = os.path.join(FULL_GRAPHS_GPICKLE_PATH, filename + ".gpickle")
    nx.write_gpickle(G, pathForSimple)
    nx.write_gpickle(FG, pathForFullSimple)
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
    #graph.remove_edges_from(nx.selfloop_edges(graph))
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
    #graph.remove_edges_from(nx.selfloop_edges(graph))
    return graph


def exclude_bot(reviewers_id):
    return [a for a in reviewers_id if a not in BOT_ACCOUNT]


if __name__ == '__main__':
    pathlib(GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(FULL_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(JSON_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(JSON_FULL_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    collect_changes(0)
