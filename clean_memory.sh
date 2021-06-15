time="1h"

while getopts t: flag
do
    case "${flag}" in
        t) time=${OPTARG};;
    esac
done

while true
do
    sleep "${time}" && sudo sync; echo 3 > /proc/sys/vm/drop_caches
done