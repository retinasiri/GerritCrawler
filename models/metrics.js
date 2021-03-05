var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MetricsSchema = new Schema({
    n: String,
    number: String,
    id: String,
    change_id: String,
    date_created: String,
    date_updated: String,
    date_submitted: String,
    date_created_time: Number,
    date_updated_time: Number,
    date_submitted_time: Number,
    lines_added: String,
    lines_deleted: String,
    subject_length: Number,
    subject_word_count: Number,

    num_files: Number,
    num_files_type: Number,
    num_directory: Number,
    num_file_added: String,
    num_file_deleted:String,
    num_subsystem: Number,
    is_a_bot: Boolean,
    modify_entropy: Number,
    num_language: Number,
    num_binary_file: Number,
    num_segs_added: Number,
    num_segs_deleted: Number,
    num_segs_updated: Number,
    changes_files_modified: Number,
    num_subsystem_author: Number,

    file_developer_num: Number,
    change_num: Number,
    recent_change_num: Number,
    subsystem_change_num: Number,
    review_num: Number,
    merged_ratio: Number,
    recent_merged_ratio: Number,
    subsystem_merged_ratio:Number,

    msg_length: Number,
    has_bug: Number,
    has_feature: Number,
    has_improve: Number,
    has_document: Number,
    has_refactor: Number,

    degree_centrality: Number,
    closeness_centrality: Number,
    betweenness_centrality: Number,
    eigenvector_centrality: Number,
    clustering_coefficient: Number,
    k_coreness : Number,

    diff_created_updated: Number,
    diff_created_updated_in_days: Number,

}, {
    versionKey: false
});

const Metric = mongoose.model('Metric', MetricsSchema)
//Account.createIndexes();

module.exports = Metric;