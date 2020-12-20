let libreOfficeUrl = 'https://gerrit.libreoffice.org/';
let qtUrl = 'https://codereview.qt-project.org/';
let openStackUrl = 'https://review.opendev.org/';
let androidUrl = 'https://android-review.googlesource.com/';

//Endpoints
let projectsEndpoint = "projects/";
let changeEndpoint = "changes/";
let accountsEndpoint = "accounts/";
let detailEndpoint = "/detail";

function getProjectsUrl(url){
    return url + projectsEndpoint;
}

function getChangesUrl(url){
    return url + changeEndpoint;
}

function getChangeDetailsUrl(url, id){
    return url + changeEndpoint + id + detailEndpoint;
}

function getAccountsDetail(url, id){
    return url + accountsEndpoint + id;
}

module.exports = {
    libreOfficeApiUrl: libreOfficeUrl,
    qtApiUrl: qtUrl,
    openstackApiUrl: openStackUrl,
    androidApiUrl: androidUrl,
    getProjectsUrl: getProjectsUrl,
    getChangesUrl: getChangesUrl,
    getChangeDetailsUrl: getChangeDetailsUrl,
    getAccountsDetail: getAccountsDetail
};