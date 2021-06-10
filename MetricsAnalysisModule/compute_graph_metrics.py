import json
import os
#import threading
import networkx as nx 
from math import ceil
from time import sleep
import utils
import multiprocessing as mp
from multiprocessing import Pool, Value, Lock
from pathlib import Path as pathlib
from humanfriendly import format_timespan
from utils import SlowBar as SlowBar


GRAPHS_METRICS_RESULTS = {} 
GRAPHS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-gpickle'
FULL_GRAPHS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-full-gpickle'
GRAPHS_METRICS_RESULTS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-metrics'
GRAPHS_FULL_METRICS_RESULTS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-full-metrics'
COUNTER = 0
LOCK = mp.Lock()


PROJET_NAME = "libreoffice"
DATA_DIR_NAME = "/Volumes/SEAGATE-II/Data/libreoffice/"
PROGRESS_BAR = SlowBar('')


def start(json):
    global PROJET_NAME
    PROJET_NAME = json["project_name"]

    global DATA_DIR_NAME
    DATA_DIR_NAME = json["output_data_path"]

    global GRAPHS_PATH
    GRAPHS_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, "graph-gpickle")
    
    global FULL_GRAPHS_PATH
    FULL_GRAPHS_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, "graph-full-gpickle")
    
    global GRAPHS_METRICS_RESULTS_PATH
    GRAPHS_METRICS_RESULTS_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, "graph-metrics")
    
    global GRAPHS_FULL_METRICS_RESULTS_PATH
    GRAPHS_FULL_METRICS_RESULTS_PATH = os.path.join(DATA_DIR_NAME,PROJET_NAME, "graph-full-metrics")

    #main()
    return 0

class Process_metrics():
    def __init__(self, path_graph, path_metrics):
        self.path_to_graph = path_graph
        self.path_to_metrics = path_metrics
        self.bar = SlowBar('')
        pass


    def run(self):
        NB_PROCESS = mp.cpu_count();
        list_files = [a for a in os.listdir(self.path_to_graph) if a.endswith('.gpickle')]
        pathlib(self.path_to_metrics).mkdir(parents=True, exist_ok=True)
        list_files.sort()
        
        count = len(list_files)
        #splitedSize = ceil(count/1000)
        splitedSize = 100
        list_files_splited = [list_files[x:x+splitedSize] for x in range(0, len(list_files), splitedSize)]

        self.bar.message = 'Processing Graph Metrics'
        self.bar.max = count
        
        pool = mp.Pool(processes=NB_PROCESS)
        processes = [pool.apply_async(self.process, (x,), callback=self.update) for x in list_files_splited]
        
        pool.close()
        pool.join()

        self.bar.finish()
        pass


    def save_metric_in_file(self, filename, metric):
        full_path = os.path.join(self.path_to_metrics, filename)
        with open(full_path, "wb") as f:
            f.write(json.dumps(metric, indent=4).encode("utf-8"))
            f.close()
        return 0


    def compute_graph_metrics(self, G) : 
        return {
            'degree_centrality' : nx.degree_centrality(G),
            'closeness_centrality' : nx.closeness_centrality(G),
            'betweenness_centrality' : nx.betweenness_centrality(G, weight='weight'),
            'eigenvector_centrality' : nx.eigenvector_centrality(G, max_iter=700, weight='weight'),
            'clustering_coefficient': nx.clustering(G), 
            'core_number' : nx.core_number(G) 
        }


    def init_metric(self) :
        return {
            'degree_centrality' : 0,
            'closeness_centrality' : 0,
            'betweenness_centrality' : 0,
            'eigenvector_centrality' : 0,
            'clustering_coefficient': 0, 
            'core_number' : 0
        }


    def read_graph_from_path(self, filename) :
        if os.path.isfile(os.path.join(self.path_to_graph,filename)) :
            return nx.read_gpickle(os.path.join(GRAPHS_PATH,filename))
        return None


    def process(self, files_list):
        i = 0
        for filename in files_list:
            G = self.read_graph_from_path(filename)
            if not (G is None):
                if G.number_of_nodes() > 0:
                    metric = self.compute_graph_metrics(G)
                else:
                    metric = self.init_metric()
            else:
                metric = self.init_metric()
            metric_info = {}
            metric_info['metrics'] = metric
            i+=1
            self.save_metric_in_file(filename.replace('.gpickle', '.json'), metric_info)
        return i      


    def update(self, results):
        PROGRESS_BAR.next(results)



#main
if __name__ == '__main__':
    utils.launch(start)
    #main()

