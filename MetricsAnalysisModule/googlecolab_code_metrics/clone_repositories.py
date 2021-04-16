import os
import urllib.parse as urlparse

FILE_PATH = "/Volumes/SEAGATE-II/data/Repositories/data/repositories-to-clone.txt"
CLONE_PATH = "Repositories/"


def clone_repo(repo_list_path, clone_path):
    repo_to_download = read_list_of_repo(repo_list_path)
    i = 0
    repo_num = len(repo_to_download)
    for git_url in repo_to_download:
        command = "git clone " + git_url
        path = clone_path + urlparse.urlsplit(git_url).path
        print("{}/{} : Cloning {}".format(i, repo_num, git_url))
        if not os.path.exists(path):
            os.makedirs(path)
        # os.system("sshpass -p your_password ssh user_name@your_localhost")
        os.chdir(clone_path)
        os.system(command)
        i+=1
    return 0


def read_list_of_repo(repo_list_path):
    f = open(repo_list_path, "r")
    arr = []
    for x in f:
        arr.append(x.rstrip("\n"))
    f.close()
    return arr


clone_repo(FILE_PATH, CLONE_PATH)
