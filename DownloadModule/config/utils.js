const fsExtra = require("fs-extra");
const fs = require('fs');
const DatabaseConfig = require('../config/databaseConfig');
const ApiEndPoints = require('../config/apiEndpoints');
const Config = require('../config.json');
const os = require('os');
const PathLibrary = require('path');
let programming_languages_extension = require("../res/Programming_Languages_Extensions.json");

function saveJSONInFile(directory = "data/", name, data) {
    let json = JSON.stringify(data, null, 2);
    return saveFile(directory, name, json, "json")
}

function saveFile(directory = "data/", name, data, ext) {
    let fileName = name + "." + ext;
    let filepath = fileName;
    if (directory)
        filepath = PathLibrary.join(directory, fileName);

    fsExtra.ensureDirSync(directory);
    return fsExtra.outputFile(filepath, data)
        /*.then(() => {
            console.log('data written to file');
        })*/
        .catch(err => {
            console.log(err)
        });
}

function csvFunction(json) {
    let array_of_json = Object.values(json)
    let csvRecord = Object.keys(array_of_json[0]).join(',') + '\n';
    array_of_json.forEach(function (jsonRecord) {
        csvRecord += Object.values(jsonRecord).join(',') + '\n';
    });
    return csvRecord;
}

function jsonToCsv(json) {
    let fields = Object.keys(json)
    let jsonArray = Object.values(json)
    console.log(jsonArray);
    let replacer = function (key, value) {
        return value === null ? '' : value
    }
    let csv = jsonArray.map(function (row) {
        return fields.map(function (fieldName) {
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
//let data_dir_name = "data"
//let metric_file_name = "metrics.csv";
//let metric_file_path = data_dir_name + "/" + metric_file_name;

function write_line_on_file(str, filename, data_dir_name) {
    let metric_file_path = PathLibrary.join(data_dir_name, filename);
    fsExtra.ensureDirSync(data_dir_name);
    return fsExtra.appendFileSync(metric_file_path, str);
}

function add_line_to_file(json, filename, data_dir_name) {
    let line = Object.values(json).join(csv_separator) + "\r\n";
    let metric_file_path = PathLibrary.join(data_dir_name, filename);
    fsExtra.ensureDirSync(data_dir_name);
    if (!fs.existsSync(metric_file_path)) {
        let header = Object.keys(json).join(csv_separator) + "\r\n";
        write_line_on_file(header, filename, data_dir_name);
        write_line_on_file(line, filename, data_dir_name);
    } else {
        write_line_on_file(line, filename, data_dir_name);
    }
}

function getTime() {
    let dt = new Date();
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " : ";
}

/**
 * @param {String} projectAPIUrl The date
 */
function getProjectName(projectAPIUrl) {
    let url = new URL(projectAPIUrl)
    return (url.hostname.split("."))[1]
}

function getProjectParameters(projectName) {
    let json = {};
    json["projectDBUrl"] = DatabaseConfig.getProjectDBUrl(projectName);
    json["projectApiUrl"] = ApiEndPoints.getProjectApi(projectName);
    json["projectName"] = projectName;
    json["projectDBName"] = Config.project[projectName]["db_name"];
    json["output_directory"] = Config.output_data_path;
    return json;
}

function getCPUCount() {
    return os.cpus().length;
}

function getSetStr(setCol) {
    let str = ''
    setCol.forEach(function (line) {
        str += line + "\r\n";
    })
    return str;
}


module.exports = {
    saveFile: saveFile,
    saveJSONInFile: saveJSONInFile,
    jsonToCsv: jsonToCsv,
    add_line_to_file: add_line_to_file,
    getTime: getTime,
    getProjectName: getProjectName,
    getProjectParameters: getProjectParameters,
    getCPUCount: getCPUCount,
    getSetStr : getSetStr
};