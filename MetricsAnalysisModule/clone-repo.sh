filename="eclipse-repositories-to-clone.txt"
repositories_directory_path="Repositories"

while getopts f:o: flag
do
    case "${flag}" in
        f) filename=${OPTARG};;
        o) repositories_directory_path=${OPTARG};;
    esac
done

echo ${filename}
echo ${repositories_directory_path}

var=$(wc -l < $filename | sed 's/^ *\([0-9]*\).*$/\1/')
var=$(echo $var)
nb_lines=${var%% *}
i=1
while IFS= read -r URL
do 
   URL_NOPRO=${URL:8}
   URL_REL=${URL_NOPRO#*/}
   REL_PATH=${URL_REL//\//\--}
   REL_PATH=${REL_PATH//$'\n'/}
   path="$repositories_directory_path/${REL_PATH}"
   printf "$i/${nb_lines} : cloning $URL \n"
   i=$(($i+1))
   mkdir -p ${path}
   git clone ${URL} ${path}
   printf "\n"
done < $filename
