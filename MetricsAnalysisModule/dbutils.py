import pymongo
import urllib

DB_URL = "mongodb://localhost:27017/"

LIBRE_OFFICE_DB_NAME = 'libreOfficeDB'
QT_DB_NAME = 'qtDB'
OPENSTACK_DB_NAME = 'openstackDB'
ANDROID_DB_NAME = 'androidDB'
CHANGES_COLLECTION_NAMES = 'changes'
METRICS_COLLECTION_NAMES = 'metrics'

NUM_OF_CHANGES_LIMIT = 20000


class Database:
    def __init__(self, database_name, hostname = "localhost", port=27017, username ="", password=""):
        db_url = self.getMainDatabaseUrl(hostname, port, username, password)
        self.dbClient = pymongo.MongoClient(db_url)
        self.databaseName = database_name

    def get_db(self):
        return self.dbClient[self.databaseName]

    def get_changes_collection(self):
        return self.get_db()[CHANGES_COLLECTION_NAMES]

    def get_metrics_collection(self):
        return self.get_db()[METRICS_COLLECTION_NAMES]

    def get_changes_count(self):
        return self.get_changes_collection().estimated_document_count()

    def get_changes_list(self, skip):
        changes_collection = self.get_changes_collection()
        aggregation_string = [{"$sort": {"created": 1}}, {"$skip": skip}, {"$limit": NUM_OF_CHANGES_LIMIT}]
        return list(changes_collection.aggregate(aggregation_string, allowDiskUse=True))

    def save_metrics(self, metric):
        query = {}
        new_values = {}
        query["id"] = metric["id"]
        del metric["id"]
        new_values["$set"] = metric
        x = self.get_metrics_collection().update_one(query, new_values, upsert=True)
        return x

    @staticmethod
    def get_db_name(projectDBName):
        return projectDBName + "DB";


    @staticmethod
    def getMainDatabaseUrl(hostname, port, username, password) :
        real_port = 27017
        if(port) :
            real_port = port
        
        if (username) :
            return "mongodb://" + username + ":" + str(urllib.quote(password.encode("utf-8"))) + "@" + hostname + ":" + str(real_port) + "/";
        elif (hostname):
            return "mongodb://" + hostname + ":" + str(real_port) + "/"
        else :
            return "mongodb://" + hostname


def getDatabaseFromJson(json):
    hostname = json["database_hostname"]
    port = json["database_port"]
    username = json["database_username"]
    password = json["database_password"]
    database_name = Database.get_db_name(json["db_name"])
    return Database(database_name, hostname, port, username, password)
    
