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

download_repo (){
  URL=$1
  URL_NOPRO=${URL:8}
  URL_REL=${URL_NOPRO#*/}
  REL_PATH=${URL_REL//\//\--}
  REL_PATH=${REL_PATH//$'\n'/}
  path="$repositories_directory_path/${REL_PATH}"
  printf "Cloning $URL \n"
  mkdir -p ${path}
  git clone --mirror ${URL} ${path}
  printf "\n"
}

N=25
while IFS= read -r URL
do
    ((i=i%N)); ((i++==0)) && wait
    download_repo "$URL" &
done < $filename

wait
echo "all done"
