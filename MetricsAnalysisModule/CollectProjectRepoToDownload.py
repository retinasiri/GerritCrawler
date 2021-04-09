import json
import math
from typing import Set
import DBUtils
from Utils import SlowBar as SlowBar

STARTING_POINT = 0;
projects = {}
repoToDownload = set()
downloadedGitRepo = {}

Database = DBUtils.Database(DBUtils.LIBRE_OFFICE_DB_NAME)
count = Database.getChangesCount()
bar = SlowBar('Processing', max=count)

def processChanges (skip) :
    changes = Database.getChangesList(skip)
    if len(changes) > 0:
        collectChange(changes)
        del changes
        return processChanges(skip + DBUtils.NUM_OF_CHANGES_LIMIT)
    #else :
    print("Finish")
    bar.finish()
    saveProjectFile(projects)
    return projects

def collectChange(changes) :
    for doc in changes:
        collectRepo(doc)
        bar.next()
    del changes

def collectRepo(doc):
    id = doc["id"]
    projects[id] = {}
    revisions = doc["revisions"]
    prev_number_save = math.inf
    for revId in revisions.keys():
        number = revisions[revId]["_number"]
        has_commit = "commit" in revisions[revId]
        if has_commit :
            if number <= prev_number_save :
                projects[id]["id"] = id;
                projects[id]["fetch_url"] = revisions[revId]["fetch"]["anonymous http"]["url"]
                projects[id]["fetch_ref"] = revisions[revId]["fetch"]["anonymous http"]["ref"]
                projects[id]["commit"] = revisions[revId]["commit"]["parents"][0]["commit"]
                repoToDownload.add(projects[id]["fetch_url"])
                prev_number_save = number
                break
    del doc
    return projects

def saveProjectFile(projects):
    with open("projects-repo.json", "wb") as f:
        f.write(json.dumps(projects, indent=4).encode("utf-8"))
        f.close()
    with open('repositories-to-download.txt', 'w') as f:
        for item in repoToDownload:
            f.write("%s\n" % item)
        f.close()
    return 0;

processChanges(STARTING_POINT)