from progress.bar import Bar
import os
import json
import sys
from humanfriendly import format_timespan


CONFIG_JSON_PATH = "../DownloadModule/config.json"
BOT_ACCOUNT_PATH = "../DownloadModule/res/bot-account.json"



class SlowBar(Bar):
    suffix = '%(percent).1f%% | %(index)d / %(max)d | %(remaining_hours)s remaining'

    @property
    def remaining_hours(self):
        return format_timespan(self.eta)


def get_repositories_path(projectName, data_dir):
    return os.path.join(data_dir, projectName, "Repositories")


def get_refspec(projectName, output_dir):
    filename = projectName + "-refspec.json"
    return os.path.join(output_dir,projectName, filename)


def get_repo_clone_list_name(projectName, output_dir):
    filename = projectName + "-repositories-to-clone.txt"
    return os.path.join(output_dir,projectName, filename)


def get_changes_list_and_commit(projectName, output_dir):
    filename = projectName + "-changes-commit-and-fetch.json"
    return os.path.join(output_dir, projectName, filename)

def get_graph_list(projectName, output_dir):
    filename = projectName + "-graph.json"
    return os.path.join(output_dir, projectName, filename)

def get_full_graph_list(projectName, output_dir):
    filename = projectName + "-full-connected-graph.json"
    return os.path.join(output_dir, projectName, filename)


def load_json(path):
    with open(path) as f:
        json_file = json.load(f)
        f.close()
    return json_file


def get_bot_accounts(projectName):
    json = load_json(BOT_ACCOUNT_PATH)
    return json[projectName]["bot_account"]


def get_project_json(projectName):
    Config = load_json(CONFIG_JSON_PATH);

    if(projectName not in Config["project"]) :
        return None

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


def launch(function):
    argument = sys.argv[1:]
    if(argument):
        projectName = argument[0]
        projectJson = get_project_json(projectName)
        if(projectJson is not None):
            function(projectJson)
        else:
            print ("The project you request can't not be found in the Config.json file")
    else:
        print ("Please provide an argument")