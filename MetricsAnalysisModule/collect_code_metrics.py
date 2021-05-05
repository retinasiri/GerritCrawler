import json
import re
import os
import utils
import dbutils
import urllib.parse as urlparse
from pathlib import Path as pathlib
from utils import SlowBar as SlowBar
from pydriller import RepositoryMining, ModificationType
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
code_metrics = {}

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
    
    bar = SlowBar('Computing code metrics ... ')

    json_data = load_json(list_of_commit)
    bar.max = len(json_data)
    #split_data(json_data, 24)
    #process(json_data)
    #pool_handler(json_data, repo_root_path, Database)
    n = 1
    for i in json_data:
        if(n<100000):
            n+=1
            bar.next()
            continue
        metric = get_code_metrics(json_data[i], repo_root_path)
        if(metric is not None):
            mid = metric["id"]
            code_metrics[mid] = metric
            Database.save_metrics(metric)
        bar.next()
    save_metrics_file(code_metrics, data_dir_path)
    bar.finish()
    print("Finished with code metrics !!!!!")
    pass

""""
def process (json_data):
    number_of_processes = multiprocessing.cpu_count() * 2
    tasks_to_accomplish = Queue()
    tasks_that_are_done = Queue()
    processes = []
    print (number_of_processes)
    data = split_data(json_data, number_of_processes)
    #list(map(tasks_to_accomplish.put, data))
    time.sleep(1)
    for i in range(len(data)):
        tasks_to_accomplish.put(data[i])
        time.sleep(0.1)
    
    cnt=1
    while not tasks_to_accomplish.empty():
        print('item no: ', cnt, ' ', len(tasks_to_accomplish.get()))
        cnt += 1

    tasks_to_accomplish.close()
    tasks_to_accomplish.join_thread()
    

    pass


def pool_handler(json_data, repo_root_path, Database):
    number_of_processes = multiprocessing.cpu_count()
    data = split_data(json_data, number_of_processes)
    lock = multiprocessing.Lock()
    procs = []
    db_info = {"url": Database.get_db_url(), "database_name" : Database.get_database_name()}

    for dt in data:
        proc = Process(target=worker, args=(lock, dt, repo_root_path, db_info))
        procs.append(proc)
        proc.start()

    for proc in procs:
        proc.join()


def worker(lock, data, repo_root_path, db_info):
    metrics = {}
    DB = dbutils.get_database_from_info(db_info)
    for i in data:
        lock.acquire()
        metric = get_code_metrics(data[i], repo_root_path)
        lock.release()
        if(metric is not None):
            print(metric)
            DB.save_metrics(metric)
            mid = metric.get("id")
            print(mid)
            metrics[mid] = metric
    pass


#https://stackoverflow.com/questions/29056525/how-do-i-split-a-dictionary-into-specific-number-of-smaller-dictionaries-using-p
def split_data(data, chunk_size):
    i = itertools.cycle(range(chunk_size))       
    split = [dict() for _ in range(chunk_size)]
    for k, v in data.items():
        split[next(i)][k] = v
    return split
"""

def load_json(path):
    with open(path) as f:
        json_file = json.load(f)
    return json_file


def save_metrics_file(metrics, data_path):
    output_file_name = PROJET_NAME + "-code-metrics.json"
    full_path = os.path.join(data_path, output_file_name)
    dir_path = pathlib(data_path)
    dir_path.parent.mkdir(parents=True, exist_ok=True)
    with open(full_path, "wb") as f:
        f.write(json.dumps(metrics, indent=4).encode("utf-8"))
        f.close()
    return 0


def get_code_metrics(data, repo_root_path):
    fetch_url = data["fetch_url"]
    fetch_ref = data["fetch_ref"]
    commit_hash = data["commit"]
    repo_path = os.path.join(repo_root_path, *urlparse.urlsplit(fetch_url).path.split("/"))
    #print("repo_root_path : " + repo_root_path)
    #print("repo_path : " + repo_path)
    metrics = None

    try:
        metrics = compute_code_metrics(data["id"], repo_path, commit_hash)
    except Exception as e:
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
        "num_modify_modification": 0,
        "num_add_modification": 0,
        "num_copy_modification": 0,
        "num_delete_modification": 0,
        "num_rename_modification": 0,
        "num_unknown_modification": 0,
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


if __name__ == '__main__':  
    processData(LIST_OF_COMMIT, REPOSITORIES_PATH, DATA_DIR_PATH)
