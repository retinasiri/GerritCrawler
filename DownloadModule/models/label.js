var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LabelSchema = new Schema({
    Verified: {
        approved: {},
        all: {},
        values: {}
    },
    "Code-Review": {},
    Sanity_Review: {}
}, {
    versionKey: false,
    strict: false
});

module.exports = mongoose.model('Label', LabelSchema);