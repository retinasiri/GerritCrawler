from . import clone_repositories as clone
from . import download_code_fetch as fetch
from . import collect_code_metrics as metrics


REPOSITORIES_PATH = "./Repositories"
DATA_DIR_PATH = "./data/"

LIST_OF_REPOSITORIES = "./data/libreoffice-repositories-to-clone.txt"
REFSPEC = "./data/libreoffice-refspec.json"
LIST_OF_COMMIT = "./data/libreoffice-changes-commit-and-fetch.json"


if __name__ == '__main__':
    clone.clone_repo(LIST_OF_REPOSITORIES, REPOSITORIES_PATH)
    fetch.collect_fetch(REFSPEC, REPOSITORIES_PATH)
    metrics.processData(LIST_OF_COMMIT, REPOSITORIES_PATH, DATA_DIR_PATH)
