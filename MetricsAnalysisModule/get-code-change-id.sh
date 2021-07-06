repo_list="android-repositories-url-list.txt"
repo_list="repo-list.txt"
directory_path="Repositories"
sub_directory_path="changes_id"


while getopts f:d: flag
do
    case "${flag}" in
        f) repo_list=${OPTARG};;
        d) directory_path=${OPTARG};;
    esac
done

baseUrl="https://android.googlesource.com/"
mkdir -p "${sub_directory_path}"

get_code_change_id (){
    project=$1
    temp=${project//\//\--}
    folderName=${temp//$'\n'/}
    refs=$(git ls-remote ${baseUrl}${project} | grep -o 'refs\/changes\/.*\/meta')

    if ! [ -z "$refs" ]
    then
        git clone --mirror "${baseUrl}${project}" ${folderName}
        cd "${folderName}"

        while read -r line
        do
            changeId=$(git log -p $line | grep -o 'Change-id\:.*' | sed 's/^.*: //')
            changes_list="${changes_list}""${changeId}"$'\n'
        done <<< $refs
        
        changes_list="${changes_list%?}"
        echo "$changes_list" > "../${sub_directory_path}/${folderName}.txt"
        #echo "$changes_list" > "../${folderName}.txt"
        cd ..
        rm -rf ${folderName}
    fi

    echo "${project} done!!!!"
}

N=100
while IFS= read -r project_url
do 
    ((i=i%N)); ((i++==0)) && wait
    get_code_change_id "$project_url" &
done < $repo_list

wait

#cd ${sub_directory_path}
pwd
cat ${sub_directory_path}/*.txt > changes_id_list.txt

echo "all done"