import json
import os
import sys
import threading
import networkx as nx 
from math import ceil
from time import sleep
import multiprocessing as mp
from multiprocessing import Pool, Value, Lock
from pathlib import Path as pathlib
from utils import SlowBar as SlowBar


GRAPHS_METRICS_RESULTS = {} 
GRAPHS_PATH = '../DownloadModule/data/libreoffice/graph-list-90-days'
GRAPHS_METRICS_RESULTS_PATH = '../DownloadModule/data/libreoffice/graph-metrics-90-days'
LOCK = mp.Lock()
UPDATE_LOCK = threading.Lock()
COUNTER = 0


def build_nx_graph(graph):
    G = nx.Graph()
    edges = graph["edges"]
    nodes = graph["nodes"]
    for nodeId in nodes:
        G.add_node(nodeId)
    for edge in edges:
        if G.has_edge(edge[0], edge[1]):
            G[edge[0]][edge[1]]['weight'] += 1
        else:
            G.add_edge(edge[0], edge[1], weight=1)
    G.remove_edges_from(nx.selfloop_edges(G))
    return G


def get_nx_graph_from_file(name):
    path = os.path.join(GRAPHS_PATH, name)
    if os.path.isfile(path):
        with open(path, "r") as f:
            #print(path)
            json_file = json.load(f)
            graph = json_file["graph"]
            changes = json_file["changes"]
            if(len(graph) == 0):
                return None
            nxgraph = build_nx_graph(graph)
            f.close()
            return [nxgraph, changes]
    return None;


def save_metric_in_file(filename, metric):
    full_path = os.path.join(GRAPHS_METRICS_RESULTS_PATH, filename)
    with open(full_path, "wb") as f:
        f.write(json.dumps(metric, indent=4).encode("utf-8"))
        f.close()
    return 0


def compute_graph_metrics(G) : 
    return {
        'degree_centrality' : nx.degree_centrality(G),
        'closeness_centrality' : nx.closeness_centrality(G),
        'betweenness_centrality' : nx.betweenness_centrality(G, weight='weight'),
        'eigenvector_centrality' : nx.eigenvector_centrality(G, max_iter=700, weight='weight'),
        'clustering_coefficient': nx.clustering(G), 
        'core_number' : nx.core_number(G) 
    }


def init_metric() :
    return {
        'degree_centrality' : 0,
        'closeness_centrality' : 0,
        'betweenness_centrality' : 0,
        'eigenvector_centrality' : 0,
        'clustering_coefficient': 0, 
        'core_number' : 0
    }


def process(files_list):
    metrics = {}
    for filename in files_list:
        result = get_nx_graph_from_file(filename)
        G = result[0]
        changes = result[1]
        if not (G is None):
            if G.number_of_nodes() > 0:
                metric = compute_graph_metrics(G)
            else:
                metric = init_metric()
        else:
            metric = init_metric()
        metric_info = {}
        metric_info['metrics'] = metric
        metric_info["changes"] = changes
        metrics[filename] = metric_info
        save_metric_in_file(filename, metric_info)
    return metrics      


def update(results):
    #print([len(x) for x in results])
    PROGRESS_BAR.next(len(results))

#todo put metrics in the DB


#main
if __name__ == '__main__':
    NB_PROCESS = mp.cpu_count();
    list_files = [a for a in os.listdir(GRAPHS_PATH) if a.endswith('.json')]
    pathlib(GRAPHS_METRICS_RESULTS_PATH).mkdir(parents=True, exist_ok=True)

    count = len(list_files)
    splitedSize = ceil(count/NB_PROCESS)
    list_files_splited = [list_files[x:x+splitedSize] for x in range(0, len(list_files), splitedSize)]
    PROGRESS_BAR = SlowBar('Processing Graph Metrics', max=count)
    
    pool = mp.Pool(processes=NB_PROCESS)
    processes = [pool.apply_async(process, (x,), callback=update) for x in list_files_splited]
    #mp.Pool(processes=NB_PROCESS).map(process, list_files_splited)
    #processes = [mp.Process(target=process, args=(x,)) for x in list_files_splited]
    pool.close()
    pool.join()
    PROGRESS_BAR.finish()

