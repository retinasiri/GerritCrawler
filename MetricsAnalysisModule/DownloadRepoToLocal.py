import os
import pickle
import urllib.parse as urlparse
from typing import Set
from git import Repo
from git import RemoteProgress
from Utils import SlowBar as SlowBar
#from Utils import CloneProgress as CloneProgress

PATH_TO_FILE = "repositories-to-clone.txt";
REPOSITORIES_PATH = "/Volumes/SEAGATE-II/Data/Repositories";

def CloneRepo():
    repoToDownload = readFileOfRepo()
    for git_url in repoToDownload :
        comand = "git clone " + git_url
        path = REPOSITORIES_PATH + urlparse.urlsplit(git_url).path
        print("\nCloning " + git_url)
        if not os.path.exists(path):
            os.makedirs(path)
        #os.system("sshpass -p your_password ssh user_name@your_localhost")
        os.chdir(REPOSITORIES_PATH)
        os.system(comand)
    return 0

def readFileOfRepo():
    f = open(PATH_TO_FILE, "r")
    arr = []
    for x in f:
        arr.append(x.rstrip("\n"));
    f.close()
    return arr;

CloneRepo()

'''def CloneRepo():
    #os.chmod(REPOSITORIES_PATH , 0o777)
    repoToDownload = readFileOfRepo()
    for git_url in repoToDownload :
        name = REPOSITORIES_PATH + urlparse.urlsplit(git_url).path
        print("Cloning " + urlparse.urlsplit(git_url).path)
        #Repo.clone_from(git_url, name, progress=CloneProgress)
        Repo.clone_from(git_url, name)
    return 0'''

'''class CloneProgress(RemoteProgress):
    def update(self, op_code, cur_count, max_count=None, message=''):
        print ('update(%s | %s | %s | %s) \n'%(op_code, cur_count, max_count, message))
        #if message:
            #print(message + " | " + str(cur_count) + " | " + str(max_count))'''
