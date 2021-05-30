from progress.bar import Bar
import os
import json
from humanfriendly import format_timespan


CONFIG_JSON_PATH = "../DownloadModule/res/bot-account.json"


class SlowBar(Bar):
    suffix = '%(percent).1f%% | %(index)d / %(max)d | %(remaining_hours)s remaining'

    @property
    def remaining_hours(self):
        return format_timespan(self.eta)


def get_repositories_path(projectName, data_dir):
    return os.path.join(data_dir, projectName, "Repositories-2")


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
    json = load_json(CONFIG_JSON_PATH)
    return json[projectName]["bot_account"]