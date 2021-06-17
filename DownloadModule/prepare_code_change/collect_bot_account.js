const Utils = require('../config/utils');
const fs = require('fs');
let path = '/Volumes/SEAGATE-II/bot/eclipse-account.json';
let rawdata = fs.readFileSync(path, 'utf8');
let Accounts = JSON.parse(rawdata);

if (typeof require !== 'undefined' && require.main === module) {
    let projectName = "eclipse";
    find_probable_bot_account(Accounts, projectName)
}

function find_probable_bot_account(accounts, projectName){
    let botAccounts = {}
    let humanAccounts = {}
    for(let key in accounts){
        let name = accounts[key]["name"];
        let id = accounts[key]["_account_id"];
        delete accounts[key]["avatars"];
        let ptpr = new RegExp(projectName, "gi");
        let pat1 = /( -)|(bot|builder|test|jenkins|release|pebble|zuul|automation|pootle|build|job)|( -)/gi;
        let pat2 = /( -)|(CI)|( -)/g;
        if(pat1.test(name) || pat2.test(name) || ptpr.test(name) ){
            botAccounts[id] = accounts[key];
        } else {
            humanAccounts[id] = accounts[key];
        }
    }
    let path = "/Volumes/SEAGATE-II/bot/eclipse/"
    Utils.saveJSONInFile(path, projectName + "-bot-account", botAccounts)
    Utils.saveJSONInFile(path, projectName + "-human-account", humanAccounts)
}