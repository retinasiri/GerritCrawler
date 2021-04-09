import pymongo
import os
from pydriller import RepositoryMining
import networkx as nx

print("Hello")

myclient = pymongo.MongoClient("mongodb://localhost:27017/")

print(myclient)

dblist = myclient.list_database_names()
for db in dblist:
    print(db)

#git fetch https://git.libreoffice.org/core refs/changes/03/109503/1 \ && git checkout FETCH_HEAD
#git fetch https://git.libreoffice.org/All-Projects refs/changes/95/107895/2 \ && git checkout FETCH_HEAD


DB_URL = "mongodb://localhost:27017/"
LIBRE_OFFICE_DB_NAME = 'libreOfficeDB'
QT_DB_NAME = 'qtDB'
OPENSTACK_DB_NAME = 'openstackDB'
ANDROID_DB_NAME = 'androidDB'

CHANGES_COLLECTION_NAMES = 'changes'
METRICS_COLLECTION_NAMES = 'metrics'

dbClient = pymongo.MongoClient(DB_URL)
db = dbClient[LIBRE_OFFICE_DB_NAME]

collist = db.list_collection_names()
print(collist)

mycol = db["metrics"]

x = mycol.find_one({},{ "date_created": 1, "date_updated": 1 })

class CloneProgress(RemoteProgress):
    def update(self, op_code, cur_count, max_count=None, message=''):
        if message:
            print(message + " | " + str(cur_count) + " | " + str(max_count))


#urls = "https://github.com/ishepard/pydriller.git"
urls = "https://git.libreoffice.org/All-Projects"
commits = "6c3cdff120d9848402583300255598e84b896006"

for commit in RepositoryMining(path_to_repo=urls, single=commits).traverse_commits():
    for mod in commit.modifications:
        print('{} has complexity of {}, and it contains {} methods'.format(
              mod.filename, mod.complexity, len(mod.methods)))