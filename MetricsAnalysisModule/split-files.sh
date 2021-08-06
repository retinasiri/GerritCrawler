input_directory="Repositories"

while getopts i:o: flag
do
    case "${flag}" in
        i) input_directory=${OPTARG};;
    esac
done

split_size=100000;
echo ${input_directory}
cd ${input_directory}/
for f in ${input_directory}/*; 
do 
    filename="$(basename -- $f)"
    tmp=${filename##+([^0-9])}
    nums=${tmp%%.*}
    folder_num=$((nums/split_size+1))
    inf=$(((folder_num-1)* split_size))
    sup=$(((folder_num)* split_size))
    d=${input_directory}-${inf}-${sup};
    echo 'cp' ${filename} '=>' ${d}
    #echo 'mv' ${filename} '=>' ${d}
    mkdir -p $d; 
    cp "$f" $d; 
    #mv "$f" $d; 
done
