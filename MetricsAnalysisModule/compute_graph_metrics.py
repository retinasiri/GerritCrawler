import json
import os
#import threading
import networkx as nx 
from math import ceil
from time import sleep
import multiprocessing as mp
from multiprocessing import Pool, Value, Lock
from pathlib import Path as pathlib
from humanfriendly import format_timespan
from progress.bar import Bar
#from utils import SlowBar as SlowBar

class SlowBar(Bar):
    suffix = '%(percent).1f%% | %(index)d / %(max)d | %(remaining_hours)s remaining'

    @property
    def remaining_hours(self):
        return format_timespan(self.eta)


GRAPHS_METRICS_RESULTS = {} 
GRAPHS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-gpickle-30-days'
GRAPHS_METRICS_RESULTS_PATH = '/Volumes/SEAGATE-II/server-data-sync/libreoffice/graph-metrics-30-days'
COUNTER = 0
LOCK = mp.Lock()


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


def read_graph_from_path(filename) :
    if os.path.isfile(os.path.join(GRAPHS_PATH,filename)) :
        return nx.read_gpickle(os.path.join(GRAPHS_PATH,filename))
    return None


def process(files_list):
    #metrics = {}
    i = 0
    for filename in files_list:
        G = read_graph_from_path(filename)
        if not (G is None):
            if G.number_of_nodes() > 0:
                metric = compute_graph_metrics(G)
            else:
                metric = init_metric()
        else:
            metric = init_metric()
        metric_info = {}
        metric_info['metrics'] = metric
        i+=1
        save_metric_in_file(filename.replace('.gpickle', '.json'), metric_info)
        '''
        LOCK.acquire()
        print(filename)
        LOCK.release()
        '''
    return i      


def update(results):
    PROGRESS_BAR.next(results)

#main
if __name__ == '__main__':
    NB_PROCESS = mp.cpu_count();
    list_files = [a for a in os.listdir(GRAPHS_PATH) if a.endswith('.gpickle')]
    pathlib(GRAPHS_METRICS_RESULTS_PATH).mkdir(parents=True, exist_ok=True)
    list_files.sort()
    
    count = len(list_files)
    #splitedSize = ceil(count/1000)
    splitedSize = 100
    list_files_splited = [list_files[x:x+splitedSize] for x in range(0, len(list_files), splitedSize)]
    PROGRESS_BAR = SlowBar('Processing Graph Metrics', max=count)
    
    pool = mp.Pool(processes=NB_PROCESS)
    processes = [pool.apply_async(process, (x,), callback=update) for x in list_files_splited]
    
    pool.close()
    pool.join()

    PROGRESS_BAR.finish()

