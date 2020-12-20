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
    hashtags: [],
    attention_set: [{
        _id: false,
        account: {type: Account},
        last_update: String,
        reason: String
    }],
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
    requirements: []
}, {
    versionKey: false
});

module.exports = mongoose.model('ChangeDetail', ChangeSchema);