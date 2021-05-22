import json
import os
import networkx as nx 
import multiprocessing as mp
from math import ceil
from multiprocessing import Pool, Value, Lock
from pathlib import Path as pathlib
from utils import SlowBar as SlowBar

#GRAPHS_JSON_PATH = '../DownloadModule/data/libreoffice/graph-list-30-days'
#GRAPHS_GPICKLE_PATH = '../DownloadModule/data/libreoffice/graph-gpickle-30-days'
#FULL_GRAPHS_GPICKLE_PATH = '../DownloadModule/data/libreoffice/graph-full-gpickle-metrics-30-days'


GRAPHS_JSON_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-list-30-days'
GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-gpickle-30-days'
FULL_GRAPHS_GPICKLE_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-full-gpickle-metrics-30-days'


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


def empty_graph():
    graph = {}
    graph["edges"] = []
    graph["nodes"] = []
    return graph


def get_nx_graph_from_file(name):
    path = os.path.join(GRAPHS_JSON_PATH, name)
    if os.path.isfile(path):
        with open(path, "r") as f:
            json_file = json.load(f)

            if ("graph" in json_file):
                graph = json_file["graph"]
            else:
                graph = empty_graph()

            if ("full_connected_graph" in json_file):
                full_connected_graph = json_file["full_connected_graph"]
            else:
                full_connected_graph = empty_graph()

            nxGraph = build_nx_graph(graph)
            nxFullGraph = build_nx_graph(full_connected_graph)
            f.close()
            return [nxGraph, nxFullGraph]
    return None;


def process(files_list):
    i = 0
    for filename in files_list:
        results = get_nx_graph_from_file(filename)
        G = results[0]
        FG = results[1]
        new_filename = filename.replace('.json', '.gpickle')
        pathForSimple = os.path.join(GRAPHS_GPICKLE_PATH, new_filename)
        pathForFullSimple = os.path.join(FULL_GRAPHS_GPICKLE_PATH, new_filename)
        nx.write_gpickle(G, pathForSimple)
        #nx.write_gpickle(FG, pathForFullSimple)
        i+=1
    return i  

def update(results):
    PROGRESS_BAR.next(results)


if __name__ == '__main__':
    NB_PROCESS = mp.cpu_count();
    list_files = [a for a in os.listdir(GRAPHS_JSON_PATH) if a.endswith('.json')]
    pathlib(GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)
    pathlib(FULL_GRAPHS_GPICKLE_PATH).mkdir(parents=True, exist_ok=True)

    count = len(list_files)
    splitedSize = ceil(count/1000)
    list_files_splited = [list_files[x:x+splitedSize] for x in range(0, len(list_files), splitedSize)]
    PROGRESS_BAR = SlowBar('Processing Graph Metrics', max=count)
    
    pool = mp.Pool(processes=NB_PROCESS)
    processes = [pool.apply_async(process, (x,), callback=update) for x in list_files_splited]
    #mp.Pool(processes=NB_PROCESS).map(process, list_files_splited)
    #processes = [mp.Process(target=process, args=(x,)) for x in list_files_splited]
    
    pool.close()
    pool.join()
    
    '''
    # Run processes
    for p in processes:
        p.start()

    # Exit the completed processes
    for p in processes:
        p.join()
    '''


    PROGRESS_BAR.finish()