import json
import dbutils
from utils import SlowBar as SlowBar

DATA_DIR_NAME = "data/"
PATH_OF_SAVED_FILE = DATA_DIR_NAME + "changes-participants.json"
STARTING_POINT = 0

Database = dbutils.Database(dbutils.LIBRE_OFFICE_DB_NAME)
count = Database.get_changes_count()
bar = SlowBar('Processing', max=count)
changes_to_save = {}


def process_changes(skip):
    changes = Database.get_changes_list(skip)
    if len(changes) > 0:
        for doc in changes:
            collect_participants(doc)
            bar.next()
        del changes
        return process_changes(skip + dbutils.NUM_OF_CHANGES_LIMIT)
    else:
        bar.finish()
        print("Finish")
        save_project_file(changes_to_save)
    return changes


def collect_participants(doc):
    i = doc["id"]
    changes_to_save[i] = {}
    changes_to_save[i]["id"] = i
    changes_to_save[i]["owner"] = {}

    changes_to_save[i]["owner"]["_account_id"] = doc["owner"]["_account_id"]
    if "name" in doc["owner"]:
        changes_to_save[i]["owner"]["name"] = doc["owner"]["name"]
    if "email" in doc["owner"]:
        changes_to_save[i]["owner"]["email"] = doc["owner"]["email"]
    if "username" in doc["owner"]:
        changes_to_save[i]["owner"]["username"] = doc["owner"]["username"]

    changes_to_save[i]["reviewers"] = doc["reviewers"]
    return changes_to_save


def save_project_file(changes):
    with open(PATH_OF_SAVED_FILE, "wb") as f:
        f.write(json.dumps(changes, indent=4).encode("utf-8"))
        f.close()
    return 0

if __name__ == '__main__':
    process_changes(STARTING_POINT)
