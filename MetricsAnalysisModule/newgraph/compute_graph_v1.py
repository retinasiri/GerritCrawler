from utils import SlowBar as SlowBar
import networkx as nx
import json
import utils
import dbutils

# todo multithread the collection of graph metrics
# todo save the graph then compute
# todo collect recent metrics
# todo make every metrics output a data file

STARTING_POINT = 0
DATA_DIR_PATH = "data/"
PROJET_NAME = "libreoffice"
OUTPUT_FILE = PROJET_NAME + "-graph-metrics.json"
GRAPH_LIST_PATH = "/Volumes/SEAGATE-II/Data/libreoffice/libreoffice-graph.json"
Database = dbutils.Database(dbutils.LIBRE_OFFICE_DB_NAME)

#G = nx.Graph()
graph_metrics = {};

def start(json):
    
    global PROJET_NAME
    PROJET_NAME = json["project_name"]

    global DATA_DIR_PATH
    DATA_DIR_PATH = json["output_data_path"]

    global GRAPH_LIST_PATH
    GRAPH_LIST_PATH = utils.get_graph_list(PROJET_NAME, DATA_DIR_PATH)

    global OUTPUT_FILE
    OUTPUT_FILE = PROJET_NAME + "-graph-metrics.json"

    global Database
    Database = dbutils.getDatabaseFromJson(json)

    return processChanges(GRAPH_LIST_PATH, DATA_DIR_PATH)


def processChanges(graph_list_path, data_dir_path):
    bar = SlowBar('Processing Graph Metrics')
    graphList = load_json(graph_list_path)
    bar.max = len(graphList)
    for i in graphList:
        metric = get_graph_metrics(graphList[i])
        if(metric is not None):
            mid = metric["id"]
            graph_metrics[mid] = metric
            Database.save_metrics(metric)
        bar.next()

    save_metrics_file(graph_metrics, data_dir_path)
    bar.finish()
    print("Finished with graph metrics!!!!!")
    return True


def load_json(path):
    with open(path) as f:
        json_file = json.load(f)
    return json_file


def save_metrics_file(metrics, data_path):
    full_path = data_path + OUTPUT_FILE;
    with open(full_path, "wb") as f:
        f.write(json.dumps(metrics, indent=4).encode("utf-8"))
        f.close()
    return 0


def get_graph_metrics(graph):
    nxgraph = build_nx_graph(graph)
    metrics = get_owner_graph_metrics(nxgraph, graph["id"], graph["owner_id"])
    #Database.save_metrics(metrics)
    #bar.next()
    return metrics


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

    return G


def get_owner_graph_metrics(G, id, owner_id):
    metrics = {}

    if not G.has_node(owner_id):
        return metrics

    metrics["id"] = id
    metrics["degree_centrality"] = nx.degree_centrality(G)[owner_id]
    metrics["closeness_centrality"] = nx.closeness_centrality(G)[owner_id]
    metrics["betweenness_centrality"] = nx.betweenness_centrality(G, weight='weight')[owner_id]
    metrics["eigenvector_centrality"] = nx.eigenvector_centrality(G, max_iter=700, weight='weight')[owner_id]
    metrics["clustering_coefficient"] = nx.clustering(G)[owner_id]
    metrics["core_number"] = nx.core_number(G)[owner_id]
    return metrics


if __name__ == '__main__':
    processChanges(GRAPH_LIST_PATH, DATA_DIR_PATH)
