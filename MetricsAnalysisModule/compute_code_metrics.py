import os

from git import diff
from pydriller.domain.commit import ModificationType
import MetricsAnalysisModule.DBUtils as DBUtils
import json
import re
import urllib.parse as urlparse
from MetricsAnalysisModule.Utils import SlowBar as SlowBar
from pydriller import RepositoryMining, ModificationType

Database = DBUtils.Database(DBUtils.LIBRE_OFFICE_DB_NAME)
count = Database.get_changes_count()
# bar = SlowBar('Processing ', max=count)

LIST_OF_COMMIT = "projects-repo-2.json"
REPOSITORIES_PATH = "/Volumes/SEAGATE-II/Data/Repositories"


def processData():
    json_data = loadJson()
    for id in json_data:
        print(id)
        downloadCodeFetch(json_data[id])
    # bar.finish()
    pass


def loadJson():
    with open(LIST_OF_COMMIT) as f:
        json_file = json.load(f)
    return json_file


def downloadCodeFetch(data):
    fetch_url = data["fetch_url"]
    fetch_ref = data["fetch_ref"]
    commit_hash = data["commit"]

    repo_name = REPOSITORIES_PATH + urlparse.urlsplit(fetch_url).path
    command_to_exec = "cd " + repo_name + " && " + "git fetch " + fetch_url + " " + fetch_ref

    print(command_to_exec)

    os.system(command_to_exec)
    getCodeMetrics(repo_name, commit_hash)
    os.system("cd " + REPOSITORIES_PATH)

    # saveMetrics
    # DBUtils.saveMetrics(DBUtils.LIBRE_OFFICE_DB_NAME, metrics)
    # bar.next()
    pass


def initData():
    return {
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


def getCodeMetrics(repoPath, commitHash):
    # analyser les données
    print(commitHash)
    data = initData()
    for commit in RepositoryMining(repoPath, single=commitHash).traverse_commits():
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

    codeSegment = count_code_segment(data["diff"])
    data["num_segs_added"] = codeSegment["added"]
    data["num_segs_deleted"] = codeSegment["deleted"]
    data["num_segs_modify"] = codeSegment["modify"]
    print(data)
    return 0;


def count_code_segment(diff):
    codeSegment = {"added": 0, "deleted": 0, "modify": 0}
    addLine = deletedLine = 0

    # alternative "(@@ .[0-9]*,[0-9]* .[0-9]*,[0-9]* @@)" or "(@@ ([-+][0-9]*,{0,1}[0-9]* *){0,2} @@)"
    regexBegin = r"^(@@ ([-+][0-9]*,[0-9]* *){2} @@)"
    regexLineAdded = r"^[+]"
    regexLineDeleted = r"^[-]"

    for line in diff.splitlines():
        if re.search(regexBegin, line):
            codeSegment = update_code_segment_count(codeSegment, addLine, deletedLine)
            addLine = deletedLine = 0
        elif re.search(regexLineAdded, line):
            addLine += 1;
        elif re.search(regexLineDeleted, line):
            deletedLine += 1;

    codeSegment = update_code_segment_count(codeSegment, addLine, deletedLine)
    addLine = deletedLine = 0

    return codeSegment


def update_code_segment_count(codeSegment, addLine, deletedLine):
    if (addLine > 0 and deletedLine > 0):
        codeSegment["modify"] += 1
    elif addLine > 0 and deletedLine == 0:
        codeSegment["added"] += 1
    elif addLine == 0 and deletedLine > 0:
        codeSegment["deleted"] += 1
    return codeSegment


processData()
