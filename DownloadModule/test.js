const Axios = require('axios');

let apiEndpoint = "https://android-review.googlesource.com/changes/?q=status:merged+project:platform/system/bt&n=5&o=DETAILED_LABELS&o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=DETAILED_ACCOUNTS&o=MESSAGES&o=DOWNLOAD_COMMANDS&o=WEB_LINKS&o=CHANGE_ACTIONS&o=REVIEWED&o=REVIEWER_UPDATES&o=COMMIT_FOOTERS&S=10500"

Axios.get(apiEndpoint)
    .then(response => {
        console.log(response)
    })
    .catch(function (err) {
        if (err.response) {
            //console.log(err.response.data);
            console.log(err.response.status);
            //console.log(err.response.headers);
        }
    });