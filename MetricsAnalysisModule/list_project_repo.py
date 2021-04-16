import json
import math
import MetricsAnalysisModule.DBUtils as DBUtils
from MetricsAnalysisModule.Utils import SlowBar as SlowBar

STARTING_POINT = 0
projects = {}
repoToDownload = set()
downloadedGitRepo = {}

Database = DBUtils.Database(DBUtils.LIBRE_OFFICE_DB_NAME)
count = Database.get_changes_count()
bar = SlowBar('Processing', max=count)


def process_changes(skip):
    changes = Database.get_changes_list(skip)
    if len(changes) > 0:
        collect_change(changes)
        del changes
        return process_changes(skip + DBUtils.NUM_OF_CHANGES_LIMIT)
    # else :
    print("Finish")
    bar.finish()
    save_project_file(projects)
    return projects


def collect_change(changes):
    for doc in changes:
        collect_repo(doc)
        bar.next()
    del changes


def collect_repo(doc):
    id = doc["id"]
    projects[id] = {}
    revisions = doc["revisions"]
    prev_number_save = math.inf
    for revId in revisions.keys():
        number = revisions[revId]["_number"]
        has_commit = "commit" in revisions[revId]
        if has_commit:
            if number <= prev_number_save:
                projects[id]["id"] = id
                projects[id]["fetch_url"] = revisions[revId]["fetch"]["anonymous http"]["url"]
                projects[id]["fetch_ref"] = revisions[revId]["fetch"]["anonymous http"]["ref"]
                projects[id]["commit"] = revisions[revId]["commit"]["parents"][0]["commit"]
                repoToDownload.add(projects[id]["fetch_url"])
                prev_number_save = number
                break
    del doc
    return projects


def save_project_file(prj):
    with open("projects-repo.json", "wb") as f:
        f.write(json.dumps(prj, indent=4).encode("utf-8"))
        f.close()
    with open('repositories-to-download.txt', 'w') as f:
        for item in repoToDownload:
            f.write("%s\n" % item)
        f.close()
    return 0


process_changes(STARTING_POINT)
