project="eclipse"
directory_path=""

while getopts p:d: flag
do
    case "${flag}" in
        p) project=${OPTARG};;
        d) directory_path=${OPTARG};;
    esac
done

echo "${project}"

if [ "$directory_path" == "" ]; then
    directory_path=""
else
    directory_path="${directory_path}/"
fi

cd "${directory_path}"
folder="${project}-code-changes"
mkdir "${folder}"
mv "open-changes/" "merged-changes/" "abandoned-changes/" "${folder}/"
zip -r "${project}-code-changes.zip" "${folder}/"
rm -rf "${folder}/"

