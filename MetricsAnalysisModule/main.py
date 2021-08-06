import multiprocessing as mp
import subprocess
import json
import os
import urllib.parse as urlparse
import time
import utils
from pathlib import Path as pathlib
#from arguments import Arguments
#from pathlib import Path as pathlib



DATA_DIR_NAME = "/Volumes/SEAGATE-II/Data/libreoffice/"
REFSPEC = DATA_DIR_NAME + "libreoffice-refspec.json"
CLONE_PATH = "/Volumes/SEAGATE-II/Data/Repositories"


def save_set_in_file(clone_list, path):
    dir_path = pathlib(path)
    dir_path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w') as f:
        for item in clone_list:
            f.write("%s\n" % item)
        f.close()
    return 0

if __name__ == '__main__':
    #print('Number of CPUs available: ', mp.cpu_count())
    #collect_fetch(REFSPEC, CLONE_PATH)
    #command = ['cd', path, '&&', 'git', 'fetch', git_url, fetch_refs]
    #procs = subprocess.run(['git', 'fetch', git_url, fetch_refs], capture_output=True, text=True, cwd=path)
    #print(procs.stdout)
    #print(procs.stderr)
    #print(procs.args)

    #path = "/Volumes/SEAGATE-II/Data/Repositories/core/"
    #git_url = "https://git.libreoffice.org/core"
    #fetch_refs = "refs/changes/12/12/1"
    #path = pathlib('/Users/jeefer/Desktop/test/filename.txt')
    #path.parent.mkdir(parents=True, exist_ok=True)

    #arg = Arguments()
    #print(arg)

    """
    f = argument.Arguments()
    f.require("fetch", help="Fetch code commit from repositories to local")
    f.option("project",
        25,
        help="The project to work with.",
        abbr="p"
        )
    """
    '''
    git_url= "https://git.libreoffice.org/conferences/fosdem-2021-static/appropiate"
    x = "--".join(urlparse.urlsplit(git_url).path.split("/")[1:])

    print(x)

    d = []
    a = {'new key': 'new value'} 
    d.append(a)
    print(d)
    '''
    
    directory_path = "/Volumes/SEAGATE-II/Gerrit-Project-Data/aosp/ls-remote-ouput-meta"
    list_files = [a for a in os.listdir(directory_path) if a.endswith('.txt')]
    dic = {}
    num_meta = 0;
    i=0
    count = len(list_files)
    big_project = set()
    left = 0

    for file in list_files:
        print("{}/{} : {}".format(i,count, file))
        meta_array=[]
        with open(os.path.join(directory_path, file)) as f:
            for line in f:
                meta_array.append(line.rstrip("\n"))
                num_meta +=1;
            f.close()
        i+=1
        dic[file] = meta_array
        nums = len(meta_array)
        if nums >= 10000:
            big_project.add(file)
            left = nums - 10000
    
    print(num_meta)
    print(left)
    print(num_meta - left)
    save_set_in_file(sorted(big_project), "/Volumes/SEAGATE-II/Gerrit-Project-Data/big-project.txt")
    utils.save_json_in_file("aosp", dic, "/Volumes/SEAGATE-II/Gerrit-Project-Data/" ,"-changes-refs-meta.json")



'''
def save_metrics_file(metrics, data_path):
    output_file_name = PROJET_NAME + "-code-metrics.json"
    full_path = os.path.join(data_path, output_file_name)
    dir_path = pathlib(data_path)
    dir_path.parent.mkdir(parents=True, exist_ok=True)
    with open(full_path, "wb") as f:
        f.write(json.dumps(metrics, indent=4).encode("utf-8"))
        f.close()
    return 0
'''

""""
def process (json_data):
    number_of_processes = multiprocessing.cpu_count() * 2
    tasks_to_accomplish = Queue()
    tasks_that_are_done = Queue()
    processes = []
    print (number_of_processes)
    data = split_data(json_data, number_of_processes)
    #list(map(tasks_to_accomplish.put, data))
    time.sleep(1)
    for i in range(len(data)):
        tasks_to_accomplish.put(data[i])
        time.sleep(0.1)
    
    cnt=1
    while not tasks_to_accomplish.empty():
        print('item no: ', cnt, ' ', len(tasks_to_accomplish.get()))
        cnt += 1

    tasks_to_accomplish.close()
    tasks_to_accomplish.join_thread()
    

    pass


def pool_handler(json_data, repo_root_path, Database):
    number_of_processes = multiprocessing.cpu_count()
    data = split_data(json_data, number_of_processes)
    lock = multiprocessing.Lock()
    procs = []
    db_info = {"url": Database.get_db_url(), "database_name" : Database.get_database_name()}

    for dt in data:
        proc = Process(target=worker, args=(lock, dt, repo_root_path, db_info))
        procs.append(proc)
        proc.start()

    for proc in procs:
        proc.join()


def worker(lock, data, repo_root_path, db_info):
    metrics = {}
    DB = dbutils.get_database_from_info(db_info)
    for i in data:
        lock.acquire()
        metric = get_code_metrics(data[i], repo_root_path)
        lock.release()
        if(metric is not None):
            print(metric)
            DB.save_metrics(metric)
            mid = metric.get("id")
            print(mid)
            metrics[mid] = metric
    pass


#https://stackoverflow.com/questions/29056525/how-do-i-split-a-dictionary-into-specific-number-of-smaller-dictionaries-using-p
def split_data(data, chunk_size):
    i = itertools.cycle(range(chunk_size))       
    split = [dict() for _ in range(chunk_size)]
    for k, v in data.items():
        split[next(i)][k] = v
    return split
"""
