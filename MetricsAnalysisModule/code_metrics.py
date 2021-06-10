import json
import os
import utils
import sys
from pathlib import Path as pathlib
import clone_repositories as clone
import download_code_fetch as fetch
import collect_code_metrics as metrics
import list_project_repo as list_repo

CONFIG_JSON_PATH = "../DownloadModule/config.json"

def process(projectJson):
    list_repo.start(projectJson)
    #clone.start(projectJson)
    fetch.start(projectJson)
    metrics.start(projectJson)
    pass


if __name__ == '__main__':
    utils.launch(process)