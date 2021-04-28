import json
import os
import sys
from pathlib import Path as pathlib
import clone_repositories as clone
import download_code_fetch as fetch
import collect_code_metrics as metrics
#import list_project_repo as list_repo


#REPOSITORIES_PATH = "./Repositories"
#DATA_DIR_PATH = "./data/"
#LIST_OF_REPOSITORIES = "./data/libreoffice-repositories-to-clone.txt"
#REFSPEC = "./data/libreoffice-refspec.json"
#LIST_OF_COMMIT = "./data/libreoffice-changes-commit-and-fetch.json"


CONFIG_JSON_PATH = "../DownloadModule/config.json"
projectName = "libreoffice"

def process(projectName):
    projectJson = get_project_json(projectName)
    list_repo.start(projectJson)
    #clone.start(projectJson)
    #fetch.start(projectJson)
    #metrics.start(projectJson)
    pass


def get_project_json(projectName):
    Config = load_json(CONFIG_JSON_PATH);
    json = {}
    json["project_name"] = projectName
    json["output_data_path"] = Config["output_data_path"]
    json["database_hostname"] = Config["database_hostname"]
    json["database_port"] = Config["database_port"]
    json["database_username"] = Config["database_username"]
    json["database_password"] = Config["database_password"]
    json["db_name"] = Config["project"][projectName]["db_name"]
    return json


def load_json(path):
    with open(path) as f:
        json_file = json.load(f)
    return json_file


if __name__ == '__main__':
    #get argument
    argument = sys.argv[1:]

    if(argument):
        projectName = argument[0]

    process(projectName)
    #list_repo.start(projectName)
    #clone.clone_repo(LIST_OF_REPOSITORIES, REPOSITORIES_PATH)
    #fetch.collect_fetch(REFSPEC, REPOSITORIES_PATH)
    #metrics.processData(LIST_OF_COMMIT, REPOSITORIES_PATH, DATA_DIR_PATH)
