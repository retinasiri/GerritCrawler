var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    id: String,
    state: String,
    web_links:[{
        _id: false,
        name: String,
        url:String,
        target:String
    }]
}, {
    versionKey: false
});

const Project = mongoose.model('Project', ProjectSchema);
//Project.createIndexes();
module.exports = Project;