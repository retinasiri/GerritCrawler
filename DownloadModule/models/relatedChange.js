var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var relatedChangeSchema = new Schema({
    id: String,
    revision_id: String,
    changes:[],
}, {
    versionKey: false,
    strict: false
});

module.exports = mongoose.model('Related_change', relatedChangeSchema);
