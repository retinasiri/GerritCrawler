project="eclipse"
directory_path="/backup/data"
code_directory=$(echo pwd)

while getopts p:d: flag
do
    case "${flag}" in
        p) project=${OPTARG};;
        d) directory_path=${OPTARG};;
    esac
done

echo "${project}"

cd "../DownloadModule"
node index.js prepare "${project}"
#delete dir

cd "../MetricsAnalysisModule"
python list_project_repo.py "${project}"

cd "${directory_path}"
filename="${project}-repositories-to-clone.txt"
bash clone-repo.sh -f "${filename}"

cd "${code_directory}/MetricsAnalysisModule"
python download_code_fetch.py "${project}"
python collect_code_metrics.py "${project}"


