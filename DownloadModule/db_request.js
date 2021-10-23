db.getCollection('metrics').aggregate([
    {$match: {recent_owner_merged_ratio: {$exists: false}}},
    {$count: "count"}
])

db.getCollection('changes').aggregate([
    //{$match : {status: {$in: ['MERGED', 'ABANDONED']}}},
    {$match: {status: {$in: ['ABANDONED']}}},
    {$match: {"labels.Code-Review.all.value": {$in: [-2]}}},
    //{$count: 'count'}
])

db.getCollection('changes').aggregate([
    //{$match : {status: {$in: ['MERGED', 'ABANDONED']}}},
    //{$match : {status: {$in: ['ABANDONED']}}},
    {$match: {"messages.author.username": 'pootlebot'}},
    //{$group}
    //{$count: 'count'}
    {
        $group: {
            _id: 1,
            count: {$sum: 1},
            time_avg: {$avg: "$meta_date_updated_date_created_diff"},
            time_max: {$max: "$meta_date_updated_date_created_diff"},
            time_min: {$min: "$meta_date_updated_date_created_diff"},
            time_std: {$stdDevPop: "$meta_date_updated_date_created_diff"},
        }
    }
])

db.getCollection('accounts').find({name: 'Pootle bot'})

db.getCollection('changes').find({_number: 25375})

db.getCollection('changes').aggregate([
    //{$match : {status: {$in: ['MERGED', 'ABANDONED']}}},
    {$match: {status: {$in: ['ABANDONED']}}},
    {$match: {"labels.Code-Review.all.value": {$nin: [-2]}}},
    {$count: 'count'}
])

db.getCollection('changes').aggregate([
    //{$match : {status: {$in: ['MERGED', 'ABANDONED']}}},
    //{$match : {status: {$in: ['ABANDONED']}}},
    {$match: {"messages.author.username": 'zuul'}},
    //{$group}
    //{$count: 'count'}
    {
        $group: {
            _id: 1,
            count: {$sum: 1},
            time_avg: {$avg: "$meta_date_updated_date_created_diff"},
            time_max: {$max: "$meta_date_updated_date_created_diff"},
            time_min: {$min: "$meta_date_updated_date_created_diff"},
            time_std: {$stdDevPop: "$meta_date_updated_date_created_diff"},
        }
    }
])

db.getCollection('changes').aggregate([
    {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            "messages.tag": 'autogenerated:gerrit:abandon',
            date_updated_date_created_diff: {$lte: 1},
        }
    },
    {$count: 'count'}
    /*{
            $group: {
                _id: 1,
                count: { $sum: 1 },
                time_avg: {$avg: "$date_updated_date_created_diff"},
                time_max: {$max: "$date_updated_date_created_diff"},
                time_min: {$min: "$date_updated_date_created_diff"},
                time_std: {$stdDevPop: "$date_updated_date_created_diff"},
            }
        }*/
])

db.getCollection('changes').aggregate([
    {
        $match: {
            //status:{$in: ['MERGED', 'ABANDONED']},
            status: 'ABANDONED',
            meta_date_updated_date_created_diff: {$lte: 1},
            //meta_date_updated_date_created_diff: {$gte: 1000},
            //"labels.Code-Review.all.value" : {$nin : [2]}
            //meta_date_updated_date_created_diff: {$gte: 60484}
        }
    },
    {$project: {id: 1, created: 1, status: 1, 'messages.date': 1, 'messages.message': 1}}
    //{$count: 'count'}
])

db.getCollection('changes').aggregate([
    {
        $match: {
            status: {$nin: ['MERGED', 'ABANDONED']},
        }
    },
    {
        $group: {
            _id: "$created",
            count: {$sum: 1},
        }
    },
    //{$match: {count: {$gte: 2}}},
    //{$count: "count"}
    {$sort: {count: -1}},
    {$limit: 300}
])

db.getCollection('changes').aggregate([
    {
        $match: {
            //status:{$in: [ 'ABANDONED']},
            created: "2019-07-30 16:02:22.000000000"
        }
    },
    {$project: {id: 1, created: 1, status: 1, 'messages.date': 1, 'messages.message': 1}}
    //{$count: 'count'}
])

db.getCollection('changes').aggregate([
    {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            //"messages.tag" : 'autogenerated:gerrit:abandon',
            date_updated_date_created_diff_original: {$gte: 24, $lte: 336},
            //date_updated_date_created_diff: {$lte: 1},
            //max_inactive_time: {$lte: 168},
        }
    },
    //{$count: 'count'}
    {
        $group: {
            _id: 1,
            count: {$sum: 1},
            time_avg: {$avg: "$date_updated_date_created_diff_original"},
            time_max: {$max: "$date_updated_date_created_diff_original"},
            time_min: {$min: "$date_updated_date_created_diff_original"},
            time_std: {$stdDevPop: "$date_updated_date_created_diff_original"},
        }
    }
])

db.getCollection('changes').aggregate([
    {
        $match:
            {files_list: {$size: 0}}
        //{"owner._account_id": {$exists: false}}
    },
    {$count: 'count'}
])

db.getCollection('metrics').aggregate([
    {
        $match:
            {sum_loc: {$ne: 0}}
        //{"owner._account_id": {$exists: false}}
    },
    {$count: 'count'}
])

db.getCollection('changes').aggregate([
    {
        $match:
        //{ files_list : {$size: 0} }
        //{"owner._account_id": {$exists: false}}
            {
                //_number:{$gte: 780140},
                //updated: {"$lt": "2021-06-15 03:19:29.000000000", "$gte": "2021-06-15 03:19:29.000000000"}
                //updated: this.created
            }
    },
    {$count: 'count'}
])

db.getCollection('changes').aggregate([

    {
        $match:

            {
                _number: {$lte: 1000},
                //updated: {"$lt": "2021-06-15 03:19:29.000000000", "$gte": "2021-06-15 03:19:29.000000000"}
            }
    },
    {$unwind: "$reviewers.REVIEWER"},
    {
        $group:
            {
                _id: "$reviewers.REVIEWER._account_id"
            }
    },
    {$count: 'count'}
])

db.getCollection('changes').aggregate([
    {$sort: {created: 1, _number: 1}},
    {$project: {_id: 0, number: 1, created: 1, updated: 1}}
])

db.getCollection('changes').aggregate([
    {
        $group: {
            _id: "$updated",
            count: {$sum: 1},
            created: {$push: "$created"}
        }
    },
    {$sort: {count: -1}},
    {$limit: 50}
    //{$count: 'count'}
], {allowDiskUse: true})


db.getCollection('changes').find({is_a_bot: true}).count()

db.getCollection('metrics').aggregate([
    {
        $match:
            {sum_loc: {$ne: 0}}
        //{"owner._account_id": {$exists: false}}
    },
    {$count: 'count'}
])

db.getCollection('changes').aggregate([
    {
        $match:
            {
                $or: [
                    {files_list: {$size: 0}},
                    {
                        $and: [
                            {insertions: 0},
                            {deletions: 0},
                        ]
                    }
                ]
                //"owner._account_id": {$exists: false}
            }
    },
    {$count: 'count'}
])

db.getCollection('changes').aggregate([
    {
        $match:
            {
                "owner._account_id": 1000154
            }
        //{"owner._account_id": {$exists: false}}
    },
    {$sort: {created: -1}},
    {$limit: 1},
    {$project: {_id: 0, created: 1}}
])

db.getCollection('changes').aggregate([
    {
        $match:
            {
                "messages.author._account_id": 1000154
            }
        //{"owner._account_id": {$exists: false}}
    },
    {$sort: {created: -1}},
    {$limit: 1},
    {$unwind: "$messages"},
    {
        $match:
            {
                "messages.author._account_id": 1000154
            }
    },
    {$sort: {"messages.date": -1}},
    {$limit: 1},
    {$project: {_id: 0, date: "$messages.date"}}
])

db.getCollection('changes').aggregate([
    {
        $match:
            {
                status: {$in: ['MERGED', 'ABANDONED']},
                "labels.Code-Review.all._account_id": 1001002
            }
        //{"owner._account_id": {$exists: false}}
    },

    {$sort: {created: -1}},
    {$limit: 1},
    {$unwind: "$labels.Code-Review.all"},
    {
        $match:
            {
                "labels.Code-Review.all._account_id": 1001002
            }
    },
    {$sort: {"labels.Code-Review.all.date": -1}},
    {$limit: 1},
    {$project: {_id: 0, date: "$labels.Code-Review.all.date"}}

])

function getReviewerLastMessage(reviewersId, number, created_date, ownerId) {
    let pipeline = [
        {
            $match:
                {
                    _number: {$lt: number},
                    created: {$lt: created_date},
                    "messages.author._account_id": ownerId,
                    "messages.date": {$lt: created_date}
                }
        },
        {$unwind: "$messages"},
        {
            $match:
                {
                    "messages.author._account_id": ownerId,
                    "messages.date": {$lt: created_date}
                }
        },
        {$sort: {created: -1}},
        {$limit: 1},
        {$project: {_id: 0, date: "$messages.date"}}
    ]
    pipeline = addRecentDateToPipeline(pipeline);
    return genericDBRequest(pipeline);
}

db.getCollection('changes').aggregate([
    {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            //"messages.tag" : 'autogenerated:gerrit:abandon',
            date_updated_date_created_diff: {$gte: 24, $lte: 336},
            //date_updated_date_created_diff: {$lte: 1},
            //max_inactive_time: {$lte: 168},
        }
    },
    //{$count: 'count'}
    {
        $group: {
            _id: 1,
            count: {$sum: 1},
            time_avg: {$avg: "$date_updated_date_created_diff"},
            time_max: {$max: "$date_updated_date_created_diff"},
            time_min: {$min: "$date_updated_date_created_diff"},
            time_std: {$stdDevPop: "$date_updated_date_created_diff"},
        }
    }
])


db.getCollection('changes').aggregate([
    {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            date_updated_date_created_diff: {$gte: 24, $lte: 336},
            max_inactive_time: {$lte: 168},
            messages_count: {$gt: 1},
            has_reviewers: true,
            num_files: {$gt: 0},
            is_a_cherry_pick: false,
            first_revision: 1
        }
    },
    //{$count: 'count'}
    {$sort: {created: 1, _number: 1}},
    {
        $group: {
            _id: 1,
            count: {$sum: 1},
            time_avg: {$avg: "$date_updated_date_created_diff"},
            time_max: {$max: "$date_updated_date_created_diff"},
            time_min: {$min: "$date_updated_date_created_diff"},
            time_std: {$stdDevPop: "$date_updated_date_created_diff"},
            first_created_date: {$first: "$created"},
            first_updated_date: {$first: "$updated"},
            last_created_date: {$last: "$created"},
            last_updated_date: {$last: "$updated"},
        }
    }
])

db.getCollection('changes').aggregate([
    {
        $match: {
            created: {$lte: "2021-06-16"},
            date_updated_date_created_diff: {$gte: 1, $lte: 730},
            max_inactive_time: {$lte: 336},
            messages_count: {$gt: 1},
            has_reviewers: true,
            num_files: {$gt: 0},
            is_a_cherry_pick: false
        }
    },
    {
        $group: {
            _id: "ALL",
            count: {$sum: 1},
            time_avg: {$avg: "$date_updated_date_created_diff"},
            time_max: {$max: "$date_updated_date_created_diff"},
            time_min: {$min: "$date_updated_date_created_diff"},
            time_std: {$stdDevPop: "$date_updated_date_created_diff"},
        }
    }
])

//db.getCollection('changes_with_metadata').find({})
db.getCollection('changes_with_metadata').aggregate([
    {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            date_updated_date_created_diff: {$gte: 24, $lte: 336},
            max_inactive_time: {$lte: 168},
            messages_count: {$gt: 1},
            has_reviewers: true,
            num_files: {$gt: 0},
            is_a_cherry_pick: false,
            first_revision: 1
        }
    },
    //{$count: 'count'}
    {$sort: {created: 1, _number: 1}},
    {
        $group: {
            _id: 1,
            count: {$sum: 1},
            time_avg: {$avg: "$date_updated_date_created_diff"},
            time_max: {$max: "$date_updated_date_created_diff"},
            time_min: {$min: "$date_updated_date_created_diff"},
            time_std: {$stdDevPop: "$date_updated_date_created_diff"},
            first_created_date: {$first: "$created"},
            first_updated_date: {$first: "$updated"},
            last_created_date: {$last: "$created"},
            last_updated_date: {$last: "$updated"},
        }
    }
])
/*
{
    $group: {
        _id: "$messages.author._account_id",
            count: { $sum: 1 },
        time_avg: {$avg: "$date_updated_date_created_diff"},
        time_max: {$max: "$date_updated_date_created_diff"},
        time_min: {$min: "$date_updated_date_created_diff"},
        time_std: {$stdDevPop: "$date_updated_date_created_diff"},
        first_created_date: {$first: "$created"},
        first_updated_date: {$first: "$updated"},
        last_created_date: {$last: "$created"},
        last_updated_date: {$last: "$updated"},
    }
}*/

db.getCollection('changes').aggregate([
    {
        $match: {
            //status: {$in: ['MERGED', 'ABANDONED']},
            //date_updated_date_created_diff: {$gte: 24, $lte:336},
        }
    },
    //{$count: 'count'}
    {
        $group: {
            _id: "$date_updated_date_created_diff",
            count: {$sum: 1},
            id: {$addToSet: "$id"}
        }
    },
    {
        $match: {
            count: {$gt: 1}
        }
    },
    {$sort: {count: -1}},
    {$unwind: '$id'},
    {
        $group: {
            _id: 1,
            id_list: {$addToSet: "$id"}
        }
    },

])

db.getCollection('changes_with_metadata').aggregate([
    {
        $match: {
            status: {$in: ['MERGED', 'ABANDONED']},
            //date_updated_date_created_diff: {$gte: 24, $lte:336},
            //max_inactive_time: {$lte: 168},
            //messages_count: {$gt: 1},
            //has_reviewers: true,
            //num_files: {$gt: 0},
            //is_a_cherry_pick: false,
            //first_revision: 1
            message
        }
    },
    //{$count: 'count'}
    //{$sort: {created:1, _number: 1}},
    {
        $group: {
            _id: 1,
            count: {$sum: 1},
        }
    }
])

db.getCollection('changes_with_metadata').createIndex({_number: 1})
db.getCollection('changes_with_metadata').createIndex({id: 1})
db.getCollection('metrics_with_metadata').createIndex({_number: 1})
db.getCollection('metrics_with_metadata').createIndex({id: 1})
db.getCollection('related_changes').createIndex({id: 1})
db.getCollection('related_changes').createIndex({change_id: 1})
db.getCollection('changes_with_metadata').createIndex({id: 1, created: 1, change_id: 1})
db.getCollection('changes_with_metadata').createIndex({id: 1, created: -1, change_id: 1})
db.getCollection('changes_with_metadata').createIndex({id: 1, status: 1, created: 1, updated: 1, change_id: 1})
db.getCollection('changes_with_metadata').createIndex({id: 1, status: 1, created: -1, updated: -1, change_id: 1})
db.getCollection('changes_with_metadata').createIndex({id: 1, created: 1, 'owner._account_id': 1, change_id: 1})
db.getCollection('changes_with_metadata').createIndex({id: 1, created: -1, 'owner._account_id': 1, change_id: 1})
db.getCollection('changes_with_metadata').createIndex({
    id: 1,
    status: 1,
    'owner._account_id': 1,
    created: 1,
    updated: 1,
    change_id: 1
})
db.getCollection('changes_with_metadata').createIndex({
    id: 1,
    status: 1,
    'owner._account_id': 1,
    created: -1,
    updated: -1,
    change_id: 1
})

db.getCollection('changes').createIndex({date_updated_date_created_diff: 1})
db.getCollection('changes').createIndex({avg_build_time_before_close: 1})
db.getCollection('changes').createIndex({avg_time_to_add_human_reviewers_before_close: 1})
db.getCollection('changes').createIndex({revisions_num: 1})
db.getCollection('changes').createIndex({avg_time_revision_before_close: 1})
db.getCollection('changes').createIndex({avg_time_between_msg_before_close: 1})
db.getCollection('changes').createIndex({messages_count_before_close: 1})
db.getCollection('changes').createIndex({num_of_build_failures_before_close: 1})

//============================

db.getCollection('changes').createIndex({id: 1})
db.getCollection('changes').createIndex({change_id: 1})
db.getCollection('changes').createIndex({_number: 1})
db.getCollection('changes').createIndex({status: 1})
db.getCollection('changes').createIndex({updated: 1})
db.getCollection('changes').createIndex({created: 1})
db.getCollection('changes').createIndex({project: 1})
db.getCollection('changes').createIndex({branch: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1})

db.getCollection('changes').createIndex({updated: 1, status: 1})
db.getCollection('changes').createIndex({created: 1, updated: 1, status: 1})

//db.getCollection('changes').createIndex({updated: -1, status: 1})
//db.getCollection('changes').createIndex({created: -1, updated: -1, status: 1})
//db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1})

db.getCollection('changes').createIndex({is_self_review: 1, status: 1, updated: 1})
db.getCollection('changes').createIndex({project: 1, status: 1, updated: 1, })
db.getCollection('changes').createIndex({updated: 1, 'owner._account_id': 1, status: 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, branch: 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, project: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, project: 1, branch: 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, branch: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, project: 1, 'owner._account_id': 1, branch: 1})
db.getCollection('changes').createIndex({updated: 1, extensions_list: 1, status: 1})
db.getCollection('changes').createIndex({updated: 1, avg_build_time: 1, extensions_list: 1, status: 1})

db.getCollection('changes').createIndex({updated: 1, status: 1, is_self_review: 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, project: 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, branch: 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, project: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, project: 1, branch: 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, branch: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({updated: 1, status: 1, project: 1, 'owner._account_id': 1, branch: 1})
db.getCollection('changes').createIndex({updated: 1, extensions_list: 1, status: 1})
db.getCollection('changes').createIndex({updated: 1, avg_build_time: 1, extensions_list: 1, status: 1})

db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1, is_self_review: 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1, project: 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1, branch: 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1, project: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1, project: 1, branch: 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1, branch: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, status: 1, project: 1, 'owner._account_id': 1, branch: 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, extensions_list: 1, status: 1})
db.getCollection('changes').createIndex({created: 1, updated: -1, avg_build_time: 1, extensions_list: 1, status: 1})

db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, updated: 1, status: 1})
db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, updated: 1, created: 1, status: 1})

db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, updated: 1, status: 1})
db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, updated: 1, created: 1, status: 1})

db.getCollection('changes').createIndex({is_self_review: 1})
db.getCollection('changes').createIndex({extensions_list: 1})
db.getCollection('changes').createIndex({date_updated_date_created_diff: 1})
db.getCollection('changes').createIndex({avg_build_time_before_close: 1})
db.getCollection('changes').createIndex({avg_time_to_add_human_reviewers_before_close: 1})
db.getCollection('changes').createIndex({revisions_num: 1})
db.getCollection('changes').createIndex({avg_time_revision_before_close: 1})
db.getCollection('changes').createIndex({avg_time_between_msg_before_close: 1})
db.getCollection('changes').createIndex({messages_count_before_close: 1})
db.getCollection('changes').createIndex({num_of_build_failures_before_close: 1})


/*db.getCollection('changes').createIndex({status: 1, is_self_review: 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, project: 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, 'owner._account_id': 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, branch: 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, project: 1, 'owner._account_id': 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, project: 1, branch: 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, branch: 1, 'owner._account_id': 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, project: 1, 'owner._account_id': 1, branch: 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, extensions_list: 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, extensions_list: 1, avg_build_time: 1, updated: -1})*/

db.changes.find().forEach(function(doc) {
    let created = doc.created;
    let updated = doc.updated;
    let arr_created = created.split(/-|\s|:/);
    let arr_updated = updated.split(/-|\s|:/);
    let date_created = new Date(Date.UTC(arr_created[0], arr_created[1] -1, arr_created[2], arr_created[3], arr_created[4], arr_created[5]));
    let date_updated = new Date(Date.UTC(arr_updated[0], arr_updated[1] -1, arr_updated[2], arr_updated[3], arr_updated[4], arr_updated[5]));
    doc.created = date_created;
    doc.updated = date_updated;
    db.changes.save(doc);
})