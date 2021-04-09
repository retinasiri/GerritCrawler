import json
import asyncio
from typing import Set
import DBUtils
from Utils import SlowBar as SlowBar
#from Utils import CloneProgress as CloneProgress

STARTING_POINT = 0
changesToSave = {}

Database = DBUtils.Database(DBUtils.LIBRE_OFFICE_DB_NAME)
count = Database.getChangesCount()
bar = SlowBar('Processing', max=count)

def processChanges (skip) :
    changes = Database.getChangesList(skip)
    if len(changes) > 0:
        collectChange(changes)
        del changes
        return processChanges(skip + DBUtils.NUM_OF_CHANGES_LIMIT)
    else :
        print("Finish")
        bar.finish()
        saveProjectFile(changesToSave)
    return changes

def collectChange(changes) :
    for doc in changes:
        collectParticipants(doc)
        bar.next()
    del changes

def collectParticipants(doc):
    id = doc["id"]
    changesToSave[id] = {}
    changesToSave[id]["id"] = id
    changesToSave[id]["owner"] = {}
    
    changesToSave[id]["owner"]["_account_id"] = doc["owner"]["_account_id"]
    if "name" in doc["owner"]:
        changesToSave[id]["owner"]["name"] = doc["owner"]["name"]
    if "email" in doc["owner"]:
        changesToSave[id]["owner"]["email"] = doc["owner"]["email"]
    if "username" in doc["owner"]:
        changesToSave[id]["owner"]["username"] = doc["owner"]["username"]
    
    changesToSave[id]["reviewers"] = doc["reviewers"]
    return changesToSave

def saveProjectFile(changesToSave):
    with open("changes-participants.json", "wb") as f:
        f.write(json.dumps(changesToSave, indent=4).encode("utf-8"))
        f.close()
    return 0;

processChanges(STARTING_POINT)