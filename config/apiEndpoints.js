let libreOfficeUrl = 'https://gerrit.libreoffice.org/';
let qtUrl = 'https://codereview.qt-project.org/';
let openStackUrl = 'https://review.opendev.org/';
let androidUrl = 'https://android-review.googlesource.com/';

//Endpoints
let projectsEndpoint = "projects/";
let changeEndpoint = "changes/";
let accountsEndpoint = "accounts/";
let detailEndpoint = "/detail";

//query params
let paging = "?S="
let pagingQuery = "S="

//Query
let queryBuilder = "?q="
let openChangeQuery = "status:open";
let abandonedChangeQuery = "status:abandoned";
let mergedChangeQuery = "status:merged" ;
let query = "";


function getProjectsUrl(url){
    return url + projectsEndpoint;
}

function getChangesUrl(url){
    return url + changeEndpoint;
}

function getChangesUrl(url, start){
    return url + changeEndpoint + paging + start;
}

function getChangeDetailsUrl(url, id){
    return url + changeEndpoint + id + detailEndpoint;
}

function getAccountsDetail(url, id){
    return url + accountsEndpoint + id;
}

function getOpenChangeUrl(url, start){
    return url + changeEndpoint + queryBuilder + openChangeQuery + "&" + pagingQuery + start;
}

function getAbandonedChangeUrl(url, start){
    return url + changeEndpoint + queryBuilder + abandonedChangeQuery + "&" + pagingQuery + start;
}

function getMergedChangeUrl(url, start){
    let mergedUrl = url + changeEndpoint + queryBuilder + mergedChangeQuery + "&" + pagingQuery + start;
    //console.log("mergedUrl : " + mergedUrl)
    return mergedUrl;
}

module.exports = {
    libreOfficeApiUrl: libreOfficeUrl,
    qtApiUrl: qtUrl,
    openstackApiUrl: openStackUrl,
    androidApiUrl: androidUrl,
    getProjectsUrl: getProjectsUrl,
    getChangesUrl: getChangesUrl,
    getChangeDetailsUrl: getChangeDetailsUrl,
    getAccountsDetail: getAccountsDetail,
    getOpenChangeUrl: getOpenChangeUrl,
    getAbandonedChangeUrl: getAbandonedChangeUrl,
    getMergedChangeUrl: getMergedChangeUrl
};