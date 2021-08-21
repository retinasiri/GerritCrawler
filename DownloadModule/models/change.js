var mongoose = require('mongoose');
var Account = require('./account').schema;
var Message = require('./message').schema;
var Label = require('./label').schema;
var ReviewerUpdate = require('./reviewerUpdate').schema;
var Schema = mongoose.Schema;

var ChangeSchema = new Schema({
    id: String,
    project: String,
    branch: String,
    topic: String,
    change_id: String,
    subject: String,
    status: String,
    created: String,
    updated: String,
    submit_type: String,
    mergeable: Boolean,
    insertions: Number,
    deletions: Number,
    total_comment_count: Number,
    unresolved_comment_count: Number,
    has_review_started: Boolean,
    _number: Number,
    owner: {type: Account},
    submitter: {type: Account},
    hashtags: [],
    attention_set: [{}],
    labels: {
        _id: false,
        type: Label
    },
    removable_reviewers: [{
        _id: false,
        type: Account
    }],
    reviewers: {
        REVIEWER: [{
            _id: false,
            type: Account
        }]
    },
    pending_reviewers: {},
    reviewer_updates: [{
        _id: false,
        type: ReviewerUpdate
    }],
    messages: [{
        _id: false,
        type: Message
    }],
    /*messages: [{
        //_id: false,
        type: { type: Schema.Types.ObjectId, ref: 'Message' }
    }],*/
    requirements: [],
    current_revision: String,
    revisions: {},
    _more_changes: Boolean,
    files_list: []
}, {
    versionKey: false,
    strict: false
});

module.exports = mongoose.model('Change', ChangeSchema);;

