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
//let query = "&o=DETAILED_LABELS&o=ALL_REVISIONS&o=CURRENT_COMMIT&o=ALL_FILES&o=DETAILED_ACCOUNTS&o=REVIEWER_UPDATES&o=MESSAGES";
let query = "&o=DETAILED_LABELS&o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=DETAILED_ACCOUNTS&o=REVIEWER_UPDATES&o=MESSAGES";

function getProjectsUrl(url){
    return new URL(url + projectsEndpoint);
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

function startAt(url, start){
    return url + + "&" + pagingQuery + start;
}

function getOpenChangeUrl(url){
    return url + changeEndpoint + queryBuilder + openChangeQuery + query;
}

function getAbandonedChangeUrl(url){
    return url + changeEndpoint + queryBuilder + abandonedChangeQuery + query;
}

function getMergedChangeUrl(url){
    return url + changeEndpoint + queryBuilder + mergedChangeQuery + query;
}

function getOpenChangeUrl(url, start){
    return new URL(url + changeEndpoint + queryBuilder + openChangeQuery + query + "&" + pagingQuery + start);
}

function getAbandonedChangeUrl(url, start){
    return new URL(url + changeEndpoint + queryBuilder + abandonedChangeQuery + query + "&" + pagingQuery + start);
}

function getMergedChangeUrl(url, start){
    //console.log("mergedUrl : " + mergedUrl)
    return new URL(url + changeEndpoint + queryBuilder + mergedChangeQuery + query + "&" + pagingQuery + start);
}

URL.prototype.startAt = function (start) {
    this.searchParams.set('S', start);
    return this;
};

URL.prototype.getStartValue = function () {
    //return this + "&" + pagingQuery + start;
    return this.searchParams.get('S');
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
    getChangesUrl: getChangesUrl,
    getChangeDetailsUrl: getChangeDetailsUrl,
    getAccountsDetail: getAccountsDetail,
    getOpenChangeUrl: getOpenChangeUrl,
    getMergedChangeUrl: getMergedChangeUrl,
    getAbandonedChangeUrl: getAbandonedChangeUrl,
    startAt: URL.prototype.startAt,
    getStartValue: URL.prototype.getStartValue
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


