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
