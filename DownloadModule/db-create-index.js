db.getCollection('accounts').createIndex({_account_id: 1})

db.getCollection('metrics').createIndex({id: 1})
db.getCollection('metrics').createIndex({number: 1})
db.getCollection('metrics').createIndex({created_date: 1})
db.getCollection('metrics').createIndex({number: 1, created_date: 1})
db.getCollection('metrics').createIndex({date_updated: 1, number: 1})

db.getCollection('changes').createIndex({id: 1})
db.getCollection('changes').createIndex({_number: 1})
db.getCollection('changes').createIndex({created: 1})
db.getCollection('changes').createIndex({updated: 1})
db.getCollection('changes').createIndex({status: 1})
db.getCollection('changes').createIndex({change_id: 1})
db.getCollection('changes').createIndex({branch: 1})
db.getCollection('changes').createIndex({project: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1})
db.getCollection('changes').createIndex({'reviewers.REVIEWER._account_id':1})
db.getCollection('changes').createIndex({_number: 1, created: 1})
db.getCollection('changes').createIndex({created: 1, _number: 1})
db.getCollection('changes').createIndex({branch:1, updated:1})
db.getCollection('changes').createIndex({status: 1, updated: 1})
db.getCollection('changes').createIndex({status:1, created:1, updated:1})
db.getCollection('changes').createIndex({status:1, branch:1, updated:1})
db.getCollection('changes').createIndex({status:1, project:1, updated:1})
db.getCollection('changes').createIndex({status:1, files_list:1, updated:1})
db.getCollection('changes').createIndex({status:1, 'owner._account_id': 1, updated:1})
db.getCollection('changes').createIndex({status:1, 'reviewers.REVIEWER._account_id': 1, updated:1})
db.getCollection('changes').createIndex({status:1, 'messages_per_account_before_close.account': 1, updated:1})
db.getCollection('changes').createIndex({status:1, project:1, branch:1, 'owner._account_id': 1, updated:1})
db.getCollection('changes').createIndex({status:1, project:1, 'owner._account_id': 1, updated:1})
db.getCollection('changes').createIndex({'owner._account_id': 1, created:1})
db.getCollection('changes').createIndex({project:1, created:1})
db.getCollection('changes').createIndex({project:1, 'owner._account_id': 1, created:1})
db.getCollection('changes').createIndex({project:1, branch:1, 'owner._account_id': 1, updated:1})

db.getCollection('changes').createIndex({status:1, avg_build_time:1, updated:1})
db.getCollection('changes').createIndex({status:1, project:1, avg_build_time:1, updated:1})
db.getCollection('changes').createIndex({status:1, project:1, branch:1, avg_build_time:1, updated:1})
db.getCollection('changes').createIndex({status:1, branch:1, avg_build_time:1, updated:1})
db.getCollection('changes').createIndex({status:1, 'owner._account_id':1, avg_build_time:1, updated:1})
db.getCollection('changes').createIndex({status:1, project:1, branch:1, 'owner._account_id':1, avg_build_time:1, updated:1})
db.getCollection('changes').createIndex({status:1, files_list:1, avg_build_time:1, updated:1})
db.getCollection('changes').createIndex({status:1, extensions_list:1, updated:1})
db.getCollection('changes').createIndex({status:1, extensions_list:1, avg_build_time:1, updated:1})
db.getCollection('changes').createIndex({status:1, base_directories:1, updated:1})
db.getCollection('changes').createIndex({status:1, base_directories:1, avg_build_time:1, updated:1})

db.getCollection('changes').createIndex({branch:1, files_list:1, created:1, updated:1})
db.getCollection('changes').createIndex({status:1, project:1, branch:1, updated:1})
db.getCollection('changes').createIndex({status:1, project:1, branch:1, 'owner._account_id':1, updated:1})
db.getCollection('changes').createIndex({project:1, branch:1, updated:1})
db.getCollection('changes').createIndex({status:1, 'owner._account_id': 1, updated:1})
db.getCollection('changes').createIndex({branch:1, 'owner._account_id': 1, updated:1})
db.getCollection('changes').createIndex({status:1, branch:1, 'owner._account_id': 1, updated:1})

db.getCollection('changes').createIndex({status:1, "labels.Code-Review.all._account_id": 1, updated:1})

db.getCollection('changes').createIndex({status:1, 'reviewers.REVIEWER._account_id': 1, files_list:1, updated:1})
db.getCollection('changes').createIndex({'owner._account_id':1, 'reviewers.REVIEWER._account_id': 1})
db.getCollection('changes').createIndex({status:1,updated:1, 'owner._account_id':1, 'reviewers.REVIEWER._account_id': 1})





db.getCollection('changes').createIndex({_number: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, _number: 1, updated: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, _number: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, _number: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, 'owner._account_id': 1, _number: 1,  updated: 1})
db.getCollection('changes').createIndex({project: 1, _number: 1})
db.getCollection('changes').createIndex({status: 1, project: 1, _number: 1, updated: 1})
db.getCollection('changes').createIndex({project: 1, 'owner._account_id': 1, _number: 1, })




db.getCollection('changes').createIndex({_number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, _number: 1, created: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, 'owner._account_id': 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({project: 1, _number: 1, created: 1})
db.getCollection('changes').createIndex({status: 1, project: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({project: 1, 'owner._account_id': 1, _number: 1, created: 1})
db.getCollection('changes').createIndex({project: 1, 'owner._account_id': 1, status: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, files_list: 1, _number: 1,  created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1,'owner._account_id': 1, files_list: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, 'reviewers.REVIEWER._account_id': 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, "messages_per_account_before_close.account": 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({"messages_per_account_before_close.account": 1})
db.getCollection('changes').createIndex({status: 1, branch: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({branch: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({branch: 1, 'owner._account_id': 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, branch: 1, 'owner._account_id': 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({project: 1, _number: 1, created: 1})
db.getCollection('changes').createIndex({branch: 1, _number: 1, created: 1})
db.getCollection('changes').createIndex({status: 1, 'reviewers.REVIEWER._account_id': 1, files_list: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, 'owner._account_id': 1, 'reviewers.REVIEWER._account_id': 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, 'reviewers.REVIEWER._account_id': 1})


db.getCollection('changes').createIndex({status: 1, branch: 1, 'owner._account_id': 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({project: 1, branch: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, project: 1, branch: 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({project: 1, branch: 1, 'owner._account_id': 1, _number: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, project: 1, branch: 1, 'owner._account_id': 1, _number: 1, created: 1, updated: 1})

db.getCollection('changes').createIndex({status: 1, _number: 1, avg_build_time: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, project: 1, _number: 1,  avg_build_time: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, project: 1, branch: 1, _number: 1,  avg_build_time: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, branch: 1, _number: 1,  avg_build_time: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, 'owner._account_id': 1, _number: 1,  avg_build_time: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, project: 1, branch: 1, 'owner._account_id': 1, _number: 1, avg_build_time: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, files_list: 1, _number: 1,  avg_build_time: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, extensions_list: 1, _number: 1,  avg_build_time: 1, created: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, base_directories: 1, _number: 1,  avg_build_time: 1, created: 1, updated: 1})

db.getCollection('changes').createIndex({"owner._account_id": 1, _number: 1, created: 1})
db.getCollection('changes').createIndex({"messages.author._account_id": 1, _number: 1, created: 1, "messages.date":1})
db.getCollection('changes').createIndex({"labels.Code-Review.all._account_id": 1, _number: 1, created: 1,  updated:1})





db.getCollection('changes').createIndex({_number: 1, updated: -1})
db.getCollection('changes').createIndex({_number: 1, updated: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({_number: -1, updated: -1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({_number: 1, updated: 1, 'owner._account_id': 1, status: 1, project: 1})
db.getCollection('changes').createIndex({_number: -1, updated: -1, 'owner._account_id': 1, status: 1, project: 1})
db.getCollection('changes').createIndex({_number: 1, updated: 1, status: 1})
db.getCollection('changes').createIndex({_number: -1, updated: -1, status: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, _number: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, _number: -1})
db.getCollection('changes').createIndex({'owner._account_id': 1, status: 1, _number: 1, updated: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, status: 1, _number: -1, updated: -1})
db.getCollection('changes').createIndex({'owner._account_id': 1, project: 1, _number: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, project: 1, _number: -1})
db.getCollection('changes').createIndex({project: 1})
db.getCollection('changes').createIndex({project: 1, created: 1})
db.getCollection('changes').createIndex({project: 1, created: -1})
db.getCollection('changes').createIndex({project: 1, _number: 1})
db.getCollection('changes').createIndex({project: 1, _number: -1})
db.getCollection('changes').createIndex({project: 1, status: 1, _number: 1, updated: 1})
db.getCollection('changes').createIndex({project: 1, status: 1, _number: -1, updated: -1})
db.getCollection('changes').createIndex({updated: 1})
db.getCollection('changes').createIndex({updated: -1})
db.getCollection('changes').createIndex({updated: -1, _number: -1})
db.getCollection('changes').createIndex({files_list: 1})
db.getCollection('changes').createIndex({files_list: 1, updated: -1, _number: -1})
db.getCollection('changes').createIndex({files_list: 1, updated: -1, _number: -1, status: 1})
db.getCollection('changes').createIndex({files_list: 1, updated: -1, _number: -1, 'owner._account_id': 1, status: 1})
db.getCollection('changes').createIndex({status: 1, _number: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, _number: -1, updated: -1})
db.getCollection('changes').createIndex({'reviewers.REVIEWER': 1})
db.getCollection('changes').createIndex({'reviewers.REVIEWER._account_id': 1})
db.getCollection('changes').createIndex({'reviewers.REVIEWER._account_id': 1, updated: -1, _number: -1})
db.getCollection('changes').createIndex({status: 1, _number: -1, branch: 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, branch: 1, updated: -1})
db.getCollection('changes').createIndex({status: 1, _number: -1, updated: -1, files_list: 1})
db.getCollection('changes').createIndex({
    status: 1,
    _number: -1,
    updated: -1,
    "owner._account_id": 1,
    "labels.Code-Review.all._account_id": 1,
    "labels.Code-Review.all.value": 1
}, {name: "autoreview"})
db.getCollection('changes').createIndex({
    "owner._account_id": 1,
    "labels.Code-Review.all._account_id": 1,
    "labels.Code-Review.all.value": 1
}, {name: "autoreviewIndex"})

db.getCollection('changes').createIndex({_number: 1, project: 1})
db.getCollection('changes').createIndex({_number: 1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({_number: 1, 'reviewers.REVIEWER._account_id': 1})
db.getCollection('changes').createIndex({_number: 1, branch: 1})
db.getCollection('changes').createIndex({_number: 1, branch: 1, updated: -1})
db.getCollection('changes').createIndex({_number: 1, branch: 1, updated: -1, status: 1})
db.getCollection('changes').createIndex({_number: -1, branch: 1, updated: -1, files_list: 1})
db.getCollection('changes').createIndex({_number: -1, branch: 1, updated: -1, files_list: 1, created: 1})
db.getCollection('changes').createIndex({_number: -1, branch: 1, updated: -1, files_list: 1, updated: 1})
db.getCollection('changes').createIndex({_number: -1, branch: 1, updated: -1, 'owner._account_id': 1})
db.getCollection('changes').createIndex({_number: -1, branch: 1, updated: -1, 'owner._account_id': 1, status: 1})
db.getCollection('changes').createIndex({_number: -1, branch: 1, updated: -1, files_list: 1, updated: 1})
db.getCollection('changes').createIndex({status: 1, _number: -1, updated: -1, created: 1})
db.getCollection('changes').createIndex({
    status: 1,
    _number: -1,
    updated: -1,
    is_self_review: 1,
    "owner._account_id": 1
})
db.getCollection('changes').createIndex({
    status: 1,
    _number: -1,
    updated: -1,
    is_a_cherry_pick: 1,
    "owner._account_id": 1
})
db.getCollection('changes').createIndex({status: 1, _number: -1, updated: -1, is_a_cherry_pick: 1, branch: 1})
db.getCollection('changes').createIndex({files_list: 1, updated: -1, _number: -1, status: 1})
db.getCollection('changes').createIndex({"owner._account_id": 1, updated: -1, _number: -1, status: 1})


db.getCollection('changes').createIndex({'messages_count_before_close': 1})
db.getCollection('changes').createIndex({'messages_per_account_before_close': 1})
db.getCollection('changes').createIndex({'messages_per_account_before_close.account': 1})
//db.getCollection('changes').createIndex({'messages.author._account_id': 1})
//db.getCollection('changes').createIndex({'messages.author._account_id': 1, number: -1, updated: -1})


db.getCollection('changes').createIndex({'messages': 1})
db.getCollection('changes').createIndex({'messages.author._account_id': 1})
db.getCollection('changes').createIndex({'messages.author._account_id': 1, number: -1, updated: -1})


db.getCollection('changes').createIndex({_number: -1})
db.getCollection('changes').createIndex({created: -1})
db.getCollection('changes').createIndex({updated: -1})
db.getCollection('changes').createIndex({_number: 1, created: -1})
db.getCollection('changes').createIndex({_number: -1, created: -1})
db.getCollection('changes').createIndex({_number: -1, created: 1})


///////////////

db.getCollection('changes').createIndex({id: 1})
db.getCollection('changes').createIndex({change_id: 1})
db.getCollection('changes').createIndex({_number: 1})
db.getCollection('changes').createIndex({status: 1})
db.getCollection('changes').createIndex({updated: 1})
db.getCollection('changes').createIndex({created: 1})
db.getCollection('changes').createIndex({project: 1})
db.getCollection('changes').createIndex({branch: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1})
db.getCollection('changes').createIndex({opb: 1})
db.getCollection('changes').createIndex({opb_closed: 1})

db.getCollection('changes').createIndex({updated_date: 1})
db.getCollection('changes').createIndex({created_date: 1})
db.getCollection('changes').createIndex({closed:1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, updated_date: 1})

db.getCollection('changes').createIndex({closed:1, project: 1, updated_date: 1})
db.getCollection('changes').createIndex({closed:1, branch: 1, updated_date: 1})
db.getCollection('changes').createIndex({closed:1, 'owner._account_id': 1, updated_date: 1})

db.getCollection('changes').createIndex({closed:1, project: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, branch: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, 'owner._account_id': 1, created_date: 1})

db.getCollection('changes').createIndex({closed:1, updated_date: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, project: 1, updated_date: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, branch: 1, updated_date: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, 'owner._account_id': 1, updated_date: 1, created_date: 1})

db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, updated_date: 1, closed: 1})
db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, updated_date: 1, created_date: 1, closed: 1})

db.getCollection('changes').createIndex({extensions_list: 1, is_built:1, closed: 1, updated_date: 1, updated_date: 1})



///////////////:

db.getCollection('changes').createIndex({id: 1})
db.getCollection('changes').createIndex({change_id: 1})
db.getCollection('changes').createIndex({_number: 1})
db.getCollection('changes').createIndex({status: 1})
db.getCollection('changes').createIndex({updated: 1})
db.getCollection('changes').createIndex({created: 1})
db.getCollection('changes').createIndex({project: 1})
db.getCollection('changes').createIndex({branch: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1})
db.getCollection('changes').createIndex({opb: 1})
db.getCollection('changes').createIndex({opb_closed: 1})

db.getCollection('changes').createIndex({updated_date: 1})
db.getCollection('changes').createIndex({created_date: 1})
db.getCollection('changes').createIndex({closed:1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, updated_date: 1})

db.getCollection('changes').createIndex({project: 1, updated_date: 1})
db.getCollection('changes').createIndex({branch: 1, updated_date: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, updated_date: 1})

db.getCollection('changes').createIndex({closed:1, project: 1, updated_date: 1})
db.getCollection('changes').createIndex({closed:1, branch: 1, updated_date: 1})
db.getCollection('changes').createIndex({closed:1, 'owner._account_id': 1, updated_date: 1})

db.getCollection('changes').createIndex({closed:1, project: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, branch: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, 'owner._account_id': 1, created_date: 1})

db.getCollection('changes').createIndex({extensions_list: 1, is_built:1, closed: 1, updated_date: 1, updated_date: 1})
db.getCollection('changes').createIndex({project: 1, updated_date: 1})
db.getCollection('changes').createIndex({branch: 1, updated_date: 1})
db.getCollection('changes').createIndex({'owner._account_id': 1, updated_date: 1})

db.getCollection('changes').createIndex({updated_date: 1, project: 1})
db.getCollection('changes').createIndex({updated_date: 1, branch: 1})
db.getCollection('changes').createIndex({updated_date: 1, 'owner._account_id': 1})

db.getCollection('changes').createIndex({closed:1, updated_date: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, project: 1, updated_date: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, branch: 1, updated_date: 1, created_date: 1})
db.getCollection('changes').createIndex({closed:1, 'owner._account_id': 1, updated_date: 1, created_date: 1})

db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, updated_date: 1, closed: 1})
db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, updated_date: 1, created_date: 1, closed: 1})

db.getCollection('changes').createIndex({extensions_list: 1, is_built:1, closed: 1, updated_date: 1})

db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, files_list: 1, updated_date: 1})
db.getCollection('changes').createIndex({files_list: 1, date_updated_date_created_diff: 1, updated_date: 1})
db.getCollection('changes').createIndex({'owner._account_id':1, files_list: 1, date_updated_date_created_diff: 1, updated_date: 1})

db.getCollection('changes').createIndex({avg_build_time_before_close: 1, files_list: 1, updated_date: 1})
db.getCollection('changes').createIndex({avg_time_revision_before_close: 1, files_list: 1, updated_date: 1})
db.getCollection('changes').createIndex({files_list: 1, avg_build_time_before_close: 1, updated_date: 1})
db.getCollection('changes').createIndex({files_list: 1, avg_time_revision_before_close: 1, updated_date: 1})

db.getCollection('changes').createIndex({date_updated_date_created_diff: 1, opb: 1, updated_date: 1})
db.getCollection('changes').createIndex({messages_count_before_close: 1, opb: 1, updated_date: 1})
db.getCollection('changes').createIndex({avg_time_between_msg_before_close: 1, opb: 1, updated_date: 1})
db.getCollection('changes').createIndex({avg_time_revision_before_close: 1, opb: 1, updated_date: 1})
db.getCollection('changes').createIndex({revisions_num: 1, opb: 1, updated_date: 1})