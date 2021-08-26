import json
import re
import os
import utils
import dbutils
import urllib.parse as urlparse
from pathlib import Path as pathlib
from utils import SlowBar as SlowBar
from pydriller import RepositoryMining, ModificationType
#import multiprocessing as mp
#from multiprocessing import Pool, Value, Lock
#from itertools import izip_longest, ifilter
#import itertools
#import time
#import multiprocessing
#import copy
#from multiprocessing import Process, Pool, Queue


LIST_OF_COMMIT = "/Volumes/SEAGATE-II/Data/libreoffice/libreoffice-changes-commit-and-fetch.json"
REPOSITORIES_PATH = "/Volumes/SEAGATE-II/Data/Repositories"
DATA_DIR_PATH = "data/"
PROJET_NAME = "libreoffice"
Database = dbutils.Database(dbutils.LIBRE_OFFICE_DB_NAME)
#code_metrics = {}
error_list = []

def start(json):
    
    global PROJET_NAME
    PROJET_NAME = json["project_name"]

    global DATA_DIR_PATH
    DATA_DIR_PATH = json["output_data_path"]

    global LIST_OF_COMMIT
    LIST_OF_COMMIT = utils.get_changes_list_and_commit(PROJET_NAME, DATA_DIR_PATH)

    global REPOSITORIES_PATH
    REPOSITORIES_PATH = utils.get_repositories_path(PROJET_NAME, DATA_DIR_PATH)
    print("REPOSITORIES_PATH : " + REPOSITORIES_PATH)

    global Database
    Database = dbutils.getDatabaseFromJson(json)

    return processData(LIST_OF_COMMIT, REPOSITORIES_PATH, DATA_DIR_PATH)

def processData(list_of_commit, repo_root_path, data_dir_path):
    bar = SlowBar('Computing code metrics ')
    json_data = load_json(list_of_commit)
    bar.max = len(json_data)
    n = 1
    for i in json_data:
        '''
        if(n<667900):
            n+=1
            bar.next()
            continue
        '''
        metric = get_code_metrics(json_data[i], repo_root_path)
        if(metric is not None):
            Database.save_metrics(metric)
        bar.next()

    save_json_in_file(error_list, data_dir_path, "-code-metrics-error.json")
    bar.finish()
    print("Finished with code metrics !!!!!")
    pass


def save_json_in_file(data, path, filename):
    output_file_name = PROJET_NAME + filename
    full_path = os.path.join(path, PROJET_NAME, output_file_name)
    dir_path = pathlib(path)
    dir_path.parent.mkdir(parents=True, exist_ok=True)
    with open(full_path, "wb") as f:
        f.write(json.dumps(data, indent=4).encode("utf-8"))
        f.close()
    return 0


def load_json(path):
    with open(path) as f:
        json_file = json.load(f)
    return json_file


def get_code_metrics(data, repo_root_path):
    fetch_url = data["fetch_url"]
    fetch_ref = data["fetch_ref"]
    commit_hash = data["commit"]
    rel_path = "--".join(urlparse.urlsplit(fetch_url).path.split("/")[1:])
    repo_path = os.path.join(repo_root_path, rel_path)    
    metrics = None

    try:
        metrics = compute_code_metrics(data["id"], repo_path, commit_hash)
    except Exception as e:
        error_list.append(data)
        print("An exception occurred")
        print("data[\"id\"] : " + data["id"])
        print("fetch_url : " + fetch_url)
        print("fetch_ref : " + fetch_ref)
        print("commit_hash : " + commit_hash)
        print("repo_path : " + repo_path)
        print(e)

    return metrics


def init_data(cid):
    return {
        "id": cid,
        "sum_changed_methods_count": 0,
        "sum_added_lines": 0,
        "sum_removed_lines": 0,
        "diff": "",
        "sum_loc": 0,
        "sum_complexity": 0,
        "moy_loc": 0,
        "moy_complexity": 0,
        "num_modify_modification": 0,
        "num_add_modification": 0,
        "num_copy_modification": 0,
        "num_delete_modification": 0,
        "num_rename_modification": 0,
        "num_unknown_modification": 0,
        "num_segs_added": 0,
        "num_segs_deleted": 0,
        "num_segs_modify": 0,
    }


def compute_code_metrics(cid, repo_path, commit_hash):
    data = init_data(cid)
    n = 0
    for commit in RepositoryMining(repo_path, single=commit_hash).traverse_commits():
        for modification in commit.modifications:
            data["sum_changed_methods_count"] += len(modification.changed_methods)
            data["sum_added_lines"] += modification.added
            data["sum_removed_lines"] += modification.removed
            data["diff"] += modification.diff + "\n"

            if modification.nloc is not None:
                data["sum_loc"] += modification.nloc
            if modification.complexity is not None:
                data["sum_complexity"] += modification.complexity

            if modification.change_type == ModificationType.MODIFY:
                data["num_modify_modification"] += 1
            if modification.change_type == ModificationType.ADD:
                data["num_add_modification"] += 1
            if modification.change_type == ModificationType.COPY:
                data["num_copy_modification"] += 1
            if modification.change_type == ModificationType.DELETE:
                data["num_delete_modification"] += 1
            if modification.change_type == ModificationType.RENAME:
                data["num_rename_modification"] += 1
            if modification.change_type == ModificationType.UNKNOWN:
                data["num_unknown_modification"] += 1

            n+=1

    if (n != 0):
        data["moy_loc"] = data["sum_loc"]/n
        data["moy_complexity"] = data["sum_complexity"]/n
    else:
        data["moy_loc"] = 0
        data["moy_complexity"] = 0

    code_segment = count_code_segment(data["diff"])
    data["num_segs_added"] = code_segment["added"]
    data["num_segs_deleted"] = code_segment["deleted"]
    data["num_segs_modify"] = code_segment["modify"]
    del data["diff"]
    return data


def count_code_segment(diff_str):
    code_segment = {"added": 0, "deleted": 0, "modify": 0}
    add_line = deleted_line = 0

    # alternative "(@@ .[0-9]*,[0-9]* .[0-9]*,[0-9]* @@)" or "(@@ ([-+][0-9]*,{0,1}[0-9]* *){0,2} @@)"
    regex_begin = r"^(@@ ([-+][0-9]*,[0-9]* *){2} @@)"
    regex_line_added = r"^[+]"
    regex_line_deleted = r"^[-]"

    for line in diff_str.splitlines():
        if re.search(regex_begin, line):
            code_segment = update_code_segment_count(code_segment, add_line, deleted_line)
            add_line = deleted_line = 0
        elif re.search(regex_line_added, line):
            add_line += 1
        elif re.search(regex_line_deleted, line):
            deleted_line += 1

    code_segment = update_code_segment_count(code_segment, add_line, deleted_line)
    add_line = deleted_line = 0

    return code_segment


def update_code_segment_count(code_segment, add_line, deleted_line):
    if add_line > 0 and deleted_line > 0:
        code_segment["modify"] += 1
    elif add_line > 0 and deleted_line == 0:
        code_segment["added"] += 1
    elif add_line == 0 and deleted_line > 0:
        code_segment["deleted"] += 1
    return code_segment


def reorder_repo_list(all_data, data_dir_path):
    new_values = {}
    for id in all_data:
        data = all_data[id]
        fetch_url = data["fetch_url"]
        if not fetch_url in new_values:
            new_values[fetch_url] = {}
        commit_hash = data["commit"]
        new_values[fetch_url][commit_hash] = data
    save_json_in_file(new_values, data_dir_path, "--changes-commit-and-fetch-2.json")
    return new_values

#def update(self, results):
#        PROGRESS_BAR.next(results)

'''
def run(list_of_commit, data_dir_path):
        json_data = load_json(list_of_commit)
        list_data = reorder_repo_list(json_data, data_dir_path)
        list_splited = list_data.values()
        #chunks = [list_data.iteritems()]*100
        #g = (dict(ifilter(None, v)) for v in izip_longest(*chunks))
        #list_splited = list(g)

        NB_PROCESS = mp.cpu_count();
        
        bar = SlowBar('')
        bar.message = 'Processing Graph Metrics'
        bar.max = count
        
        pool = mp.Pool(processes=NB_PROCESS)
        processes = [pool.apply_async(process, (x,), callback=update) for x in list_splited]
        
        pool.close()
        pool.join()

        bar.finish()
        pass
'''

if __name__ == '__main__':  
    #processData(LIST_OF_COMMIT, REPOSITORIES_PATH, DATA_DIR_PATH)
    utils.launch(start)
