from sys import path
import time
import subprocess
import os
from utils import SlowBar as SlowBar
import urllib.parse as urlparse


LIST_OF_REPOSITORIES = "/Volumes/SEAGATE-II/Data/libreoffice/libreoffice-repositories-to-clone.txt"
REPOSITORIES_PATH = "/Volumes/SEAGATE-II/Data/Repositories"
#bar = SlowBar('Cloning ')

def get_repositories_path(data_dir, projectName):
    return os.path.join(data_dir, projectName, "Repositories")

def get_repo_clone_list_name(projectName, output_dir):
    filename = projectName + "-repositories-to-clone.txt"
    return os.path.join(output_dir,projectName, filename)


def start(json):
    
    global project_name
    project_name = json["project_name"]

    global DATA_DIR_NAME
    DATA_DIR_NAME = json["output_data_path"]

    global LIST_OF_REPOSITORIES
    LIST_OF_REPOSITORIES = get_repo_clone_list_name(project_name, DATA_DIR_NAME)

    global REPOSITORIES_PATH
    REPOSITORIES_PATH = get_repositories_path(project_name, DATA_DIR_NAME)
    
    clone_repo(LIST_OF_REPOSITORIES, REPOSITORIES_PATH)

    return 0


def clone_repo(repo_list_path, clone_path):
    repo_to_download = read_list_of_repo(repo_list_path)
    running_procs = []
    #bar.max = len(repo_to_download)
    print("cloning repositories ...")
    for git_url in repo_to_download:
        path = clone_path + urlparse.urlsplit(git_url).path 
        running_procs.append(subprocess.Popen(['git', 'clone', git_url, path], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True))

    check_process(running_procs);
    #bar.finish()
    return 0

def check_process(running_procs):
    i=0
    lenght = len(running_procs)
    while running_procs:
        for proc in running_procs:
            retcode = proc.poll()
            if retcode is not None: # Process finished.
                if retcode == 0:
                    i+= 1
                    text = " ".join(proc.args[0:3]) + " FINISHED!!!"
                    print("{}/{} : {}".format(i, lenght, text))
                    #bar.suffix = "{}/{} | {}".format(bar.index, bar.max, proc.args[2])
                    #bar.next()
                    running_procs.remove(proc)
                    break
                else:
                    print("Error : {} ".format(proc.communicate()[1]))
            else: # No process is done, wait a bit and check again.
                time.sleep(.1)
                continue

        # Here, `proc` has finished with return code `retcode`
        if retcode != 0:
            """Error handling."""


def read_list_of_repo(repo_list_path):
    f = open(repo_list_path, "r")
    arr = []
    for line in f:
        if line.strip():
            arr.append(line.rstrip("\n"))
    f.close()
    return arr


if __name__ == '__main__':
    clone_repo(LIST_OF_REPOSITORIES, REPOSITORIES_PATH)
