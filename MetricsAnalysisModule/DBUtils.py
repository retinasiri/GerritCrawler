import pymongo

DB_URL = "mongodb://localhost:27017/"
LIBRE_OFFICE_DB_NAME = 'libreOfficeDB'
QT_DB_NAME = 'qtDB'
OPENSTACK_DB_NAME = 'openstackDB'
ANDROID_DB_NAME = 'androidDB'
CHANGES_COLLECTION_NAMES = 'changes'
METRICS_COLLECTION_NAMES = 'metrics'

NUM_OF_CHANGES_LIMIT = 20000

class Database:
    def __init__(self, databaseName):
        self.dbClient = pymongo.MongoClient(DB_URL)
        self.databaseName = databaseName

    def getDB(self):
        return self.dbClient[self.databaseName]

    def getChangesCollection(self):
        return self.getDB()[CHANGES_COLLECTION_NAMES]

    def getMetricsCollection(self):
        return self.getDB()[METRICS_COLLECTION_NAMES]

    def getChangesCount(self):
        return self.getChangesCollection().estimated_document_count()

    def getChangesList(self, skip):
        changesCollection = self.getChangesCollection()
        aggregationString = [{ "$sort": { "created": 1 } }, { "$skip": skip }, { "$limit": NUM_OF_CHANGES_LIMIT }]
        #print("skip : " + str(skip) + " - limit : " + str(skip + NUM_OF_CHANGES_LIMIT - 1))
        #changesCollection.find().sort({ "created": 1 }).skip(skip).limit(NUM_OF_CHANGES_LIMIT)
        return list(changesCollection.aggregate(aggregationString, allowDiskUse=True)) 

    def saveMetrics (self, metric):
        query = {}
        newvalues = {}
        query["id"] = metric["id"]
        del metric["id"]
        newvalues["$set"] = metric
        x = self.getMetricsCollection().update_one(query, newvalues, upsert=True)
        #print(x.modified_count, "documents updated.")
        return x
            