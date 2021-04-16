import os
import urllib.parse as urlparse

FILE_PATH = "/content/drive/MyDrive/PROJET-MTR871/Script/ComputeCodeMetrics/libreoffice-repositories-to-clone.txt"
CLONE_PATH = "Repositories"

def clone_repo(repo_list_path):
    repo_to_download = read_list_of_repo(repo_list_path)
    i = 1

    if not os.path.exists(CLONE_PATH):
      os.makedirs(CLONE_PATH)

    os.chdir(CLONE_PATH)
    repo_num = len(repo_to_download)

    for git_url in repo_to_download:
        command = "git clone " + git_url
        path = urlparse.urlsplit(git_url).path
        print(path)
        print("{}/{} : Cloning {}".format(i, repo_num, git_url))
        if not os.path.exists(path):
            os.makedirs(path)
        # os.system("sshpass -p your_password ssh user_name@your_localhost")
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


clone_repo(FILE_PATH)
