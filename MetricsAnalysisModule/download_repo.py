import os
import urllib.parse as urlparse

PATH_TO_FILE = "Data/repositories-to-clone.txt"
REPOSITORIES_PATH = "/Volumes/SEAGATE-II/Data/Repositories"


def clone_repo():
    repo_to_download = read_list_of_repo()
    i = 0
    repo_num = len(repo_to_download)
    for git_url in repo_to_download:
        command = "git clone " + git_url
        path = REPOSITORIES_PATH + urlparse.urlsplit(git_url).path
        print("{}/{} : Cloning {}".format(i, repo_num, git_url))
        if not os.path.exists(path):
            os.makedirs(path)
        # os.system("sshpass -p your_password ssh user_name@your_localhost")
        os.chdir(REPOSITORIES_PATH)
        os.system(command)
    return 0


def read_list_of_repo():
    f = open(PATH_TO_FILE, "r")
    arr = []
    for x in f:
        arr.append(x.rstrip("\n"))
    f.close()
    return arr


clone_repo()
