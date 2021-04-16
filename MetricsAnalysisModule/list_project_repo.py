import json
import math
import dbutils
from utils import SlowBar as SlowBar

DATA_DIR_NAME = "/Volumes/SEAGATE-II/Data/libreoffice/"
REPO_TO_CLONE_LIST = DATA_DIR_NAME + 'libreoffice-repositories-to-clone.txt'
CHANGES_COMMIT_AND_FETCH_LIST = DATA_DIR_NAME + "libreoffice-changes-commit-and-fetch.json"
STARTING_POINT = 0

changes_commit_dic = {}
repositories_list = set()
downloadedGitRepo = {}

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
        save_project_file(changes_commit_dic)
        save_repo_clone_list(repositories_list)
        print("\nFinish")
        bar.finish()
    return changes_commit_dic


def collect_repo(doc):
    pid = doc["id"]
    changes_commit_dic[pid] = {}
    revisions = doc["revisions"]
    prev_number_save = math.inf
    for revId in revisions.keys():
        number = revisions[revId]["_number"]
        has_commit = "commit" in revisions[revId]
        if has_commit:
            if number <= prev_number_save:
                changes_commit_dic[pid]["id"] = pid
                changes_commit_dic[pid]["fetch_url"] = revisions[revId]["fetch"]["anonymous http"]["url"]
                changes_commit_dic[pid]["fetch_ref"] = revisions[revId]["fetch"]["anonymous http"]["ref"]
                changes_commit_dic[pid]["commit"] = revisions[revId]["commit"]["parents"][0]["commit"]
                repositories_list.add(changes_commit_dic[pid]["fetch_url"])
                prev_number_save = number
    del doc
    return changes_commit_dic


def save_project_file(prj):
    with open(CHANGES_COMMIT_AND_FETCH_LIST, "wb") as f:
        f.write(json.dumps(prj, indent=4).encode("utf-8"))
        f.close()
    return 0


def save_repo_clone_list(clone_list):
    with open(REPO_TO_CLONE_LIST, 'w') as f:
        for item in clone_list:
            f.write("%s\n" % item)
        f.close()
    return 0


process_changes(STARTING_POINT)
