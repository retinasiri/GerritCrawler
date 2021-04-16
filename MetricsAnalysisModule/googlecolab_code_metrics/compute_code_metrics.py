import os
import json
import re
import urllib.parse as urlparse
from utils import SlowBar as SlowBar
from progress.bar import ChargingBar
from humanfriendly import format_timespan
from pydriller import RepositoryMining, ModificationType


REPOSITORIES_PATH = "Repositories"
LIST_OF_COMMIT = "projects-repo-2.json"
OUTPUT_FILE = "code-metrics.json"

code_metrics = {}

class SlowBar(ChargingBar):
    suffix = '%(percent).1f%% | %(index)d / %(max)d | %(remaining_hours)s remaining'

    @property
    def remaining_hours(self):
        return format_timespan(self.eta)

bar = SlowBar('Processing ')


def processData(list_of_commit, repo_root_path):
    json_data = load_json(list_of_commit)
    bar.max = len(json_data)
    for i in json_data:
        metric = download_code_fetch(json_data[i], repo_root_path)
        mid = metric["id"]
        code_metrics[mid] = metric
        #save_metrics(metric)
        bar.next()
    save_metrics_file(code_metrics)
    bar.finish()
    pass


def load_json(path):
    with open(path) as f:
        json_file = json.load(f)
    return json_file


def save_metrics_file(metrics):
    full_path = OUTPUT_FILE;
    with open(full_path, "wb") as f:
        f.write(json.dumps(metrics, indent=4).encode("utf-8"))
        f.close()
    return 0


def download_code_fetch(data, repo_root_path):
    fetch_url = data["fetch_url"]
    fetch_ref = data["fetch_ref"]
    commit_hash = data["commit"]
    repo_path = repo_root_path + urlparse.urlsplit(fetch_url).path
    command_to_exec = "cd " + repo_path + " && " + "git fetch " + fetch_url + " " + fetch_ref
    os.system(command_to_exec)
    metrics = get_code_metrics(data["id"], repo_path, commit_hash)
    return metrics


def init_data(cid):
    return {
        "id": cid,
        "changed_methods_count": 0,
        "added_lines": 0,
        "removed_lines": 0,
        "diff": "",
        "loc": 0,
        "complexity": 0,
        "num_modify_modification": 0,
        "num_add_modification": 0,
        "num_copy_modification": 0,
        "num_delete_modification": 0,
        "num_rename_modification": 0,
        "num_unknown_modification": 0,
    }


def get_code_metrics(cid, repo_path, commit_hash):
    data = init_data(cid)

    for commit in RepositoryMining(repo_path, single=commit_hash).traverse_commits():
        for modification in commit.modifications:

            data["changed_methods_count"] += len(modification.changed_methods)
            data["added_lines"] += modification.added
            data["removed_lines"] += modification.removed
            data["diff"] += modification.diff + "\n"

            if modification.nloc is not None:
                data["loc"] += modification.nloc
            if modification.complexity is not None:
                data["complexity"] += modification.complexity

            if modification.change_type == ModificationType.MODIFY:
                data["num_modify_modification"] += 1
            if modification.change_type == ModificationType.ADD:
                data["num_add_modification"] += 1
            if modification.change_type == ModificationType.COPY:
                data["num_copy_modification"] += 1
            if modification.change_type == ModificationType.DELETE:
                data["num_delete_modification"] += 1
            if modification.change_type == ModificationType.RENAME:
                data["num_rename_modification"] += 1
            if modification.change_type == ModificationType.UNKNOWN:
                data["num_unknown_modification"] += 1

    code_segment = count_code_segment(data["diff"])
    data["num_segs_added"] = code_segment["added"]
    data["num_segs_deleted"] = code_segment["deleted"]
    data["num_segs_modify"] = code_segment["modify"]
    del data["diff"]
    return data


def count_code_segment(diff_str):
    code_segment = {"added": 0, "deleted": 0, "modify": 0}
    add_line = deleted_line = 0

    # alternative "(@@ .[0-9]*,[0-9]* .[0-9]*,[0-9]* @@)" or "(@@ ([-+][0-9]*,{0,1}[0-9]* *){0,2} @@)"
    regex_begin = r"^(@@ ([-+][0-9]*,[0-9]* *){2} @@)"
    regex_line_added = r"^[+]"
    regex_line_deleted = r"^[-]"

    for line in diff_str.splitlines():
        if re.search(regex_begin, line):
            code_segment = update_code_segment_count(code_segment, add_line, deleted_line)
            add_line = deleted_line = 0
        elif re.search(regex_line_added, line):
            add_line += 1
        elif re.search(regex_line_deleted, line):
            deleted_line += 1

    code_segment = update_code_segment_count(code_segment, add_line, deleted_line)
    add_line = deleted_line = 0

    return code_segment


def update_code_segment_count(code_segment, add_line, deleted_line):
    if add_line > 0 and deleted_line > 0:
        code_segment["modify"] += 1
    elif add_line > 0 and deleted_line == 0:
        code_segment["added"] += 1
    elif add_line == 0 and deleted_line > 0:
        code_segment["deleted"] += 1
    return code_segment


processData(LIST_OF_COMMIT, REPOSITORIES_PATH)
