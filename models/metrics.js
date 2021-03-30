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
    days_of_the_weeks_of_date_created: Number,
    committer_timezone: Number,
    created_date_is_weekend: Number,

    subject_length: Number,
    subject_word_count: Number,
    msg_length: Number,
    msg_word_count: Number,
    has_bug: Number,
    has_feature: Number,
    has_improve: Number,
    has_document: Number,
    has_refactor: Number,
    is_corrective: Number,
    is_merge: Number,
    is_non_fonctional: Number,
    is_perfective: Number,
    is_refactoring: Number,

    lines_added: String,
    lines_deleted: String,

    num_files: Number,
    num_files_type: Number,
    num_directory: Number,
    num_file_added: String,
    num_file_deleted:String,
    num_subsystem: Number,
    is_a_bot: Boolean,
    num_binary_file: Number,
    num_language: Number,
    modify_entropy: Number,
    num_segs_added: Number,
    num_segs_deleted: Number,
    num_segs_updated: Number,
    moy_changes_files_modified: Number,
    moy_changes_files_modified_time: Number,

    file_developer_num: Number,
    file_developer_experience: Number,
    num_subsystem_author: Number,
    change_num: Number,
    recent_change_num: Number,
    subsystem_change_num: Number,
    review_num: Number,
    num_merged: Number,
    merged_ratio: Number,
    subsystem_merged:Number,
    recent_merged_ratio: Number,
    subsystem_merged_ratio:Number,

    moy_time_owner_pass_on_change_files:Number,
    moy_number_of_time_reviewer_review_the_files:Number,
    moy_time_reviewer_pass_on_this_files:Number,

    num_human_reviewer:Number,
    num_revisions:Number,

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