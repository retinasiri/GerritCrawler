var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LabelSchema = new Schema({
    Verified: {
        approved: {},
        all: {},
        values: {}
    },
    Code_Review: {},
    Sanity_Review: {}
}, {
    versionKey: false
});

module.exports = mongoose.model('Label', LabelSchema);