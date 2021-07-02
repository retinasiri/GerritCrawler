var mongoose = require('mongoose');
var Account = require('./account').schema;
var Schema = mongoose.Schema;

var ChangeLiteSchema = new Schema({
    _id : { type : String, required : true },
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
    _number: Number,
    owner: {type: Account},
    owner_id: Number,
}, {
    versionKey: false,
    strict: false
});

module.exports = mongoose.model('ChangeLite', ChangeLiteSchema);