db.getCollection('metrics').aggregate([
    {$match: {recent_owner_merged_ratio : {$exists : false}}},
    {$count: "count"}
])

db.getCollection('changes').aggregate([
    //{$match : {status: {$in: ['MERGED', 'ABANDONED']}}},
    {$match : {status: {$in: ['ABANDONED']}}},
    {$match : {"labels.Code-Review.all.value" : {$in : [-2]}}},
    //{$count: 'count'}
])

db.getCollection('changes').aggregate([
    //{$match : {status: {$in: ['MERGED', 'ABANDONED']}}},
    //{$match : {status: {$in: ['ABANDONED']}}},
    {$match : {"messages.author.username" : 'pootlebot'}},
    //{$group}
    //{$count: 'count'}
    {
        $group: {
            _id: 1,
            count: { $sum: 1 },
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
    {$match : {status: {$in: ['ABANDONED']}}},
    {$match : {"labels.Code-Review.all.value" : {$nin : [-2]}}},
    {$count: 'count'}
])

db.getCollection('changes').aggregate([
    //{$match : {status: {$in: ['MERGED', 'ABANDONED']}}},
    //{$match : {status: {$in: ['ABANDONED']}}},
    {$match : {"messages.author.username" : 'zuul'}},
    //{$group}
    //{$count: 'count'}
    {
        $group: {
            _id: 1,
            count: { $sum: 1 },
            time_avg: {$avg: "$meta_date_updated_date_created_diff"},
            time_max: {$max: "$meta_date_updated_date_created_diff"},
            time_min: {$min: "$meta_date_updated_date_created_diff"},
            time_std: {$stdDevPop: "$meta_date_updated_date_created_diff"},
        }
    }
])

db.getCollection('changes').aggregate([
    {$match : {
            status: {$in: ['MERGED', 'ABANDONED']},
            "messages.tag" : 'autogenerated:gerrit:abandon',
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
    {$match: {
            //status:{$in: ['MERGED', 'ABANDONED']},
            status:'ABANDONED',
            meta_date_updated_date_created_diff: {$lte: 1},
            //meta_date_updated_date_created_diff: {$gte: 1000},
            //"labels.Code-Review.all.value" : {$nin : [2]}
            //meta_date_updated_date_created_diff: {$gte: 60484}
        }
    },
    {$project: {id:1, created:1, status:1, 'messages.date': 1, 'messages.message' : 1}}
    //{$count: 'count'}
])

db.getCollection('changes').aggregate([
    {
        $match: {
            status:{$nin: ['MERGED', 'ABANDONED']},
        }
    },
    {
        $group: {
            _id: "$created",
            count: { $sum: 1 },
        }
    },
    //{$match: {count: {$gte: 2}}},
    //{$count: "count"}
    {$sort: {count : -1}},
    {$limit: 300}
])

db.getCollection('changes').aggregate([
    {$match: {
            //status:{$in: [ 'ABANDONED']},
            created: "2019-07-30 16:02:22.000000000"
        }
    },
    {$project: {id:1, created:1, status:1, 'messages.date': 1, 'messages.message' : 1}}
    //{$count: 'count'}
])

db.getCollection('changes').aggregate([
    {$match : {
            status: {$in: ['MERGED', 'ABANDONED']},
            //"messages.tag" : 'autogenerated:gerrit:abandon',
            date_updated_date_created_diff_original: {$gte: 24, $lte:336},
            //date_updated_date_created_diff: {$lte: 1},
            //max_inactive_time: {$lte: 168},
        }
    },
    //{$count: 'count'}
    {
        $group: {
            _id: 1,
            count: { $sum: 1 },
            time_avg: {$avg: "$date_updated_date_created_diff_original"},
            time_max: {$max: "$date_updated_date_created_diff_original"},
            time_min: {$min: "$date_updated_date_created_diff_original"},
            time_std: {$stdDevPop: "$date_updated_date_created_diff_original"},
        }
    }
])

db.getCollection('changes').aggregate([
    {$match :
            { files_list : {$size: 0} }
        //{"owner._account_id": {$exists: false}}
    },
    {$count: 'count'}
])

db.getCollection('metrics').aggregate([
    {$match :
            { sum_loc : {$ne: 0} }
        //{"owner._account_id": {$exists: false}}
    },
    {$count: 'count'}
])

db.getCollection('changes').aggregate([
    {$match :
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

    {$match :

            {
                _number:{$lte: 1000},
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
    {$sort:{created:1, _number:1}},
    {$project:{_id:0, number:1, created:1, updated:1}}
])

db.getCollection('changes').aggregate([
    {
        $group: {
            _id: "$updated",
            count:{$sum: 1},
            created: {$push: "$created"}
        }
    },
    {$sort: {count:-1}},
    {$limit: 50}
    //{$count: 'count'}
], {allowDiskUse: true})


db.getCollection('changes').find({is_a_bot: true}).count()

db.getCollection('metrics').aggregate([
    {$match :
            { sum_loc : {$ne: 0} }
        //{"owner._account_id": {$exists: false}}
    },
    {$count: 'count'}
])

db.getCollection('changes').aggregate([
    {$match :
            {
                $or: [
                    {files_list : {$size: 0}},
                    {
                        $and: [
                            {insertions:0},
                            {deletions: 0},
                        ]
                    }
                ]
                //"owner._account_id": {$exists: false}
            }
    },
    {$count: 'count'}
])