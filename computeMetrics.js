const Mongoose = require('mongoose');
const Moment = require('moment');
const MathJs = require('mathjs');
const dbUtils = require('./config/dbUtils');
const Database = require('./config/databaseConfig');
const Change = require('./models/change');
const Metrics = require('./models/metrics');
const Utils = require('./config/utils');
const Extension = require('./res/extension.json');

let projectDBUrl = Database.libreOfficeDBUrl;

let NUM_DAYS_FOR_RECENT = 120;
let NUM_OF_CHANGES_LIMIT = 600;

let metricsJson = {};

let i = 0;

mainFunction()
    .then(() => {
        console.log("Finished!!!!");
    })
    .catch(err => {
        console.log(err)
    });

function mainFunction() {
    dbConnection();
    return getChanges()
        .then(() => {
            return Utils.saveJsonToFile("metrics", metricsJson);
        })
        .catch(err => {
            console.log(err)
        });
}

function dbConnection() {
    return Mongoose.connect(projectDBUrl,
        {useNewUrlParser: true, useUnifiedTopology: true},
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Connected to the database");
            }
        });

}


//get changes id
function getChanges() {

    return Change
        //.find({})
        .aggregate([
            {$sort: {created: 1}},
            {$limit: NUM_OF_CHANGES_LIMIT}
        ])
        .allowDiskUse(true)
        //.sort({'created': 1})
        .limit(NUM_OF_CHANGES_LIMIT)
        .exec()
        .then(docs => {
            /*for (let key in docs) {
                console.log("doc : " + docs[key].created);
            }*/
            return collectDocs(docs);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return;
    let promiseArray = []
    for (let key in docs) {
        let promise = await collectMetrics(docs[key]).then((json) => {
            return saveMetrics(json);
        });
        promiseArray.push(promise);
    }
    return Promise.all(promiseArray);
}

function saveMetrics(json) {
    return Metrics.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            console.log('Metrics saved : ' + json.id)
        });
}

async function collectMetrics(json) {

    console.log(i + "/" + NUM_OF_CHANGES_LIMIT);
    i++;

    let metric = {};

    metric["n"] = i;
    metric["number"] = json._number;
    metric["id"] = json.id;
    metric["change_id"] = json.change_id;
    metric["date_created"] = json.created;
    metric["date_updated"] = json.updated;
    metric["date_submitted"] = get_date_submitted(json);
    metric["date_created_time"] = get_date_created_time(json);
    metric["date_updated_time"] = get_date_updated_time(json);
    metric["diff_created_updated"] = diffCreatedUpdatedTime(json);
    metric["lines_added_num"] = json.insertions;
    metric["lines_deleted_num"] = json.deletions;
    metric["diff_lines_added_line_deleted"] = json.insertions - json.deletions;
    metric["subject_length"] = countSubjectLength(json);
    metric["subject_word_count"] = numberOfWordInSubject(json);

    let fileInfo = get_files_info(json);

    metric["num_files"] = fileInfo.num_files;
    metric["num_files_type"] = fileInfo.num_files_type;
    metric["num_directory"] = fileInfo.num_directory;
    metric["num_file_added"] = fileInfo.num_file_added;
    metric["num_file_deleted"] = fileInfo.num_file_deleted;
    metric["num_binary_file"] = fileInfo.num_binary_file;
    metric["num_language"] = fileInfo.num_programming_language;
    metric["modify_entropy"] = fileInfo.modify_entropy;

    metric["num_subsystem"] = num_subsystem(json);
    metric["is_a_bot"] = is_a_bot(json);

    let changesFileInfo = get_changes_files_modified(json)
    metric["moy_changes_files_modified"] = changesFileInfo.moy_number_per_review;
    metric["moy_changes_files_modified_time"] = changesFileInfo.moy_time_per_review;
    metric["file_developer_num"] = changesFileInfo.num_dev;
    metric["file_developer_experience"] = changesFileInfo.dev_exp;

    let ownerInfo = get_owner_property(json);

    metric["change_num"] = ownerInfo.owner_num_changed;
    metric["subsystem_change_num"] = ownerInfo.owner_project
    metric["num_merged"] = ownerInfo.owner_num_merged;
    metric["merged_ratio"] = ownerInfo.owner_num_merged_ratio;
    //metric["recent_merged_ratio"] = ownerInfo.owner_num_merged_ratio;
    metric["subsystem_merged"] = ownerInfo.owner_sub_sys_merged;
    metric["subsystem_merged_ratio"] = ownerInfo.owner_sub_sys_merged_ratio;
    metric["review_num"] = ownerInfo.owner_num_review;

    /*
    metric["recent_change_num"] = get_recent_change_num(json);
    */

    /*

    num_segs_added: Number,
    num_segs_deleted: Number,
    num_segs_updated: Number,

    metric["change_num"] = get_change_num(json);
    metric["recent_change_num"] = get_recent_change_num(json);
    metric["subsystem_change_num"] = get_subsystem_change_num(json);
    metric["recent_merged_ratio"] = get_recent_merged_ratio(json);
    metric["subsystem_merged_ratio"] = get_subsystem_merged_ratio(json);

    metric["msg_length"] = get_msg_length(json);
    metric["has_bug"] = get_has_feature(json);
    metric["has_feature"] = get_has_feature(json);
    metric["has_improve"] = get_has_improve(json);
    metric["has_document"] = get_has_document(json);
    metric["has_refactor"] = get_has_refactor(json);
    */

    return metric;
}

let owner = {};

function initOwner(ownerId) {
    if (!(owner.hasOwnProperty(ownerId))) {
        owner[ownerId] = {
            num_changed: 0,
            sub_sys: [],
            num_merged: 0,
            sub_sys_merged: [],
            num_review: 0,
        };
    }
}

function get_owner_property(json) {
    let ownerId = json.owner._account_id;

    initOwner(ownerId);

    owner[ownerId]["num_changed"] = owner[ownerId]["num_changed"] + 1;

    if (!(json.project in owner[ownerId].sub_sys))
        owner[ownerId].sub_sys.push(json.project)

    if (json.status === "MERGED") {
        owner[ownerId]["num_merged"] = owner[ownerId]["num_merged"] + 1;
        if (!(json.project in owner[ownerId]["sub_sys_merged"]))
            owner[ownerId]["sub_sys_merged"].push(json.project);
    }

    //console.log("owner[ownerId][\"num_changed\"]" + owner[ownerId]["num_changed"]);
    let num_merged_ratio = 0;
    if (owner[ownerId]["num_changed"] !== 0)
        num_merged_ratio = MathJs.divide(owner[ownerId]["num_merged"], owner[ownerId]["num_changed"])

    let sub_sys_merged_ratio = 0;
    if (owner[ownerId]["sub_sys"].length > 0) {
        sub_sys_merged_ratio = MathJs.divide(owner[ownerId]["sub_sys_merged"].length, owner[ownerId]["sub_sys"].length);
    }

    let reviewers = json.reviewers.REVIEWER
    for (let id in reviewers) {
        let reviewerId = reviewers[id]._account_id;
        initOwner(reviewerId);
        owner[ownerId]["num_review"] = owner[ownerId]["num_review"] + 1;
    }

    return {
        owner_num_changed: owner[ownerId]["num_changed"],
        owner_num_review: owner[ownerId]["num_review"],
        owner_num_merged: owner[ownerId]["num_merged"],
        owner_num_merged_ratio: num_merged_ratio,
        owner_sub_sys_merged: owner[ownerId]["sub_sys_merged"].length,
        owner_sub_sys_merged_ratio: sub_sys_merged_ratio,
        owner_project: Object.keys(owner[ownerId].sub_sys).length
    }
}

let files_change_json = {};

function get_changes_files_modified(json) {
    let revisions = json.revisions;
    let ownerId = json.owner._account_id;
    let time_per_review = [];
    let number_per_review = [];
    let number_of_dev = [];
    let dev_experience = [];
    for (let key in revisions) {
        //Get only the first revision
        let revision_number = revisions[key]._number;
        if(revision_number !== 1)
            break;

        console.log(json.id);
        //console.log(revision_number);

        let time = [];
        let number = [];
        let files = revisions[key].files;
        for (let index in files) {
            if (!files_change_json[index]) {
                files_change_json[index] = {number_of_modif: 0, time_of_modif: [], dev: {}, reviewer:{}};
            }
            files_change_json[index]["number_of_modif"] = files_change_json[index]["number_of_modif"] + 1;
            let diff_time = diffCreatedUpdatedTime(json)
            files_change_json[index]["time_of_modif"].push(diff_time);
            //console.log("files_change_json[index][\"time_of_modif\"]" + files_change_json[index]["time_of_modif"]);

            /*if (!(ownerId in files_change_json[index]["dev"])) {
                files_change_json[index]["dev"].push(ownerId);
            }
            files_change_json[index]["dev"][ownerId]["time_of_modif"].push(time);
            */

            if(ownerId in files_change_json[index]["dev"]){
                files_change_json[index]["dev"][ownerId]["number_of_modif"] = files_change_json[index]["dev"][ownerId]["number_of_modif"] + 1;
            } else {
                files_change_json[index]["dev"][ownerId] = {};
                files_change_json[index]["dev"][ownerId]["number_of_modif"] = 1;
            }
            //console.log("files_change_json : " + JSON.stringify(files_change_json[index]["dev"][ownerId]));
            let count_dev = Object.keys(files_change_json[index]["dev"]).length;
            number_of_dev.push(count_dev);
            //console.log("count_dev : " + count_dev);

            let number_of_modif = files_change_json[index]["dev"][ownerId]["number_of_modif"];
            dev_experience.push(number_of_modif);

            number.push(files_change_json[index]["number_of_modif"]);
            time.push(files_change_json[index]["time_of_modif"]);
            //console.log("time " + time);
        }

        /*
        let time = [];
        let number = [];
        for (let index in files) {
            number.push(files_change_json[index]["number_of_modif"]);
            time.push(files_change_json[index]["time_of_modif"]);
        }
        */

        let moy_time;
        if (time.length > 0)
            moy_time = MathJs.mean(time);
        else
            moy_time = 0;
        time_per_review.push(moy_time);
        //console.log("time_per_review " + time_per_review);

        let moy_number;
        if (number.length > 0)
            moy_number = MathJs.mean(number);
        else
            moy_number = 0;
        number_per_review.push(moy_number);
        console.log("1 time_per_review " + MathJs.mean(time_per_review));
        console.log("1 number_per_review " + MathJs.mean(number_per_review));
    }
    //console.log("2 time_per_review " + MathJs.mean(time_per_review.reverse()));
    //console.log("2 number_per_review " + MathJs.mean(number_per_review.reverse()));
    //console.log("2 time_per_review " + MathJs.mean(time_per_review));
    //console.log("2 number_per_review " + MathJs.mean(number_per_review));
    //console.log("number_per_review.length : " + number_per_review.length);
    //console.log( Array.isArray(number_per_review));
    //let KKKK = MathJs.mean(number_per_review);
    //console.log("2 KKKK " + KKKK);
    //console.log("2 2 " + [1, 2]);

    let moy_number_per_review = average(time_per_review);
    let moy_time_per_review = average(number_per_review);
    let num_dev = average(number_of_dev);
    let dev_exp = average(dev_experience);

    /*if (number_of_dev.length > 0)
        num_dev = MathJs.mean(number_of_dev);
    else
        num_dev = 0;

    if (dev_experience.length > 0)
        dev_exp = MathJs.mean(dev_experience);
    else
        dev_exp = 0;*/

    //console.log("time_per_review " + time_per_review);


    /*let moy_time_per_review;
    if (time_per_review.length > 0)
    else
        moy_time_per_review = 0;

   // console.log("moy_time_per_review " + moy_time_per_review);

    let moy_number_per_review;
    if (number_per_review.length > 0)
    else
        moy_number_per_review = 0;
    //console.log("moy_number_per_review " + moy_number_per_review);*/

    return {
        num_dev: num_dev,
        dev_exp: dev_exp,
        moy_time_per_review: moy_time_per_review,
        moy_number_per_review: moy_number_per_review
    }
}

function average(array) {
    let i = 0, sum = 0, len = array.length;
    while (i < len) {
        sum = sum + array[i++];
    }
    return sum / len;
}
function get_date_submitted(json) {
    if (json.submitted)
        return json.submitted;
    else
        return 0;
}

function get_date_created_time(json) {
    return Moment(json.created).toDate().getTime();
}

function get_date_updated_time(json) {
    return Moment(json.updated).toDate().getTime()
}

//function

function countSubjectLength(json) {
    return countLetter(json.subject);
}

function numberOfWordInSubject(json) {
    return countWord(json.subject);
}

function countLetter(word) {
    if (word)
        return word.length;
    else
        return 0;
}

function countWord(phrase) {
    if (phrase)
        return phrase.split(' ')
            .filter(function (n) {
                return n != ''
            })
            .length;
    else
        return 0;
}

function diffCreatedUpdatedTime(json) {
    let createdTime = Moment(json.created);
    let updatedTime = Moment(json.updated);
    return Math.abs(createdTime.toDate() - updatedTime.toDate());
}

function is_a_bot(json) {
    let owner = json.owner;
    if (owner.email)
        return 0;
    else
        return 1;
}

function get_files(json) {
    let revisions = json.revisions
    let filesJson = {};
    for (let key in revisions) {
        let files = revisions[key].files;
        for (let index in files) {
            if (filesJson[index]) {
                filesJson[index] = filesJson[index] + 1;
            } else {
                filesJson[index] = 1;
            }
        }
    }
    return filesJson;
}

function get_files_names_list(json) {
    let revisions = json.revisions;
    let filesArray = [];
    for (let key in revisions) {
        let files = revisions[key].files;
        filesArray.concat(files);
    }
    return filesArray;
}

function get_num_files(json) {
    let filesArray = get_files_names_list(json);
    return Object.keys(filesArray).length;
}

function get_files_info(json) {

    let revisions = json.revisions
    let fileInfo = {};
    let filesJson = {};
    let filesExtJson = {};
    let directoryJson = {};
    let addFiles = [];
    let removeFiles = [];

    fileInfo.num_files = 0;
    fileInfo.num_files_type = 0;
    fileInfo.num_file_added = 0;
    fileInfo.num_file_deleted = 0;
    fileInfo.num_binary_file = 0;
    fileInfo.num_programming_language = 0;

    //let insertions = json.insertions;
    //let deletions = json.deletions;
    //let som = insertions + deletions
    let modificationArray = [];
    let entropyArray = [];

    fileInfo.modify_entropy = 0;

    for (let key in revisions) {

        //Get only the first revision
        let revision_number = revisions[key]._number;
        if(revision_number !== 1)
            break;

        let files = revisions[key].files;
        let num_lines_added_for_all_files = 0;
        let num_lines_deleted_for_all_files = 0;
        for (let index in files) {
            let status = files[index].status;
            let filename = files[index];
            if (status) {
                if (status === "A") {
                    if (addFiles.indexOf(index) === -1) {
                        addFiles.push(index);
                    }
                } else if (status === "D") {
                    if (removeFiles.indexOf(index) === -1) {
                        removeFiles.push(index);
                    }
                }
            }
            if (files[index].binary)
                if (files[index].binary === true)
                    fileInfo.num_binary_file++;

            let ext = index.substr(index.lastIndexOf('.') + 1);
            if (filesExtJson[ext]) {
                filesExtJson[ext] = filesExtJson[ext] + 1;
            } else {
                filesExtJson[ext] = 1;
            }

            //count dir
            let dir = index.substr(0, index.lastIndexOf('/') + 1);
            //console.log("dir : " + dir);
            if (directoryJson[dir]) {
                directoryJson[dir] = directoryJson[dir] + 1;
            } else {
                directoryJson[dir] = 1;
            }

            //count files
            if (filesJson[index]) {
                filesJson[index] = filesJson[index] + 1;
            } else {
                filesJson[index] = 1;
            }

            let number = plusFn(files[index].lines_inserted, files[index].lines_deleted);
            //console.log("number" + number);
            modificationArray.push(number);
        }

        //calculate the entropy
        let entropy = 0;
        if (modificationArray.length > 0) {
            let som = MathJs.sum(modificationArray);
            //console.log("modificationArray: " + modificationArray);
            //console.log("som: " + som);
            for (let k in modificationArray) {
                let lk = modificationArray[k];
                let pk = 1;
                if (som !== 0)
                    pk = MathJs.divide(lk, som);
                let log2Pk = MathJs.log2(pk);
                let pk_log2Pk;
                if (pk !== 0) pk_log2Pk = MathJs.multiply(pk, log2Pk)
                else
                    pk_log2Pk = 0;
                entropy = MathJs.sum(entropy, pk_log2Pk);
            }
            entropy = MathJs.multiply(entropy, -1);
        }
        entropyArray.push(entropy);

    }

    fileInfo.num_files = Object.keys(filesJson).length;
    fileInfo.num_files_type = Object.keys(filesExtJson).length;
    fileInfo.num_file_added = Object.keys(addFiles).length;
    fileInfo.num_file_deleted = Object.keys(removeFiles).length;
    fileInfo.num_directory = Object.keys(directoryJson).length;
    fileInfo.num_programming_language = get_num_of_language(filesExtJson);

    //console.log("entropyArray" + entropyArray);

    if (entropyArray.length > 0)
        fileInfo.modify_entropy = MathJs.mean(entropyArray);
    else
        fileInfo.modify_entropy = 0;

    return fileInfo;
}

function plusFn(l, r) {
    if (typeof l === 'undefined')
        if (typeof r === 'undefined')
            return 0;
        else
            return r;
    if (typeof r === 'undefined')
        if (typeof l === 'undefined')
            return 0;
        else
            return l;
    return l + r;
}

function get_num_of_language(extJson) {
    let programming_list_json = Extension.programming;
    let number = 0;
    let prog_list = new Set;
    for (let extension in extJson) {
        if (programming_list_json[extension]) {
            if (!prog_list.has(programming_list_json[extension][0])) {
                number++
            }
            programming_list_json[extension].forEach(item => prog_list.add(item))
            //console.log("number" + number);
        }
    }
    return number;
}


function num_subsystem(json) {
    let subsystem = [];
    subsystem.push(json.project);
    return Object.keys(subsystem).length;
}

async function get_prior_change(json) {
    let inputDate = Moment(json.created).toDate().toISOString();
    //console.log("inputDate : " + inputDate);
    return await Change
        .find({
            'created': {$lte: inputDate}
        })
        .limit(NUM_OF_CHANGES_LIMIT)
        .exec()
        .then(docs => {
            if (!docs)
                return [];
            //console.log("docs" + JSON.stringify(docs));
            return docs;
        })
        .catch(err => {
            console.log(err)
        });
}

function diff_date_days(date1, date2) {
    let time1 = Moment(date1).toDate();
    let time2 = Moment(date2).toDate();
    let time = Math.abs(time1 - time2);
    return Moment.duration(time).asDays();
}

async function review_num(json) {
    let ownerId = json.owner._account_id;
    let date1 = json.created;
    let priorChanges = await get_prior_change(json);
    let change_num = 0;
    let recent_change_num = 0;
    let review_num = 0;
    let recent_review_num = 0;
    let merged_review_num = 0;
    let recent_merged_review_num = 0;
    let merged_ratio = 0;
    let recent_merged_ratio = 0;

    for (let key in priorChanges) {
        let thisOwnerId = priorChanges[key].owner._account_id;
        let date2 = priorChanges[key].created;
        let duration = diff_date_days(date1, date2)

        if (thisOwnerId === ownerId) {
            change_num++;
            if (duration < NUM_DAYS_FOR_RECENT)
                recent_change_num++;

            if (priorChanges[key].status === "MERGED") {
                merged_review_num++;
                if (duration < NUM_DAYS_FOR_RECENT)
                    recent_merged_review_num++;
            }

        }

        let reviewersId = await getReviewersId(json);
        for (let id in reviewersId) {
            if (ownerId === reviewersId[id]) {
                review_num++;
                if (duration < NUM_DAYS_FOR_RECENT)
                    recent_review_num++;
            }
        }
    }

    if (change_num !== 0)
        merged_ratio = merged_review_num / change_num;
    else
        merged_ratio = 0;

    if (recent_review_num !== 0)
        recent_merged_ratio = recent_merged_review_num / recent_review_num;
    else
        recent_merged_ratio = 0;

    let returnJson = {
        change_num: change_num,
        recent_change_num: recent_change_num,
        review_num: review_num,
        recent_review_num: recent_review_num,
        merged_review_num: merged_review_num,
        recent_merged_review_num: recent_merged_review_num,
        merged_ratio: merged_ratio,
        recent_merged_ratio: recent_merged_ratio
    }
    //console.log("returnJson " + JSON.stringify(returnJson));
    return returnJson;
}

function getReviewers(json) {
    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id])
    }
    return reviewerArray;
}

function getReviewersId(json) {
    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id]._account_id)
    }
    return reviewerArray;
}

let user = {};

function getReviewerExperienceOnFile(json){

}


function getOwnerExperienceOnFile(json){

}