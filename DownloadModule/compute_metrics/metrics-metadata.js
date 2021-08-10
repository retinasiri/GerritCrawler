const Moment = require('moment');
const MathJs = require('mathjs');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');
const ComputeSimpleMetrics = require('./compute-simple-metrics');

//todo detect cherry-pick

const progressBar = new cliProgress.SingleBar({
    //format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | delete_nums : {delete_change_nums}',
    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '#',
    barIncompleteChar: '-',
}, cliProgress.Presets.shades_classic);

let libreOfficeJson = Utils.getProjectParameters("libreoffice");
let projectDBUrl = libreOfficeJson["projectDBUrl"];
let projectName = libreOfficeJson["projectName"];

let DATA_PATH = "data/"
let STARTING_POINT = 0;
let delete_change_nums = 0;
const MAX_INACTIVE_TIME_DELAY = 730;

if (typeof require !== 'undefined' && require.main === module) {
    startComputeMetadata(libreOfficeJson).catch(err => {
        console.log(err)
    });
}

function startComputeMetadata(json) {
    if (json["projectDBUrl"])
        projectDBUrl = json["projectDBUrl"];
    if (json["output_directory"])
        DATA_PATH = json["output_directory"];
    if (json["projectName"])
        projectName = json["projectName"];

    return Database.dbConnection(projectDBUrl)
        .then(() => { // Counts the number of change
            return Change.estimatedDocumentCount({});
        })
        .then((count) => {
            let NUM_OF_CHANGES_LIMIT = 10000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count - STARTING_POINT, 0);
            return getChanges(STARTING_POINT, NUM_OF_CHANGES_LIMIT);
        })
        .then(() => {
            progressBar.stop();
            console.log("Finished !!!!");
            return Database.closeConnection();
        })
        .catch(err => {
            console.log(err)
        });
}

//get changes id
function getChanges(skip, NUM_OF_CHANGES_LIMIT = 20000) {
    return Change
        .aggregate([
            {$sort: {_number: 1}},
            {$skip: skip},
            {$limit: NUM_OF_CHANGES_LIMIT}
        ])
        .allowDiskUse(true)
        .exec()
        .then(docs => {
            if (!docs)
                return Promise.resolve(false)
            return docs.length ? collectDocs(docs) : Promise.resolve(false);
        })
        .then(result => {
            return result ? getChanges(skip + NUM_OF_CHANGES_LIMIT) : Promise.resolve(false);
        })
        .catch(err => {
            console.log(err)
        });
}

async function collectDocs(docs) {
    if (!docs)
        return Promise.resolve(true);
    for (let key in docs) {
        await collectMetadata(docs[key])
            .then((json) => {
                if (json.id === null) {
                    console.log(docs[key].id)
                    return Promise.resolve(true)
                }
                return saveMetadata(json);
            })
    }
    return Promise.resolve(true);
}

function saveMetadata(json) {
    return Change.updateOne({id: json.id}, json, {upsert: true})
        .then(() => {
            return updateProgress();
        }).catch(err => {
            console.log(err)
        });
}

async function updateProgress() {
    progressBar.increment(1, {delete_change_nums: delete_change_nums});
    return Promise.resolve(true);
}

//console.log(metadata)

//do get the smallest date
//ab time to add reviewers
//do new status
//do revision before close time
//todo work load of the owner.
//do delete outlier
//do delete all but 1st revision
//do add new features
//build time avg per file
//build time avg per branch
//build time of owner
//avg time of revision of file
//avg time of revision of owner
//avg time between revision owner
//avg of fail of file
//owner time to add reviewer
//file build fail

async function collectMetadata(json) {
    let metadata = {};
    metadata["id"] = json.id
    metadata = get_owner_info(metadata, json)
    metadata = get_revision_info(metadata, json)
    metadata = get_time_info(metadata, json)
    metadata = {...metadata, ...get_messages_information(json.messages, json.created)}
    //metadata = deleteUnnecessary(metadata)

    metadata["close_time"] = json["updated"]
    if (metadata["review_close_date"])
        if (metadata["review_close_date"] < metadata["close_time"])
            metadata["close_time"] = metadata["review_close_date"]
    if (metadata["first_review_in_message_date"])
        if (metadata["first_review_in_message_date"] < metadata["close_time"])
            metadata["close_time"] = metadata["first_review_in_message_date"]

    metadata["diff_created_close_time"] = timeDiff(metadata["close_time"], json.created)

    let time_to_add_human_reviewers = get_time_to_add_human_reviewers(json, metadata["close_time"])

    if (time_to_add_human_reviewers.avg_time_to_add_human_reviewers === undefined || time_to_add_human_reviewers.avg_time_to_add_human_reviewers === 0) {
        metadata["avg_time_to_add_human_reviewers"] = metadata["close_time"];
    } else {
        metadata["avg_time_to_add_human_reviewers"] = time_to_add_human_reviewers.avg_time_to_add_human_reviewers;
    }

    if (time_to_add_human_reviewers.avg_time_to_add_human_reviewers_before_close === undefined || time_to_add_human_reviewers.avg_time_to_add_human_reviewers_before_close === 0) {
        metadata["avg_time_to_add_human_reviewers_before_close"] = metadata["close_time"];
    } else {
        metadata["avg_time_to_add_human_reviewers_before_close"] = time_to_add_human_reviewers.avg_time_to_add_human_reviewers_before_close;
    }

    let msg = get_messages_before_close(json.messages, metadata["close_time"])
    let msg_before_close_info = get_messages_information(msg, json.created)
    metadata = {...metadata, ...MetricsUtils.add_suffix_to_json(msg_before_close_info, '_before_close')}

    metadata["is_self_review"] = MetricsUtils.check_self_review(json, projectName);
    metadata["description"] = get_description(json);

    metadata["new_status"] = metadata["new_status"] ? metadata["new_status"] : json["status"]
    metadata["new_status_before_close"] = metadata["new_status_before_close"] ? metadata["new_status_before_close"] : json["status"]

    //metadata["id"] = json["id"];
    metadata["updated_original"] = json["updated"]
    metadata["status_original"] = json["status"]
    metadata["date_updated_date_created_diff_original"] = timeDiff(json.created, json.updated)

    metadata["updated"] = metadata["close_time"]
    metadata["status"] = metadata["new_status_before_close"]
    metadata["date_updated_date_created_diff"] = parseFloat(metadata["diff_created_close_time"])

    metadata["days_of_the_weeks_date_created"] = get_days_of_the_weeks(json.created)
    metadata["days_of_the_weeks_date_updated_original"] = get_days_of_the_weeks(json.updated)
    metadata["days_of_the_weeks_date_updated"] = get_days_of_the_weeks(metadata["updated"])

    return metadata;
}

function get_description(json) {
    let first_revision = ComputeSimpleMetrics.get_first_revision(json);
    return first_revision["commit"]["message"]
}

function get_days_of_the_weeks(dateString) {
    return Moment.utc(dateString).isoWeekday();
}

function get_time_to_add_human_reviewers(json, close_time) {
    let reviewers_updated = json["reviewer_updates"]; //todo correct
    let date_created = json["created"]
    let dateDiff = []
    let dateDiff_before_close = []
    if (!reviewers_updated)
        return {
            avg_time_to_add_human_reviewers: undefined,
            avg_time_to_add_human_reviewers_before_close: undefined
        };

    for (let i = 0; i < reviewers_updated.length; i++) {
        let updated = reviewers_updated[i];
        let reviewer_id = updated["reviewer"]["_account_id"];
        if (!MetricsUtils.isABot(reviewer_id, projectName)) {
            let date = updated["updated"]; //todo correct
            dateDiff.push(timeDiff(date_created, date))
            if (date < close_time)
                dateDiff_before_close.push(timeDiff(date_created, date))
        }
    }
    return {
        avg_time_to_add_human_reviewers: avg(dateDiff),
        avg_time_to_add_human_reviewers_before_close: avg(dateDiff_before_close)
    }
}

function avg(num_array) {
    return num_array.length > 0 ? MathJs.mean(num_array) : 0;
}


function get_owner_info(metadata, json) {
    if (json.owner) {
        let ownerId = json.owner._account_id;
        metadata["owner_id"] = ownerId;
        metadata["is_a_bot"] = MetricsUtils.isABot(ownerId, projectName);
        /*if (metadata["is_a_bot"])
            return Promise.resolve(false)*/
    }
    return metadata
}

function get_revision_info(metadata, json) {
    let revisions = json.revisions;
    if (revisions) {
        metadata["revisions_num"] = Object.keys(revisions).length
        metadata["first_revision"] = MetricsUtils.get_first_revision_number(json)
        metadata["first_revision_kind"] = MetricsUtils.get_first_revision_kind(json)
        metadata["is_trivial_rebase"] = MetricsUtils.is_trivial_rebase(json);
    }
    return metadata
}

function get_time_info(metadata, json) {
    metadata["review_close_date"] = get_review_time_in_label(json)
    metadata["date_updated_date_created_diff"] = timeDiff(json.created, json.updated)
    metadata["is_review_close_date_equal_updated_time"] = is_equal(metadata["review_close_date"], json.updated)
    if (metadata["review_close_date"])
        metadata["review_close_to_date_created_diff"] = timeDiff(json.created, metadata["review_close_date"])
    return metadata
}

function get_messages_before_close(messages, close_time) {
    let msgs = []
    for (let k in messages) {
        let msg = messages[k];
        let date = msg.date;
        if (date <= close_time) {
            msgs.push(msg)
        }
    }
    return msgs;
}

function check_if_cherry_picked(msg) {
    let cherry_pick_patt = /^Patch Set 1: Cherry Picked from/i;
    return cherry_pick_patt.test(msg);
}


function get_messages_information(messages, date_created) {
    if (!messages)
        return {}

    let messages_count = Object.keys(messages).length;
    let messages_per_account = {}
    let messages_human_count = 0
    let messages_bot_count = 0
    let message_review_time = [];
    let has_auto_tag_merged = false;
    let has_auto_tag_abandoned = false;

    let time_diff_between_messages = []
    let lastTime = 0
    let has_been_review = false;
    let last_revision_number = 0;
    let revisions_list = [];
    let build_message_list = [];
    let new_status = "";
    let all_status = [];
    let is_a_cherry_pick = false;

    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        let date = message.date;
        let msg = message.message

        if (!message.author)
            continue;

        if (!is_a_cherry_pick)
            is_a_cherry_pick = check_if_cherry_picked(msg)

        let abandoned_patt = /^abandoned/i;
        if (abandoned_patt.test(msg)) {
            message_review_time.push(date);
            all_status.push("ABANDONED");
        }

        let code_review = analyse_code_review(message)
        if (code_review !== undefined) {
            if (code_review["Code-Review"] === 2 || code_review["Code-Review"] === -2) {
                message_review_time.push(code_review["date"])
                has_been_review = true;
                if (code_review["Code-Review"] === 2)
                    all_status.push("MERGED")
                if (code_review["Code-Review"] === -2)
                    all_status.push("ABANDONED")
            }
        }

        let auto_tag = analyse_auto_tag(message)
        if (auto_tag !== undefined) {
            if (auto_tag["tag"] === "merged")
                has_auto_tag_merged = true
            else if (auto_tag["tag"] === "abandoned")
                has_auto_tag_abandoned = true
        }

        let author = message.author._account_id;

        //count message per account
        if (!messages_per_account[author])
            messages_per_account[author] = 1;
        else
            messages_per_account[author] = messages_per_account[author] + 1;

        //count bot message
        if (MetricsUtils.isABot(author, projectName)) {
            messages_bot_count += 1
        } else {
            messages_human_count += 1
        }

        //analyse time between message
        if (i === 0) {
            let diff_time = timeDiff(date_created, date)
            time_diff_between_messages.push(diff_time)
        }
        if (lastTime !== 0) {
            let diff_time = timeDiff(lastTime, date)
            time_diff_between_messages.push(diff_time)
        }

        //analyse time between revision
        let revision_number = message._revision_number;
        if (last_revision_number !== revision_number) {
            if (revisions_list.length === 0) {
                let rev = {revision: revision_number, start: date_created}
                revisions_list.push(rev)
            } else {
                let rev = {revision: revision_number, start: date}
                revisions_list.push(rev)
            }
            if (revisions_list.length >= 1) {
                revisions_list[revisions_list.length - 1]["end"] = date;
            }
            last_revision_number = revision_number;
        } else {
            revisions_list[revisions_list.length - 1]["end"] = date;
        }

        if (i === messages.length - 1) {
            revisions_list[revisions_list.length - 1]["end"] = date;
        }

        //analyse build time
        let bot_build_info = get_bot_message(message)
        if (bot_build_info !== undefined)
            build_message_list.push(bot_build_info);

        lastTime = Moment.utc(date);
    }

    let first_review_in_message_date = message_review_time.length > 0 ? message_review_time[0] : 0

    //analyse all info collected
    let max_inactive_time = time_diff_between_messages.length > 0 ? MathJs.max(time_diff_between_messages) : 0
    let is_inactive = false;
    if (max_inactive_time > MAX_INACTIVE_TIME_DELAY) {
        //3 month 2190 //2 month 1460 //1 month 730
        is_inactive = true
    }

    let avg_time_between_msg = time_diff_between_messages.length > 0 ? MathJs.mean(time_diff_between_messages) : 0

    let revision_time = []
    let time_between_revision = []
    for (let i = 0; i < revisions_list.length; i++) {
        let rev_item = revisions_list[i];
        let start = rev_item["start"];
        let end = rev_item["end"];
        revision_time.push(timeDiff(start, end))
        if (i > 0) {
            time_between_revision.push(timeDiff(revisions_list[i]["start"], revisions_list[i - 1]["end"]))
        }
    }

    let avg_time_revision = revision_time.length > 0 ? MathJs.mean(revision_time) : 0
    let avg_time_between_revision = time_between_revision.length > 0 ? MathJs.mean(time_between_revision) : 0

    //message per account
    let messages_per_account_array = []
    for (let key in messages_per_account) {
        key = parseInt(key);
        messages_per_account_array.push({account: key, num_messages: messages_per_account[key]})
    }

    //analyse build info
    let build_info = analyse_build_info(build_message_list, revisions_list)
    let avg_build_time = build_info.avg_time_of_build;
    let num_of_build_success = build_info.num_of_build_success;
    let num_of_build_failures = build_info.num_of_build_failures;

    return {
        messages_count: messages_count,
        messages_per_account: messages_per_account_array,
        messages_human_count: messages_human_count,
        messages_bot_count: messages_bot_count,
        new_status: all_status.length > 0 ? all_status[0] : 0,
        all_status: new_status,
        is_inactive: is_inactive,
        is_a_cherry_pick: is_a_cherry_pick,
        max_inactive_time: max_inactive_time,
        has_auto_tag_merged: has_auto_tag_merged,
        has_auto_tag_abandoned: has_auto_tag_abandoned,
        avg_time_between_msg: avg_time_between_msg,
        avg_time_revision: avg_time_revision,
        avg_time_between_revision: avg_time_between_revision,
        has_been_review_in_message: has_been_review,
        first_review_in_message_date: first_review_in_message_date,
        avg_build_time: avg_build_time,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,
    };
}

function get_bot_message(message_info) {
    if (!message_info.author)
        return undefined;

    let date = message_info.date;
    let revision_number = message_info._revision_number;
    let author_id = message_info.author._account_id;
    let message = message_info.message;
    let is_a_bot = MetricsUtils.isABot(author_id, projectName)
    if (!is_a_bot)
        return undefined

    //let url_pat = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gm
    let url_pat = /\bhttps?:\/\/\S+/gi
    const urls = message.match(url_pat);

    if (['qt'].includes(projectName)) {
        let build_start_patt = /.*(Added to build .* for .*|Pre Continuous Integration Quick Check: Running).*/mi
        let build_success_patt = /.*(Continuous Integration: Passed|Pre Continuous Integration Quick Check: Passed).*/mi
        let build_failed_patt = /.*(Continuous Integration: (Failed|Cancelled)|Pre Continuous Integration Quick Check: (Failed|Cancelled)).*/mi;
        let ref_patt = /\brefs\/builds\/[^\s-]*\/\d+/i
        let urls_ref_patt = /\bhttps:\/\/testresults.qt.io\/\S+/i
        let refs = message.match(ref_patt);

        if (message.match(ref_patt))
            refs = message.match(ref_patt)[0]
        else if (message.match(urls_ref_patt))
            refs = message.match(urls_ref_patt)[0];

        if (build_start_patt.test(message)) {
            return {
                date: date,
                "ci_tag": "started",
                author_id: author_id,
                url: urls,
                revision_number: revision_number,
                refs: refs
            }
        } else if (build_success_patt.test(message)) {
            return {
                date: date,
                "ci_tag": "success",
                author_id: author_id,
                failed: false,
                success: true,
                url: urls,
                revision_number: revision_number,
                refs: refs
            }
        } else if (build_failed_patt.test(message)) {
            return {
                date: date,
                ci_tag: "failed",
                author_id: author_id,
                failed: true,
                success: false,
                url: urls,
                revision_number: revision_number,
                refs: refs
            }
        }

    } else if (['android'].includes(projectName)) {
        let build_start_patt = /.*Started presubmit run: .*/mi
        let build_finished_patt = /.*TreeHugger finished with: .*/mi
        let verified_failed_patt = /.*Presubmit-Verified(-1|-2).*/mi
        let verified_success_patt = /.*Presubmit-Verified(\+1|\+2).*/mi
        let ref_patt = /\bhttps?:\/\/android-build.googleplex.com\/builds\/\S+/i
        let build_refs_patt = /L[0-9]+\S+/i
        const refs = message.match(ref_patt) ? message.match(ref_patt)[0] : null;
        const build_refs = message.match(build_refs_patt) ? message.match(build_refs_patt)[0] : null;
        /*console.log(refs)
        console.log(build_refs)
        if(refs)
            console.log(message)*/
        if (build_start_patt.test(message)) {
            //console.log(message)
            return {
                date: date,
                ci_tag: "started",
                author_id: author_id,
                url: urls,
                revision_number: revision_number,
                refs: refs,
                build_refs: build_refs,
            }
        } else if (build_finished_patt.test(message)) {
            const failed = verified_failed_patt.test(message);
            const success = verified_success_patt.test(message);
            return {
                date: date,
                "ci_tag": "finished",
                author_id: author_id,
                url: urls,
                failed: failed,
                success: success,
                revision_number: revision_number,
                refs: refs,
                build_refs: build_refs,
            }
        }
    }
    //if (['libreoffice', 'asterisk', 'scilab', 'eclipse', 'onap'].contains(projectName)) {
    else {
        let build_start_patt = /.*Build (Started|queued).*\bhttps?:\/\/\S+.*/mi
        let build_success_patt = /.*Build Successful.*\bhttps?:\/\/\S+.* : SUCCESS/smi
        let build_succeeded_patt = /Build (succeeded|failed) \(check pipeline\)/i
        let build_failed_patt = /.*Build Failed.*\bhttps?:\/\/\S+.* : (FAILURE|ABORTED)/smi;

        let url_pat = /\bhttps?:\/\/\S+ : (SUCCESS|FAILURE|ABORTED)+/gi
        let url_pat_2 = /\bhttps?:\/\/\S+/gi
        let success_pat = /\bSUCCESS\b/gi
        let failure_pat = /\bFAILURE\b/gi
        //let failure_pat = /\bSKIPPED\S+/gi
        let refs_temp = message.match(url_pat);
        let refs = message.match(url_pat_2);

        if (refs_temp)
            refs = refs_temp.toString().match(url_pat_2)

        let success_num = message.match(success_pat) ? message.match(success_pat).length : 0;
        let fail_num = message.match(failure_pat) ? message.match(failure_pat).length : 0;

        if (build_start_patt.test(message)) {
            return {
                date: date, "ci_tag": "started",
                author_id: author_id,
                url: urls,
                revision_number: revision_number,
                refs: refs
            }
        } else if (build_success_patt.test(message)) {
            return {
                date: date, "ci_tag": "success",
                author_id: author_id,
                url: urls,
                failed: false,
                success: true,
                revision_number: revision_number,
                refs: refs,
                fail_num: fail_num,
                success_num: success_num
            }
        } else if (build_failed_patt.test(message)) {
            return {
                date: date, "ci_tag": "failed",
                author_id: author_id,
                url: urls,
                revision_number: revision_number,
                failed: true,
                success: false, refs: refs,
                fail_num: fail_num,
                success_num: success_num
            }
        } else if (build_succeeded_patt.test(message)) {

            return {
                date: date,
                "ci_tag": "succeeded",
                author_id: author_id,
                url: urls,
                revision_number: revision_number,
                fail_num: fail_num,
                success_num: success_num
            }
        }
    }

    return undefined
}

function analyse_android_build_info(build_message_list, revisions_list) {
    let build_time = {};
    let num_of_build_success = 0;
    let num_of_build_failures = 0;
    let avg_time_of_build = 0;
    let build_time_array = [];

    for (let i = 0; i < build_message_list.length; i++) {
        let build_message = build_message_list[i];
        if (build_message["ci_tag"] === "started") {
            let refs = build_message["refs"]
            if (!build_time[refs])
                build_time[refs] = {}
            build_time[refs]["started"] = build_message["date"];
        } else if (build_message["ci_tag"] === "finished") {
            let refs = build_message["refs"]
            if (!build_time[refs])
                build_time[refs] = {}
            build_time[refs]["finished"] = build_message["date"];
            if (build_message["failed"])
                num_of_build_failures += 1
            if (build_message["success"])
                num_of_build_success += 1
        }

    }
    for (let key in build_time) {
        build_time_array.push(timeDiff(build_time[key]["started"], build_time[key]["finished"]))
    }

    avg_time_of_build = build_time_array.length > 0 ? MathJs.mean(build_time_array) : 0
    return {
        avg_time_of_build: avg_time_of_build,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,
    }
}

function analyse_qt_build_info(build_message_list, revisions_list) {
    let build_time = {};
    let num_of_build_success = 0;
    let num_of_build_failures = 0;
    let avg_time_of_build = 0;
    let build_time_array = [];

    for (let i = 0; i < build_message_list.length; i++) {
        let build_message = build_message_list[i];
        if (build_message["ci_tag"] === "started") {
            let refs = build_message["refs"]
            if (!build_time[refs])
                build_time[refs] = {}
            build_time[refs]["started"] = build_message["date"];
        } else if (build_message["ci_tag"] === "failed" || build_message["ci_tag"] === "success") {
            let refs = build_message["refs"]
            if (!build_time[refs])
                build_time[refs] = {}
            build_time[refs]["finished"] = build_message["date"];
            if (build_message["failed"])
                num_of_build_failures += 1
            if (build_message["success"])
                num_of_build_success += 1
        }

    }

    for (let key in build_time) {
        let start = build_time[key]["started"]
        if (!start)
            start = get_revision_started_date(build_time[key]["revision_number"], revisions_list)
        if (start && build_time[key]["finished"])
            build_time_array.push(timeDiff(start, build_time[key]["finished"]))
    }

    avg_time_of_build = build_time_array.length > 0 ? MathJs.mean(build_time_array) : 0
    return {
        avg_time_of_build: avg_time_of_build,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,
    }
}

function analyse_project_build_info(build_message_list, revisions_list) {
    //console.log(build_message_list)
    let build_time = {};
    let num_of_build_success = 0;
    let num_of_build_failures = 0;
    let avg_time_of_build = 0;
    let build_time_array = [];
    let build_succeeded_time = [];

    for (let i = 0; i < build_message_list.length; i++) {
        let build_message = build_message_list[i];
        if (build_message["ci_tag"] === "succeeded") {
            build_succeeded_time.push(
                {
                    date: build_message["date"],
                    revision_number: build_message["revision_number"],
                    success_num: build_message["success_num"],
                    fail_num: build_message["fail_num"]
                }
            )
        } else if (build_message["ci_tag"] === "started") {
            let refs = build_message["refs"]
            for (let k in refs) {
                let ref = refs[k]
                if (!build_time[ref])
                    build_time[ref] = {}
                //console.log(JSON.stringify(build_time))
                build_time[ref]["started"] = build_message["date"];
            }
        } else if (build_message["ci_tag"] === "failed" || build_message["ci_tag"] === "success") {
            let refs = build_message["refs"]
            for (let k in refs) {
                let ref = refs[k]
                if (!build_time[ref])
                    build_time[ref] = {}
                build_time[ref]["finished"] = build_message["date"];
                if (build_message["fail_num"])
                    num_of_build_failures += build_message["fail_num"]
                if (build_message["success_num"])
                    num_of_build_success += build_message["success_num"]
            }
        }
    }

    let build_time_array_for_all = []

    //console.log(build_succeeded_time)

    //For all bot
    for (let k in build_succeeded_time) {
        let bst = build_succeeded_time[k]
        num_of_build_failures = bst["fail_num"]
        num_of_build_success = bst["success_num"]
        let revision_start_date = get_revision_started_date(bst["revision_number"], revisions_list)
        build_time_array_for_all.push(timeDiff(revision_start_date, bst["date"]))
        //console.log(revision_start_date +" - " + bst["date"])
        //console.log(build_time["finished"])
    }

    //For individual bot
    for (let key in build_time) {
        let start = build_time[key]["started"]
        if (!start)
            start = get_revision_started_date(build_time[key]["revision_number"], revisions_list)
        if (start && build_time[key]["finished"])
            build_time_array.push(timeDiff(start, build_time[key]["finished"]))
    }

    if (build_time_array_for_all.length > 0) {
        avg_time_of_build = build_time_array_for_all.length > 0 ? MathJs.mean(build_time_array_for_all) : 0
    } else {
        avg_time_of_build = build_time_array.length > 0 ? MathJs.mean(build_time_array) : 0
    }

    //console.log(build_time)
    //console.log(build_time_array_for_all)

    return {
        avg_time_of_build: avg_time_of_build,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,
    }
}

function get_revision_started_date(revision_number, revisions_list) {
    for (let k in revisions_list) {
        let rev = revisions_list[k];
        if (rev.revision === revision_number)
            return rev.start
    }
}

function analyse_build_info(build_message_list, revisions_list) {
    if (['android'].includes(projectName)) {
        return analyse_android_build_info(build_message_list, revisions_list)
    } else if (['qt'].includes(projectName)) {
        return analyse_qt_build_info(build_message_list, revisions_list)
    } else {
        return analyse_project_build_info(build_message_list, revisions_list)
    }
}

function analyse_auto_tag(message_info) {
    let pat_auto_tag_merged = /.*autogenerated:gerrit:merged.*/;
    let pat_auto_tag_abandon = /.*autogenerated:gerrit:abandon.*/;
    let date = message_info.date;

    if (!message_info.author)
        return undefined;
    let author_id = message_info.author._account_id;

    let message = message_info.message;
    if (pat_auto_tag_merged.test(message)) {
        return {date: date, tag: "merged", author_id: author_id}
    } else if (pat_auto_tag_abandon.test(message)) {
        return {date: date, tag: "abandoned", author_id: author_id}
    } else {
        return undefined
    }
}

function analyse_code_review(message_info) {
    let pat_plus_2 = /.*Code-Review\+2.*/;
    let pat_plus_1 = /.*Code-Review\+1.*/;
    let pat_minus_2 = /.*Code-Review-2.*/;
    let pat_minus_1 = /.*Code-Review-1.*/;
    let date = message_info.date;

    if (!message_info.author)
        return undefined;

    let author_id = message_info.author._account_id;

    let message = message_info.message
    if (pat_plus_2.test(message)) {
        return {date: date, "Code-Review": 2, author_id: author_id}
    } else if (pat_minus_2.test(message)) {
        return {date: date, "Code-Review": -2, author_id: author_id}
    } else if (pat_plus_1.test(message)) {
        return {date: date, "Code-Review": 1, author_id: author_id}
    } else if (pat_minus_1.test(message)) {
        return {date: date, "Code-Review": -1, author_id: author_id}
    } else {
        return undefined
    }
}

function is_equal(time1, time2) {
    return time1 === time2;
}

function get_review_time_in_label(json) {
    let labels = json["labels"];
    let time = undefined

    if (!!!labels)
        return time;

    let code_review = []
    if (labels["Code-Review"]) {
        if (labels["Code-Review"]["all"])
            code_review = labels["Code-Review"]["all"];
        else
            return time;
    } else {
        return time;
    }

    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let value = review.value;
        if (value === 2 || value === -2) {
            time = review.date
        }
    }
    return time;
}

function timeDiff(time1, time2) {
    let createdTime = Moment.utc(time1);
    let updatedTime = Moment.utc(time2);
    let time = Math.abs(createdTime.toDate() - updatedTime.toDate());
    return Moment.duration(time).asHours()
}


module.exports = {
    start: startComputeMetadata
};