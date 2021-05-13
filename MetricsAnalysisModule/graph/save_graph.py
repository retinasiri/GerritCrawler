import pandas as pd 
import networkx as nx 
import os
from tqdm import tqdm_notebook as tqdm
import json
import sys

def getJson(file_path) :
    with open(file_path) as json_file:
        json_data = json.load(json_file)
    return json_data
        
def getMetaData(metadata_path): 
    metadata = pd.read_excel(metadata_path)
    return metadata

def UpdateGraph(G,doc):
    ownerId = getOwnerId(doc)
    reviewersId = getHumanReviewersId(doc)
    if ownerId in reviewersId: reviewersId.remove(ownerId)
    G.add_node(ownerId)
    G.add_nodes_from(reviewersId)
    for revId in reviewersId:
        if G.has_edge(ownerId, revId):
            G[ownerId][revId]['weight'] += 1
        else:
            G.add_edge(ownerId, revId, weight=1)

    return G

def getOwnerId(doc) :
    return doc["owner"]["_account_id"]

def getReviewersId(doc) :
    if 'reviewers' not in doc: return []
    if 'REVIEWER' not in doc["reviewers"]: return []
    reviewers = list(doc["reviewers"]["REVIEWER"])
    reviewersId = []
    for reviewer in reviewers:
        reviewersId.append(reviewer["_account_id"])
        return reviewersId

def getHumanReviewersId(doc):
    if 'reviewers' not in doc: return []
    if 'REVIEWER' not in doc["reviewers"]: return []
    reviewers = list(doc["reviewers"]["REVIEWER"])
    reviewersId = []
    for reviewer in reviewers:
        if 'email' in reviewer : reviewersId.append(reviewer["_account_id"])
    return reviewersId

def SaveGraph(G,name,path) : 
    nx.write_gpickle(G, os.path.join(path,name+".gpickle"))

def CreateGraphs(review_data,metadata,data_path) :
    collaboration_graph = nx.Graph()
    current_graph_id = -1 
    review_to_graph = {}

    os.makedirs(os.path.join(data_path,'graphs/'),exist_ok=True)

    bar = tqdm(total=len(metadata))
    saved = False 
    for index,row in metadata.iterrows() :
        try:
            review_id = row['ID']
            current_review_data = review_data[review_id]
            if row['event'] == '1_create':
                if not (saved):
                    current_graph_id += 1 
                    SaveGraph(collaboration_graph,str(current_graph_id),os.path.join(data_path,'graphs'))
                    saved = True
                review_to_graph[review_id] = current_graph_id 
          
            if row['event'] == '2_close' : 
                saved = False 
                collaboration_graph = UpdateGraph(collaboration_graph,current_review_data)
            sys.stdout.flush()
            bar.update(1)
        except Exception as e: 
            print(index)
            print(e)
            sys.stdout.flush()
            bar.update(1)
            continue
    with open(os.path.join(data_path,'reviews_graphs.json'), 'w') as fp:
        json.dump(review_to_graph, fp,indent=4)

metadata_path = './libreoffice_metadata.xlsx'
review_data_path = './change-participation.json'
data_path = './drive/MyDrive/graphs_data/libreoffice'
    
metadata = getMetaData(metadata_path)
review_data = getJson(review_data_path)
print('data is set!')
CreateGraphs(review_data,metadata,data_path)  