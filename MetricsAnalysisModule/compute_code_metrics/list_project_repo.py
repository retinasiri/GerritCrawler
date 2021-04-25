import json
import math
import dbutils
from utils import SlowBar as SlowBar

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
bar = SlowBar('Processing', max=count)


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
    with open(path, "wb") as f:
        f.write(json.dumps(prj, indent=4).encode("utf-8"))
        f.close()
    return 0


def save_set_in_file(clone_list, path):
    with open(path, 'w') as f:
        for item in clone_list:
            f.write("%s\n" % item)
        f.close()
    return 0


process_changes(STARTING_POINT)
