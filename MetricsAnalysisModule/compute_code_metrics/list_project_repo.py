import json
import os
import math
import dbutils
import utils
from pathlib import Path as pathlib
from utils import SlowBar as SlowBar

PROJET_NAME = "libreoffice"
DATA_DIR_NAME = "/Volumes/SEAGATE-II/Data/libreoffice/"
REPO_TO_CLONE_LIST = DATA_DIR_NAME + 'libreoffice-repositories-to-clone.txt'
CHANGES_COMMIT_AND_FETCH_LIST = DATA_DIR_NAME + "libreoffice-changes-commit-and-fetch.json"
REFSPEC = DATA_DIR_NAME + "libreoffice-refspec.json"
STARTING_POINT = 0

changes_commit_dic = {}
repositories_list = set()
downloadedGitRepo = {}
refspec = {}

Database = dbutils.Database(dbutils.LIBRE_OFFICE_DB_NAME)
count = Database.get_changes_count()
bar = SlowBar('')


def start(json):

    global PROJET_NAME
    PROJET_NAME = json["project_name"]

    global DATA_DIR_NAME
    DATA_DIR_NAME = json["output_data_path"]

    global REPO_TO_CLONE_LIST
    REPO_TO_CLONE_LIST = utils.get_repo_clone_list_name(PROJET_NAME, DATA_DIR_NAME)
    
    global CHANGES_COMMIT_AND_FETCH_LIST
    CHANGES_COMMIT_AND_FETCH_LIST = utils.get_changes_list_and_commit(PROJET_NAME, DATA_DIR_NAME)
    
    global REFSPEC
    REFSPEC = utils.get_refspec(PROJET_NAME, DATA_DIR_NAME)
    
    hostname = json["database_hostname"]
    port = json["database_port"]
    username = json["database_username"]
    password = json["database_password"]
    database_name = dbutils.Database.get_db_name(json["db_name"])

    global Database
    Database = dbutils.Database(database_name, hostname, port, username, password)
    
    global count
    count = Database.get_changes_count()
    
    global bar
    bar = SlowBar('Processing', max=count)

    process_changes(STARTING_POINT)
    return 0


def process_changes(skip):
    changes = Database.get_changes_list(skip)
    if len(changes) > 0:
        for doc in changes:
            collect_repo(doc)
            bar.next()
        del changes
        return process_changes(skip + dbutils.NUM_OF_CHANGES_LIMIT)
    else:
        save_dic_in_file(changes_commit_dic, CHANGES_COMMIT_AND_FETCH_LIST)
        save_dic_in_file(refspec, REFSPEC)
        save_set_in_file(repositories_list, REPO_TO_CLONE_LIST)
        print("\nFinish")
        bar.finish()
    return changes_commit_dic


def collect_repo(doc):
    pid = doc["id"]
    changes_commit_dic[pid] = {}
    revisions = doc["revisions"]
    prev_number_save = math.inf
    fetch_url = ""
    fetch_refs = ""
    commit = ""
    for revId in revisions.keys():
        number = revisions[revId]["_number"]
        has_commit = "commit" in revisions[revId]
        if has_commit:
            if number <= prev_number_save:
                fetch_url = revisions[revId]["fetch"]["anonymous http"]["url"]
                fetch_refs = revisions[revId]["fetch"]["anonymous http"]["ref"]
                commit = revisions[revId]["commit"]["parents"][0]["commit"]
                prev_number_save = number

    changes_commit_dic[pid]["id"] = pid
    changes_commit_dic[pid]["fetch_url"] = fetch_url
    changes_commit_dic[pid]["fetch_ref"] = fetch_refs
    changes_commit_dic[pid]["commit"] = commit
    repositories_list.add(changes_commit_dic[pid]["fetch_url"])
    
    if not fetch_url in refspec:
        refspec[fetch_url] = {"fetch_url" : fetch_url, "fetch_refs": [], "commits": []}

    refspec[fetch_url]["fetch_refs"].append(fetch_refs)
    refspec[fetch_url]["commits"].append(commit)

    del doc
    return changes_commit_dic


def save_dic_in_file(prj, path):
    dir_path = pathlib(path)
    dir_path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as f:
        f.write(json.dumps(prj, indent=4).encode("utf-8"))
        f.close()
    return 0


def save_set_in_file(clone_list, path):
    dir_path = pathlib(path)
    dir_path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w') as f:
        for item in clone_list:
            f.write("%s\n" % item)
        f.close()
    return 0


if __name__ == '__main__':
    process_changes(STARTING_POINT)
