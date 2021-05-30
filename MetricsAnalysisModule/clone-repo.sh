filename="libreoffice-repositories-to-clone.txt"
repositories_directory_path="Repositories"
var=$(wc -l < $filename | sed 's/^ *\([0-9]*\).*$/\1/')
var=$(echo $var)
nb_lines=${var%% *}
i=1
while IFS= read -r URL
do 
   URL_NOPRO=${URL:8}
   URL_REL=${URL_NOPRO#*/}
   #echo "/${URL_REL%%\?*}"
   path="$repositories_directory_path/${URL_REL%?}"
   printf "$i/${nb_lines} : cloning $URL"
   i=$(($i+1))
   mkdir -p ${path}
   git clone ${URL} ${path}
   printf "\n"
done < $filename