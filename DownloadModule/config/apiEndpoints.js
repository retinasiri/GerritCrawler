const Config = require('../config.json')

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
let mergedChangeQuery = "status:merged";
//let query = "&o=DETAILED_LABELS&o=ALL_REVISIONS&o=CURRENT_COMMIT&o=ALL_FILES&o=DETAILED_ACCOUNTS&o=REVIEWER_UPDATES&o=MESSAGES";
//let query = "&o=DETAILED_LABELS&o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=DETAILED_ACCOUNTS&o=REVIEWER_UPDATES&o=MESSAGES&o=DOWNLOAD_COMMANDS";
//let query = "&o=DETAILED_LABELS&o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=DETAILED_ACCOUNTS" +
//"&o=REVIEWER_UPDATES&o=MESSAGES&o=DOWNLOAD_COMMANDS&o=WEB_LINKS"
//"&o=CHANGE_ACTIONS&o=REVIEWED&o=SUBMITTABLE&o=CHECK&o=COMMIT_FOOTERS&o=TRACKING_IDS";
//&o=REVIEWER_UPDATES&o=COMMIT_FOOTERS
//&o=REVIEWER_UPDATES&o=COMMIT_FOOTERS

let query_params = "&o=DETAILED_LABELS&o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=DETAILED_ACCOUNTS" +
    "&o=MESSAGES&o=DOWNLOAD_COMMANDS&o=WEB_LINKS&o=CHANGE_ACTIONS&o=REVIEWER_UPDATES&o=COMMIT_FOOTERS"

//"&o=DETAILED_LABELS&o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=DETAILED_ACCOUNTS" +
//"&o=MESSAGES&o=DOWNLOAD_COMMANDS&o=WEB_LINKS&o=CHANGE_ACTIONS"

function getProjectApi(projectName) {
    return Config.project[projectName]["api_url"];
}

function getProjectsUrl(url) {
    return new URL(url + projectsEndpoint);
}

function getProjectsUrlHref(url) {
    return url + projectsEndpoint;
}

/*function getChangesUrl(url){
    return url + changeEndpoint;
}*/

function getChangesUrl(url, start) {
    return url + changeEndpoint + paging + start;
}

function getChangeDetailsUrl(url, id) {
    return url + changeEndpoint + id + detailEndpoint;
}

function getAccountsDetail(url, id) {
    return url + accountsEndpoint + id;
}

function startAt(url, start) {
    return url + +"&" + pagingQuery + start;
}

/*
function getOpenChangeUrl(url) {
    return url + changeEndpoint + queryBuilder + openChangeQuery + query_params;
}

function getAbandonedChangeUrl(url) {
    return url + changeEndpoint + queryBuilder + abandonedChangeQuery + query_params;
}

function getMergedChangeUrl(url) {
    return url + changeEndpoint + queryBuilder + mergedChangeQuery + query_params;
}

function getOpenChangeUrl(url, start) {
    return new URL(url + changeEndpoint + queryBuilder + openChangeQuery + query_params + "&" + pagingQuery + start);
}

function getAbandonedChangeUrl(url, start) {
    return new URL(url + changeEndpoint + queryBuilder + abandonedChangeQuery + query_params + "&" + pagingQuery + start);
}

function getMergedChangeUrl(url, start) {
    //console.log("mergedUrl : " + mergedUrl)
    return new URL(url + changeEndpoint + queryBuilder + mergedChangeQuery + query_params + "&" + pagingQuery + start);
}
*/

function getTypeChangeUrl(url, start, query, project = ""){
    if (!project || project.length === 0)
        return new URL(url + changeEndpoint + queryBuilder + query + query_params + "&" + pagingQuery + start);
    else
        return new URL(url + changeEndpoint + queryBuilder + query + '+' + getProjectString(project) + query_params + "&" + pagingQuery + start);
}

function getOpenChangeUrl(url, start, project = "") {
    return getTypeChangeUrl(url, start, openChangeQuery, project)
}

function getAbandonedChangeUrl(url, start, project = "") {
    return getTypeChangeUrl(url, start, abandonedChangeQuery, project)
}

function getMergedChangeUrl(url, start, project = "") {
    return getTypeChangeUrl(url, start, mergedChangeQuery, project)
}

//+encodeURIComponent(password)
function getProjectString(project) {
    return 'project:' + encodeURIComponent(project)
}

function getProjectName(url) {
    return (url.hostname.split("."))[1]
}

URL.prototype.startAt = function (start) {
    this.searchParams.set('S', start);
    return this;
};

URL.prototype.getStartValue = function () {
    //return this + "&" + pagingQuery + start;
    return this.searchParams.get('S');
};

URL.prototype.numChanges = function (number) {
    this.searchParams.set('n', number);
    return this;
};

URL.prototype.getNumChanges = function () {
    //return this + "&" + pagingQuery + start;
    return this.searchParams.get('n');
};

module.exports = {
    libreOfficeApiUrl: libreOfficeUrl,
    qtApiUrl: qtUrl,
    openstackApiUrl: openStackUrl,
    androidApiUrl: androidUrl,
    openChangeQuery: openChangeQuery,
    mergedChangeQuery: mergedChangeQuery,
    abandonedChangeQuery: abandonedChangeQuery,
    getProjectsUrl: getProjectsUrl,
    getProjectsUrlHref: getProjectsUrlHref,
    getChangesUrl: getChangesUrl,
    getChangeDetailsUrl: getChangeDetailsUrl,
    getAccountsDetail: getAccountsDetail,
    getOpenChangeUrl: getOpenChangeUrl,
    getMergedChangeUrl: getMergedChangeUrl,
    getAbandonedChangeUrl: getAbandonedChangeUrl,
    startAt: URL.prototype.startAt,
    getStartValue: URL.prototype.getStartValue,
    numChanges: URL.prototype.numChanges,
    getNumChanges: URL.prototype.getNumChanges,
    getProjectApi: getProjectApi
};

/*

const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// Prints 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// Prints https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);

//console.log("basicChangesUrl : " + basicChangesUrl);
basicChangesUrl = "https://codereview.qt-project.org/changes/?abc=123&q=status:open&o=DETAILED_LABELS&o=ALL_REVISIONS&o=CURRENT_COMMIT&o=ALL_FILES&o=DETAILED_ACCOUNTS&o=REVIEWER_UPDATES&o=MESSAGES&S=0";
//const url1 = new URL("https://codereview.qt-project.org/changes/?abc=123&q=status:open&o=DETAILED_LABELS&o=ALL_REVISIONS&o=CURRENT_COMMIT&o=ALL_FILES&o=DETAILED_ACCOUNTS&o=REVIEWER_UPDATES&o=MESSAGES&S=0");
const url1 = new URL(basicChangesUrl);
console.log(url1.searchParams.get('S'));
url1.searchParams.set('S', '5000')
console.log(url1.href);
*/


