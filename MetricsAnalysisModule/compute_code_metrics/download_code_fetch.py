import multiprocessing as mp
import subprocess
import multiprocessing
import json
import os
import urllib.parse as urlparse
import time
import utils
from utils import SlowBar as SlowBar

PROJET_NAME = "libreoffice"
DATA_DIR_NAME = "/Volumes/SEAGATE-II/Data/libreoffice/"
REFSPEC = DATA_DIR_NAME + "libreoffice-refspec.json"
REPOSITORIES_PATH = "/Volumes/SEAGATE-II/Data/Repositories"

refspec = {}
NUMBER_OF_FETCH_PER_REQUEST = 300;
NUMBER_OF_REQUEST = multiprocessing.cpu_count();
bar = SlowBar('')

def start(json):
    
    global PROJET_NAME
    PROJET_NAME = json["project_name"]

    global DATA_DIR_NAME
    DATA_DIR_NAME = json["output_data_path"]

    global REFSPEC
    REFSPEC = utils.get_refspec(PROJET_NAME, DATA_DIR_NAME)

    global REPOSITORIES_PATH
    REPOSITORIES_PATH = utils.get_repositories_path(PROJET_NAME, DATA_DIR_NAME)

    global bar
    bar = SlowBar('Downloading code fetch ... ')
    path = os.path.join(REPOSITORIES_PATH, PROJET_NAME)
    collect_fetch(REFSPEC, path)
    
    return 0


def collect_fetch(list_of_refspec, clone_path):
    refspecs_data = load_json(list_of_refspec)
    running_procs = []
    #print(len(refspecs_data))
    bar.max = 0
    for i in refspecs_data:
        git_url = refspecs_data[i]["fetch_url"]
        fetch_refs = refspecs_data[i]["fetch_refs"]
        path = os.path.join(clone_path , urlparse.urlsplit(git_url).path)
        n = NUMBER_OF_FETCH_PER_REQUEST
        bar.max += len(fetch_refs)
        #print(bar.max)
        for i in range(0, len(fetch_refs), n):
            command = ['git', 'fetch', git_url] + fetch_refs[i:i+n]
            running_procs.append(subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, cwd= path))
            if(len(running_procs) == NUMBER_OF_REQUEST) :
                check_process(running_procs)
    bar.finish()
    #check_process(running_procs)
    #print("hello")
    pass


def load_json(path):
    with open(path) as f:
        json_file = json.load(f)
    return json_file


def check_process(running_procs):
    i=0
    lenght = len(running_procs)
    running = False;
    while running_procs:
        for proc in running_procs:
            retcode = proc.poll()
            if retcode is not None: # Process finished.
                if retcode == 0:
                    i+= 1
                    text = " ".join(proc.args[0:4]) + " ... " + proc.args[-1] + " FINISHED!!!"
                    #print("{}/{} : {}".format(i, lenght, text))
                    #print(proc.communicate())
                    #d = len(proc.args[4:])
                    bar.next(len(proc.args[4:]))
                    running_procs.remove(proc)
                    break
                else:
                    #print("Error : {} ".format(proc.communicate()[1]))
                    bar.max -= len(proc.args[4:])
                    running_procs.remove(proc)
            else: # No process is done, wait a bit and check again.
                time.sleep(.1)
                continue

        # Here, `proc` has finished with return code `retcode`
        if retcode != 0:
            """Error handling."""
        running = False
    
    return running;


if __name__ == '__main__':
    #print('Number of CPUs available: ', mp.cpu_count())
    collect_fetch(REFSPEC, REPOSITORIES_PATH)



