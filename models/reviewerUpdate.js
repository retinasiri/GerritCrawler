var mongoose = require('mongoose');
var Account = require('./account').schema;
var Schema = mongoose.Schema;

var ReviewerUpdateSchema = new Schema({
    updated: String,
    state: String,
    updated_by: {type: Account},
    reviewer: {type: Account}
}, {
    versionKey: false
});

module.exports = mongoose.model('ReviewerUpdate', ReviewerUpdateSchema);