const fsExtra = require("fs-extra");
const fs = require('fs');
let metricsJson = require("../data/metrics.json");

//main();

function main(){
    //let data = csvFunction(metricsJson);
    //saveFile("csv_metrics", data, "csv");
}

async function saveJsonToFile(name, json) {
    return saveFileJSON(name, json, "json");
}

function saveFileJSON(name, data, ext) {
    let fileName = "data/" + name + "." + ext;
    let json = JSON.stringify(data, null, 2);
    fsExtra.ensureDirSync("data");
    return fsExtra.outputFile(fileName, json)
        .then(() => {
            console.log('Data written to file');
        })
        .catch(err => {
            console.log(err)
        });

    /*fs.writeFile(fileName, json, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });*/
}

function saveFile(name, data, ext) {
    let fileName = "data/" + name + "." + ext;
    fsExtra.ensureDirSync("data");
    return fsExtra.outputFile(fileName, data)
        .then(() => {
            console.log('Data written to file');
        })
        .catch(err => {
            console.log(err)
        });
}

/*function saveFile2(name, data, ext) {
    let fileName = "data/" + name + "." + ext;
    let json = JSON.stringify(data, null, 2);
    fsExtra.ensureDirSync("data");

    let array = data.split('\n');

    for (let id in array){
        fs.appendFile('message.txt', 'data to append', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }


    return fsExtra.outputFile(fileName, json)
        .then(() => {
            console.log('Data written to file');
        })
        .catch(err => {
            console.log(err)
        });
}*/

function csvFunction(json){
    let jsonArray = Object.values(json)
    let csvRecord = Object.keys(jsonArray[0]).join(',') + '\n';
    jsonArray.forEach(function(jsonRecord) {
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

module.exports = {
    saveFile: saveFile,
    saveJsonToFile: saveJsonToFile,
    jsonToCsv : jsonToCsv,
    saveFile : saveFile
};