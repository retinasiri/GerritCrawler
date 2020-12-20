var mongoose = require('mongoose');
var Account = require('./account').schema;
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
    owner: {type: Account}
}, {
    versionKey: false
});

module.exports = mongoose.model('Change', ChangeSchema);