const Moment = require('moment');
const MathJs = require('mathjs');
const cliProgress = require('cli-progress');
const Database = require('../config/databaseConfig');
const Change = require('../models/change');
const Utils = require('../config/utils');
const MetricsUtils = require('./metrics-utils');

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
            let NUM_OF_CHANGES_LIMIT = 3000;
            console.log("Processing data by slice of " + NUM_OF_CHANGES_LIMIT);
            progressBar.start(count, 0);
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

async function collectMetadata(json) {
    let metadata = {};
    metadata["id"] = json.id
    metadata = get_owner_info(metadata, json)
    metadata = get_revision_info(metadata, json)
    metadata = get_time_info(metadata, json)
    metadata = {...metadata, ...get_messages_information(json)}
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
    metadata["avg_time_to_add_human_reviewers"] = time_to_add_human_reviewers.avg_time_to_add_human_reviewers;
    metadata["avg_time_to_add_human_reviewers_before_close"] = time_to_add_human_reviewers.avg_time_to_add_human_reviewers_before_close;


    //do get the smallest date
    //ab time to add reviewers
    //todo work load of the owner.
    //todo delete outlier
    //todo revision before close time
    //todo delete all but 1st revision
    //todo add new features
        //build time avg per file
            //build time of owner
        //avg time of revision of file
        //avg time of revision of owner
        //avg time between revision owner
        //avg of fail of file

    return metadata;
}

function get_time_to_add_human_reviewers(json, close_time) {
    let reviewers_updated = json["reviewers_updated"];
    let date_created = json["date_created"]
    let dateDiff = []
    let dateDiff_before_close = []
    for (let i = 0; i < reviewers_updated.length; i++) {
        let updated = reviewers_updated[i];
        let reviewer_id = updated["reviewer"]["_account_id"];
        if (!MetricsUtils.isABot(reviewer_id, projectName)) {
            let date = updated["date"];
            dateDiff.push(timeDiff(date, date_created))
            if (date < close_time)
                dateDiff_before_close.push(timeDiff(date, date_created))
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
        if (metadata["is_a_bot"])
            return Promise.resolve(false)
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

function get_messages_information(json) {
    let messages = json.messages;

    if (!messages)
        return {}

    let messages_count = Object.keys(messages).length;
    let messages_per_account = {}
    let messages_human_count = 0
    let messages_bot_count = 0
    let message_review_time = [];
    //let message_auto_tag = [];
    let has_auto_tag_merged = false;
    let has_auto_tag_abandoned = false;

    let time_diff_between_messages = []
    let time_diff_between_messages_before_review = []
    let lastTime = 0
    let has_been_review = false;
    let last_revision_number = 0;
    let revisions_list = [];
    let build_message_list = [];

    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        let date = message.date;

        if (!message.author)
            continue;

        let code_review = analyse_code_review(message)
        if (code_review !== undefined) {
            if (code_review["Code-Review"] === 2 || code_review["Code-Review"] === -2) {
                message_review_time.push(code_review["date"])
                has_been_review = true;
            }
        }

        let auto_tag = analyse_auto_tag(message)
        if (auto_tag !== undefined) {
            //message_auto_tag.push(auto_tag)
            if (auto_tag["tag"] === "merged")
                has_auto_tag_merged = true
            else if (auto_tag["tag"] === "abandoned")
                has_auto_tag_abandoned = true
        }

        let author = messages[i].author._account_id;

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

        }
        if (lastTime !== 0) {
            //let diff_time = timeDiff(time_diff_between_messages[time_diff_between_messages.length - 1], date)
            let diff_time = timeDiff(lastTime, date)
            time_diff_between_messages.push(diff_time)
            if (!has_been_review) {
                time_diff_between_messages_before_review.push(diff_time)
            }
        }

        //analyse time between revision
        let revision_number = message._revision_number;
        //console.log(revisions_list)
        if (last_revision_number !== revision_number) {
            let rev = {revision: revision_number, start: date}
            revisions_list.push(rev)
            if (last_revision_number > 1) {
                revisions_list[revisions_list.length - 1]["end"] = date;
            }
            last_revision_number = revision_number;
        } else {
            revisions_list[revisions_list.length - 1]["last_message_time"] = date;
            revisions_list[revisions_list.length - 1]["end"] = date;
        }

        if (i === messages.length - 1) {
            revisions_list[revisions_list.length - 1]["end"] = date;
            revisions_list[revisions_list.length - 1]["last_message_time"] = date;
        }

        //analyse build time
        let bot_build_info = get_bot_message(message)
        if (bot_build_info !== undefined)
            build_message_list.push(bot_build_info);

        lastTime = Moment.utc(date);
    }
    //anaylse all info collected
    let max_inactive_time = time_diff_between_messages.length > 0 ? MathJs.max(time_diff_between_messages) : 0
    let max_inactive_time_before_review = time_diff_between_messages_before_review.length > 0 ? MathJs.max(time_diff_between_messages_before_review) : 0
    let is_inactive = false;
    if (max_inactive_time > 2190) {
        //3 month
        is_inactive = true
    }

    let avg_time_between_msg = time_diff_between_messages.length > 0 ? MathJs.mean(time_diff_between_messages) : 0
    let avg_time_between_msg_before_revision = time_diff_between_messages_before_review.length > 0 ? MathJs.mean(time_diff_between_messages_before_review) : 0

    let revision_time = []
    let revision_time_to_last_msg = []
    let time_between_revision = []
    //result = array.slice(1).map((v, i) => v - array[i]);
    for (let i = 0; i < revisions_list.length; i++) {
        let rev_item = revisions_list[i];
        revision_time.push(timeDiff(rev_item["start"], rev_item["end"]))
        revision_time_to_last_msg.push(timeDiff(rev_item["start"], rev_item["last_message_time"]))
        time_between_revision.push(timeDiff(rev_item["start"], rev_item["end"]) - timeDiff(rev_item["start"], rev_item["last_message_time"]))
    }
    let avg_time_revision = revision_time.length > 0 ? MathJs.mean(revision_time) : 0
    let avg_revision_time_to_last_msg = revision_time_to_last_msg.length > 0 ? MathJs.mean(revision_time_to_last_msg) : 0;
    let avg_time_between_revision = time_between_revision > 0 ? MathJs.mean(time_between_revision) : 0

    //message per account
    let messages_per_account_array = []
    for (let key in messages_per_account) {
        messages_per_account_array.push({account: key, num_messages: messages_per_account[key]})
    }

    //analyse build info
    let first_review_in_message_date = message_review_time.length > 0 ? message_review_time[0] : 0
    let build_info = analyse_build_info(build_message_list, revisions_list)
    let avg_build_time = build_info.avg_time_of_build;
    let num_of_build_success = build_info.num_of_build_success;
    let num_of_build_failures = build_info.num_of_build_failures;

    return {
        messages_count: messages_count,
        messages_per_account: messages_per_account_array,
        messages_human_count: messages_human_count,
        messages_bot_count: messages_bot_count,
        is_inactive: is_inactive,
        max_inactive_time: max_inactive_time,
        max_inactive_time_before_review: max_inactive_time_before_review,
        has_auto_tag_merged: has_auto_tag_merged,
        has_auto_tag_abandoned: has_auto_tag_abandoned,
        avg_time_between_msg: avg_time_between_msg,
        avg_time_between_msg_before_revision: avg_time_between_msg_before_revision,
        avg_time_revision: avg_time_revision,
        avg_revision_time_to_last_msg: avg_revision_time_to_last_msg,
        avg_time_between_revision: avg_time_between_revision,
        has_been_review_in_message: has_been_review,
        first_review_in_message_date: first_review_in_message_date,
        avg_build_time: avg_build_time,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,
    };
}

//todo time to add reviewer

function get_bot_message(message_info) {
    let date = message_info.date;
    let revision_number = message_info._revision_number;

    if (!message_info.author)
        return undefined;

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
        let ref_patt = /\brefs\/builds\/\S+/i
        let urls_ref_patt = /\bhttps:\/\/testresults.qt.io\/\S+/i
        let refs = message.match(ref_patt);
        if (!refs)
            refs = message.match(urls_ref_patt);

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
        let build_start_patt = /.*=== Started presubmit run .* === .*/mi
        let build_finished_patt = /.*TreeHugger finished with: .*/mi
        let verified_failed_patt = /.*Presubmit-Verified(-1|-2).*/mi
        let verified_success_patt = /.*Presubmit-Verified(\+1|\+2).*/mi
        let ref_patt = /\bhttps?:\/\/android-build.googleplex.com\/builds\/\S+/i
        let build_refs_patt = /L[0-9]+\S+/i
        const refs = message.match(ref_patt);
        const build_refs = message.match(build_refs_patt);
        if (build_start_patt.test(message)) {
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
            const failed = message.test(verified_failed_patt);
            const success = message.test(verified_success_patt);
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
        let build_success_patt = /.*Build Successful .* \bhttps?:\/\/\S+.* : SUCCESS /mi
        let build_succeeded_patt = /.*Build succeeded \(check pipeline\).*/mi
        let build_failed_patt = /.*Build Failed .* \bhttps?:\/\/\S+.* : (FAILURE|ABORTED) /mi;

        let url_pat = /\bhttps?:\/\/\S+/gi
        let success_pat = /\bSUCCESS\S+/gi
        let failure_pat = /\bFAILURE\S+/gi
        //let failure_pat = /\bSKIPPED\S+/gi
        const refs = message.match(url_pat);

        if (build_start_patt.test(message)) {
            return {
                date: date, "ci_tag": "started",
                author_id: author_id, url: urls, revision_number: revision_number, refs: refs

            }
        } else if (build_success_patt.test(message)) {
            return {
                date: date, "ci_tag": "success", author_id: author_id, url: urls,
                failed: false,
                success: true,
                revision_number: revision_number, refs: refs
            }
        } else if (build_failed_patt.test(message)) {
            return {
                date: date, "ci_tag": "failed", author_id: author_id,
                url: urls, revision_number: revision_number, failed: true,
                success: false, refs: refs
            }
        } else if (build_succeeded_patt.test(message)) {
            let success_num = message.match(success_pat) ? message.match(success_pat).length : 0;
            let fail_num = message.match(failure_pat) ? message.match(failure_pat).length : 0;
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


function analyse_build_info(build_message_list, revisions_list) {
    let num_of_build_success = 0;
    let num_of_build_failures = 0;
    let avg_time_of_build = 0;
    let build_time_array = [];

    if (['android'].includes(projectName)) {
        let build_time = {};
        for (let i = 0; i < build_message_list.length; i++) {
            let build_message = build_message_list[i];
            if (build_message["ci_tag"] === "started") {
                let refs = build_message["refs"]
                build_time[refs]["started"] = build_message["date"];
            } else if (build_message["ci_tag"] === "success") {
                let refs = build_message["refs"]
                build_time[refs]["finished"] = build_message["date"];
                if ([refs]["failed"])
                    num_of_build_failures += 1
                if ([refs]["success"])
                    num_of_build_success += 1
            }
        }
        for (let key in build_time) {
            build_time_array.push(timeDiff(build_time[key]["started"], build_time[key]["finished"]))
        }
    } else if (['qt'].includes(projectName)) {
        let build_time = {};
        for (let i = 0; i < build_message_list.length; i++) {
            let build_message = build_message_list[i];
            if (build_message["ci_tag"] === "started") {
                let refs = build_message["refs"]
                build_time[refs]["started"] = build_message["date"];
            } else if (build_message["ci_tag"] === "failed" || build_message["ci_tag"] === "success") {
                let refs = build_message["refs"]
                build_time[refs]["finished"] = build_message["date"];
                if ([refs]["failed"])
                    num_of_build_failures += 1
                if ([refs]["success"])
                    num_of_build_success += 1
            }
        }
        for (let key in build_time) {
            build_time_array.push(timeDiff(build_time[key]["started"], build_time[key]["finished"]))
        }
    } else {
        let build_time = {};
        let build_succeeded_time = {};
        for (let i = 0; i < build_message_list.length; i++) {
            let build_message = build_message_list[i];
            let bot_id = build_message.owner_id;
            if (build_message["ci_tag"] === "succeeded") {
                build_succeeded_time.push(
                    {
                        date: build_message["date"],
                        revision: build_message["revision_number"],
                        success_num: build_message["success_num"],
                        fail_num: build_message["fail_num"]
                    }
                )
            } else if (build_message["ci_tag"] === "started") {
                let refs = build_message["refs"]
                for (let k in refs) {
                    let ref = refs[k]
                    build_time[bot_id][ref]["started"] = build_message["date"];
                    build_time[bot_id][ref]["revision"] = build_message["revision_number"]
                }
            } else if (build_message["ci_tag"] === "failed" || build_message["ci_tag"] === "success") {
                let refs = build_message["refs"]
                for (let k in refs) {
                    let ref = refs[k]
                    build_time[bot_id][ref]["finished"] = build_message["date"];
                    build_time[bot_id][ref]["revision"] = build_message["revision_number"]
                    if ([ref]["failed"])
                        num_of_build_failures += 1
                    if ([ref]["success"])
                        num_of_build_success += 1
                }
            }
        }
        //get bot avg time
        let build_time_array_for_bot_individually = []
        for (let k in build_time) {
            //build_time_array.push(timeDiff(build_time[key]["started"], build_time[key]["finished"]))
            let bot_build_time = build_time[k]
            let bot_build_time_array = []
            for (let key in bot_build_time) {
                let bot_time = bot_build_time[key];
                if (bot_time["started"])
                    bot_build_time_array.push(timeDiff(bot_time["started"], bot_time["finished"]))
                else {
                    let revision_number = bot_time["revision_number"]
                    let revision_start_date = 0
                    for (let j in revisions_list) {
                        if (revisions_list[j]["revision_number"] === revision_number)
                            revision_start_date = revisions_list[j]["date"]
                    }

                    bot_build_time_array.push(timeDiff(revision_start_date, bot_time["finished"]))
                }
            }
            let avg_bot_build_time = bot_build_time_array.length > 0 ? MathJs.mean(bot_build_time_array) : 0
            build_time_array_for_bot_individually.push(avg_bot_build_time)
        }
        //get succeeded time
        let build_time_array_for_all = []
        for (let k in build_succeeded_time) {
            let bot_build_succeeded_time = build_succeeded_time[k]
            num_of_build_failures = bot_build_succeeded_time["fail_num"]
            num_of_build_success = bot_build_succeeded_time["success_num"]
            let revision_number = bot_build_succeeded_time["revision_number"]
            let revision_start_date = revisions_list[revisions_list.length - 1]["date"]
            build_time_array_for_all.push(timeDiff(revision_start_date, build_time[k]["finished"]))
        }

        if (build_time_array_for_all.length > 0) {
            let avg_time = MathJs.mean(build_time_array_for_all)
            build_time_array.push(avg_time)
        } else {
            let avg_time = build_time_array_for_bot_individually.length > 0 ? MathJs.mean(build_time_array_for_bot_individually) : 0
            build_time_array.push(avg_time)
        }

    }

    avg_time_of_build = build_time_array.length > 0 ? MathJs.mean(build_time_array) : 0
    return {
        avg_time_of_build: avg_time_of_build,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,
    }
}

function analyse_auto_tag(message) {
    let pat_auto_tag_merged = /.*autogenerated:gerrit:merged.*/;
    let pat_auto_tag_abandon = /.*autogenerated:gerrit:abandon.*/;
    let date = message.date;

    if (!message.author)
        return undefined;

    let author_id = message.author._account_id;
    if (pat_auto_tag_merged.test(message)) {
        return {date: date, tag: "merged", author_id: author_id}
    } else if (pat_auto_tag_abandon.test(message)) {
        return {date: date, tag: "abandoned", author_id: author_id}
    } else {
        return undefined
    }
}

function analyse_code_review(message) {
    let pat_plus_2 = /.*Code-Review\+2.*/;
    let pat_plus_1 = /.*Code-Review\+1.*/;
    let pat_minus_2 = /.*Code-Review-2.*/;
    let pat_minus_1 = /.*Code-Review-1.*/;
    let date = message.date;

    if (!message.author)
        return undefined;

    let author_id = message.author._account_id;

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

function diffCreatedUpdatedTime(json) {
    let createdTime = Moment.utc(json.created);
    let updatedTime = Moment.utc(json.updated);
    let time = Math.abs(createdTime.toDate() - updatedTime.toDate());
    return Moment.duration(time).asHours()
}

function getReviewersId(json) {

    let reviewers = json.reviewers.REVIEWER
    let reviewerArray = []
    for (let id in reviewers) {
        reviewerArray.push(reviewers[id]._account_id)
    }
    return reviewerArray;
}


module.exports = {
    start: startComputeMetadata
};