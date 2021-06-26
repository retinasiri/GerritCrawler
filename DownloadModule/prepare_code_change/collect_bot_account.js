const Utils = require('../config/utils');
const fs = require('fs');
const Moment = require('moment');


if (typeof require !== 'undefined' && require.main === module) {
    //let path = '/Volumes/SEAGATE-II/bot/eclipse-account.json';
    //let rawdata = fs.readFileSync(path, 'utf8');
    //let Accounts = JSON.parse(rawdata);

    let projectName = "eclipse";
    //find_probable_bot_account(Accounts, projectName);
    test()
}

function find_probable_bot_account(accounts, projectName) {
    let botAccounts = {}
    let humanAccounts = {}
    for (let key in accounts) {
        let name = accounts[key]["name"];
        let id = accounts[key]["_account_id"];
        delete accounts[key]["avatars"];
        let ptpr = new RegExp(projectName, "gi");
        let pat1 = /( -)|(bot|builder|test|jenkins|release|pebble|zuul|automation|pootle|build|job)|( -)/gi;
        let pat2 = /( -)|(CI)|( -)/g;
        if (pat1.test(name) || pat2.test(name) || ptpr.test(name)) {
            botAccounts[id] = accounts[key];
        } else {
            humanAccounts[id] = accounts[key];
        }
    }
    let path = "/Volumes/SEAGATE-II/bot/eclipse/"
    Utils.saveJSONInFile(path, projectName + "-bot-account", botAccounts)
    Utils.saveJSONInFile(path, projectName + "-human-account", humanAccounts)
}

function is_probably_a_bot(name, projectName) {
    let bool = false;
    let ptpr = new RegExp(projectName, "gi");
    let pat1 = /( -)|(bot|builder|test|jenkins|release|pebble|zuul|automation|pootle|build|job)|( -)/gi;
    let pat2 = /( -)|(CI)|( -)/g;
    if (pat1.test(name) || pat2.test(name) || ptpr.test(name)) {
        bool = true;
    }
    return bool;
}

function test() {
    /*let createdTime = Moment.utc("2021-06-13 17:19:14.000000000");
    let updatedTime = Moment.utc("2021-06-13 16:18:10.000000000");
    console.log(createdTime.toDate())
    console.log(updatedTime.toDate())
    console.log(createdTime.toDate() - updatedTime.toDate())
    return Math.abs(createdTime.toDate() - updatedTime.toDate());
    */
    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    console.log(mixArray(array))
}

function mixArray(array) {
    let temp = []
    let j = 0
    for (let i = 0; i < array.length / 2; i++) {
        console.log(i)
        temp[j] = array[i]
        if (i !== array.length - i - 1)
            temp[j + 1] = array[array.length - i - 1]
        j += 2
    }
    return temp;
}

function isOdd(num) {
    return num % 2;
}

function isEven(num) {
    return !isOdd(num);
}