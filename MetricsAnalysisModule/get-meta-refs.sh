repo_list="android-repositories-url-list.txt"
directory_path="Repositories"

while getopts f:d: flag
do
    case "${flag}" in
        f) repo_list=${OPTARG};;
        d) directory_path=${OPTARG};;
    esac
done

echo ${repo_list}
echo ${directory_path}
directory_path="${directory_path}/ls-remote-ouput-meta/"
mkdir -p ${directory_path}

var=$(wc -l < $repo_list | sed 's/^ *\([0-9]*\).*$/\1/')
var=$(echo $var)
nb_lines=${var%% *}
i=1
while IFS= read -r URL
do 
   URL_NOPRO=${URL:8}
   URL_REL=${URL_NOPRO#*/}
   REL_PATH=${URL_REL//\//\--}
   filename=${REL_PATH//$'\n'/}
   #printf "$i/${nb_lines} : git ls-remote ${URL} | grep refs/changes/ > $directory_path/${filename}.txt \n"
   #git ls-remote ${URL} | grep refs/changes/ > "$directory_path/${filename}.txt"   
   #printf "$i/${nb_lines} : git ls-remote ${URL} | grep refs/changes/ > $directory_path/${filename}.txt \n"
   #git ls-remote ${URL} | grep refs/changes/ > "$directory_path/${filename}.txt"
   printf "$i/${nb_lines} : git ls-remote ${URL} | grep -o 'refs\/changes\/.*\/meta' > $directory_path/${filename}.txt \n"
   git ls-remote ${URL} | grep -o 'refs\/changes\/.*\/meta' > "$directory_path/${filename}.txt"
   i=$(($i+1))
   printf "\n"
done < $repo_list

#grep -o 'refs\/changes.\/meta'
#refs/changes/13/863713/meta
#'refs\/changes\/[1-9]{2}\/[1-9]+\/meta'
#grep -o 'refs\/changes\/.*\/meta

#git log -p refs/changes/99/999499/meta