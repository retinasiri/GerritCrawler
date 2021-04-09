const fsExtra = require("fs-extra");
const fs = require('fs');
//let metricsJson = require("../data/metrics.json");
let programming_languages_extension = require("../res/Programming_Languages_Extensions.json");

function saveJSONInFile(directory = "data/", name, data) {
    let json = JSON.stringify(data, null, 2);
    return saveFile(directory, name, json, "json")
}

function saveFile(directory = "data/", name, data, ext) {
    let fileName = directory + name + "." + ext;
    fsExtra.ensureDirSync(directory);
    return fsExtra.outputFile(fileName, data)
        /*.then(() => {
            console.log('Data written to file');
        })*/
        .catch(err => {
            console.log(err)
        });
}

function csvFunction(json) {
    let array_of_json = Object.values(json)
    let csvRecord = Object.keys(array_of_json[0]).join(',') + '\n';
    array_of_json.forEach(function(jsonRecord) {
        csvRecord += Object.values(jsonRecord).join(',') + '\n';
    });
    return csvRecord;
}

function jsonToCsv(json) {
    let fields = Object.keys(json)
    let jsonArray = Object.values(json)
    console.log(jsonArray);
    let replacer = function(key, value) {
        return value === null ? '' : value
    }
    let csv = jsonArray.map(function(row) {
        return fields.map(function(fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    return csv
}

//generate_extension;
function generate_extension() {
    let extension = get_programming_language_extensions(programming_languages_extension);
    return saveJsonToFile("extension", extension).then(() => {
        console.log('extension file generated');
    });
}

//extension to programming language
//https://gist.github.com/ppisarczyk/43962d06686722d26d176fad46879d41
function get_programming_language_extensions(ArrayOfJson) {
    let extension_language = {};
    for (let index in ArrayOfJson) {
        let json = ArrayOfJson[index];
        let extensions = json.extensions;
        let type = json.type;
        if (!extension_language[type]) {
            extension_language[type] = {};
        }
        for (let i in extensions) {
            let extension = extensions[i];
            extension = extension.slice(1);
            if (!extension_language[type][extension])
                extension_language[type][extension] = [];
            extension_language[type][extension].push(ArrayOfJson[index].name);
        }
    }
    return extension_language;
}

//create metrics file

let csv_separator = ",";
let data_dir_name = "data"
let metric_file_name = "metrics.csv";
let metric_file_path = data_dir_name + "/" + metric_file_name;

function write_line_on_file(str) {
    fsExtra.ensureDirSync(data_dir_name);
    return fsExtra.appendFileSync(metric_file_path, str);
}

function add_line_to_file(json) {
    let line = Object.values(json).join(csv_separator) + "\r\n";
    fsExtra.ensureDirSync(data_dir_name);
    if (!fs.existsSync(metric_file_path)) {
        let header = Object.keys(json).join(csv_separator) + "\r\n";
        write_line_on_file(header);
        write_line_on_file(line);
    } else {
        write_line_on_file(line);
    }
}

function getTime() {
    let dt = new Date();
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " : ";
}

module.exports = {
    saveFile: saveFile,
    saveJSONInFile: saveJSONInFile,
    jsonToCsv: jsonToCsv,
    add_line_to_file: add_line_to_file,
    getTime: getTime
};