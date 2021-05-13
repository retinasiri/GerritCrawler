import threading
import pandas as pd 
import networkx as nx 
import os
from tqdm import tqdm
import json
import sys

GRAPHS_METRICS_RESULTS = {} 
GRAPHS_PATH = './graphs_data/libreoffice/graphs'
REVIEW_GRAPHS_DATA_PATH =  './graphs_data/libreoffice/reviews_graphs.json'
NB_THREADS = 8
IDS_list = [] # later 
UPDATE_LOCK = threading.Lock()

class GraphMetricsThread(threading.Thread):
	def __init__(self, start_id, ids):
		threading.Thread.__init__(self)
		self.start_id =start_id
		self.ids = ids
		self.threads_results = {}
	def run(self):
	
		print('starting: ' + str(self.start_id))
		current_id = self.start_id
		while current_id < len(IDS_list): 
			G =  self.read_graph_from_path(GRAPHS_PATH,current_id)
			if not (G is None) : 
				if not nx.is_empty(G):
					metrics = self.compute_graph_metrics(G)
					self.threads_results[current_id] = metrics
			with UPDATE_LOCK: 
				sys.stdout.flush()
				PROGRESS_BAR.update(1)
			current_id += NB_THREADS

	def read_graph_from_path(self,path,id) :
		if os.path.isfile(os.path.join(path,str(id) + '.gpickle')) :
			return nx.read_gpickle(os.path.join(path,str(id) + '.gpickle'))
		return None
	   
	def compute_graph_metrics(self,G) : 
		return {
			'degree_centrality' : nx.degree_centrality(G),
		        'closeness_centrality' : nx.closeness_centrality(G),
		        'betweenness_centrality' : nx.betweenness_centrality(G, weight='weight'),
		        'eigenvector_centrality' : nx.eigenvector_centrality(G, max_iter=700, weight='weight'),
		        'clustering_coefficient': nx.clustering(G), 
		        'core_number' : nx.core_number(G) 
			  }

	def get_results(self):
		return self.threads_results

#main 
with open(REVIEW_GRAPHS_DATA_PATH) as f:
    review_graphs_data = json.load(f)

IDS_list = sorted(list(set(list(review_graphs_data.values()))))
PROGRESS_BAR = tqdm(total=len(IDS_list))
THREADS_POOL = [GraphMetricsThread(i,IDS_list) for i in range(NB_THREADS)] 

for thread in THREADS_POOL : 
	thread.start()

for thread in THREADS_POOL : 
	thread.join()

  