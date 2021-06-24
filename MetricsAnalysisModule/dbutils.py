import pymongo
import urllib.parse as urlparse


DB_URL = "mongodb://localhost:27017/"

LIBRE_OFFICE_DB_NAME = 'libreOfficeDB'
QT_DB_NAME = 'qtDB'
OPENSTACK_DB_NAME = 'openstackDB'
ANDROID_DB_NAME = 'androidDB'
CHANGES_COLLECTION_NAMES = 'changes'
METRICS_COLLECTION_NAMES = 'metrics'
PREVIOUS_METRICS_COLLECTION_NAMES = 'metrics_20210623'
NUM_OF_CHANGES_LIMIT = 50000


class Database:
    def __init__(self, database_name, url = None):
        self.db_url = url
        self.dbClient = pymongo.MongoClient(self.db_url, authSource='admin')
        #print(url)
        self.databaseName = database_name
        #return self.dbClient;

    def get_db(self):
        return self.dbClient[self.databaseName]

    def get_db_url(self):
        return self.db_url

    def get_database_name(self):
        return self.databaseName

    def get_changes_collection(self):
        return self.get_db()[CHANGES_COLLECTION_NAMES]

    def get_metrics_collection(self):
        return self.get_db()[METRICS_COLLECTION_NAMES]

    def get_previous_metrics_collection(self):
        return self.get_db()[PREVIOUS_METRICS_COLLECTION_NAMES]

    def get_changes_count(self):
        return self.get_changes_collection().estimated_document_count()

    def get_metrics_count(self):
        return self.get_metrics_collection().estimated_document_count()

    def get_previous_metrics_count(self):
        return self.get_previous_metrics_collection().estimated_document_count()

    def get_previous_metrics_list(self, skip):
        metrics_collection = self.get_previous_metrics_collection()
        aggregation_string = [{"$sort": {"number" : 1}}, {"$skip": skip}, {"$limit": NUM_OF_CHANGES_LIMIT}]
        return list(metrics_collection.aggregate(aggregation_string, allowDiskUse=True))

    def get_changes_list(self, skip):
        changes_collection = self.get_changes_collection()
        aggregation_string = [{"$sort": {"_number" : 1}}, {"$skip": skip}, {"$limit": NUM_OF_CHANGES_LIMIT}]
        return list(changes_collection.aggregate(aggregation_string, allowDiskUse=True))

    def get_changes_list_for_graph(self, skip):
        changes_collection = self.get_changes_collection()
        aggregation_string = [
            {"$sort": {"_number": 1}},
            {"$project": {"id": 1,"created": 1, "updated": 1,"_number": 1,"owner_id": "$owner._account_id","reviewers_id": "$reviewers.REVIEWER._account_id"}},
            {"$skip": skip},
            {"$limit": NUM_OF_CHANGES_LIMIT}
        ]        
        return list(changes_collection.aggregate(aggregation_string, allowDiskUse=True))


    def save_metrics(self, metric):
        query = {}
        new_values = {}
        query["id"] = metric["id"]
        del metric["id"]
        new_values["$set"] = metric
        if(new_values["$set"]):
            x = self.get_metrics_collection().update_one(query, new_values, upsert=True)
        else :
            x = metric
        return x

    @staticmethod
    def get_db_name(projectDBName):
        return projectDBName + "DB";


def getMainDatabaseUrl(hostname, port, username, password) :
    real_port = 27017
    if(port) :
        real_port = port
    
    if (username) :
        return "mongodb://" + username + ":" + str(urlparse.quote(password.encode("utf-8"))) + "@" + hostname + ":" + str(real_port) + "/";
    elif (hostname):
        return "mongodb://" + hostname + ":" + str(real_port) + "/"
    else :
        return "mongodb://" + hostname


def getDatabaseFromJson(json):
    #print(json)
    hostname = json["database_hostname"]
    port = json["database_port"]
    username = json["database_username"]
    password = json["database_password"]
    database_name = Database.get_db_name(json["db_name"])
    url = getMainDatabaseUrl(hostname, port, username, password)
    return Database(database_name, url)


def get_database_from_info(db_info):
    return Database(db_info["database_name"], db_info["url"])

    
