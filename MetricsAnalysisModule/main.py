import multiprocessing as mp
import subprocess
import json
import urllib.parse as urlparse
import time
#from arguments import Arguments
#from pathlib import Path as pathlib



DATA_DIR_NAME = "/Volumes/SEAGATE-II/Data/libreoffice/"
REFSPEC = DATA_DIR_NAME + "libreoffice-refspec.json"
CLONE_PATH = "/Volumes/SEAGATE-II/Data/Repositories"


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
    git_url= "https://git.libreoffice.org/conferences/fosdem-2021-static/appropiate"
    x = "--".join(urlparse.urlsplit(git_url).path.split("/")[1:])

    print(x)

    d = []
    a = {'new key': 'new value'} 
    d.append(a)
    print(d)
    