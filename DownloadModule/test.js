const Axios = require('axios');
const Moment = require('moment');
const MathJs = require('mathjs');
const MetricsUtils = require('./compute_metrics/metrics-utils');

//let apiEndpoint = "https://android-review.googlesource.com/changes/?q=status:merged+project:platform/system/bt&n=5&o=DETAILED_LABELS&o=ALL_REVISIONS&o=ALL_COMMITS&o=ALL_FILES&o=DETAILED_ACCOUNTS&o=MESSAGES&o=DOWNLOAD_COMMANDS&o=WEB_LINKS&o=CHANGE_ACTIONS&o=REVIEWED&o=REVIEWER_UPDATES&o=COMMIT_FOOTERS&S=10500"

/*Axios.get(apiEndpoint)
    .then(response => {
        console.log(response)
    })
    .catch(function (err) {
        if (err.response) {
            //console.log(err.response.data);
            console.log(err.response.status);
            //console.log(err.response.headers);
        }
    });*/

let projectName = 'qt'

let json2 = [{
    "id": "device%2Famlogic%2Fyukawa~master~I680279b1081e5654c84dd794215774c5df8dbcb4",
    "project": "device/amlogic/yukawa",
    "branch": "master",
    "topic": "use cec_device_types property",
    "attention_set": {
        "1585075": {
            "account": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "last_update": "2020-10-27 16:18:16.000000000",
            "reason": "A robot voted negatively on a label"
        }
    },
    "hashtags": [],
    "change_id": "I680279b1081e5654c84dd794215774c5df8dbcb4",
    "subject": "Set cec_device_types property",
    "status": "NEW",
    "created": "2020-05-14 10:29:51.000000000",
    "updated": "2020-10-28 22:26:08.000000000",
    "submit_type": "MERGE_IF_NECESSARY",
    "insertions": 1,
    "deletions": 0,
    "total_comment_count": 3,
    "unresolved_comment_count": 0,
    "has_review_started": true,
    "meta_rev_id": "e8599dcfdda2afb0483ffcd5a799892229b8f5d4",
    "_number": 1311573,
    "owner": {
        "_account_id": 1585075,
        "name": "Tarundeep Singh",
        "email": "tarundeep.singh@ittiam.com",
        "avatars": [
            {
                "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                "height": 32
            },
            {
                "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                "height": 56
            },
            {
                "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                "height": 100
            },
            {
                "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                "height": 120
            }
        ]
    },
    "actions": {},
    "labels": {
        "Verified": {
            "all": [
                {
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                "-2": "Build failure",
                "-1": "Build success (tests failing)",
                " 0": "No score",
                "+1": "Build success (untested)",
                "+2": "Tests passing"
            },
            "default_value": 0,
            "optional": true
        },
        "Code-Review": {
            "all": [
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 2,
                    "date": "2020-06-25 18:31:34.000000000",
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 1,
                    "date": "2020-06-25 18:57:50.000000000",
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                "-2": "Do not submit",
                "-1": "I would prefer that you didn't submit this",
                " 0": "No score",
                "+1": "Looks good to me, but someone else must approve",
                "+2": "Looks good to me, approved"
            },
            "default_value": 0
        },
        "Open-Source-Licensing": {
            "all": [
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                "-2": "Super block.",
                "-1": "Submit blocked but can be overriden with two +2 votes.",
                " 0": "Submit okay unless there are negative votes.",
                "+1": "Looks good to me. Does not override -1.",
                "+2": "LGTM, overriding -1 when there are two +2 votes."
            },
            "default_value": 0,
            "optional": true
        },
        "Lint": {
            "all": [
                {
                    "tag": "autogenerated:AyeAye:Comment",
                    "value": 1,
                    "date": "2020-10-20 01:16:37.000000000",
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 2
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 2
                    },
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 2
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 2
                    },
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                "-2": "Super block.",
                "-1": "Blocked unless +2 bypass.",
                " 0": "Not Run.",
                "+1": "Passing.",
                "+2": "Bypass lint."
            },
            "default_value": 0,
            "optional": true
        },
        "Global-Approval": {
            "all": [
                {
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                " 0": "No score",
                "+1": "Approved"
            },
            "default_value": 0,
            "optional": true
        },
        "Exempt": {
            "all": [
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                " 0": "Not exempted.",
                "+1": "Exempted."
            },
            "default_value": 0,
            "optional": true
        },
        "Autosubmit": {
            "all": [
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 1,
                    "date": "2020-06-25 18:31:34.000000000",
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                " 0": "Do not submit automatically",
                "+1": "Submit automatically"
            },
            "default_value": 0,
            "optional": true
        },
        "Presubmit-Ready": {
            "all": [
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "date": "2020-07-08 00:53:00.000000000",
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                " 0": "Not Ready",
                "+1": "Ready"
            },
            "default_value": 0,
            "optional": true
        },
        "Presubmit-Verified": {
            "all": [
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "tag": "autogenerated:TreeHugger:Verify-Fail",
                    "value": -1,
                    "date": "2020-10-28 22:17:58.000000000",
                    "permitted_voting_range": {
                        "min": -2,
                        "max": 2
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                "-2": "Fails",
                "-1": "Failing",
                " 0": "Not tested",
                "+1": "Passing",
                "+2": "Passes"
            },
            "default_value": 0
        },
        "Bypass-Presubmit": {
            "all": [
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 2
                    },
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                " 0": "Not bypass",
                "+1": "Bypassing",
                "+2": "Bypass"
            },
            "default_value": 0,
            "optional": true
        },
        "Presubmit-Verified-Together": {
            "all": [
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                "-1": "Fails",
                " 0": "Not tested",
                "+1": "Passes"
            },
            "default_value": 0,
            "optional": true
        },
        "Build-Cop-Override": {
            "all": [
                {
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1060286,
                    "name": "nchalko",
                    "email": "nchalko@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "_account_id": 1047003,
                    "name": "Harish Mahendrakar",
                    "email": "harish.mahendrakar@ittiam.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "permitted_voting_range": {
                        "min": -1,
                        "max": 1
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "_account_id": 1000414,
                    "name": "Dmitry Shmidt",
                    "email": "dimitrysh@google.com",
                    "avatars": [
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "values": {
                "-1": "Do not submit",
                " 0": "No score",
                "+1": "Build cop approved"
            },
            "default_value": 0,
            "optional": true
        }
    },
    "removable_reviewers": [],
    "reviewers": {
        "REVIEWER": [
            {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            {
                "_account_id": 1047003,
                "name": "Harish Mahendrakar",
                "email": "harish.mahendrakar@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            }
        ],
        "CC": [
            {
                "_account_id": 1068291,
                "name": "Venkatarama Avadhani",
                "email": "venkatarama.avadhani@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-xVmaQcjYci4/AAAAAAAAAAI/AAAAAAAAAAA/L2Vt-vBmDLs/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-xVmaQcjYci4/AAAAAAAAAAI/AAAAAAAAAAA/L2Vt-vBmDLs/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-xVmaQcjYci4/AAAAAAAAAAI/AAAAAAAAAAA/L2Vt-vBmDLs/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-xVmaQcjYci4/AAAAAAAAAAI/AAAAAAAAAAA/L2Vt-vBmDLs/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            {
                "_account_id": 1261213,
                "name": "Umang Saini",
                "email": "umang.saini@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-b2jMSRKtXC8/AAAAAAAAAAI/AAAAAAAAAAA/Vlfe_hKiwRY/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-b2jMSRKtXC8/AAAAAAAAAAI/AAAAAAAAAAA/Vlfe_hKiwRY/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-b2jMSRKtXC8/AAAAAAAAAAI/AAAAAAAAAAA/Vlfe_hKiwRY/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-b2jMSRKtXC8/AAAAAAAAAAI/AAAAAAAAAAA/Vlfe_hKiwRY/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            }
        ]
    },
    "pending_reviewers": {},
    "reviewer_updates": [
        {
            "updated": "2020-05-14 10:30:49.000000000",
            "updated_by": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "reviewer": {
                "_account_id": 1068291,
                "name": "Venkatarama Avadhani",
                "email": "venkatarama.avadhani@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-xVmaQcjYci4/AAAAAAAAAAI/AAAAAAAAAAA/L2Vt-vBmDLs/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-xVmaQcjYci4/AAAAAAAAAAI/AAAAAAAAAAA/L2Vt-vBmDLs/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-xVmaQcjYci4/AAAAAAAAAAI/AAAAAAAAAAA/L2Vt-vBmDLs/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-xVmaQcjYci4/AAAAAAAAAAI/AAAAAAAAAAA/L2Vt-vBmDLs/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "state": "CC"
        },
        {
            "updated": "2020-05-14 10:30:49.000000000",
            "updated_by": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "reviewer": {
                "_account_id": 1261213,
                "name": "Umang Saini",
                "email": "umang.saini@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-b2jMSRKtXC8/AAAAAAAAAAI/AAAAAAAAAAA/Vlfe_hKiwRY/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-b2jMSRKtXC8/AAAAAAAAAAI/AAAAAAAAAAA/Vlfe_hKiwRY/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-b2jMSRKtXC8/AAAAAAAAAAI/AAAAAAAAAAA/Vlfe_hKiwRY/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-b2jMSRKtXC8/AAAAAAAAAAI/AAAAAAAAAAA/Vlfe_hKiwRY/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "state": "CC"
        },
        {
            "updated": "2020-05-14 10:30:49.000000000",
            "updated_by": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "reviewer": {
                "_account_id": 1047003,
                "name": "Harish Mahendrakar",
                "email": "harish.mahendrakar@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-HsjrYZD5T-o/AAAAAAAAAAI/AAAAAAAAAAA/1Kz5Aq72b_U/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "state": "REVIEWER"
        },
        {
            "updated": "2020-05-14 10:30:49.000000000",
            "updated_by": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "reviewer": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "state": "REVIEWER"
        },
        {
            "updated": "2020-05-14 18:17:16.000000000",
            "updated_by": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "reviewer": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "state": "REVIEWER"
        },
        {
            "updated": "2020-06-25 18:50:53.000000000",
            "updated_by": {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "reviewer": {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "state": "CC"
        },
        {
            "updated": "2020-06-25 18:57:50.000000000",
            "updated_by": {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "reviewer": {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "state": "REVIEWER"
        },
        {
            "updated": "2020-10-20 01:16:37.000000000",
            "updated_by": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "reviewer": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "state": "REVIEWER"
        }
    ],
    "messages": [
        {
            "id": "76c84b59b97e4451280229651edd145810c94b8c",
            "tag": "autogenerated:gerrit:newPatchSet",
            "author": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-05-14 10:29:51.000000000",
            "message": "Uploaded patch set 1.",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "133cc750a91a6ad8577130946b44142179007729",
            "tag": "autogenerated:gerrit:setTopic",
            "author": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-05-14 10:30:26.000000000",
            "message": "Topic set to Add cec_device_types property",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "82454b4edae5033476ac6e0afa74f1b37ccda771",
            "author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-05-14 18:17:05.000000000",
            "message": "Patch Set 1: Code-Review+2",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "204dfc616d9077251b748d29757615f5a580f18a",
            "tag": "autogenerated:TreeHugger:Verify-Unmergeable-Fail",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-05-14 18:17:16.000000000",
            "message": "Patch Set 1: Presubmit-Verified-1\n\nThis change, or one of the changes it depends on, has a merge conflict. Please rebase your changes and fix any merge conflicts.",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "603aa68df076fc5540d7d6c65d66cf01475622ef",
            "tag": "autogenerated:gerrit:newPatchSet",
            "author": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-05-17 18:08:53.000000000",
            "message": "Uploaded patch set 2.",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "c0ff136bc7491dd461a3ae2209baacdbae71a250",
            "author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-06-25 18:31:34.000000000",
            "message": "Patch Set 2: Autosubmit+1 Code-Review+2 Presubmit-Ready+1",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "2e7a12e90a605778cff0a5da50b08a62e657ad0d",
            "tag": "autogenerated:gerrit:deleteVote",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-06-25 18:31:44.000000000",
            "message": "Removed Presubmit-Ready+1 by nchalko <nchalko@google.com>\n",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "82eda4919799e51bfb409ac106dbad6b219bf7e3",
            "tag": "autogenerated:TreeHugger:Verify-Fail",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-06-25 18:31:45.000000000",
            "message": "Patch Set 2:\n\nWARN: Found unapproved submitted together changes: Change 1311653, Change 1311553, Change 1311554.\nPlease make sure these changes are owned by authorized users or have a Code-Review+2 vote.\n\n view details: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=5742754607333376",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "b97ffaf9ddae1af450a4cc3f11c6b70434983b6e",
            "author": {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-06-25 18:50:53.000000000",
            "message": "Patch Set 2:\n\nJust wondering about the need of duplicate information:\nro.hdmi.device_type=4\n  and\nro.hdmi.cec_device_types=playback_device",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "86c900cb37abeb724af23723e7d713e39daa07c6",
            "author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-06-25 18:55:24.000000000",
            "message": "Patch Set 2:\n\n> Patch Set 2:\n> \n> Just wondering about the need of duplicate information:\n> ro.hdmi.device_type=4\n>   and\n> ro.hdmi.cec_device_types=playback_device\n\nDeprecating the old slightly miss named property.\n\nWhile we are renaming it, changed it to be a enum list.\n\nThere are tests to ensure the are equivalent.",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "c15bef814d24af5270488c99c80ab7ca5967d9a6",
            "author": {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1000414,
                "name": "Dmitry Shmidt",
                "email": "dimitrysh@google.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s32/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s56/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s100/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/s120/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-06-25 18:57:50.000000000",
            "message": "Patch Set 2: Code-Review+1",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "5d2c7f35656b2d0f24ccf4e1ea338fd4589fbc1e",
            "tag": "autogenerated:gerrit:setTopic",
            "author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-06-30 16:03:07.000000000",
            "message": "Topic Add cec_device_types property removed",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "953358f14fa4865b9a845aa7d91263b7ae716541",
            "tag": "autogenerated:gerrit:setTopic",
            "author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-06-30 16:03:10.000000000",
            "message": "Topic set to use cec_device_types property",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "70dcbfa334a6a0782f0242444c7ff7f8105e0431",
            "tag": "autogenerated:TreeHugger:Verify-Fail",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-06-30 16:03:15.000000000",
            "message": "Patch Set 2:\n\nWARN: Found unapproved submitted together changes: Change 1311653.\nPlease make sure these changes are owned by authorized users or have a Code-Review+2 vote.\n\n view details: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=5665304396365824",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "852b32b374f8b481ef72ded5726b05e7d588475b",
            "author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1060286,
                "name": "nchalko",
                "email": "nchalko@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-Xc6NomkqYuo/AAAAAAAAAAI/AAAAAAAAAAA/eF8Cp_s5GlQ/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2020-07-08 00:52:15.000000000",
            "message": "Patch Set 2: Presubmit-Ready+1",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "c9d7d3c317c97d379c89fa55cef09f30de1fc056",
            "tag": "autogenerated:gerrit:deleteVote",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-07-08 00:53:00.000000000",
            "message": "Removed Presubmit-Ready+1 by nchalko <nchalko@google.com>\n",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "dc4ab2ff337aec9a98e35875e2039bca359ef9c5",
            "tag": "autogenerated:TreeHugger:Verify-Fail",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-07-08 00:53:03.000000000",
            "message": "Patch Set 2:\n\nWARN: Found unapproved submitted together changes: Change 1311653.\nPlease make sure these changes are owned by authorized users or have a Code-Review+2 vote.\n\n view details: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=4805922200682496",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "aa0070ac4bea1d0f3742bfcb9b4776e2626865e5",
            "tag": "autogenerated:TreeHugger:Verify-Start",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-19 22:10:42.000000000",
            "message": "Patch Set 2:\n\n=== Started presubmit run: L45500000720828160 ===\nChange status: https://android-build.googleplex.com/builds/treetop/android-review/1311573?ref=COMMENT&revision=2&workplanId=L45500000720828160\n=== Other changes included in this run ===\n\nChange 1311673, Change 1311653\n\n\n\n\nDebugging info: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=5752446146609152",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "1874c70ec40b2b2f15bf59c51527bca650162e0a",
            "tag": "autogenerated:TreeHugger:Verify-Fail",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-20 01:11:10.000000000",
            "message": "Patch Set 2: Presubmit-Verified-1\n\nTreeHugger finished with: 36 passed, 8 failed, 37 skipped.\nStatus: https://android-build.googleplex.com/builds/treetop/android-review/1311573?ref=COMMENT&revision=2&workplanId=L45500000720828160\n\n\nDebugging info: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=5752387661234176",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "cef0909d63cec5efb6efe618b92881599e5f9d93",
            "tag": "autogenerated:AyeAye:Comment",
            "author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-20 01:16:37.000000000",
            "message": "Patch Set 2: Lint+1\n\n(1 comment)",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "607806882abfd361d6e972f7789e6d00d5cbb3da",
            "tag": "autogenerated:TreeHugger:Verify-Start",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-27 15:08:30.000000000",
            "message": "Patch Set 2: -Presubmit-Verified\n\n=== Started presubmit run: L06900000727810189 ===\nChange status: https://android-build.googleplex.com/builds/treetop/android-review/1311573?ref=COMMENT&revision=2&workplanId=L06900000727810189\n=== Other changes included in this run ===\n\nChange 1311673, Change 1311653\n\n\n\n\nDebugging info: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=5713517146046464",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "108fcf389e4b64164d76565bb84ced002d545329",
            "tag": "autogenerated:TreeHugger:Verify-Fail",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-27 16:18:16.000000000",
            "message": "Patch Set 2: Presubmit-Verified-1\n\nTreeHugger finished with: 35 passed, 8 failed, 47 skipped.\nStatus: https://android-build.googleplex.com/builds/treetop/android-review/1311573?ref=COMMENT&revision=2&workplanId=L06900000727810189\n\n\nDebugging info: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=6218798808465408",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "362074d81e8155ae137986695727af74dcb4dc40",
            "tag": "autogenerated:AyeAye:Comment",
            "author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-27 16:23:44.000000000",
            "message": "Patch Set 2:\n\n(1 comment)",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "da7e5da5206f56e60374ce71922690e3b5fb5d63",
            "tag": "autogenerated:TreeHugger:Verify-Start",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-28 21:08:20.000000000",
            "message": "Patch Set 2: -Presubmit-Verified\n\n=== Started presubmit run: L23700000729218836 ===\nChange status: https://android-build.googleplex.com/builds/treetop/android-review/1311573?ref=COMMENT&revision=2&workplanId=L23700000729218836\n=== Other changes included in this run ===\n\nChange 1311673, Change 1311653, Change 1471528, Change 1471527\n\n\n\n\nDebugging info: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=5703538950307840",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "38700526159006273eedbd281e59577fa7ff4a07",
            "tag": "autogenerated:TreeHugger:Verify-Fail",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-28 22:17:58.000000000",
            "message": "Patch Set 2: Presubmit-Verified-1\n\nTreeHugger finished with: 34 passed, 9 failed, 41 skipped.\nStatus: https://android-build.googleplex.com/builds/treetop/android-review/1311573?ref=COMMENT&revision=2&workplanId=L23700000729218836\n\n\nDebugging info: https://android-build.googleplex.com/presubmit-status?change_id=1311573&revision_id=2&host=android&id=5988746099458048",
            "accounts_in_message": [],
            "_revision_number": 2
        },
        {
            "id": "e8599dcfdda2afb0483ffcd5a799892229b8f5d4",
            "tag": "autogenerated:AyeAye:Comment",
            "author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2020-10-28 22:26:08.000000000",
            "message": "Patch Set 2:\n\n(1 comment)",
            "accounts_in_message": [],
            "_revision_number": 2
        }
    ],
    "current_revision": "e7a511f91191306a11a875e5cb9d8ccca0d26b5d",
    "revisions": {
        "be1c4e761c81cafd046ffe32deb0f57529568fa9": {
            "kind": "REWORK",
            "_number": 1,
            "created": "2020-05-14 10:29:51.000000000",
            "uploader": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "ref": "refs/changes/73/1311573/1",
            "fetch": {
                "repo": {
                    "url": "device/amlogic/yukawa",
                    "ref": "refs/changes/73/1311573/1",
                    "commands": {
                        "Branch": "repo download -b change-1311573 device/amlogic/yukawa 1311573",
                        "Checkout": "repo download device/amlogic/yukawa 1311573",
                        "Cherry Pick": "repo download -c device/amlogic/yukawa 1311573"
                    }
                },
                "http": {
                    "url": "https://android.googlesource.com/device/amlogic/yukawa",
                    "ref": "refs/changes/73/1311573/1",
                    "commands": {
                        "Branch": "git fetch https://android.googlesource.com/device/amlogic/yukawa refs/changes/73/1311573/1 && git checkout -b change-1311573 FETCH_HEAD",
                        "Checkout": "git fetch https://android.googlesource.com/device/amlogic/yukawa refs/changes/73/1311573/1 && git checkout FETCH_HEAD",
                        "Cherry Pick": "git fetch https://android.googlesource.com/device/amlogic/yukawa refs/changes/73/1311573/1 && git cherry-pick FETCH_HEAD",
                        "Pull": "git pull https://android.googlesource.com/device/amlogic/yukawa refs/changes/73/1311573/1"
                    }
                }
            },
            "commit": {
                "parents": [
                    {
                        "commit": "97981ede648c95c509f50a199e2e84832476ddca",
                        "subject": "yukawa: Fix branch tag version in bootloader README",
                        "web_links": [
                            {
                                "name": "gitiles",
                                "url": "https://android.googlesource.com/device/amlogic/yukawa/+/97981ede648c95c509f50a199e2e84832476ddca",
                                "target": "_blank"
                            }
                        ]
                    }
                ],
                "author": {
                    "name": "Tarundeep Singh",
                    "email": "tarundeep.singh@ittiam.com",
                    "date": "2020-04-27 13:23:04.000000000",
                    "tz": 330
                },
                "committer": {
                    "name": "Tarundeep Singh",
                    "email": "tarundeep.singh@ittiam.com",
                    "date": "2020-05-13 13:34:50.000000000",
                    "tz": 330
                },
                "subject": "Set cec_device_types property",
                "message": "Set cec_device_types property\n\nBug: 154122911\nTest: make\nChange-Id: I680279b1081e5654c84dd794215774c5df8dbcb4\n",
                "web_links": [
                    {
                        "name": "gitiles",
                        "url": "https://android.googlesource.com/device/amlogic/yukawa/+/be1c4e761c81cafd046ffe32deb0f57529568fa9",
                        "target": "_blank"
                    },
                    {
                        "name": "builds",
                        "url": "https://android-build.googleplex.com/builds/sha-search/be1c4e761c81cafd046ffe32deb0f57529568fa9?ref=gerrit",
                        "target": "_blank"
                    },
                    {
                        "name": "automerger",
                        "url": "https://android-build.googleplex.com/builds/automerger/mergepath?host=android&branch=master&project=device/amlogic/yukawa&subject=Set+cec_device_types+property%0A%0ABug:+154122911%0ATest:+make%0AChange-Id:+I680279b1081e5654c84dd794215774c5df8dbcb4%0A",
                        "target": "_blank"
                    }
                ]
            },
            "files": {
                "device-common.mk": {
                    "lines_inserted": 1,
                    "size_delta": 40,
                    "size": 11813
                }
            }
        },
        "e7a511f91191306a11a875e5cb9d8ccca0d26b5d": {
            "kind": "REWORK",
            "_number": 2,
            "created": "2020-05-17 18:08:53.000000000",
            "uploader": {
                "_account_id": 1585075,
                "name": "Tarundeep Singh",
                "email": "tarundeep.singh@ittiam.com",
                "avatars": [
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh3.googleusercontent.com/-Z2FC9XaiFwc/AAAAAAAAAAI/AAAAAAAAAAA/YaClBy739uw/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "ref": "refs/changes/73/1311573/2",
            "fetch": {
                "repo": {
                    "url": "device/amlogic/yukawa",
                    "ref": "refs/changes/73/1311573/2",
                    "commands": {
                        "Branch": "repo download -b change-1311573 device/amlogic/yukawa 1311573",
                        "Checkout": "repo download device/amlogic/yukawa 1311573",
                        "Cherry Pick": "repo download -c device/amlogic/yukawa 1311573"
                    }
                },
                "http": {
                    "url": "https://android.googlesource.com/device/amlogic/yukawa",
                    "ref": "refs/changes/73/1311573/2",
                    "commands": {
                        "Branch": "git fetch https://android.googlesource.com/device/amlogic/yukawa refs/changes/73/1311573/2 && git checkout -b change-1311573 FETCH_HEAD",
                        "Checkout": "git fetch https://android.googlesource.com/device/amlogic/yukawa refs/changes/73/1311573/2 && git checkout FETCH_HEAD",
                        "Cherry Pick": "git fetch https://android.googlesource.com/device/amlogic/yukawa refs/changes/73/1311573/2 && git cherry-pick FETCH_HEAD",
                        "Pull": "git pull https://android.googlesource.com/device/amlogic/yukawa refs/changes/73/1311573/2"
                    }
                }
            },
            "commit": {
                "parents": [
                    {
                        "commit": "97981ede648c95c509f50a199e2e84832476ddca",
                        "subject": "yukawa: Fix branch tag version in bootloader README",
                        "web_links": [
                            {
                                "name": "gitiles",
                                "url": "https://android.googlesource.com/device/amlogic/yukawa/+/97981ede648c95c509f50a199e2e84832476ddca",
                                "target": "_blank"
                            }
                        ]
                    }
                ],
                "author": {
                    "name": "Tarundeep Singh",
                    "email": "tarundeep.singh@ittiam.com",
                    "date": "2020-04-27 13:23:04.000000000",
                    "tz": 330
                },
                "committer": {
                    "name": "Tarundeep Singh",
                    "email": "tarundeep.singh@ittiam.com",
                    "date": "2020-05-15 05:04:32.000000000",
                    "tz": 330
                },
                "subject": "Set cec_device_types property",
                "message": "Set cec_device_types property\n\nBug: 154122911\nTest: make\nChange-Id: I680279b1081e5654c84dd794215774c5df8dbcb4\n",
                "web_links": [
                    {
                        "name": "gitiles",
                        "url": "https://android.googlesource.com/device/amlogic/yukawa/+/e7a511f91191306a11a875e5cb9d8ccca0d26b5d",
                        "target": "_blank"
                    },
                    {
                        "name": "builds",
                        "url": "https://android-build.googleplex.com/builds/sha-search/e7a511f91191306a11a875e5cb9d8ccca0d26b5d?ref=gerrit",
                        "target": "_blank"
                    },
                    {
                        "name": "automerger",
                        "url": "https://android-build.googleplex.com/builds/automerger/mergepath?host=android&branch=master&project=device/amlogic/yukawa&subject=Set+cec_device_types+property%0A%0ABug:+154122911%0ATest:+make%0AChange-Id:+I680279b1081e5654c84dd794215774c5df8dbcb4%0A",
                        "target": "_blank"
                    }
                ]
            },
            "files": {
                "device-common.mk": {
                    "lines_inserted": 1,
                    "size_delta": 47,
                    "size": 11820
                }
            },
            "commit_with_footers": "Set cec_device_types property\n\nBug: 154122911\nTest: make\nChange-Id: I680279b1081e5654c84dd794215774c5df8dbcb4\nReviewed-on: https://android-review.googlesource.com/c/device/amlogic/yukawa/+/1311573\nReviewed-by: nchalko <nchalko@google.com>\nReviewed-by: Dmitry Shmidt <dimitrysh@google.com>\nAutosubmit: nchalko <nchalko@google.com>\nLint: Lint 🤖 <android-build-ayeaye@system.gserviceaccount.com>\n"
        }
    },
    "requirements": [
        {
            "status": "OK",
            "fallback_text": "Code Owners",
            "type": "code-owners"
        }
    ]
}]

let json3 = [{
    "id": "platform%2Fsystem%2Fsepolicy~master~Ide5d95782929836cffc5b3921bffae3295773532",
    "project": "platform/system/sepolicy",
    "branch": "master",
    "topic": "incidentd-odsign-prop",
    "attention_set": {},
    "hashtags": [],
    "change_id": "Ide5d95782929836cffc5b3921bffae3295773532",
    "subject": "Add get_prop(odsign_prop) to incidentd.te",
    "status": "MERGED",
    "created": "2021-07-09 13:57:22.000000000",
    "updated": "2021-07-09 16:46:15.000000000",
    "submitted": "2021-07-09 16:46:15.000000000",
    "submitter": {
        "_account_id": 1071150,
        "name": "Orion Hodson",
        "email": "oth@google.com",
        "avatars": [
            {
                "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                "height": 32
            },
            {
                "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                "height": 56
            },
            {
                "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                "height": 100
            },
            {
                "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                "height": 120
            }
        ]
    },
    "insertions": 2,
    "deletions": 0,
    "total_comment_count": 2,
    "unresolved_comment_count": 0,
    "has_review_started": true,
    "submission_id": "1761447-incidentd-odsign-prop",
    "meta_rev_id": "86d16ed1e9101227e8f7b5863e7b1debceb98283",
    "_number": 1761447,
    "owner": {
        "_account_id": 1071150,
        "name": "Orion Hodson",
        "email": "oth@google.com",
        "avatars": [
            {
                "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                "height": 32
            },
            {
                "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                "height": 56
            },
            {
                "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                "height": 100
            },
            {
                "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                "height": 120
            }
        ]
    },
    "actions": {},
    "labels": {
        "Verified": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 1,
                    "date": "2021-07-09 13:58:07.000000000",
                    "permitted_voting_range": {
                        "min": 1,
                        "max": 1
                    },
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                "-2": "Build failure",
                "-1": "Build success (tests failing)",
                " 0": "No score",
                "+1": "Build success (untested)",
                "+2": "Tests passing"
            },
            "default_value": 0,
            "optional": true
        },
        "Code-Review": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 2,
                    "date": "2021-07-09 16:42:21.000000000",
                    "permitted_voting_range": {
                        "min": 2,
                        "max": 2
                    },
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                "-2": "Do not submit",
                "-1": "I would prefer that you didn\u0027t submit this",
                " 0": "No score",
                "+1": "Looks good to me, but someone else must approve",
                "+2": "Looks good to me, approved"
            },
            "default_value": 0
        },
        "Open-Source-Licensing": {
            "all": [
                {
                    "tag": "autogenerated:AyeAye:Comment",
                    "value": 1,
                    "date": "2021-07-09 13:57:30.000000000",
                    "permitted_voting_range": {
                        "min": 1,
                        "max": 2
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                "-2": "Super block.",
                "-1": "Submit blocked but can be overriden with two +2 votes.",
                " 0": "Submit okay unless there are negative votes.",
                "+1": "Looks good to me. Does not override -1.",
                "+2": "LGTM, overriding -1 when there are two +2 votes."
            },
            "default_value": 0,
            "optional": true
        },
        "Lint": {
            "all": [
                {
                    "tag": "autogenerated:AyeAye:Comment",
                    "value": 1,
                    "date": "2021-07-09 15:08:16.000000000",
                    "permitted_voting_range": {
                        "min": 1,
                        "max": 2
                    },
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                "-2": "Super block.",
                "-1": "Blocked unless +2 bypass.",
                " 0": "Not Run.",
                "+1": "Passing.",
                "+2": "Bypass lint."
            },
            "default_value": 0,
            "optional": true
        },
        "Global-Approval": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                " 0": "No score",
                "+1": "Approved"
            },
            "default_value": 0,
            "optional": true
        },
        "Exempt": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                " 0": "Not exempted.",
                "+1": "Exempted."
            },
            "default_value": 0,
            "optional": true
        },
        "Autosubmit": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                " 0": "Do not submit automatically",
                "+1": "Submit automatically"
            },
            "default_value": 0,
            "optional": true
        },
        "Presubmit-Ready": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "date": "2021-07-09 16:46:10.000000000",
                    "permitted_voting_range": {
                        "min": 0,
                        "max": 1
                    },
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                " 0": "Not Ready",
                "+1": "Ready"
            },
            "default_value": 0,
            "optional": true
        },
        "Presubmit-Verified": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "tag": "autogenerated:TreeHugger:Verify-Pass",
                    "value": 2,
                    "date": "2021-07-09 15:07:58.000000000",
                    "permitted_voting_range": {
                        "min": 2,
                        "max": 2
                    },
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                "-2": "Fails",
                "-1": "Failing",
                " 0": "Not tested",
                "+1": "Passing",
                "+2": "Passes"
            },
            "default_value": 0
        },
        "Bypass-Presubmit": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                " 0": "Not bypass",
                "+1": "Bypassing",
                "+2": "Bypass"
            },
            "default_value": 0,
            "optional": true
        },
        "Presubmit-Verified-Together": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                "-1": "Fails",
                " 0": "Not tested",
                "+1": "Passes"
            },
            "default_value": 0,
            "optional": true
        },
        "Build-Cop-Override": {
            "all": [
                {
                    "value": 0,
                    "_account_id": 1757831,
                    "name": "Lint 🤖",
                    "email": "android-build-ayeaye@system.gserviceaccount.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                },
                {
                    "value": 0,
                    "_account_id": 1062513,
                    "name": "Treehugger Robot",
                    "email": "treehugger-gerrit@google.com",
                    "avatars": [
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                            "height": 120
                        }
                    ],
                    "tags": [
                        "SERVICE_USER"
                    ]
                }
            ],
            "values": {
                "-1": "Do not submit",
                " 0": "No score",
                "+1": "Build cop approved"
            },
            "default_value": 0,
            "optional": true
        }
    },
    "removable_reviewers": [
        {
            "_account_id": 1054468,
            "name": "Jeffrey Vander Stoep",
            "email": "jeffv@google.com",
            "avatars": [
                {
                    "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s32-p/photo.jpg",
                    "height": 32
                },
                {
                    "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s56-p/photo.jpg",
                    "height": 56
                },
                {
                    "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s100-p/photo.jpg",
                    "height": 100
                },
                {
                    "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s120-p/photo.jpg",
                    "height": 120
                }
            ]
        }
    ],
    "reviewers": {
        "REVIEWER": [
            {
                "_account_id": 1054468,
                "name": "Jeffrey Vander Stoep",
                "email": "jeffv@google.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            {
                "_account_id": 1060831,
                "name": "Alan Stokes",
                "email": "alanstokes@google.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            }
        ]
    },
    "pending_reviewers": {},
    "reviewer_updates": [
        {
            "updated": "2021-07-09 13:57:30.000000000",
            "updated_by": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "reviewer": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "state": "REVIEWER"
        },
        {
            "updated": "2021-07-09 13:58:07.000000000",
            "updated_by": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "reviewer": {
                "_account_id": 1060831,
                "name": "Alan Stokes",
                "email": "alanstokes@google.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "state": "REVIEWER"
        },
        {
            "updated": "2021-07-09 13:58:07.000000000",
            "updated_by": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "reviewer": {
                "_account_id": 1054468,
                "name": "Jeffrey Vander Stoep",
                "email": "jeffv@google.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "state": "REVIEWER"
        },
        {
            "updated": "2021-07-09 14:00:29.000000000",
            "updated_by": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "reviewer": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "state": "CC"
        },
        {
            "updated": "2021-07-09 15:07:58.000000000",
            "updated_by": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "reviewer": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "state": "REVIEWER"
        }
    ],
    "messages": [
        {
            "id": "7b6ce8b80f68bdf016911437ae72c199b0af7425",
            "tag": "autogenerated:gerrit:newPatchSet",
            "author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2021-07-09 13:57:22.000000000",
            "message": "Uploaded patch set 1.",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "9653dc201e3c34e4e101abbdf209f06f2402d12b",
            "tag": "autogenerated:AyeAye:Comment",
            "author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2021-07-09 13:57:30.000000000",
            "message": "Patch Set 1: Open-Source-Licensing+1\n\nLicensing looks good.\n\nNo license declarations found in or near changes.",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "20caa7d4c0f2962e35b0964c9f475c78d7726d67",
            "author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2021-07-09 13:58:07.000000000",
            "message": "Patch Set 1: Verified+1 Presubmit-Ready+1",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "154f8c3868d8e3fc9f0d25ebdeeee03c386ebb33",
            "tag": "autogenerated:gerrit:code-owners:addReviewer",
            "author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2021-07-09 13:58:08.000000000",
            "message": "\u003cGERRIT_ACCOUNT_1054468\u003e who was added as reviewer owns the following files:\n* private/incidentd.te\n",
            "accounts_in_message": [
                {
                    "_account_id": 1054468,
                    "name": "Jeffrey Vander Stoep",
                    "email": "jeffv@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-jjQLeBfh-zk/AAAAAAAAAAI/AAAAAAAAAAA/IVfCstnC9zg/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "_revision_number": 1
        },
        {
            "id": "126cb23d238896dc11852b9d33299649e11f33a6",
            "tag": "autogenerated:gerrit:code-owners:addReviewer",
            "author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2021-07-09 13:58:08.000000000",
            "message": "\u003cGERRIT_ACCOUNT_1060831\u003e who was added as reviewer owns the following files:\n* private/incidentd.te\n",
            "accounts_in_message": [
                {
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "_revision_number": 1
        },
        {
            "id": "5e193b2d45c67bb5b4e4cb61f08a8b3ce569ae93",
            "tag": "autogenerated:TreeHugger:Verify-Start",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2021-07-09 14:00:29.000000000",
            "message": "Patch Set 1:\n\n\u003d\u003d\u003d Started presubmit run: L95400000946335607 \u003d\u003d\u003d\nChange status: https://android-build.googleplex.com/builds/treetop/android-review/1761447?ref\u003dCOMMENT\u0026revision\u003d1\u0026workplanId\u003dL95400000946335607\n\n\nDebugging info: https://android-build.googleplex.com/presubmit-status?change_id\u003d1761447\u0026revision_id\u003d1\u0026host\u003dandroid\u0026id\u003d6140695094132736",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "b7389ff73d3add52d12c4b77be94ce07a55e12c1",
            "tag": "autogenerated:gerrit:deleteVote",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2021-07-09 15:07:58.000000000",
            "message": "Removed Presubmit-Ready+1 by \u003cGERRIT_ACCOUNT_1071150\u003e\n",
            "accounts_in_message": [
                {
                    "_account_id": 1071150,
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "avatars": [
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "_revision_number": 1
        },
        {
            "id": "07e892d1fd7264cc7ca835658841c800450e5a84",
            "tag": "autogenerated:TreeHugger:Verify-Pass",
            "author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1062513,
                "name": "Treehugger Robot",
                "email": "treehugger-gerrit@google.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-iK1-iTkEAE0/AAAAAAAAAAI/AAAAAAAAAAA/KWB8UDnQ33M/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2021-07-09 15:07:58.000000000",
            "message": "Patch Set 1: Presubmit-Verified+2\n\nTreeHugger finished with: 88 passed, 1 ignored, 4 skipped.\nStatus: https://android-build.googleplex.com/builds/treetop/android-review/1761447?ref\u003dCOMMENT\u0026revision\u003d1\u0026workplanId\u003dL95400000946335607\n\n\nDebugging info: https://android-build.googleplex.com/presubmit-status?change_id\u003d1761447\u0026revision_id\u003d1\u0026host\u003dandroid\u0026id\u003d6486668641206272",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "5385f19f189b680579d0c66ff4ea3a46d2f9bc21",
            "tag": "autogenerated:AyeAye:Comment",
            "author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "real_author": {
                "_account_id": 1757831,
                "name": "Lint 🤖",
                "email": "android-build-ayeaye@system.gserviceaccount.com",
                "avatars": [
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh4.googleusercontent.com/-Zkxlnqw2kDg/AAAAAAAAAAI/AAAAAAAAAAA/FzxSIRSZ0Po/s120-p/photo.jpg",
                        "height": 120
                    }
                ],
                "tags": [
                    "SERVICE_USER"
                ]
            },
            "date": "2021-07-09 15:08:16.000000000",
            "message": "Patch Set 1: Lint+1\n\n(1 comment)",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "300b1f43f15c9e8c49d0e40da2e23bd9a96e963b",
            "author": {
                "_account_id": 1060831,
                "name": "Alan Stokes",
                "email": "alanstokes@google.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1060831,
                "name": "Alan Stokes",
                "email": "alanstokes@google.com",
                "avatars": [
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2021-07-09 16:42:21.000000000",
            "message": "Patch Set 1: Code-Review+2\n\nBy voting Code-Review+2 the following files are now code-owner approved by \u003cGERRIT_ACCOUNT_1060831\u003e:\n* private/incidentd.te\n",
            "accounts_in_message": [
                {
                    "_account_id": 1060831,
                    "name": "Alan Stokes",
                    "email": "alanstokes@google.com",
                    "avatars": [
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s32-p/photo.jpg",
                            "height": 32
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s56-p/photo.jpg",
                            "height": 56
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s100-p/photo.jpg",
                            "height": 100
                        },
                        {
                            "url": "https://lh6.googleusercontent.com/-9fcKpyKf4sE/AAAAAAAAAAI/AAAAAAAAAAA/CFicDVHOlJI/s120-p/photo.jpg",
                            "height": 120
                        }
                    ]
                }
            ],
            "_revision_number": 1
        },
        {
            "id": "144cd8b0454145ef0c6596948f3d2373eee3b704",
            "author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2021-07-09 16:46:10.000000000",
            "message": "Patch Set 1:\n\n(1 comment)",
            "accounts_in_message": [],
            "_revision_number": 1
        },
        {
            "id": "86d16ed1e9101227e8f7b5863e7b1debceb98283",
            "tag": "autogenerated:gerrit:merged",
            "author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "real_author": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "date": "2021-07-09 16:46:15.000000000",
            "message": "Change has been successfully merged",
            "accounts_in_message": [],
            "_revision_number": 1
        }
    ],
    "current_revision": "2abf1e293ba3b0a16b72c862770906ee3a67ba73",
    "revisions": {
        "2abf1e293ba3b0a16b72c862770906ee3a67ba73": {
            "kind": "REWORK",
            "_number": 1,
            "created": "2021-07-09 13:57:22.000000000",
            "uploader": {
                "_account_id": 1071150,
                "name": "Orion Hodson",
                "email": "oth@google.com",
                "avatars": [
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s32-p/photo.jpg",
                        "height": 32
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s56-p/photo.jpg",
                        "height": 56
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s100-p/photo.jpg",
                        "height": 100
                    },
                    {
                        "url": "https://lh5.googleusercontent.com/-zDGQpiZet5E/AAAAAAAAAAI/AAAAAAAAAAA/zLEcik6sW9w/s120-p/photo.jpg",
                        "height": 120
                    }
                ]
            },
            "ref": "refs/changes/47/1761447/1",
            "fetch": {
                "repo": {
                    "url": "platform/system/sepolicy",
                    "ref": "refs/changes/47/1761447/1",
                    "commands": {
                        "Branch": "repo download -b change-1761447 platform/system/sepolicy 1761447",
                        "Checkout": "repo download platform/system/sepolicy 1761447",
                        "Cherry Pick": "repo download -c platform/system/sepolicy 1761447"
                    }
                },
                "http": {
                    "url": "https://android.googlesource.com/platform/system/sepolicy",
                    "ref": "refs/changes/47/1761447/1",
                    "commands": {
                        "Branch": "git fetch https://android.googlesource.com/platform/system/sepolicy refs/changes/47/1761447/1 \u0026\u0026 git checkout -b change-1761447 FETCH_HEAD",
                        "Checkout": "git fetch https://android.googlesource.com/platform/system/sepolicy refs/changes/47/1761447/1 \u0026\u0026 git checkout FETCH_HEAD",
                        "Cherry Pick": "git fetch https://android.googlesource.com/platform/system/sepolicy refs/changes/47/1761447/1 \u0026\u0026 git cherry-pick FETCH_HEAD",
                        "Pull": "git pull https://android.googlesource.com/platform/system/sepolicy refs/changes/47/1761447/1"
                    }
                }
            },
            "commit": {
                "parents": [
                    {
                        "commit": "c1d9d9a85c8656f93d208adde5389ac2e3fc3c34",
                        "subject": "Merge \"untrusted_app_30: add new targetSdk domain\"",
                        "web_links": [
                            {
                                "name": "gitiles",
                                "url": "https://android.googlesource.com/platform/system/sepolicy/+/c1d9d9a85c8656f93d208adde5389ac2e3fc3c34",
                                "target": "_blank"
                            }
                        ]
                    }
                ],
                "author": {
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "date": "2021-07-09 13:54:27.000000000",
                    "tz": 60
                },
                "committer": {
                    "name": "Orion Hodson",
                    "email": "oth@google.com",
                    "date": "2021-07-09 13:54:27.000000000",
                    "tz": 60
                },
                "subject": "Add get_prop(odsign_prop) to incidentd.te",
                "message": "Add get_prop(odsign_prop) to incidentd.te\n\nPrevents SELinux denial when capturing a bugreport.\n\nBug: 192895524\nBug: 193084909\nBug: 193096842\nBug: 193097008\nBug: 193097511\nBug: 193097845\nBug: 193097886\nTest: adb bugreport and check no denial in logcat.\nChange-Id: Ide5d95782929836cffc5b3921bffae3295773532\n",
                "web_links": [
                    {
                        "name": "gitiles",
                        "url": "https://android.googlesource.com/platform/system/sepolicy/+/2abf1e293ba3b0a16b72c862770906ee3a67ba73",
                        "target": "_blank"
                    },
                    {
                        "name": "builds",
                        "url": "https://android-build.googleplex.com/builds/sha-search/2abf1e293ba3b0a16b72c862770906ee3a67ba73?ref\u003dgerrit",
                        "target": "_blank"
                    },
                    {
                        "name": "automerger",
                        "url": "https://android-build.googleplex.com/builds/automerger/mergepath?host\u003dandroid\u0026branch\u003dmaster\u0026project\u003dplatform/system/sepolicy\u0026subject\u003dAdd+get_prop(odsign_prop)+to+incidentd.te%0A%0APrevents+SELinux+denial+when+capturing+a+bugreport.%0A%0ABug:+192895524%0ABug:+193084909%0ABug:+193096842%0ABug:+193097008%0ABug:+193097511%0ABug:+193097845%0ABug:+193097886%0ATest:+adb+bugreport+and+check+no+denial+in+logcat.%0AChange-Id:+Ide5d95782929836cffc5b3921bffae3295773532%0A",
                        "target": "_blank"
                    }
                ]
            },
            "files": {
                "private/incidentd.te": {
                    "lines_inserted": 2,
                    "size_delta": 70,
                    "size": 6947
                }
            },
            "commit_with_footers": "Add get_prop(odsign_prop) to incidentd.te\n\nPrevents SELinux denial when capturing a bugreport.\n\nBug: 192895524\nBug: 193084909\nBug: 193096842\nBug: 193097008\nBug: 193097511\nBug: 193097845\nBug: 193097886\nTest: adb bugreport and check no denial in logcat.\nChange-Id: Ide5d95782929836cffc5b3921bffae3295773532\nReviewed-on: https://android-review.googlesource.com/c/platform/system/sepolicy/+/1761447\nOpen-Source-Licensing: Lint 🤖 \u003candroid-build-ayeaye@system.gserviceaccount.com\u003e\nTested-by: Orion Hodson \u003coth@google.com\u003e\nPresubmit-Verified: Treehugger Robot \u003ctreehugger-gerrit@google.com\u003e\nLint: Lint 🤖 \u003candroid-build-ayeaye@system.gserviceaccount.com\u003e\nReviewed-by: Alan Stokes \u003calanstokes@google.com\u003e\n"
        }
    },
    "requirements": []
}]

let json4 = [
    {
        "id": "qt%2Fqtbase~6.0~I5e34971267c52c63cda2489bef5b09bed739f532",
        "project": "qt/qtbase",
        "branch": "6.0",
        "hashtags": [],
        "change_id": "I5e34971267c52c63cda2489bef5b09bed739f532",
        "subject": "Skip tst_QUrl::testThreading() under QEMU",
        "status": "ABANDONED",
        "created": "2021-04-26 17:47:01.000000000",
        "updated": "2021-04-28 17:47:14.000000000",
        "insertions": 5,
        "deletions": 0,
        "total_comment_count": 0,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 345619,
        "owner": {
            "_account_id": 1007413,
            "name": "Qt Cherry-pick Bot",
            "email": "cherrypick_bot@qt-project.org",
            "username": "cherrypickbot"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 2,
                        "date": "2021-04-26 17:47:11.000000000",
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 2
                        },
                        "_account_id": 1007413,
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "username": "cherrypickbot"
                    },
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 2
                        },
                        "_account_id": 1007467,
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "username": "agolubev"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "tag": "autogenerated:sanity",
                        "value": 1,
                        "date": "2021-04-26 17:47:30.000000000",
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 1,
                        "date": "2021-04-26 17:47:25.000000000",
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1007413,
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "username": "cherrypickbot"
                    },
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1007467,
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "username": "agolubev"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-04-26 17:47:01.000000000",
                "updated_by": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "reviewer": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-26 17:47:20.000000000",
                "updated_by": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "reviewer": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "state": "REVIEWER"
            }
        ],
        "messages": [
            {
                "id": "1d0ba45dbb7c69a146a29a0d416e9a9974bb252c",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:01.000000000",
                "message": "Patch Set 1: Cherry Picked from branch 6.1.0.",
                "_revision_number": 1
            },
            {
                "id": "07e74a62669f5f797d49ca745868981aa186fe87",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:11.000000000",
                "message": "Patch Set 1: Code-Review+2 Sanity-Review+1\n\nThis change is being approved because it was automatically cherry-picked from dev and contains no conflicts.",
                "_revision_number": 1
            },
            {
                "id": "898e3300a0f2f73368b3b2d72840a3d406788bfa",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:14.000000000",
                "message": "Patch Set 1:\n\nThis cherry-pick is ready to be automatically staged, but it\u0027s parent is not staged or merged.\n\nCherry-pick bot will wait for the parent to stage for the next 48 hours.\nIf this window expires, a follow up message will be posted and you will need to stage this pick manually.",
                "_revision_number": 1
            },
            {
                "id": "0cd0f8f732e786b0ffd3c190401a46f8aee3fd66",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-04-26 17:47:20.000000000",
                "message": "Patch Set 1: Sanity-Review+1",
                "_revision_number": 1
            },
            {
                "id": "edbc75395e240aecc8e0c6c7215ae3b803318e44",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:23.000000000",
                "message": "Uploaded patch set 2.",
                "_revision_number": 2
            },
            {
                "id": "38ce3a187807740774dc192ac39747ffb54c0c3d",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:25.000000000",
                "message": "Patch Set 2: Sanity-Review+1\n\nThis change is being approved because it was automatically cherry-picked from dev and contains no conflicts.",
                "_revision_number": 2
            },
            {
                "id": "e0ac2c902e62008c171b9ee87ba5ab9e927db831",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-04-26 17:47:30.000000000",
                "message": "Patch Set 2: Sanity-Review+1",
                "_revision_number": 2
            },
            {
                "id": "ff21e4f4d7f288c338f27f600edfbae7eb43389a",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:30.000000000",
                "message": "Staged for CI",
                "_revision_number": 2
            },
            {
                "id": "f70abcb53254183fdc311ba597b36a12eab6888b",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-26 19:14:35.000000000",
                "message": "Added to build refs/builds/qtci/6.0/1619464474 for qt/qtbase,refs/heads/refs/staging/6.0",
                "_revision_number": 2
            },
            {
                "id": "0824280b1088eddf19ac15aa4ae591462cc1399c",
                "tag": "autogenerated:gerrit:revert",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-26 19:32:20.000000000",
                "message": "\nContinuous Integration: Failed\n\nFailed to build sources. In the current state bug can be everywhere.\n\n\nThe error was in \"qt/qtbase\", revision: 772a04cd8dbf0f3e5fce704890e132f14451b20c\n\n \n 11426: Non-cacheable calls                   0\n Non-compilation calls                 0\n Unsupported compiler calls            0\n Average cache write               0.009 s\n Average cache read miss           4.554 s\n Average cache read hit            0.007 s\n Failed distributed compilations       0\n Cache location                  S3, bucket: Bucket(name\u003dcache, base_url\u003dhttp://ci-sccache:9000/cache/)\n agent:2021/04/26 19:32:18 build.go:670:\n Build failed\n ERROR building: exit status 1\n\nBuild log: https://testresults.qt.io/logs/qt/qtbase/4502431432d25b545b1350962c7134689bd7bcbf/MacOSMacOS_10_14x86_64MacOSMacOS_10_14x86_64Clangqtci-macos-10.14-x86_64-dcdb00Sccache/44b6a78e7cef76b64705cd5607821031863dddc5/build_1619464567/log.txt.gz\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1619464477\n\nTested changes (refs/builds/qtci/6.0/1619464474):\n  https://codereview.qt-project.org/c/qt/qtbase/+/345604/1 xcb: Add more debug info for XCB_INPUT event\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345620/1 Add more tests for QList/QString/QBA\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345621/1 Do not shift the data pointer when removing all elements from QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345619/2 Skip tst_QUrl::testThreading() under QEMU\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345520/1 CMake: Install prl files from all repo build dirs in a top-level build\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345616/1 Add tests for QtPrivate::q_relocate_overlap_n\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345178/2 fix: The QtStartUpFunction function may be called repeatedly\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345610/1 Resurrect data moves in QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345611/2 Change QList\u0027s insert() and emplace() to always invalidate [pos, end())\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345608/1 Add q_points_into_range to container utilities\n\n",
                "_revision_number": 2
            },
            {
                "id": "972e4dd793d8ae1484e907e52ba1b5e48e978f6e",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1002472,
                    "name": "Jani Heikkinen",
                    "email": "jani.heikkinen@qt.io",
                    "username": "janihe"
                },
                "real_author": {
                    "_account_id": 1002472,
                    "name": "Jani Heikkinen",
                    "email": "jani.heikkinen@qt.io",
                    "username": "janihe"
                },
                "date": "2021-04-27 04:40:10.000000000",
                "message": "Staged for CI",
                "_revision_number": 2
            },
            {
                "id": "773e37e1797e69e2497d7387b7521239a6fce9eb",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-27 04:42:49.000000000",
                "message": "Added to build refs/builds/qtci/6.0/1619498569 for qt/qtbase,refs/heads/refs/staging/6.0",
                "_revision_number": 2
            },
            {
                "id": "0d2b746666ed692779ec24466bb737d9581392d1",
                "tag": "autogenerated:gerrit:revert",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-27 04:46:44.000000000",
                "message": "\nContinuous Integration: Failed\n\nFailed to build sources. In the current state bug can be everywhere.\n\n\nThe error was in \"qt/qtbase\", revision: 6610b38792daef140e0d9c6a9ae2667c00a1ee70\n\n \n 2458: Non-cacheable calls                   0\n Non-compilation calls                 0\n Unsupported compiler calls            0\n Average cache write               0.000 s\n Average cache read miss           0.000 s\n Average cache read hit            0.031 s\n Failed distributed compilations       0\n Cache location                  S3, bucket: Bucket(name\u003dcache, base_url\u003dhttp://ci-sccache:9000/cache/)\n agent:2021/04/27 04:46:42 build.go:670:\n Build failed\n ERROR building: exit status 1\n\nBuild log: https://testresults.qt.io/logs/qt/qtbase/479abab852a29377f947b54fd0033448838e3d9c/MacOSMacOS_10_15x86_64MacOSMacOS_10_15x86_64Clangqtci-macos-10.15-x86_64-100-fc9a4dInsignificantTests_Sccache/b3df2ddb1d2d67e8fbc3b8bb796511d2465873bd/build_1619498687/log.txt.gz\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1619498604\n\nTested changes (refs/builds/qtci/6.0/1619498569):\n  https://codereview.qt-project.org/c/qt/qtbase/+/345620/1 Add more tests for QList/QString/QBA\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345621/1 Do not shift the data pointer when removing all elements from QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345619/2 Skip tst_QUrl::testThreading() under QEMU\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345616/1 Add tests for QtPrivate::q_relocate_overlap_n\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345610/1 Resurrect data moves in QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345611/2 Change QList\u0027s insert() and emplace() to always invalidate [pos, end())\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345608/1 Add q_points_into_range to container utilities\n\n",
                "_revision_number": 2
            },
            {
                "id": "1f2ca7538ee9cff6b5ef90a4971417f54d6848ec",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "real_author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "date": "2021-04-27 06:57:22.000000000",
                "message": "Staged for CI",
                "_revision_number": 2
            },
            {
                "id": "ad5341473757d7fdbfd8d7176a901f82fb09b26e",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-27 07:01:46.000000000",
                "message": "Added to build refs/builds/qtci/6.0/1619506905 for qt/qtbase,refs/heads/refs/staging/6.0",
                "_revision_number": 2
            },
            {
                "id": "810b64d2e4fdb987d1b50e0df132b054c0075bd5",
                "tag": "autogenerated:gerrit:revert",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-27 07:28:03.000000000",
                "message": "\nContinuous Integration: Failed\n\nFailed to build sources. In the current state bug can be everywhere.\n\n\nThe error was in \"qt/qtbase\", revision: 0a635a83b20b15df88b78019a1c32fc7a6669434\n\n \n 16530: Unsupported compiler calls            0\n Average cache write               0.011 s\n Average cache read miss           8.033 s\n Average cache read hit            0.009 s\n Failed distributed compilations       0\n Non-cacheable reasons:\n -x                                   14\n Cache location                  S3, bucket: Bucket(name\u003dcache, base_url\u003dhttp://ci-sccache:9000/cache/)\n agent:2021/04/27 07:27:53 build.go:670:\n Build failed\n ERROR building: exit status 1\n\nBuild log: https://testresults.qt.io/logs/qt/qtbase/c75bb78cb2a5a428ffe8cb3d8c19faa97d0d9463/MacOSMacOS_10_15x86_64MacOSMacOS_10_15x86_64Clangqtci-macos-10.15-x86_64-100-fc9a4dInsignificantTests_Sccache/b3df2ddb1d2d67e8fbc3b8bb796511d2465873bd/build_1619508031/log.txt.gz\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1619506908\n\nTested changes (refs/builds/qtci/6.0/1619506905):\n  https://codereview.qt-project.org/c/qt/qtbase/+/345620/1 Add more tests for QList/QString/QBA\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345621/1 Do not shift the data pointer when removing all elements from QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345619/2 Skip tst_QUrl::testThreading() under QEMU\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345616/1 Add tests for QtPrivate::q_relocate_overlap_n\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345610/1 Resurrect data moves in QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345611/2 Change QList\u0027s insert() and emplace() to always invalidate [pos, end())\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345608/1 Add q_points_into_range to container utilities\n\n",
                "_revision_number": 2
            },
            {
                "id": "bc72f23bb87dd1bd70a3a2b21d0cdc9da090e73b",
                "tag": "autogenerated:gerrit:abandon",
                "author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "real_author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "date": "2021-04-27 12:53:31.000000000",
                "message": "Abandoned\n\nThis commit implicitly depends on https://codereview.qt-project.org/c/qt/qtbase/+/334009, which is not cherry-picked to 6.0.",
                "_revision_number": 2
            },
            {
                "id": "003c65494ead5204e477d6f09c6e202ceeac98ce",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-28 17:47:14.000000000",
                "message": "Patch Set 2:\n\nAn automatic staging request for this pick has expired because it\u0027s parent did not stage in a timely manner.\nPlease stage this cherry-pick manually as appropriate.",
                "_revision_number": 2
            }
        ],
        "current_revision": "5d74dbd2dbeaf6e5b767f298adf03c2783502fc1",
        "revisions": {
            "5d74dbd2dbeaf6e5b767f298adf03c2783502fc1": {
                "kind": "TRIVIAL_REBASE",
                "_number": 2,
                "created": "2021-04-26 17:47:23.000000000",
                "uploader": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "ref": "refs/changes/19/345619/2",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/19/345619/2",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/19/345619/2 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/19/345619/2 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/19/345619/2 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/19/345619/2"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "d1d8ec458c36ceaa011d5e381a1815631aee440b",
                            "subject": "Add more tests for QList/QString/QBA",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003dd1d8ec458c36ceaa011d5e381a1815631aee440b"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "date": "2021-04-26 17:47:23.000000000",
                        "tz": 0
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d5d74dbd2dbeaf6e5b767f298adf03c2783502fc1"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200191
                    }
                },
                "commit_with_footers": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\nReviewed-by: Qt Cherry-pick Bot \u003ccherrypick_bot@qt-project.org\u003e\n"
            },
            "075c139020d9d4c98c2a9df2402ae1ab87e45eb1": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-04-26 17:47:01.000000000",
                "uploader": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "ref": "refs/changes/19/345619/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/19/345619/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/19/345619/1 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/19/345619/1 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/19/345619/1 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/19/345619/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "60c9d91c0a68152de7274cd543a5021052ea1fe8",
                            "subject": "Change QList\u0027s insert() and emplace() to always invalidate [pos, end())",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d60c9d91c0a68152de7274cd543a5021052ea1fe8"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "date": "2021-04-26 17:47:01.000000000",
                        "tz": 0
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d075c139020d9d4c98c2a9df2402ae1ab87e45eb1"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200191
                    }
                }
            }
        },
        "requirements": []
    },
    {
        "id": "qt%2Fqtbase~dev~I5e34971267c52c63cda2489bef5b09bed739f532",
        "project": "qt/qtbase",
        "branch": "dev",
        "hashtags": [],
        "change_id": "I5e34971267c52c63cda2489bef5b09bed739f532",
        "subject": "Skip tst_QUrl::testThreading() under QEMU",
        "status": "MERGED",
        "created": "2021-04-26 17:47:02.000000000",
        "updated": "2021-04-27 12:12:35.000000000",
        "submitted": "2021-04-27 12:12:35.000000000",
        "submitter": {
            "_account_id": 1003699,
            "name": "Qt CI Bot",
            "email": "qt_ci_bot@qt-project.org",
            "username": "qt_ci_bot"
        },
        "insertions": 5,
        "deletions": 0,
        "total_comment_count": 0,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 345625,
        "owner": {
            "_account_id": 1007413,
            "name": "Qt Cherry-pick Bot",
            "email": "cherrypick_bot@qt-project.org",
            "username": "cherrypickbot"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 2,
                        "date": "2021-04-27 12:12:35.000000000",
                        "permitted_voting_range": {
                            "min": 2,
                            "max": 2
                        },
                        "_account_id": 1007413,
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "username": "cherrypickbot"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-04-27 12:12:35.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1007413,
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "username": "cherrypickbot"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                {
                    "_account_id": 1000121,
                    "name": "Lars Knoll",
                    "email": "lars.knoll@qt.io",
                    "username": "laknoll"
                },
                {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-04-26 17:47:02.000000000",
                "updated_by": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "reviewer": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-26 17:47:26.000000000",
                "updated_by": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "reviewer": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-27 07:15:49.000000000",
                "updated_by": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "reviewer": {
                    "_account_id": 1000121,
                    "name": "Lars Knoll",
                    "email": "lars.knoll@qt.io",
                    "username": "laknoll"
                },
                "state": "REVIEWER"
            }
        ],
        "messages": [
            {
                "id": "3b2909c4cf6c2cc1085723a09c140b973ce6c191",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:02.000000000",
                "message": "Patch Set 1: Cherry Picked from branch 6.1.0.",
                "_revision_number": 1
            },
            {
                "id": "6ffc01c2fa3b19a884031d77d2b0390ee4b96169",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:18.000000000",
                "message": "Patch Set 1: Code-Review+2 Sanity-Review+1\n\nThis change is being approved because it was automatically cherry-picked from dev and contains no conflicts.",
                "_revision_number": 1
            },
            {
                "id": "13d0279a9a4f6300b3939f75b91bf6c980a797bc",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-04-26 17:47:26.000000000",
                "message": "Patch Set 1: Sanity-Review+1",
                "_revision_number": 1
            },
            {
                "id": "21b919414343950ea234c5bc985d3ca0a08f81cd",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "real_author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "date": "2021-04-27 07:15:49.000000000",
                "message": "Uploaded patch set 2: Patch Set 1 was rebased.",
                "_revision_number": 2
            },
            {
                "id": "bbba1544b80282ed46fb377d5e8b9d620a6f88fb",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-04-27 07:15:58.000000000",
                "message": "Patch Set 2: Sanity-Review+1",
                "_revision_number": 2
            },
            {
                "id": "c7ced26a0d0866b79efd41c3f829334a7f9b55fe",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "real_author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "date": "2021-04-27 07:19:05.000000000",
                "message": "Uploaded patch set 3: New patch set was added with same tree, parent, and commit message as Patch Set 2.",
                "_revision_number": 3
            },
            {
                "id": "72630504b470c6c598571b0d29b0047b93d0bf9a",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "real_author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "date": "2021-04-27 07:42:42.000000000",
                "message": "Staged for CI",
                "_revision_number": 3
            },
            {
                "id": "d4018fe0f152e0a4dade239e5029d9855c403798",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-27 08:38:12.000000000",
                "message": "Added to build refs/builds/qtci/dev/1619512691 for qt/qtbase,refs/heads/refs/staging/dev",
                "_revision_number": 3
            },
            {
                "id": "83f7b8bf9822f8ee41f20f03cc4cfae886fd1300",
                "tag": "autogenerated:gerrit:merged",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-27 12:12:35.000000000",
                "message": "\nContinuous Integration: Passed\n\nPatch looks good. Thanks.\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1619512699\n\nTested changes (refs/builds/qtci/dev/1619512691):\n  https://codereview.qt-project.org/c/qt/qtbase/+/345622/3 Do not shift the data pointer when removing all elements from QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345586/1 Remove links to QRegularExpression#Wildcard matching\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345617/3 Add more tests for QList/QString/QBA\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343518/5 Android: Remove NoSuchMethodException error\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343933/5 Check POSIX rules during QTzTimeZone creation\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345625/3 Skip tst_QUrl::testThreading() under QEMU\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345606/4 Resurrect data moves in QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345415/4 WASM: Don’t set “-g4” by default for qmake builds\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345216/1 Correct the parsing of POSIX rule day-of-year fields\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345217/1 Fix handling of a POSIX zone rule describing permanent DST\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345455/1 Declare loop arg in benchmark unused\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345612/3 Add tests for QtPrivate::q_relocate_overlap_n\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345613/4 Change QList\u0027s insert() and emplace() to always invalidate [pos, end())\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345357/2 doc: Warn about kerning in QRawFont::advancesForGlyphIndexes()\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/344936/5 Add q_points_into_range to container utilities\n\n",
                "_revision_number": 4
            }
        ],
        "current_revision": "c3d16e21265ebacca1018b31490b63f8738333a5",
        "revisions": {
            "1d736fbc6df6866f9ca577336cf10d2c22929949": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-04-26 17:47:02.000000000",
                "uploader": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "ref": "refs/changes/25/345625/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/25/345625/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/1 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/1 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/1 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "473e4cdfcbcb1c2bef13ff5dba7995755d592d90",
                            "subject": "Resurrect data moves in QList",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d473e4cdfcbcb1c2bef13ff5dba7995755d592d90"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "date": "2021-04-26 17:47:02.000000000",
                        "tz": 0
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d1d736fbc6df6866f9ca577336cf10d2c22929949"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200208
                    }
                }
            },
            "f4f1883d0ff0b269c5b51f06d33b50e4da0b24a5": {
                "kind": "NO_CHANGE",
                "_number": 3,
                "created": "2021-04-27 07:19:05.000000000",
                "uploader": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "ref": "refs/changes/25/345625/3",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/25/345625/3",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/3 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/3 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/3 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/3"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "0c4ef9751100ff9886cfe93a202d9e0b492ab428",
                            "subject": "Add more tests for QList/QString/QBA",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d0c4ef9751100ff9886cfe93a202d9e0b492ab428"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-27 07:18:40.000000000",
                        "tz": 120
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003df4f1883d0ff0b269c5b51f06d33b50e4da0b24a5"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200208
                    }
                }
            },
            "f45c4c17f4ac2297d42ee560d07918cb2ca696fe": {
                "kind": "TRIVIAL_REBASE",
                "_number": 2,
                "created": "2021-04-27 07:15:49.000000000",
                "uploader": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "ref": "refs/changes/25/345625/2",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/25/345625/2",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/2 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/2 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/2 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/2"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "dddc0e77722dac913b2ab874e5ef6706b88f00fd",
                            "subject": "Add more tests for QList/QString/QBA",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003ddddc0e77722dac913b2ab874e5ef6706b88f00fd"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-27 07:15:37.000000000",
                        "tz": 120
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003df45c4c17f4ac2297d42ee560d07918cb2ca696fe"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200208
                    }
                }
            },
            "c3d16e21265ebacca1018b31490b63f8738333a5": {
                "kind": "REWORK",
                "_number": 4,
                "created": "2021-04-27 12:12:35.000000000",
                "uploader": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "ref": "refs/changes/25/345625/4",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/25/345625/4",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/4 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/4 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/4 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/25/345625/4"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "e6f7202e34f407a316d1c96a6b3a55f24dd068d8",
                            "subject": "Add more tests for QList/QString/QBA",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003de6f7202e34f407a316d1c96a6b3a55f24dd068d8"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-27 12:12:34.000000000",
                        "tz": 120
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\nReviewed-by: Qt Cherry-pick Bot \u003ccherrypick_bot@qt-project.org\u003e\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003dc3d16e21265ebacca1018b31490b63f8738333a5"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200208
                    }
                },
                "commit_with_footers": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\nReviewed-by: Qt Cherry-pick Bot \u003ccherrypick_bot@qt-project.org\u003e\n"
            }
        },
        "requirements": []
    },
    {
        "id": "qt%2Fqtbase~6.1~I5e34971267c52c63cda2489bef5b09bed739f532",
        "project": "qt/qtbase",
        "branch": "6.1",
        "hashtags": [],
        "change_id": "I5e34971267c52c63cda2489bef5b09bed739f532",
        "subject": "Skip tst_QUrl::testThreading() under QEMU",
        "status": "MERGED",
        "created": "2021-04-26 17:47:02.000000000",
        "updated": "2021-04-26 21:00:57.000000000",
        "submitted": "2021-04-26 21:00:57.000000000",
        "submitter": {
            "_account_id": 1003699,
            "name": "Qt CI Bot",
            "email": "qt_ci_bot@qt-project.org",
            "username": "qt_ci_bot"
        },
        "insertions": 5,
        "deletions": 0,
        "total_comment_count": 0,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 345624,
        "owner": {
            "_account_id": 1007413,
            "name": "Qt Cherry-pick Bot",
            "email": "cherrypick_bot@qt-project.org",
            "username": "cherrypickbot"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 2,
                        "date": "2021-04-26 21:00:57.000000000",
                        "permitted_voting_range": {
                            "min": 2,
                            "max": 2
                        },
                        "_account_id": 1007413,
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "username": "cherrypickbot"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-04-26 21:00:57.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 1
                        },
                        "_account_id": 1007413,
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "username": "cherrypickbot"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-04-26 17:47:02.000000000",
                "updated_by": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "reviewer": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "state": "REVIEWER"
            }
        ],
        "messages": [
            {
                "id": "408f33c228dbaaa0af675d0a6b7dd4ab818ce78b",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:02.000000000",
                "message": "Patch Set 1: Cherry Picked from branch 6.1.0.",
                "_revision_number": 1
            },
            {
                "id": "e0280b3d2d9cf59ad4f185659bd75a5915a5195b",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:17.000000000",
                "message": "Patch Set 1: Code-Review+2 Sanity-Review+1\n\nThis change is being approved because it was automatically cherry-picked from dev and contains no conflicts.",
                "_revision_number": 1
            },
            {
                "id": "91c659fbded12fa6f46f04c761c1c0468c804cb6",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:23.000000000",
                "message": "Staged for CI",
                "_revision_number": 1
            },
            {
                "id": "81e97315b230855a48a2416303287bc04873e51f",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-26 17:52:32.000000000",
                "message": "Added to build refs/builds/qtci/6.1/1619459552 for qt/qtbase,refs/heads/refs/staging/6.1",
                "_revision_number": 1
            },
            {
                "id": "c2d3bed5173722c4bf47827322b2c139be9cbdc0",
                "tag": "autogenerated:gerrit:merged",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-26 21:00:57.000000000",
                "message": "\nContinuous Integration: Passed\n\nPatch looks good. Thanks.\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1619459623\n\nTested changes (refs/builds/qtci/6.1/1619459552):\n  https://codereview.qt-project.org/c/qt/qtbase/+/345607/1 Add q_points_into_range to container utilities\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345623/1 Add more tests for QList/QString/QBA\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345605/1 xcb: Add more debug info for XCB_INPUT event\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345618/1 Do not shift the data pointer when removing all elements from QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345521/1 Add override to addPaths and removePaths in kqueue filesystem watcher\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345441/1 Fix QTreeModel calling beginRemoveRows twice\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345614/2 Change QList\u0027s insert() and emplace() to always invalidate [pos, end())\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345519/1 CMake: Install prl files from all repo build dirs in a top-level build\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345615/1 Add tests for QtPrivate::q_relocate_overlap_n\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345503/1 Fix QAbstractItemModelTester false positive\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345624/1 Skip tst_QUrl::testThreading() under QEMU\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345609/1 Resurrect data moves in QList\n\n",
                "_revision_number": 2
            }
        ],
        "current_revision": "94e4add5e880845713d76020c4f90422437c97af",
        "revisions": {
            "94e4add5e880845713d76020c4f90422437c97af": {
                "kind": "REWORK",
                "_number": 2,
                "created": "2021-04-26 21:00:57.000000000",
                "uploader": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "ref": "refs/changes/24/345624/2",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/24/345624/2",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345624/2 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345624/2 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345624/2 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345624/2"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "e08bf5eb844c114660a57bf660f69dfb8865c3f1",
                            "subject": "Add more tests for QList/QString/QBA",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003de08bf5eb844c114660a57bf660f69dfb8865c3f1"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "date": "2021-04-26 17:47:23.000000000",
                        "tz": 0
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\nReviewed-by: Qt Cherry-pick Bot \u003ccherrypick_bot@qt-project.org\u003e\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d94e4add5e880845713d76020c4f90422437c97af"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200208
                    }
                },
                "commit_with_footers": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\nReviewed-by: Qt Cherry-pick Bot \u003ccherrypick_bot@qt-project.org\u003e\n"
            },
            "c48cb36cdfcd5b45bba44c1bd4831e0c222a8c0f": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-04-26 17:47:02.000000000",
                "uploader": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "ref": "refs/changes/24/345624/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/24/345624/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345624/1 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345624/1 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345624/1 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345624/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "7561a49605fd710c112a0116e17b1a2b70110ef7",
                            "subject": "Resurrect data moves in QList",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d7561a49605fd710c112a0116e17b1a2b70110ef7"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "date": "2021-04-26 17:47:02.000000000",
                        "tz": 0
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n(cherry picked from commit 6d52d86b999088ec07e58c14197bddda043ef0aa)\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003dc48cb36cdfcd5b45bba44c1bd4831e0c222a8c0f"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200208
                    }
                }
            }
        },
        "requirements": []
    },
    {
        "id": "qt%2Fqtbase~6.1.0~I5e34971267c52c63cda2489bef5b09bed739f532",
        "project": "qt/qtbase",
        "branch": "6.1.0",
        "hashtags": [],
        "change_id": "I5e34971267c52c63cda2489bef5b09bed739f532",
        "subject": "Skip tst_QUrl::testThreading() under QEMU",
        "status": "MERGED",
        "created": "2021-04-26 13:02:28.000000000",
        "updated": "2021-04-26 17:47:25.000000000",
        "submitted": "2021-04-26 17:46:47.000000000",
        "submitter": {
            "_account_id": 1003699,
            "name": "Qt CI Bot",
            "email": "qt_ci_bot@qt-project.org",
            "username": "qt_ci_bot"
        },
        "insertions": 5,
        "deletions": 0,
        "total_comment_count": 1,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 345524,
        "owner": {
            "_account_id": 1007467,
            "name": "Andrei Golubev",
            "email": "andrei.golubev@qt.io",
            "username": "agolubev"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 2,
                        "date": "2021-04-26 17:46:47.000000000",
                        "permitted_voting_range": {
                            "min": 2,
                            "max": 2
                        },
                        "_account_id": 1000121,
                        "name": "Lars Knoll",
                        "email": "lars.knoll@qt.io",
                        "username": "laknoll"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-04-26 17:46:47.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000121,
                        "name": "Lars Knoll",
                        "email": "lars.knoll@qt.io",
                        "username": "laknoll"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                {
                    "_account_id": 1000121,
                    "name": "Lars Knoll",
                    "email": "lars.knoll@qt.io",
                    "username": "laknoll"
                },
                {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                },
                {
                    "_account_id": 1000548,
                    "name": "Giuseppe D\u0027Angelo",
                    "email": "giuseppe.dangelo@kdab.com",
                    "username": "peppe"
                }
            ],
            "CC": [
                {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-04-26 13:02:29.000000000",
                "updated_by": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "reviewer": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-26 13:10:03.000000000",
                "updated_by": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "reviewer": {
                    "_account_id": 1000548,
                    "name": "Giuseppe D\u0027Angelo",
                    "email": "giuseppe.dangelo@kdab.com",
                    "username": "peppe"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-26 13:10:03.000000000",
                "updated_by": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "reviewer": {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-26 13:10:03.000000000",
                "updated_by": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "reviewer": {
                    "_account_id": 1000121,
                    "name": "Lars Knoll",
                    "email": "lars.knoll@qt.io",
                    "username": "laknoll"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-26 13:12:24.000000000",
                "updated_by": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "reviewer": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "state": "CC"
            },
            {
                "updated": "2021-04-26 17:47:11.000000000",
                "updated_by": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "reviewer": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "state": "CC"
            }
        ],
        "messages": [
            {
                "id": "1bd95f6079be5d3c8bf76bda496767d0bb7f46e8",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "real_author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "date": "2021-04-26 13:02:28.000000000",
                "message": "Uploaded patch set 1.",
                "_revision_number": 1
            },
            {
                "id": "60d219eab1a7ff770f1a8982b8c04a56ae0692ad",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-04-26 13:02:29.000000000",
                "message": "Patch Set 1: Sanity-Review+1\n\n(1 comment)\n\nSee http://wiki.qt.io/Early_Warning_System for explanations.",
                "_revision_number": 1
            },
            {
                "id": "bd97ed5453fc595933390a49b378e2cffcc3773e",
                "author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "real_author": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "date": "2021-04-26 13:10:03.000000000",
                "message": "Patch Set 1:\n\nThis seems to be necessary for the QList work to succeed in the CI.\n\nAnd no, it doesn\u0027t seem related as I can reproduce the issue even without the QList patches.\nAdditionally, my POC fix [1] seems to resolve the data races in tst_qurl (which probably means that the QEMU test run would succeed as well) and, with this fix, the issues are gone with the QList patches applied as well.\n\n[1]: https://codereview.qt-project.org/c/qt/qtbase/+/345499",
                "_revision_number": 1
            },
            {
                "id": "8a502125d0c0667ff8ac13b64a73001d4dd8f08b",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-26 13:12:24.000000000",
                "message": "Patch Set 1:\n\nPre Continuous Integration Quick Check: Running\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1619442735",
                "_revision_number": 1
            },
            {
                "id": "339480d545ec11b4b68512653a42ea2906e01754",
                "author": {
                    "_account_id": 1000121,
                    "name": "Lars Knoll",
                    "email": "lars.knoll@qt.io",
                    "username": "laknoll"
                },
                "real_author": {
                    "_account_id": 1000121,
                    "name": "Lars Knoll",
                    "email": "lars.knoll@qt.io",
                    "username": "laknoll"
                },
                "date": "2021-04-26 13:46:45.000000000",
                "message": "Patch Set 1: Code-Review+2",
                "_revision_number": 1
            },
            {
                "id": "522f684aa7b0db8f2f09a421a5a55c60a85f734f",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1002472,
                    "name": "Jani Heikkinen",
                    "email": "jani.heikkinen@qt.io",
                    "username": "janihe"
                },
                "real_author": {
                    "_account_id": 1002472,
                    "name": "Jani Heikkinen",
                    "email": "jani.heikkinen@qt.io",
                    "username": "janihe"
                },
                "date": "2021-04-26 15:07:57.000000000",
                "message": "Staged for CI",
                "_revision_number": 1
            },
            {
                "id": "6259cd85e129951dcf5fa27557ead7611571f781",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-26 15:09:27.000000000",
                "message": "Added to build refs/builds/qtci/6.1.0/1619449766 for qt/qtbase,refs/heads/refs/staging/6.1.0",
                "_revision_number": 1
            },
            {
                "id": "7466c538043f5f2e245eecf7f992c9f75c3bfc73",
                "tag": "autogenerated:gerrit:merged",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-26 17:46:47.000000000",
                "message": "\nContinuous Integration: Passed\n\nPatch looks good. Thanks.\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1619449768\n\nTested changes (refs/builds/qtci/6.1.0/1619449766):\n  https://codereview.qt-project.org/c/qt/qtbase/+/345431/2 Add q_points_into_range to container utilities\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345524/1 Skip tst_QUrl::testThreading() under QEMU\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345330/7 Do not shift the data pointer when removing all elements from QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345331/14 Add more tests for QList/QString/QBA\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/340586/14 Resurrect data moves in QList\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345258/7 Add tests for QtPrivate::q_relocate_overlap_n\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/345336/8 Change QList\u0027s insert() and emplace() to always invalidate [pos, end())\n\n",
                "_revision_number": 2
            },
            {
                "id": "9bc7b01465460c53be65f81d1e5c60df3420492b",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:11.000000000",
                "message": "Patch Set 2:\n\nSuccessfully created cherry-pick to 6.0\nView it here: https://codereview.qt-project.org/c/qt%2Fqtbase/+/345619",
                "_revision_number": 2
            },
            {
                "id": "2b0bd7e0be20974b378fcf5d59f42dd1d77077d9",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:17.000000000",
                "message": "Patch Set 2:\n\nSuccessfully created cherry-pick to 6.1\nView it here: https://codereview.qt-project.org/c/qt%2Fqtbase/+/345624",
                "_revision_number": 2
            },
            {
                "id": "618f92b5c6747745a852a5c5052c795bd09140c0",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:18.000000000",
                "message": "Patch Set 2:\n\nSuccessfully created cherry-pick to dev\nView it here: https://codereview.qt-project.org/c/qt%2Fqtbase/+/345625",
                "_revision_number": 2
            },
            {
                "id": "ffa227c1fb08e5897f953587c4d98c8d82f081a2",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-04-26 17:47:25.000000000",
                "message": "Patch Set 2:\n\nSuccessfully created cherry-pick to 6.0\nView it here: https://codereview.qt-project.org/c/qt%2Fqtbase/+/345619",
                "_revision_number": 2
            }
        ],
        "current_revision": "6d52d86b999088ec07e58c14197bddda043ef0aa",
        "revisions": {
            "2d5f8c0e570177bba768eed498475bd8b9ee4373": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-04-26 13:02:28.000000000",
                "uploader": {
                    "_account_id": 1007467,
                    "name": "Andrei Golubev",
                    "email": "andrei.golubev@qt.io",
                    "username": "agolubev"
                },
                "ref": "refs/changes/24/345524/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/24/345524/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345524/1 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345524/1 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345524/1 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345524/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "fbdf904ba5b5f15de35976d78e9961ae0b7295cb",
                            "subject": "Add more tests for QList/QString/QBA",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003dfbdf904ba5b5f15de35976d78e9961ae0b7295cb"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nPick-to: 6.0 6.1 dev\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d2d5f8c0e570177bba768eed498475bd8b9ee4373"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200208
                    }
                }
            },
            "6d52d86b999088ec07e58c14197bddda043ef0aa": {
                "kind": "REWORK",
                "_number": 2,
                "created": "2021-04-26 17:46:47.000000000",
                "uploader": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "ref": "refs/changes/24/345524/2",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/24/345524/2",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345524/2 \u0026\u0026 git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345524/2 \u0026\u0026 git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345524/2 \u0026\u0026 git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/24/345524/2"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "adb41bbe00b2b853d4dd26cd9ee77ae5ed541576",
                            "subject": "Add more tests for QList/QString/QBA",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003dadb41bbe00b2b853d4dd26cd9ee77ae5ed541576"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 12:59:16.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Andrei Golubev",
                        "email": "andrei.golubev@qt.io",
                        "date": "2021-04-26 15:07:57.000000000",
                        "tz": 120
                    },
                    "subject": "Skip tst_QUrl::testThreading() under QEMU",
                    "message": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nPick-to: 6.0 6.1 dev\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p\u003dqt%2Fqtbase.git;a\u003dcommit;h\u003d6d52d86b999088ec07e58c14197bddda043ef0aa"
                        }
                    ]
                },
                "files": {
                    "tests/auto/corelib/io/qurl/CMakeLists.txt": {
                        "lines_inserted": 1,
                        "size_delta": 24,
                        "size": 492
                    },
                    "tests/auto/corelib/io/qurl/tst_qurl.cpp": {
                        "lines_inserted": 4,
                        "size_delta": 186,
                        "size": 200208
                    }
                },
                "commit_with_footers": "Skip tst_QUrl::testThreading() under QEMU\n\nIt usually fails the test with \"corrupted size vs. prev_size\" message\ncoming from malloc() or some other memory allocation routine (which\nsignals about memory corruption probably)\n\nTask-number: QTBUG-93176\nPick-to: 6.0 6.1 dev\nChange-Id: I5e34971267c52c63cda2489bef5b09bed739f532\nReviewed-by: Lars Knoll \u003clars.knoll@qt.io\u003e\n"
            }
        },
        "requirements": []
    },
    {
        "id": "qt%2Fqtbase~6.2~I7f194befc08ab50cdef321d8900ee3553599a19e",
        "project": "qt/qtbase",
        "branch": "6.2",
        "hashtags": [],
        "change_id": "I7f194befc08ab50cdef321d8900ee3553599a19e",
        "subject": "Fix C++20 compilation of androiddeployqt",
        "status": "MERGED",
        "created": "2021-07-09 13:35:56.000000000",
        "updated": "2021-07-09 22:31:36.000000000",
        "submitted": "2021-07-09 22:31:36.000000000",
        "submitter": {
            "_account_id": 1003699,
            "name": "Qt CI Bot",
            "email": "qt_ci_bot@qt-project.org",
            "username": "qt_ci_bot"
        },
        "insertions": 3,
        "deletions": 3,
        "total_comment_count": 0,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 359090,
        "owner": {
            "_account_id": 1007413,
            "name": "Qt Cherry-pick Bot",
            "email": "cherrypick_bot@qt-project.org",
            "username": "cherrypickbot"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 2,
                        "date": "2021-07-09 22:31:36.000000000",
                        "permitted_voting_range": {
                            "min": 2,
                            "max": 2
                        },
                        "_account_id": 1007413,
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "username": "cherrypickbot"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-07-09 22:31:36.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-07-09 22:31:36.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 1
                        },
                        "_account_id": 1007413,
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "username": "cherrypickbot"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-07-09 13:35:56.000000000",
                "updated_by": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "reviewer": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-07-09 13:35:58.000000000",
                "updated_by": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "reviewer": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "state": "REVIEWER"
            }
        ],
        "messages": [
            {
                "id": "3016884926d55cb6bd97a509557f00995fb2d09a",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-07-09 13:35:56.000000000",
                "message": "Patch Set 1: Cherry Picked from branch dev.",
                "_revision_number": 1
            },
            {
                "id": "ef1316809d2e3e3d7b68b570856a16ed284a8607",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-07-09 13:35:57.000000000",
                "message": "Patch Set 1: Code-Review+2 Sanity-Review+1\n\nThis change is being approved because it was automatically cherry-picked from dev and contains no conflicts.",
                "_revision_number": 1
            },
            {
                "id": "8244e8254ad6b1341ac023f11067dacc605aee8a",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-07-09 13:35:58.000000000",
                "message": "Patch Set 1: Sanity-Review+1",
                "_revision_number": 1
            },
            {
                "id": "d89181dd208dd26e932b0c058a2f01bf9075c967",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-07-09 13:36:03.000000000",
                "message": "Staged for CI",
                "_revision_number": 1
            },
            {
                "id": "693ef916c906e915ce0be5acc26557b442ac4373",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-07-09 13:47:23.000000000",
                "message": "Added to build refs/builds/qtci/6.2/1625838443 for qt/qtbase,refs/heads/refs/staging/6.2",
                "_revision_number": 1
            },
            {
                "id": "594f377acac90ead7989587f1a489bff1a6685df",
                "tag": "autogenerated:gerrit:revert",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-07-09 15:07:23.000000000",
                "message": "\nContinuous Integration: Failed\n\nFailed to run tests.\n\n\nThe error was in \"qt/qtbase\", revision: 2977fea989bb6a22d634c7382a3297e087aad0d6\n\n \n 133: set SCCACHE_BUCKET=cache\n agent:2021/07/09 14:54:36 build.go:1079:\n Executing instruction 12 of 39 - ExecuteCommand\n [sccache --start-server] 3m0s 3m0s false true\n sccache: Starting the server...\n agent:2021/07/09 14:54:36 build.go:1079:\n Executing instruction 13 of 39 - ChangeDirectory\n cd  /home/qt/work/qt/qtbase\n agent:2021/07/09 14:54:36 build.go:1079:\n Executing instruction 14 of 39 - EnvironmentVariable\n set TARGET_CONFIGURE_ARGS=-DQT_BUILD_EXAMPLES=ON -DFEATURE_developer_build=ON -DCMAKE_BUILD_TYPE=RelWithDebInfo -DQT_BUILD_TOOLS_WHEN_CROSSCOMPILING=ON -DCMAKE_TOOLCHAIN_FILE=/opt/b2qt/3.2/sysroots/x86_64-pokysdk-linux/usr/share/cmake/OEToolchainConfig.cmake -DQT_FEATURE_system_harfbuzz=OFF -DQT_QMAKE_TARGET_MKSPEC=devices/linux-imx7-g++ -DQT_QMAKE_DEVICE_OPTIONS=\"CROSS_COMPILE=/opt/b2qt/3.2/sysroots/x86_64-pokysdk-linux/usr/bin/arm-poky-linux-gnueabi/arm-poky-linux-gnueabi-;DISTRO_OPTS=hard-float boot2qt\" -DCMAKE_STAGING_PREFIX=/home/qt/work/install/target -DCMAKE_AUTOGEN_VERBOSE=ON -DCMAKE_C_COMPILER_LAUNCHER=sccache -DCMAKE_CXX_COMPILER_LAUNCHER=sccache -DFEATURE_forkfd_pidfd=OFF -DWARNINGS_ARE_ERRORS=OFF\n\nBuild log: https://testresults.qt.io/logs/qt/qtbase/063440a79f612b521865505362cfe47ba0b5a535/LinuxUbuntu_20_04x86_64LinuxQEMUarmv7GCCqtci-linux-Ubuntu-20.04-x86_64-50-061d4dSccache/5867f25fea7e777652201d05f6358f3444ce0a47/test_1625839729/log.txt.gz\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1625838445\n\nTested changes (refs/builds/qtci/6.2/1625838443):\n  https://codereview.qt-project.org/c/qt/qtbase/+/359062/1 QMap::erase - extend docs to specify iterator limitations\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/359090/1 Fix C++20 compilation of androiddeployqt\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/359054/1 cldr.py: Avoid raising StopIteration from generators\n\n",
                "_revision_number": 1
            },
            {
                "id": "dff7009a4c89226d7be493c34070e5e78bbd8d21",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "real_author": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "date": "2021-07-09 18:31:09.000000000",
                "message": "Staged for CI",
                "_revision_number": 1
            },
            {
                "id": "0862b57f654a95c7659152eb5848dab2d15b364c",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-07-09 20:07:33.000000000",
                "message": "Added to build refs/builds/qtci/6.2/1625861252 for qt/qtbase,refs/heads/refs/staging/6.2",
                "_revision_number": 1
            },
            {
                "id": "f9e4256288bfec62ed0505cc8d4d919943b879e0",
                "tag": "autogenerated:gerrit:merged",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-07-09 22:31:36.000000000",
                "message": "\nContinuous Integration: Passed\n\nPatch looks good. Thanks.\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1625863176\n\nTested changes (refs/builds/qtci/6.2/1625861252):\n  https://codereview.qt-project.org/c/qt/qtbase/+/359090/1 Fix C++20 compilation of androiddeployqt\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/359096/1 Diffie-Hellman parameters: remove useless 'fix'\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/359097/1 Dont's use DTLS_MAX_VERSION when setting SSL_CTX\n\n",
                "_revision_number": 2
            }
        ],
        "current_revision": "1da243a588fc9081d4e3eabc869ae2e42967f9e5",
        "revisions": {
            "40982a8a710d2d04ba76a89e57b2d62b92390e93": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-07-09 13:35:56.000000000",
                "uploader": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "ref": "refs/changes/90/359090/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/90/359090/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/90/359090/1 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/90/359090/1 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/90/359090/1 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/90/359090/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "1f00b520e62dc19bf710f13bab11b3bf834c672c",
                            "subject": "Let androiddeployqt write a dependency file",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=1f00b520e62dc19bf710f13bab11b3bf834c672c"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marc Mutz",
                        "email": "marc.mutz@kdab.com",
                        "date": "2021-07-09 09:50:04.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "date": "2021-07-09 13:35:56.000000000",
                        "tz": 0
                    },
                    "subject": "Fix C++20 compilation of androiddeployqt",
                    "message": "Fix C++20 compilation of androiddeployqt\n\nu8 literals changed type from const char[] to const char8_t[] in C++20\nand Qt APIs that don't use QUtf8StringView aren't prepared for it. Use\na classical char literal for the time being.\n\nAmends 857be50b2e193b92de37c3e2bb5124d24d21a253.\n\nChange-Id: I7f194befc08ab50cdef321d8900ee3553599a19e\nReviewed-by: Andreas Buhr <andreas.buhr@qt.io>\n(cherry picked from commit f5bcfb8f57f6588b8264667e57bff79241c29369)\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=40982a8a710d2d04ba76a89e57b2d62b92390e93"
                        }
                    ]
                },
                "files": {
                    "src/tools/androiddeployqt/main.cpp": {
                        "lines_inserted": 3,
                        "lines_deleted": 3,
                        "size_delta": -6,
                        "size": 123762
                    }
                }
            },
            "1da243a588fc9081d4e3eabc869ae2e42967f9e5": {
                "kind": "REWORK",
                "_number": 2,
                "created": "2021-07-09 22:31:36.000000000",
                "uploader": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "ref": "refs/changes/90/359090/2",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/90/359090/2",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/90/359090/2 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/90/359090/2 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/90/359090/2 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/90/359090/2"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "a6c402547b39c42128f8fddb11387d70b42842f4",
                            "subject": "Dont's use DTLS_MAX_VERSION when setting SSL_CTX",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=a6c402547b39c42128f8fddb11387d70b42842f4"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marc Mutz",
                        "email": "marc.mutz@kdab.com",
                        "date": "2021-07-09 09:50:04.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Qt Cherry-pick Bot",
                        "email": "cherrypick_bot@qt-project.org",
                        "date": "2021-07-09 20:07:24.000000000",
                        "tz": 0
                    },
                    "subject": "Fix C++20 compilation of androiddeployqt",
                    "message": "Fix C++20 compilation of androiddeployqt\n\nu8 literals changed type from const char[] to const char8_t[] in C++20\nand Qt APIs that don't use QUtf8StringView aren't prepared for it. Use\na classical char literal for the time being.\n\nAmends 857be50b2e193b92de37c3e2bb5124d24d21a253.\n\nChange-Id: I7f194befc08ab50cdef321d8900ee3553599a19e\nReviewed-by: Andreas Buhr <andreas.buhr@qt.io>\n(cherry picked from commit f5bcfb8f57f6588b8264667e57bff79241c29369)\nReviewed-by: Qt Cherry-pick Bot <cherrypick_bot@qt-project.org>\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=1da243a588fc9081d4e3eabc869ae2e42967f9e5"
                        }
                    ]
                },
                "files": {
                    "src/tools/androiddeployqt/main.cpp": {
                        "lines_inserted": 3,
                        "lines_deleted": 3,
                        "size_delta": -6,
                        "size": 123762
                    }
                },
                "commit_with_footers": "Fix C++20 compilation of androiddeployqt\n\nu8 literals changed type from const char[] to const char8_t[] in C++20\nand Qt APIs that don't use QUtf8StringView aren't prepared for it. Use\na classical char literal for the time being.\n\nAmends 857be50b2e193b92de37c3e2bb5124d24d21a253.\n\nChange-Id: I7f194befc08ab50cdef321d8900ee3553599a19e\nReviewed-by: Andreas Buhr <andreas.buhr@qt.io>\n(cherry picked from commit f5bcfb8f57f6588b8264667e57bff79241c29369)\nReviewed-by: Qt Cherry-pick Bot <cherrypick_bot@qt-project.org>\n"
            }
        },
        "requirements": []
    },
    {
        "id": "qt%2Fqtbase~dev~I7f194befc08ab50cdef321d8900ee3553599a19e",
        "project": "qt/qtbase",
        "branch": "dev",
        "hashtags": [],
        "change_id": "I7f194befc08ab50cdef321d8900ee3553599a19e",
        "subject": "Fix C++20 compilation of androiddeployqt",
        "status": "MERGED",
        "created": "2021-07-09 09:52:21.000000000",
        "updated": "2021-07-09 13:35:57.000000000",
        "submitted": "2021-07-09 13:35:54.000000000",
        "submitter": {
            "_account_id": 1003699,
            "name": "Qt CI Bot",
            "email": "qt_ci_bot@qt-project.org",
            "username": "qt_ci_bot"
        },
        "insertions": 3,
        "deletions": 3,
        "total_comment_count": 1,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 359037,
        "owner": {
            "_account_id": 1000869,
            "name": "Marc Mutz",
            "email": "marc.mutz@kdab.com",
            "username": "mmutz"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 2,
                        "date": "2021-07-09 13:35:54.000000000",
                        "permitted_voting_range": {
                            "min": 2,
                            "max": 2
                        },
                        "_account_id": 1007512,
                        "name": "Andreas Buhr",
                        "email": "andreas.buhr@qt.io",
                        "username": "andreasbuhr"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-07-09 13:35:54.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1007512,
                        "name": "Andreas Buhr",
                        "email": "andreas.buhr@qt.io",
                        "username": "andreasbuhr"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                {
                    "_account_id": 1007512,
                    "name": "Andreas Buhr",
                    "email": "andreas.buhr@qt.io",
                    "username": "andreasbuhr"
                }
            ],
            "CC": [
                {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-07-09 09:52:21.000000000",
                "updated_by": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "reviewer": {
                    "_account_id": 1007512,
                    "name": "Andreas Buhr",
                    "email": "andreas.buhr@qt.io",
                    "username": "andreasbuhr"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-07-09 09:52:22.000000000",
                "updated_by": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "reviewer": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-07-09 13:35:57.000000000",
                "updated_by": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "reviewer": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "state": "CC"
            }
        ],
        "messages": [
            {
                "id": "bd0ceb4924557717a54bf48082bab8ab65c85f40",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "real_author": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "date": "2021-07-09 09:52:21.000000000",
                "message": "Uploaded patch set 1.",
                "_revision_number": 1
            },
            {
                "id": "0f3622776b0c1ced7ac3a86c8457c313b56236c0",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-07-09 09:52:22.000000000",
                "message": "Patch Set 1: Sanity-Review-1\n\n(1 comment)\n\nSee http://wiki.qt.io/Early_Warning_System for explanations.",
                "_revision_number": 1
            },
            {
                "id": "d8e9b0ba9f1392e0e15d01b431e408284524ee43",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "real_author": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "date": "2021-07-09 09:52:47.000000000",
                "message": "Patch Set 2: Commit message was updated.",
                "_revision_number": 2
            },
            {
                "id": "a652f27fef22117dcb14ca730522f26fdbabffa3",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-07-09 09:52:50.000000000",
                "message": "Patch Set 2: Sanity-Review+1",
                "_revision_number": 2
            },
            {
                "id": "aeff9f3f42289351ed242d8f89f3483718345b8a",
                "author": {
                    "_account_id": 1007512,
                    "name": "Andreas Buhr",
                    "email": "andreas.buhr@qt.io",
                    "username": "andreasbuhr"
                },
                "real_author": {
                    "_account_id": 1007512,
                    "name": "Andreas Buhr",
                    "email": "andreas.buhr@qt.io",
                    "username": "andreasbuhr"
                },
                "date": "2021-07-09 09:55:45.000000000",
                "message": "Patch Set 2: Code-Review+2",
                "_revision_number": 2
            },
            {
                "id": "fe9a2594de6c6ffc765653de15d939666466847d",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "real_author": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "date": "2021-07-09 10:53:12.000000000",
                "message": "Staged for CI",
                "_revision_number": 2
            },
            {
                "id": "281b555b34df8dafaaf3d99a137e533c028ff5d0",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-07-09 10:56:36.000000000",
                "message": "Added to build refs/builds/qtci/dev/1625828195 for qt/qtbase,refs/heads/refs/staging/dev",
                "_revision_number": 2
            },
            {
                "id": "ca25c2571b5e3f6e052c34e6f7e86868192ed792",
                "tag": "autogenerated:gerrit:merged",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-07-09 13:35:54.000000000",
                "message": "\nContinuous Integration: Passed\n\nPatch looks good. Thanks.\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1625828197\n\nTested changes (refs/builds/qtci/dev/1625828195):\n  https://codereview.qt-project.org/c/qt/qtbase/+/359037/2 Fix C++20 compilation of androiddeployqt\n\n",
                "_revision_number": 3
            },
            {
                "id": "1aa115e495e3410e3552aff9f6224aded2b60e07",
                "author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "real_author": {
                    "_account_id": 1007413,
                    "name": "Qt Cherry-pick Bot",
                    "email": "cherrypick_bot@qt-project.org",
                    "username": "cherrypickbot"
                },
                "date": "2021-07-09 13:35:57.000000000",
                "message": "Patch Set 3:\n\nSuccessfully created cherry-pick to 6.2\nView it here: https://codereview.qt-project.org/c/qt%2Fqtbase/+/359090",
                "_revision_number": 3
            }
        ],
        "current_revision": "f5bcfb8f57f6588b8264667e57bff79241c29369",
        "revisions": {
            "4cb244d9d7dc4226103898ab2582334cf54ea96c": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-07-09 09:52:21.000000000",
                "uploader": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "ref": "refs/changes/37/359037/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/37/359037/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/1 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/1 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/1 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "873119210675c0e38e076c46ec3ecabf9d2ed97e",
                            "subject": "Fix qt_error_string() and QSystemError::string's lack of i18n",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=873119210675c0e38e076c46ec3ecabf9d2ed97e"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marc Mutz",
                        "email": "marc.mutz@kdab.com",
                        "date": "2021-07-09 09:50:04.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Marc Mutz",
                        "email": "marc.mutz@kdab.com",
                        "date": "2021-07-09 09:51:16.000000000",
                        "tz": 120
                    },
                    "subject": "Fix C++20 compilation of androiddeployqt",
                    "message": "Fix C++20 compilation of androiddeployqt\n\nu8 literals changed type from const char[] to const char8_t[] in C++20\nand Qt APIs that don't use QUtf8StringView aren't prepared for it. Use\na classical char literal for the time being.\n\nAmends 857be50b2e193b92de37c3e2bb5124d24d21a253.\n\nPick-to: 6.2\n\nChange-Id: I7f194befc08ab50cdef321d8900ee3553599a19e\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=4cb244d9d7dc4226103898ab2582334cf54ea96c"
                        }
                    ]
                },
                "files": {
                    "src/tools/androiddeployqt/main.cpp": {
                        "lines_inserted": 3,
                        "lines_deleted": 3,
                        "size_delta": -6,
                        "size": 123762
                    }
                }
            },
            "f5bcfb8f57f6588b8264667e57bff79241c29369": {
                "kind": "REWORK",
                "_number": 3,
                "created": "2021-07-09 13:35:54.000000000",
                "uploader": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "ref": "refs/changes/37/359037/3",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/37/359037/3",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/3 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/3 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/3 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/3"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "74d6c36eb7b80cfdecd80c5e6f8c1f0604f0b496",
                            "subject": "QMap::erase - extend docs to specify iterator limitations",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=74d6c36eb7b80cfdecd80c5e6f8c1f0604f0b496"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marc Mutz",
                        "email": "marc.mutz@kdab.com",
                        "date": "2021-07-09 09:50:04.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Marc Mutz",
                        "email": "marc.mutz@kdab.com",
                        "date": "2021-07-09 13:35:54.000000000",
                        "tz": 0
                    },
                    "subject": "Fix C++20 compilation of androiddeployqt",
                    "message": "Fix C++20 compilation of androiddeployqt\n\nu8 literals changed type from const char[] to const char8_t[] in C++20\nand Qt APIs that don't use QUtf8StringView aren't prepared for it. Use\na classical char literal for the time being.\n\nAmends 857be50b2e193b92de37c3e2bb5124d24d21a253.\n\nPick-to: 6.2\nChange-Id: I7f194befc08ab50cdef321d8900ee3553599a19e\nReviewed-by: Andreas Buhr <andreas.buhr@qt.io>\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=f5bcfb8f57f6588b8264667e57bff79241c29369"
                        }
                    ]
                },
                "files": {
                    "src/tools/androiddeployqt/main.cpp": {
                        "lines_inserted": 3,
                        "lines_deleted": 3,
                        "size_delta": -6,
                        "size": 123762
                    }
                },
                "commit_with_footers": "Fix C++20 compilation of androiddeployqt\n\nu8 literals changed type from const char[] to const char8_t[] in C++20\nand Qt APIs that don't use QUtf8StringView aren't prepared for it. Use\na classical char literal for the time being.\n\nAmends 857be50b2e193b92de37c3e2bb5124d24d21a253.\n\nPick-to: 6.2\nChange-Id: I7f194befc08ab50cdef321d8900ee3553599a19e\nReviewed-by: Andreas Buhr <andreas.buhr@qt.io>\n"
            },
            "5dcc3c2a8976d0d9abdee0dc4ae5e5c7d15354c0": {
                "kind": "NO_CODE_CHANGE",
                "_number": 2,
                "created": "2021-07-09 09:52:47.000000000",
                "uploader": {
                    "_account_id": 1000869,
                    "name": "Marc Mutz",
                    "email": "marc.mutz@kdab.com",
                    "username": "mmutz"
                },
                "ref": "refs/changes/37/359037/2",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/37/359037/2",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/2 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/2 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/2 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/37/359037/2"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "873119210675c0e38e076c46ec3ecabf9d2ed97e",
                            "subject": "Fix qt_error_string() and QSystemError::string's lack of i18n",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=873119210675c0e38e076c46ec3ecabf9d2ed97e"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marc Mutz",
                        "email": "marc.mutz@kdab.com",
                        "date": "2021-07-09 09:50:04.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Marc Mutz",
                        "email": "marc.mutz@kdab.com",
                        "date": "2021-07-09 09:52:47.000000000",
                        "tz": 0
                    },
                    "subject": "Fix C++20 compilation of androiddeployqt",
                    "message": "Fix C++20 compilation of androiddeployqt\n\nu8 literals changed type from const char[] to const char8_t[] in C++20\nand Qt APIs that don't use QUtf8StringView aren't prepared for it. Use\na classical char literal for the time being.\n\nAmends 857be50b2e193b92de37c3e2bb5124d24d21a253.\n\nPick-to: 6.2\nChange-Id: I7f194befc08ab50cdef321d8900ee3553599a19e\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=5dcc3c2a8976d0d9abdee0dc4ae5e5c7d15354c0"
                        }
                    ]
                },
                "files": {
                    "src/tools/androiddeployqt/main.cpp": {
                        "lines_inserted": 3,
                        "lines_deleted": 3,
                        "size_delta": -6,
                        "size": 123762
                    }
                },
                "description": "Edit commit message"
            }
        },
        "requirements": []
    },
    {
        "id": "qt%2Fqtbase~dev~I37e389c878845162b6f18457984d4f73a265b604",
        "project": "qt/qtbase",
        "branch": "dev",
        "hashtags": [],
        "change_id": "I37e389c878845162b6f18457984d4f73a265b604",
        "subject": "Check whether CMake was built with zstd support",
        "status": "MERGED",
        "created": "2021-04-15 14:59:20.000000000",
        "updated": "2021-04-16 18:14:35.000000000",
        "submitted": "2021-04-16 18:14:35.000000000",
        "submitter": {
            "_account_id": 1003699,
            "name": "Qt CI Bot",
            "email": "qt_ci_bot@qt-project.org",
            "username": "qt_ci_bot"
        },
        "insertions": 28,
        "deletions": 0,
        "total_comment_count": 2,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 343501,
        "owner": {
            "_account_id": 1000120,
            "name": "Joerg Bornemann",
            "email": "joerg.bornemann@qt.io",
            "username": "jbornema"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1006810,
                        "name": "Alexey Edelev",
                        "email": "alexey.edelev@qt.io",
                        "username": "semlanik"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 2,
                        "date": "2021-04-16 18:14:35.000000000",
                        "permitted_voting_range": {
                            "min": 2,
                            "max": 2
                        },
                        "_account_id": 1004184,
                        "name": "Alexandru Croitor",
                        "email": "alexandru.croitor@qt.io",
                        "username": "alexandru.croitor"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-04-16 18:14:35.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1006810,
                        "name": "Alexey Edelev",
                        "email": "alexey.edelev@qt.io",
                        "username": "semlanik"
                    },
                    {
                        "value": 0,
                        "_account_id": 1004184,
                        "name": "Alexandru Croitor",
                        "email": "alexandru.croitor@qt.io",
                        "username": "alexandru.croitor"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1000003,
                    "name": "Kai Koehne",
                    "email": "kai.koehne@qt.io",
                    "username": "kkohne"
                },
                {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                {
                    "_account_id": 1000094,
                    "name": "Cristian Adam",
                    "email": "cristian.adam@qt.io",
                    "username": "cadam",
                    "status": "Vacation 🌴"
                },
                {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                {
                    "_account_id": 1004184,
                    "name": "Alexandru Croitor",
                    "email": "alexandru.croitor@qt.io",
                    "username": "alexandru.croitor"
                },
                {
                    "_account_id": 1006810,
                    "name": "Alexey Edelev",
                    "email": "alexey.edelev@qt.io",
                    "username": "semlanik"
                },
                {
                    "_account_id": 1008411,
                    "name": "Craig Scott",
                    "email": "craig.scott@qt.io",
                    "username": "crscott"
                }
            ],
            "CC": [
                {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-04-15 14:59:20.000000000",
                "updated_by": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "reviewer": {
                    "_account_id": 1000094,
                    "name": "Cristian Adam",
                    "email": "cristian.adam@qt.io",
                    "username": "cadam",
                    "status": "Vacation 🌴"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-15 14:59:20.000000000",
                "updated_by": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "reviewer": {
                    "_account_id": 1004184,
                    "name": "Alexandru Croitor",
                    "email": "alexandru.croitor@qt.io",
                    "username": "alexandru.croitor"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-15 14:59:20.000000000",
                "updated_by": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "reviewer": {
                    "_account_id": 1006810,
                    "name": "Alexey Edelev",
                    "email": "alexey.edelev@qt.io",
                    "username": "semlanik"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-15 14:59:20.000000000",
                "updated_by": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "reviewer": {
                    "_account_id": 1008411,
                    "name": "Craig Scott",
                    "email": "craig.scott@qt.io",
                    "username": "crscott"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-15 14:59:20.000000000",
                "updated_by": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "reviewer": {
                    "_account_id": 1000003,
                    "name": "Kai Koehne",
                    "email": "kai.koehne@qt.io",
                    "username": "kkohne"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-15 14:59:23.000000000",
                "updated_by": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "reviewer": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-04-15 18:40:19.000000000",
                "updated_by": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "reviewer": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "state": "CC"
            },
            {
                "updated": "2021-04-16 05:41:46.000000000",
                "updated_by": {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                },
                "reviewer": {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                },
                "state": "CC"
            },
            {
                "updated": "2021-04-16 07:44:55.000000000",
                "updated_by": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "reviewer": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "state": "REVIEWER"
            }
        ],
        "messages": [
            {
                "id": "6a6f76f7f274721447c0513e8e557dac18870728",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "real_author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "date": "2021-04-15 14:59:20.000000000",
                "message": "Uploaded patch set 1.",
                "_revision_number": 1
            },
            {
                "id": "503977af584cf2dc19d0ecb24bfdca7d557881f0",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-04-15 14:59:23.000000000",
                "message": "Patch Set 1: Sanity-Review+1",
                "_revision_number": 1
            },
            {
                "id": "8ae84c8554aabaedb996d8dfc793750fc5e7248a",
                "author": {
                    "_account_id": 1006810,
                    "name": "Alexey Edelev",
                    "email": "alexey.edelev@qt.io",
                    "username": "semlanik"
                },
                "real_author": {
                    "_account_id": 1006810,
                    "name": "Alexey Edelev",
                    "email": "alexey.edelev@qt.io",
                    "username": "semlanik"
                },
                "date": "2021-04-15 15:04:59.000000000",
                "message": "Patch Set 1: Code-Review+1",
                "_revision_number": 1
            },
            {
                "id": "05fada0b423ac870d5ba23c6bb0af1abd3fabee0",
                "author": {
                    "_account_id": 1004184,
                    "name": "Alexandru Croitor",
                    "email": "alexandru.croitor@qt.io",
                    "username": "alexandru.croitor"
                },
                "real_author": {
                    "_account_id": 1004184,
                    "name": "Alexandru Croitor",
                    "email": "alexandru.croitor@qt.io",
                    "username": "alexandru.croitor"
                },
                "date": "2021-04-15 15:11:14.000000000",
                "message": "Patch Set 1: Code-Review+2\n\n(1 comment)\n\nWere you able to test that it crashes?",
                "_revision_number": 1
            },
            {
                "id": "bfaf5d9e8595fe295324ea2dad2315568f58dab9",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "real_author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "date": "2021-04-15 18:34:44.000000000",
                "message": "Uploaded patch set 2.",
                "_revision_number": 2
            },
            {
                "id": "5f61e7c96877332f1ab8eb43967e89b016db59f3",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-04-15 18:34:46.000000000",
                "message": "Patch Set 2: Sanity-Review+1",
                "_revision_number": 2
            },
            {
                "id": "a1392faeb9a2505c8a3540415d2e6d7be5e31f4f",
                "author": {
                    "_account_id": 1004184,
                    "name": "Alexandru Croitor",
                    "email": "alexandru.croitor@qt.io",
                    "username": "alexandru.croitor"
                },
                "real_author": {
                    "_account_id": 1004184,
                    "name": "Alexandru Croitor",
                    "email": "alexandru.croitor@qt.io",
                    "username": "alexandru.croitor"
                },
                "date": "2021-04-15 18:36:30.000000000",
                "message": "Patch Set 2: Code-Review+2",
                "_revision_number": 2
            },
            {
                "id": "aafa26a1c13b618d0dd3d93b19a2ff3d20e0dad1",
                "author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "real_author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "date": "2021-04-15 18:38:03.000000000",
                "message": "Patch Set 2:\n\n(1 comment)\n\n> Patch Set 1: Code-Review+2\n> \n> (1 comment)\n> \n> Were you able to test that it crashes?\n\nYes, and this is how you do it:\n\n- remove libzstd-dev\n- configure CMake (I've used 3.18.4 like in the bug report)\n- change CMAKE_USE_SYSTEM_ZSTD to ON\n- build CMake\n- confirm that this cmake version behaves as described: \n$ ~/opt/cmake/bin/cmake -P ~/dev/qt/dev/qtbase/config.tests/cmake_zstd/check_zstd.cmake \nCMake Error: archive_write_header: Format must be set before you can write to an archive.\nCMake Error at /home/jobor/dev/qt/dev/qtbase/config.tests/cmake_zstd/check_zstd.cmake:1 (file):\n  file failed to compress: cmake_zstd.zstd\n- re-install libzstd-dev\n- play with this patch",
                "_revision_number": 2
            },
            {
                "id": "93ad9481adeddca07a8b0b50a6836d4261d70e53",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-15 18:40:19.000000000",
                "message": "Patch Set 2:\n\nPre Continuous Integration Quick Check: Running\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1618515135",
                "_revision_number": 2
            },
            {
                "id": "0711db310972398ec57a7a318223bb896f004ff0",
                "author": {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                },
                "real_author": {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                },
                "date": "2021-04-16 05:41:46.000000000",
                "message": "Patch Set 2:\n\nCan we make this a configure failure? \"Please recompile your cmake or explicitly disable Zstd\"",
                "_revision_number": 2
            },
            {
                "id": "8c2de34297962ed149f2f8fd0e09e1623b91dcfe",
                "author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "real_author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "date": "2021-04-16 05:58:27.000000000",
                "message": "Patch Set 2:\n\n> Patch Set 2:\n> \n> Can we make this a configure failure? \"Please recompile your cmake or explicitly disable Zstd\"\n\nThat might be better than silently falling back to gzip. Will do.",
                "_revision_number": 2
            },
            {
                "id": "ea6b35efb75fb5129a1d777413c1849b009aee2e",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "real_author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "date": "2021-04-16 06:08:37.000000000",
                "message": "Uploaded patch set 3.",
                "_revision_number": 3
            },
            {
                "id": "3da274f9c1e15b225cd088d23dca36d9bde0ee43",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-04-16 06:08:39.000000000",
                "message": "Patch Set 3: Sanity-Review+1",
                "_revision_number": 3
            },
            {
                "id": "db2be14a7d15d0124116ae6dbc95045aaa60445e",
                "author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "real_author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "date": "2021-04-16 06:09:21.000000000",
                "message": "Patch Set 2:\n\nThe error looks like this:\n\nCMake Error at src/corelib/CMakeLists.txt:1190 (message):\n  CMake was not built with zstd support.  Rebuild CMake or set\n  QT_AVOID_CMAKE_ARCHIVING_API=ON.",
                "_revision_number": 2
            },
            {
                "id": "f9fcb6edb88b39e4de23b09aed1026326863225b",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-16 07:44:55.000000000",
                "message": "Patch Set 2: Code-Review+1\n\nPre Continuous Integration Quick Check: Passed\n\nPatch looks good. Thanks.\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1618515135",
                "_revision_number": 2
            },
            {
                "id": "32ffa58b1e51498821e15fcdd2251d0ed32c9575",
                "author": {
                    "_account_id": 1004184,
                    "name": "Alexandru Croitor",
                    "email": "alexandru.croitor@qt.io",
                    "username": "alexandru.croitor"
                },
                "real_author": {
                    "_account_id": 1004184,
                    "name": "Alexandru Croitor",
                    "email": "alexandru.croitor@qt.io",
                    "username": "alexandru.croitor"
                },
                "date": "2021-04-16 09:09:03.000000000",
                "message": "Patch Set 3: Code-Review+2",
                "_revision_number": 3
            },
            {
                "id": "63f43a113d8ef1583d430777e2d86fee1bc7fbef",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "real_author": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "date": "2021-04-16 12:40:04.000000000",
                "message": "Staged for CI",
                "_revision_number": 3
            },
            {
                "id": "b77e17a3596ec589d5eea83ad3f42115c30cdccb",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-16 13:23:07.000000000",
                "message": "Added to build refs/builds/qtci/dev/1618579387 for qt/qtbase,refs/heads/refs/staging/dev",
                "_revision_number": 3
            },
            {
                "id": "d0565aa64d7f891b07a4ca2473ee157166313f5c",
                "tag": "autogenerated:gerrit:revert",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-16 14:13:16.000000000",
                "message": "\nContinuous Integration: Failed\n\nCoin failed to acquire a virtual machine, re-staging is unlikely to help, please contact the admins: 'AgentException: 'Failed repeatedly to launch build/test agent' reasons: [[Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials']'\n\nThe error was in \"qt/qtbase\", revision: dd6fa89cffa7bebd23a78e3e092b31b3e697c4ff\n\n AgentException: 'Failed repeatedly to launch build/test agent' reasons: [[Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials'; [Errno 2] No such file or directory: '/var/lib/coin/tqtc-coin-ci/secrets/coin_jenkins_credentials']\n\nBuild log: https://testresults.qt.io/logs/qt/qtbase/8ce30f838ed080473b66a98a2c07c53360b74bc6/MacOSMacOS_11_00arm64MacOSMacOS_11_00arm64Clangqtci-macos-11.0-arm64InsignificantTests/bb1aad2ab2d11555b5644e7f37f08490382d7620/build_1618583721/log.txt.gz\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1618581875_restarted\n\nTested changes (refs/builds/qtci/dev/1618579387):\n  https://codereview.qt-project.org/c/qt/qtbase/+/343443/1 Fix build of jpeg plugin against recent jpeg-turbo on MinGW\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343614/2 Port example away from deprecated QVariant API\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343647/3 QMultiHash: Fix doc\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343501/3 Check whether CMake was built with zstd support\n\n",
                "_revision_number": 3
            },
            {
                "id": "ba6b92aa8fcbdaeecef8a7d92eed7a4353ae2846",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1006637,
                    "name": "Toni Saario",
                    "email": "toni.saario@qt.io",
                    "username": "tosaario"
                },
                "real_author": {
                    "_account_id": 1006637,
                    "name": "Toni Saario",
                    "email": "toni.saario@qt.io",
                    "username": "tosaario"
                },
                "date": "2021-04-16 14:17:49.000000000",
                "message": "Staged for CI",
                "_revision_number": 3
            },
            {
                "id": "f7f02f95f5ddbb72e4b1ad014d8d8364f62909f9",
                "tag": "autogenerated:qt:ci",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-16 15:04:20.000000000",
                "message": "Added to build refs/builds/qtci/dev/1618585460 for qt/qtbase,refs/heads/refs/staging/dev",
                "_revision_number": 3
            },
            {
                "id": "2d12e4ebfb1a0c72d22fca4b59989b7a5277591b",
                "author": {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                },
                "real_author": {
                    "_account_id": 1000329,
                    "name": "Thiago Macieira",
                    "email": "thiago.macieira@intel.com",
                    "username": "thiago"
                },
                "date": "2021-04-16 15:37:20.000000000",
                "message": "Patch Set 3:\n\nThanks!",
                "_revision_number": 3
            },
            {
                "id": "fc5e70238c1af4aa45d8f358d9e4e1d5b891b3cc",
                "tag": "autogenerated:gerrit:merged",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-04-16 18:14:35.000000000",
                "message": "\nContinuous Integration: Passed\n\nPatch looks good. Thanks.\n\nDetails: https://testresults.qt.io/coin/integration/qt/qtbase/tasks/1618585656\n\nTested changes (refs/builds/qtci/dev/1618585460):\n  https://codereview.qt-project.org/c/qt/qtbase/+/343478/1 QList::(const_)iterator: protect element_type on GCC < 11\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343443/1 Fix build of jpeg plugin against recent jpeg-turbo on MinGW\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/332115/31 Address thread safety issues in QProperty classes\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/333246/3 Fix handling of surrogates in QBidiAlgorithm\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343614/2 Port example away from deprecated QVariant API\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343647/3 QMultiHash: Fix doc\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343206/4 Switch metatypes generation on by default for Qt modules\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343591/2 Add documentation links for some JNI entities\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343456/3 QString: add missing char8_t* constructor / fromUtf8 overloads\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343457/1 util/unicode: enable asserts unconditionally\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/343501/3 Check whether CMake was built with zstd support\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/332557/45 Remove lazy binding evaluation\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/332843/33 Don't emit change notifications more often than required\n\n  https://codereview.qt-project.org/c/qt/qtbase/+/332937/34 Add support for grouped property changes\n\n",
                "_revision_number": 4
            }
        ],
        "current_revision": "f4417bf7e8f843438345f496cf5d6a9b6fa33709",
        "revisions": {
            "f4417bf7e8f843438345f496cf5d6a9b6fa33709": {
                "kind": "REWORK",
                "_number": 4,
                "created": "2021-04-16 18:14:35.000000000",
                "uploader": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "ref": "refs/changes/01/343501/4",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/01/343501/4",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/4 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/4 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/4 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/4"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "5656a60dd067a69f9e864a33068ec300124d4e05",
                            "subject": "QList::(const_)iterator: protect element_type on GCC < 11",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=5656a60dd067a69f9e864a33068ec300124d4e05"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Joerg Bornemann",
                        "email": "joerg.bornemann@qt.io",
                        "date": "2021-04-15 14:41:02.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Joerg Bornemann",
                        "email": "joerg.bornemann@qt.io",
                        "date": "2021-04-16 14:49:28.000000000",
                        "tz": 120
                    },
                    "subject": "Check whether CMake was built with zstd support",
                    "message": "Check whether CMake was built with zstd support\n\nCMake 3.18 introduced the file(ARCHIVE_CREATE) API that we use with\nCOMPRESSION Zstd for compressing corelib's mimedatabase.\n\nIt's possible to build CMake without proper zstd support, and we have\nencountered such builds in the wild where the file(ARCHIVE_CREATE) call\ncrashes.\n\nAdd a configure test to determine whether CMake properly supports the\nZstd compression method.\n\nFixes: QTBUG-89108\nChange-Id: I37e389c878845162b6f18457984d4f73a265b604\nReviewed-by: Alexandru Croitor <alexandru.croitor@qt.io>\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=f4417bf7e8f843438345f496cf5d6a9b6fa33709"
                        }
                    ]
                },
                "files": {
                    "config.tests/cmake_zstd/check_zstd.cmake": {
                        "status": "A",
                        "lines_inserted": 5,
                        "size_delta": 123,
                        "size": 123
                    },
                    "configure.cmake": {
                        "lines_inserted": 18,
                        "size_delta": 783,
                        "size": 35646
                    },
                    "src/corelib/CMakeLists.txt": {
                        "lines_inserted": 5,
                        "size_delta": 237,
                        "size": 53300
                    }
                },
                "commit_with_footers": "Check whether CMake was built with zstd support\n\nCMake 3.18 introduced the file(ARCHIVE_CREATE) API that we use with\nCOMPRESSION Zstd for compressing corelib's mimedatabase.\n\nIt's possible to build CMake without proper zstd support, and we have\nencountered such builds in the wild where the file(ARCHIVE_CREATE) call\ncrashes.\n\nAdd a configure test to determine whether CMake properly supports the\nZstd compression method.\n\nFixes: QTBUG-89108\nChange-Id: I37e389c878845162b6f18457984d4f73a265b604\nReviewed-by: Alexandru Croitor <alexandru.croitor@qt.io>\n"
            },
            "a2cfbe74858bff5d70bd07a203a26b07e57e2fd6": {
                "kind": "REWORK",
                "_number": 2,
                "created": "2021-04-15 18:34:44.000000000",
                "uploader": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "ref": "refs/changes/01/343501/2",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/01/343501/2",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/2 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/2 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/2 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/2"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "33e098704e87354c58b3bf975c3113cb82f6be07",
                            "subject": "Merge integration refs/builds/qtci/dev/1618451439",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=33e098704e87354c58b3bf975c3113cb82f6be07"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Joerg Bornemann",
                        "email": "joerg.bornemann@qt.io",
                        "date": "2021-04-15 14:41:02.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Joerg Bornemann",
                        "email": "joerg.bornemann@qt.io",
                        "date": "2021-04-15 18:34:32.000000000",
                        "tz": 120
                    },
                    "subject": "Check whether CMake was built with zstd support",
                    "message": "Check whether CMake was built with zstd support\n\nCMake 3.18 introduced the file(ARCHIVE_CREATE) API that we use with\nCOMPRESSION Zstd for compressing corelib's mimedatabase.\n\nIt's possible to build CMake without proper zstd support, and we have\nencountered such builds in the wild where the file(ARCHIVE_CREATE) call\ncrashes.\n\nAdd a configure test to determine whether CMake properly supports the\nZstd compression method.\n\nFixes: QTBUG-89108\nChange-Id: I37e389c878845162b6f18457984d4f73a265b604\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=a2cfbe74858bff5d70bd07a203a26b07e57e2fd6"
                        }
                    ]
                },
                "files": {
                    "config.tests/cmake_zstd/check_zstd.cmake": {
                        "status": "A",
                        "lines_inserted": 5,
                        "size_delta": 123,
                        "size": 123
                    },
                    "configure.cmake": {
                        "lines_inserted": 18,
                        "size_delta": 783,
                        "size": 35646
                    },
                    "src/corelib/CMakeLists.txt": {
                        "lines_inserted": 6,
                        "lines_deleted": 2,
                        "size_delta": 99,
                        "size": 53095
                    }
                }
            },
            "acef6d9639efc9ce110b6899612dd5c5b24b4bb1": {
                "kind": "REWORK",
                "_number": 3,
                "created": "2021-04-16 06:08:37.000000000",
                "uploader": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "ref": "refs/changes/01/343501/3",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/01/343501/3",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/3 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/3 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/3 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/3"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "33e098704e87354c58b3bf975c3113cb82f6be07",
                            "subject": "Merge integration refs/builds/qtci/dev/1618451439",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=33e098704e87354c58b3bf975c3113cb82f6be07"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Joerg Bornemann",
                        "email": "joerg.bornemann@qt.io",
                        "date": "2021-04-15 14:41:02.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Joerg Bornemann",
                        "email": "joerg.bornemann@qt.io",
                        "date": "2021-04-16 06:08:07.000000000",
                        "tz": 120
                    },
                    "subject": "Check whether CMake was built with zstd support",
                    "message": "Check whether CMake was built with zstd support\n\nCMake 3.18 introduced the file(ARCHIVE_CREATE) API that we use with\nCOMPRESSION Zstd for compressing corelib's mimedatabase.\n\nIt's possible to build CMake without proper zstd support, and we have\nencountered such builds in the wild where the file(ARCHIVE_CREATE) call\ncrashes.\n\nAdd a configure test to determine whether CMake properly supports the\nZstd compression method.\n\nFixes: QTBUG-89108\nChange-Id: I37e389c878845162b6f18457984d4f73a265b604\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=acef6d9639efc9ce110b6899612dd5c5b24b4bb1"
                        }
                    ]
                },
                "files": {
                    "config.tests/cmake_zstd/check_zstd.cmake": {
                        "status": "A",
                        "lines_inserted": 5,
                        "size_delta": 123,
                        "size": 123
                    },
                    "configure.cmake": {
                        "lines_inserted": 18,
                        "size_delta": 783,
                        "size": 35646
                    },
                    "src/corelib/CMakeLists.txt": {
                        "lines_inserted": 5,
                        "size_delta": 237,
                        "size": 53233
                    }
                }
            },
            "2e36ad3caad83b72f6b8d30a3709475190869542": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-04-15 14:59:20.000000000",
                "uploader": {
                    "_account_id": 1000120,
                    "name": "Joerg Bornemann",
                    "email": "joerg.bornemann@qt.io",
                    "username": "jbornema"
                },
                "ref": "refs/changes/01/343501/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt/qtbase",
                        "ref": "refs/changes/01/343501/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/1 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/1 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/1 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt/qtbase\" refs/changes/01/343501/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "33e098704e87354c58b3bf975c3113cb82f6be07",
                            "subject": "Merge integration refs/builds/qtci/dev/1618451439",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=33e098704e87354c58b3bf975c3113cb82f6be07"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Joerg Bornemann",
                        "email": "joerg.bornemann@qt.io",
                        "date": "2021-04-15 14:41:02.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Joerg Bornemann",
                        "email": "joerg.bornemann@qt.io",
                        "date": "2021-04-15 14:47:27.000000000",
                        "tz": 120
                    },
                    "subject": "Check whether CMake was built with zstd support",
                    "message": "Check whether CMake was built with zstd support\n\nCMake 3.18 introduced the file(ARCHIVE_CREATE) API that we use with\nCOMPRESSION Zstd for compressing corelib's mimedatabase.\n\nIt's possible to build CMake without proper zstd support, and we have\nencountered such builds in the wild where the file(ARCHIVE_CREATE) call\ncrashes.\n\nAdd a configure test to determine whether CMake properly supports the\nZstd compression method.\n\nFixes: QTBUG-89108\nChange-Id: I37e389c878845162b6f18457984d4f73a265b604\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt%2Fqtbase.git;a=commit;h=2e36ad3caad83b72f6b8d30a3709475190869542"
                        }
                    ]
                },
                "files": {
                    "config.tests/cmake_zstd/check_zstd.cmake": {
                        "status": "A",
                        "lines_inserted": 5,
                        "size_delta": 123,
                        "size": 123
                    },
                    "configure.cmake": {
                        "lines_inserted": 17,
                        "size_delta": 752,
                        "size": 35615
                    },
                    "src/corelib/CMakeLists.txt": {
                        "lines_inserted": 6,
                        "lines_deleted": 2,
                        "size_delta": 99,
                        "size": 53095
                    }
                }
            }
        },
        "requirements": []
    },
    {
        "id": "qt-creator%2Fqt-creator~5.0~Id5c5db57a8d3335d91911824d06f388ed054df9e",
        "project": "qt-creator/qt-creator",
        "branch": "5.0",
        "hashtags": [],
        "change_id": "Id5c5db57a8d3335d91911824d06f388ed054df9e",
        "subject": "Sqlite: Disable value method for fundamentals",
        "status": "ABANDONED",
        "created": "2021-07-07 09:45:56.000000000",
        "updated": "2021-07-07 11:27:08.000000000",
        "insertions": 11,
        "deletions": 3,
        "total_comment_count": 1,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 358613,
        "owner": {
            "_account_id": 1008515,
            "name": "Miina Puuronen",
            "email": "miina.puuronen@qt.io",
            "username": "miina-puuronen"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 2
                        },
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 2
                        },
                        "_account_id": 1004495,
                        "name": "Vikas Pachdha",
                        "email": "vikas.pachdha@qt.io",
                        "username": "vikas"
                    },
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 2
                        },
                        "_account_id": 1000061,
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "username": "bubke"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:sanity",
                        "value": -2,
                        "date": "2021-07-07 09:45:57.000000000",
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1004495,
                        "name": "Vikas Pachdha",
                        "email": "vikas.pachdha@qt.io",
                        "username": "vikas"
                    },
                    {
                        "value": 0,
                        "permitted_voting_range": {
                            "min": -2,
                            "max": 1
                        },
                        "_account_id": 1000061,
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "username": "bubke"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                {
                    "_account_id": 1004495,
                    "name": "Vikas Pachdha",
                    "email": "vikas.pachdha@qt.io",
                    "username": "vikas"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-07-07 09:45:56.000000000",
                "updated_by": {
                    "_account_id": 1008515,
                    "name": "Miina Puuronen",
                    "email": "miina.puuronen@qt.io",
                    "username": "miina-puuronen"
                },
                "reviewer": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-07-07 09:45:56.000000000",
                "updated_by": {
                    "_account_id": 1008515,
                    "name": "Miina Puuronen",
                    "email": "miina.puuronen@qt.io",
                    "username": "miina-puuronen"
                },
                "reviewer": {
                    "_account_id": 1004495,
                    "name": "Vikas Pachdha",
                    "email": "vikas.pachdha@qt.io",
                    "username": "vikas"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-07-07 09:45:56.000000000",
                "updated_by": {
                    "_account_id": 1008515,
                    "name": "Miina Puuronen",
                    "email": "miina.puuronen@qt.io",
                    "username": "miina-puuronen"
                },
                "reviewer": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-07-07 09:45:57.000000000",
                "updated_by": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "reviewer": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "state": "REVIEWER"
            }
        ],
        "messages": [
            {
                "id": "f3485b6a4562d0296ba8cf3827f854716e0d76d4",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1008515,
                    "name": "Miina Puuronen",
                    "email": "miina.puuronen@qt.io",
                    "username": "miina-puuronen"
                },
                "real_author": {
                    "_account_id": 1008515,
                    "name": "Miina Puuronen",
                    "email": "miina.puuronen@qt.io",
                    "username": "miina-puuronen"
                },
                "date": "2021-07-07 09:45:56.000000000",
                "message": "Uploaded patch set 1.",
                "_revision_number": 1
            },
            {
                "id": "5df2409ccfe45d0f296a0f868216d34667b9b9c1",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-07-07 09:45:57.000000000",
                "message": "Patch Set 1: Sanity-Review-2\n\n(1 comment)\n\nSee http://wiki.qt.io/Early_Warning_System for explanations.",
                "_revision_number": 1
            },
            {
                "id": "0d7c5c6685b03e3eb68b44d173368f54049497bb",
                "author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "real_author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "date": "2021-07-07 09:57:18.000000000",
                "message": "Patch Set 1:\n\nWhy do you need to cherry pick it to 5.0?",
                "_revision_number": 1
            },
            {
                "id": "f3cc1518ce995e646a88595bc2edc12caab75aae",
                "tag": "autogenerated:gerrit:abandon",
                "author": {
                    "_account_id": 1008515,
                    "name": "Miina Puuronen",
                    "email": "miina.puuronen@qt.io",
                    "username": "miina-puuronen"
                },
                "real_author": {
                    "_account_id": 1008515,
                    "name": "Miina Puuronen",
                    "email": "miina.puuronen@qt.io",
                    "username": "miina-puuronen"
                },
                "date": "2021-07-07 11:27:08.000000000",
                "message": "Abandoned\n\nPushed this by mistake.",
                "_revision_number": 1
            }
        ],
        "current_revision": "35c57d08467eb8244a4f679c92601d1869b1c3a3",
        "revisions": {
            "35c57d08467eb8244a4f679c92601d1869b1c3a3": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-07-07 09:45:56.000000000",
                "uploader": {
                    "_account_id": 1008515,
                    "name": "Miina Puuronen",
                    "email": "miina.puuronen@qt.io",
                    "username": "miina-puuronen"
                },
                "ref": "refs/changes/13/358613/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt-creator/qt-creator",
                        "ref": "refs/changes/13/358613/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/13/358613/1 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/13/358613/1 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/13/358613/1 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/13/358613/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "916fc90b448b71db911793cae252298e45d538dd",
                            "subject": "Doc: Describe Show Source and Header Groups filter in Projects view",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=916fc90b448b71db911793cae252298e45d538dd"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-24 12:14:24.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Miina Puuronen",
                        "email": "miina.puuronen@qt.io",
                        "date": "2021-07-07 09:24:09.000000000",
                        "tz": 180
                    },
                    "subject": "Sqlite: Disable value method for fundamentals",
                    "message": "Sqlite: Disable value method for fundamentals\n\nThere is optionalValue which can handle a null value. ints and floats\ncan be initialize to zero but you cannot be sure that this value comes\nfrom the database, is a empty value. So it's better to force\nthe use of optionalValue for ints and floats. In that case empty has\nto be handled.\n\nChange-Id: Id5c5db57a8d3335d91911824d06f388ed054df9e\nReviewed-by: Qt CI Bot <qt_ci_bot@qt-project.org>\nReviewed-by: Vikas Pachdha <vikas.pachdha@qt.io>\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=35c57d08467eb8244a4f679c92601d1869b1c3a3"
                        }
                    ]
                },
                "files": {
                    "src/libs/sqlite/sqlitebasestatement.h": {
                        "lines_inserted": 1,
                        "lines_deleted": 1,
                        "size_delta": 57,
                        "size": 17534
                    },
                    "tests/unit/unittest/sqlitestatement-test.cpp": {
                        "lines_inserted": 10,
                        "lines_deleted": 2,
                        "size_delta": 102,
                        "size": 51652
                    }
                },
                "commit_with_footers": "Sqlite: Disable value method for fundamentals\n\nThere is optionalValue which can handle a null value. ints and floats\ncan be initialize to zero but you cannot be sure that this value comes\nfrom the database, is a empty value. So it's better to force\nthe use of optionalValue for ints and floats. In that case empty has\nto be handled.\n\nChange-Id: Id5c5db57a8d3335d91911824d06f388ed054df9e\nReviewed-by: Qt CI Bot <qt_ci_bot@qt-project.org>\nReviewed-by: Vikas Pachdha <vikas.pachdha@qt.io>\n"
            }
        },
        "requirements": []
    },
    {
        "id": "qt-creator%2Fqt-creator~master~Id5c5db57a8d3335d91911824d06f388ed054df9e",
        "project": "qt-creator/qt-creator",
        "branch": "master",
        "hashtags": [],
        "change_id": "Id5c5db57a8d3335d91911824d06f388ed054df9e",
        "subject": "Sqlite: Disable value method for fundamentals",
        "status": "MERGED",
        "created": "2021-06-24 12:14:46.000000000",
        "updated": "2021-06-28 08:08:59.000000000",
        "submitted": "2021-06-28 08:08:59.000000000",
        "submitter": {
            "_account_id": 1000061,
            "name": "Marco Bubke",
            "email": "marco.bubke@qt.io",
            "username": "bubke"
        },
        "insertions": 11,
        "deletions": 3,
        "total_comment_count": 0,
        "unresolved_comment_count": 0,
        "has_review_started": true,
        "_number": 356550,
        "owner": {
            "_account_id": 1000061,
            "name": "Marco Bubke",
            "email": "marco.bubke@qt.io",
            "username": "bubke"
        },
        "actions": {},
        "labels": {
            "Code-Review": {
                "all": [
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-06-28 08:08:59.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 2
                        },
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 2,
                        "date": "2021-06-28 08:08:59.000000000",
                        "permitted_voting_range": {
                            "min": 2,
                            "max": 2
                        },
                        "_account_id": 1004495,
                        "name": "Vikas Pachdha",
                        "email": "vikas.pachdha@qt.io",
                        "username": "vikas"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000061,
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "username": "bubke"
                    }
                ],
                "values": {
                    "-2": "This shall not be merged",
                    "-1": "I would prefer this is not merged as is",
                    " 0": "No score",
                    "+1": "Looks good to me, but someone else must approve",
                    "+2": "Looks good to me, approved"
                },
                "default_value": 0
            },
            "Sanity-Review": {
                "all": [
                    {
                        "value": 0,
                        "_account_id": 1003699,
                        "name": "Qt CI Bot",
                        "email": "qt_ci_bot@qt-project.org",
                        "username": "qt_ci_bot"
                    },
                    {
                        "tag": "autogenerated:gerrit:merged",
                        "value": 1,
                        "date": "2021-06-28 08:08:59.000000000",
                        "permitted_voting_range": {
                            "min": 1,
                            "max": 1
                        },
                        "_account_id": 1000049,
                        "name": "Qt Sanity Bot",
                        "email": "qt_sanitybot@qt-project.org",
                        "username": "qt_sanity_bot"
                    },
                    {
                        "value": 0,
                        "_account_id": 1004495,
                        "name": "Vikas Pachdha",
                        "email": "vikas.pachdha@qt.io",
                        "username": "vikas"
                    },
                    {
                        "value": 0,
                        "_account_id": 1000061,
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "username": "bubke"
                    }
                ],
                "values": {
                    "-2": "Major sanity problems found",
                    "-1": "Sanity problems found",
                    " 0": "No sanity review",
                    "+1": "Sanity review passed"
                },
                "default_value": 0
            }
        },
        "removable_reviewers": [],
        "reviewers": {
            "REVIEWER": [
                {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                {
                    "_account_id": 1004495,
                    "name": "Vikas Pachdha",
                    "email": "vikas.pachdha@qt.io",
                    "username": "vikas"
                }
            ]
        },
        "pending_reviewers": {},
        "reviewer_updates": [
            {
                "updated": "2021-06-24 12:14:48.000000000",
                "updated_by": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "reviewer": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-06-24 12:16:38.000000000",
                "updated_by": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "reviewer": {
                    "_account_id": 1004495,
                    "name": "Vikas Pachdha",
                    "email": "vikas.pachdha@qt.io",
                    "username": "vikas"
                },
                "state": "REVIEWER"
            },
            {
                "updated": "2021-06-24 12:41:33.000000000",
                "updated_by": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "reviewer": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "state": "CC"
            },
            {
                "updated": "2021-06-24 13:26:07.000000000",
                "updated_by": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "reviewer": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "state": "REVIEWER"
            }
        ],
        "messages": [
            {
                "id": "bf885cf503a2b95aabcf9b48d2e5861d674c2fdb",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "real_author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "date": "2021-06-24 12:14:46.000000000",
                "message": "Uploaded patch set 1.",
                "_revision_number": 1
            },
            {
                "id": "e0a99820628274d26f280866ea23f385b396ef0f",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-06-24 12:14:48.000000000",
                "message": "Patch Set 1: Sanity-Review+1",
                "_revision_number": 1
            },
            {
                "id": "d214961b234a1f1a4c02d745addb945ecb4223ff",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "real_author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "date": "2021-06-24 12:16:01.000000000",
                "message": "Uploaded patch set 2: Patch Set 1 was rebased.",
                "_revision_number": 2
            },
            {
                "id": "70c84af29e3e8ec10645e68c3a6b16ca0e510b11",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-06-24 12:16:02.000000000",
                "message": "Patch Set 2: Sanity-Review+1",
                "_revision_number": 2
            },
            {
                "id": "1bfe9437c178d85231e4d15cda190b297b44304b",
                "tag": "autogenerated:gerrit:newPatchSet",
                "author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "real_author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "date": "2021-06-24 12:16:22.000000000",
                "message": "Uploaded patch set 3: Patch Set 2 was rebased.",
                "_revision_number": 3
            },
            {
                "id": "80c1123216f18a9b15e3ca078d88ee316c8b9798",
                "tag": "autogenerated:sanity",
                "author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "real_author": {
                    "_account_id": 1000049,
                    "name": "Qt Sanity Bot",
                    "email": "qt_sanitybot@qt-project.org",
                    "username": "qt_sanity_bot"
                },
                "date": "2021-06-24 12:16:23.000000000",
                "message": "Patch Set 3: Sanity-Review+1",
                "_revision_number": 3
            },
            {
                "id": "c17ffda49feb4c1b9a749e023b0f4aaee919f172",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-06-24 12:41:33.000000000",
                "message": "Patch Set 3:\n\nPre Continuous Integration Quick Check: Running\n\nDetails: https://testresults.qt.io/coin/integration/qt-creator/qt-creator/tasks/1624538530",
                "_revision_number": 3
            },
            {
                "id": "33be704707778215be3ad7e15b54736f4490e689",
                "author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "real_author": {
                    "_account_id": 1003699,
                    "name": "Qt CI Bot",
                    "email": "qt_ci_bot@qt-project.org",
                    "username": "qt_ci_bot"
                },
                "date": "2021-06-24 13:26:07.000000000",
                "message": "Patch Set 3: Code-Review+1\n\nPre Continuous Integration Quick Check: Passed\n\nPatch looks good. Thanks.\n\nDetails: https://testresults.qt.io/coin/integration/qt-creator/qt-creator/tasks/1624538530",
                "_revision_number": 3
            },
            {
                "id": "0a0f85d3357bf33da3db53a5909242c747d51865",
                "author": {
                    "_account_id": 1004495,
                    "name": "Vikas Pachdha",
                    "email": "vikas.pachdha@qt.io",
                    "username": "vikas"
                },
                "real_author": {
                    "_account_id": 1004495,
                    "name": "Vikas Pachdha",
                    "email": "vikas.pachdha@qt.io",
                    "username": "vikas"
                },
                "date": "2021-06-24 21:09:09.000000000",
                "message": "Patch Set 3: Code-Review+2",
                "_revision_number": 3
            },
            {
                "id": "803f3f2ee5db409919317fc17b20d90b5a177aca",
                "tag": "autogenerated:gerrit:merged",
                "author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "real_author": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "date": "2021-06-28 08:08:59.000000000",
                "message": "Change has been successfully cherry-picked as 091c7a009373c4e580e5477aa51f9f0ec6e27de1 by Marco Bubke",
                "_revision_number": 4
            }
        ],
        "current_revision": "091c7a009373c4e580e5477aa51f9f0ec6e27de1",
        "revisions": {
            "65b9104b4cbdb2389122f347c4ba9c9688bcaf49": {
                "kind": "TRIVIAL_REBASE",
                "_number": 3,
                "created": "2021-06-24 12:16:22.000000000",
                "uploader": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "ref": "refs/changes/50/356550/3",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt-creator/qt-creator",
                        "ref": "refs/changes/50/356550/3",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/3 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/3 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/3 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/3"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "f42b68f4afe5ff7a5e0deeb944f652b0638589c7",
                            "subject": "Merge remote-tracking branch 'origin/5.0'",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=f42b68f4afe5ff7a5e0deeb944f652b0638589c7"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-24 12:14:24.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-24 12:16:17.000000000",
                        "tz": 120
                    },
                    "subject": "Sqlite: Disable value method for fundamentals",
                    "message": "Sqlite: Disable value method for fundamentals\n\nThere is optionalValue which can handle a null value. ints and floats\ncan be initialize to zero but you cannot be sure that this value comes\nfrom the database, is a empty value. So it's better to force\nthe use of optionalValue for ints and floats. In that case empty has\nto be handled.\n\nChange-Id: Id5c5db57a8d3335d91911824d06f388ed054df9e\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=65b9104b4cbdb2389122f347c4ba9c9688bcaf49"
                        }
                    ]
                },
                "files": {
                    "src/libs/sqlite/sqlitebasestatement.h": {
                        "lines_inserted": 1,
                        "lines_deleted": 1,
                        "size_delta": 57,
                        "size": 17532
                    },
                    "tests/unit/unittest/sqlitestatement-test.cpp": {
                        "lines_inserted": 10,
                        "lines_deleted": 2,
                        "size_delta": 102,
                        "size": 51814
                    }
                }
            },
            "6978a68447e58668618c79048dce5a38fcd6ef99": {
                "kind": "TRIVIAL_REBASE",
                "_number": 2,
                "created": "2021-06-24 12:16:01.000000000",
                "uploader": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "ref": "refs/changes/50/356550/2",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt-creator/qt-creator",
                        "ref": "refs/changes/50/356550/2",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/2 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/2 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/2 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/2"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "354a0b17abef403d698b0f81e567dc31a1fe6f5a",
                            "subject": "AutoTest: More filepathification",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=354a0b17abef403d698b0f81e567dc31a1fe6f5a"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-24 12:14:24.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-24 12:15:51.000000000",
                        "tz": 120
                    },
                    "subject": "Sqlite: Disable value method for fundamentals",
                    "message": "Sqlite: Disable value method for fundamentals\n\nThere is optionalValue which can handle a null value. ints and floats\ncan be initialize to zero but you cannot be sure that this value comes\nfrom the database, is a empty value. So it's better to force\nthe use of optionalValue for ints and floats. In that case empty has\nto be handled.\n\nChange-Id: Id5c5db57a8d3335d91911824d06f388ed054df9e\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=6978a68447e58668618c79048dce5a38fcd6ef99"
                        }
                    ]
                },
                "files": {
                    "src/libs/sqlite/sqlitebasestatement.h": {
                        "lines_inserted": 1,
                        "lines_deleted": 1,
                        "size_delta": 57,
                        "size": 17532
                    },
                    "tests/unit/unittest/sqlitestatement-test.cpp": {
                        "lines_inserted": 10,
                        "lines_deleted": 2,
                        "size_delta": 102,
                        "size": 51814
                    }
                }
            },
            "650932e966d39ae88bf239741ad993e790591432": {
                "kind": "REWORK",
                "_number": 1,
                "created": "2021-06-24 12:14:46.000000000",
                "uploader": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "ref": "refs/changes/50/356550/1",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt-creator/qt-creator",
                        "ref": "refs/changes/50/356550/1",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/1 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/1 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/1 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/1"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "d80094946f554388925ce8c0c99351e270f86d4a",
                            "subject": "WIP",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=d80094946f554388925ce8c0c99351e270f86d4a"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-24 12:14:24.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-24 12:14:24.000000000",
                        "tz": 120
                    },
                    "subject": "Sqlite: Disable value method for fundamentals",
                    "message": "Sqlite: Disable value method for fundamentals\n\nThere is optionalValue which can handle a null value. ints and floats\ncan be initialize to zero but you cannot be sure that this value comes\nfrom the database, is a empty value. So it's better to force\nthe use of optionalValue for ints and floats. In that case empty has\nto be handled.\n\nChange-Id: Id5c5db57a8d3335d91911824d06f388ed054df9e\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=650932e966d39ae88bf239741ad993e790591432"
                        }
                    ]
                },
                "files": {
                    "src/libs/sqlite/sqlitebasestatement.h": {
                        "lines_inserted": 1,
                        "lines_deleted": 1,
                        "size_delta": 57,
                        "size": 17532
                    },
                    "tests/unit/unittest/sqlitestatement-test.cpp": {
                        "lines_inserted": 10,
                        "lines_deleted": 2,
                        "size_delta": 102,
                        "size": 51814
                    }
                }
            },
            "091c7a009373c4e580e5477aa51f9f0ec6e27de1": {
                "kind": "REWORK",
                "_number": 4,
                "created": "2021-06-28 08:08:59.000000000",
                "uploader": {
                    "_account_id": 1000061,
                    "name": "Marco Bubke",
                    "email": "marco.bubke@qt.io",
                    "username": "bubke"
                },
                "ref": "refs/changes/50/356550/4",
                "fetch": {
                    "anonymous http": {
                        "url": "https://codereview.qt-project.org/qt-creator/qt-creator",
                        "ref": "refs/changes/50/356550/4",
                        "commands": {
                            "Checkout": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/4 && git checkout FETCH_HEAD",
                            "Cherry Pick": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/4 && git cherry-pick FETCH_HEAD",
                            "Format Patch": "git fetch \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/4 && git format-patch -1 --stdout FETCH_HEAD",
                            "Pull": "git pull \"https://codereview.qt-project.org/qt-creator/qt-creator\" refs/changes/50/356550/4"
                        }
                    }
                },
                "commit": {
                    "parents": [
                        {
                            "commit": "584f0476eca8676abc652d8e907b5e10c08da787",
                            "subject": "qmljstools::LocatorData: improve safety",
                            "web_links": [
                                {
                                    "name": "gitweb",
                                    "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=584f0476eca8676abc652d8e907b5e10c08da787"
                                }
                            ]
                        }
                    ],
                    "author": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-24 12:14:24.000000000",
                        "tz": 120
                    },
                    "committer": {
                        "name": "Marco Bubke",
                        "email": "marco.bubke@qt.io",
                        "date": "2021-06-28 08:08:59.000000000",
                        "tz": 0
                    },
                    "subject": "Sqlite: Disable value method for fundamentals",
                    "message": "Sqlite: Disable value method for fundamentals\n\nThere is optionalValue which can handle a null value. ints and floats\ncan be initialize to zero but you cannot be sure that this value comes\nfrom the database, is a empty value. So it's better to force\nthe use of optionalValue for ints and floats. In that case empty has\nto be handled.\n\nChange-Id: Id5c5db57a8d3335d91911824d06f388ed054df9e\nReviewed-by: Qt CI Bot <qt_ci_bot@qt-project.org>\nReviewed-by: Vikas Pachdha <vikas.pachdha@qt.io>\n",
                    "web_links": [
                        {
                            "name": "gitweb",
                            "url": "/gitweb?p=qt-creator%2Fqt-creator.git;a=commit;h=091c7a009373c4e580e5477aa51f9f0ec6e27de1"
                        }
                    ]
                },
                "files": {
                    "src/libs/sqlite/sqlitebasestatement.h": {
                        "lines_inserted": 1,
                        "lines_deleted": 1,
                        "size_delta": 57,
                        "size": 17532
                    },
                    "tests/unit/unittest/sqlitestatement-test.cpp": {
                        "lines_inserted": 10,
                        "lines_deleted": 2,
                        "size_delta": 102,
                        "size": 51814
                    }
                },
                "commit_with_footers": "Sqlite: Disable value method for fundamentals\n\nThere is optionalValue which can handle a null value. ints and floats\ncan be initialize to zero but you cannot be sure that this value comes\nfrom the database, is a empty value. So it's better to force\nthe use of optionalValue for ints and floats. In that case empty has\nto be handled.\n\nChange-Id: Id5c5db57a8d3335d91911824d06f388ed054df9e\nReviewed-by: Qt CI Bot <qt_ci_bot@qt-project.org>\nReviewed-by: Vikas Pachdha <vikas.pachdha@qt.io>\n"
            }
        },
        "requirements": []
    }
]

test(json4)

function test(jsonArray) {
    for (let k in jsonArray) {
        let json = jsonArray[k]
        //console.log(k)
        collectMetadata(json)
    }
}

async function collectMetadata(json) {
    let metadata = {};
    metadata["id"] = json.id
    metadata = get_owner_info(metadata, json)
    metadata = get_revision_info(metadata, json)
    metadata = get_time_info(metadata, json)
    metadata = {...metadata, ...get_messages_information(json)}
    //metadata = deleteUnnecessary(metadata)

    metadata["close_time"] = json["updated"]
    if (metadata["review_close_date"])
        if (metadata["review_close_date"] < metadata["close_time"])
            metadata["close_time"] = metadata["review_close_date"]
    if (metadata["first_review_in_message_date"])
        if (metadata["first_review_in_message_date"] < metadata["close_time"])
            metadata["close_time"] = metadata["first_review_in_message_date"]

    metadata["diff_created_close_time"] = timeDiff(metadata["close_time"], json.created)

    let time_to_add_human_reviewers = get_time_to_add_human_reviewers(json, metadata["close_time"])
    metadata["avg_time_to_add_human_reviewers"] = time_to_add_human_reviewers.avg_time_to_add_human_reviewers;
    metadata["avg_time_to_add_human_reviewers_before_close"] = time_to_add_human_reviewers.avg_time_to_add_human_reviewers_before_close;

    console.log(metadata)

    //do get the smallest date
    //ab time to add reviewers
    //todo work load of the owner.
    //todo delete outlier
    //todo revision before close time
    //todo delete all but 1st revision
    //todo add new features
    //build time avg per file
    //build time of owner
    //avg time of revision of file
    //avg time of revision of owner
    //avg time between revision owner
    //avg of fail of file

    return metadata;
}

function get_time_to_add_human_reviewers(json, close_time) {
    let reviewers_updated = json["reviewer_updates"]; //todo correct
    let date_created = json["created"]
    let dateDiff = []
    let dateDiff_before_close = []
    if (!reviewers_updated)
        return {
            avg_time_to_add_human_reviewers: undefined,
            avg_time_to_add_human_reviewers_before_close: undefined
        };

    for (let i = 0; i < reviewers_updated.length; i++) {
        let updated = reviewers_updated[i];
        let reviewer_id = updated["reviewer"]["_account_id"];
        //console.log(reviewer_id)
        if (!MetricsUtils.isABot(reviewer_id, projectName)) {
            let date = updated["updated"]; //todo
            dateDiff.push(timeDiff(date_created, date))
            //console.log(date_created)
            //console.log(date)
            if (date < close_time)
                dateDiff_before_close.push(timeDiff(date_created, date))
        }
    }
    return {
        avg_time_to_add_human_reviewers: avg(dateDiff),
        avg_time_to_add_human_reviewers_before_close: avg(dateDiff_before_close)
    }
}

function avg(num_array) {
    return num_array.length > 0 ? MathJs.mean(num_array) : 0;
}

function get_owner_info(metadata, json) {
    if (json.owner) {
        let ownerId = json.owner._account_id;
        metadata["owner_id"] = ownerId;
        metadata["is_a_bot"] = MetricsUtils.isABot(ownerId, projectName);
        if (metadata["is_a_bot"])
            return Promise.resolve(false)
    }
    return metadata
}

function get_revision_info(metadata, json) {
    let revisions = json.revisions;
    if (revisions) {
        metadata["revisions_num"] = Object.keys(revisions).length
        metadata["first_revision"] = MetricsUtils.get_first_revision_number(json)
        metadata["first_revision_kind"] = MetricsUtils.get_first_revision_kind(json)
        metadata["is_trivial_rebase"] = MetricsUtils.is_trivial_rebase(json);
    }
    return metadata
}

function get_time_info(metadata, json) {
    metadata["review_close_date"] = get_review_time_in_label(json)
    metadata["date_updated_date_created_diff"] = timeDiff(json.created, json.updated)
    metadata["is_review_close_date_equal_updated_time"] = is_equal(metadata["review_close_date"], json.updated)
    if (metadata["review_close_date"])
        metadata["review_close_to_date_created_diff"] = timeDiff(json.created, metadata["review_close_date"])
    return metadata
}


function get_messages_information_before_close(messages, close_time){
    let msgs = []
    for (let k in messages){
        let msg = messages[k];
        let date = message.date;
        if(date <= close_time){
            msgs.push(msg)
        }
    }
    return msgs;
}

function get_messages_information(json) {
    let messages = json.messages;

    if (!messages)
        return {}

    let messages_count = Object.keys(messages).length;
    let messages_per_account = {}
    let messages_human_count = 0
    let messages_bot_count = 0
    let message_review_time = [];
    //let message_auto_tag = [];
    let has_auto_tag_merged = false;
    let has_auto_tag_abandoned = false;

    let time_diff_between_messages = []
    let time_diff_between_messages_before_review = []
    let lastTime = 0
    let has_been_review = false;
    let last_revision_number = 0;
    let revisions_list = [];
    let build_message_list = [];

    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        let date = message.date;

        if (!message.author)
            continue;

        let code_review = analyse_code_review(message)
        if (code_review !== undefined) {
            if (code_review["Code-Review"] === 2 || code_review["Code-Review"] === -2) {
                message_review_time.push(code_review["date"])
                has_been_review = true;
            }
        }

        let auto_tag = analyse_auto_tag(message)
        if (auto_tag !== undefined) {
            //message_auto_tag.push(auto_tag)
            if (auto_tag["tag"] === "merged")
                has_auto_tag_merged = true
            else if (auto_tag["tag"] === "abandoned")
                has_auto_tag_abandoned = true
        }

        let author = messages[i].author._account_id;

        //count message per account
        if (!messages_per_account[author])
            messages_per_account[author] = 1;
        else
            messages_per_account[author] = messages_per_account[author] + 1;

        //count bot message
        if (MetricsUtils.isABot(author, projectName)) {
            messages_bot_count += 1
        } else {
            messages_human_count += 1
        }

        //analyse time between message
        if (i === 0) {

        }
        if (lastTime !== 0) {
            //let diff_time = timeDiff(time_diff_between_messages[time_diff_between_messages.length - 1], date)
            let diff_time = timeDiff(lastTime, date)
            time_diff_between_messages.push(diff_time)
            if (!has_been_review) {
                time_diff_between_messages_before_review.push(diff_time)
            }
        }

        //analyse time between revision
        let revision_number = message._revision_number;
        //console.log(revisions_list)
        if (last_revision_number !== revision_number) {
            let rev = {revision: revision_number, start: date}
            revisions_list.push(rev)
            if (last_revision_number > 1) {
                revisions_list[revisions_list.length - 1]["end"] = date;
            }
            last_revision_number = revision_number;
        } else {
            //revisions_list[revisions_list.length - 1]["last_message_time"] = date;
            revisions_list[revisions_list.length - 1]["end"] = date;
        }

        if (i === messages.length - 1) {
            revisions_list[revisions_list.length - 1]["end"] = date;
            //revisions_list[revisions_list.length - 1]["last_message_time"] = date;
        }

        //analyse build time
        let bot_build_info = get_bot_message(message)
        if (bot_build_info !== undefined)
            build_message_list.push(bot_build_info);

        lastTime = Moment.utc(date);
    }
    let first_review_in_message_date = message_review_time.length > 0 ? message_review_time[0] : 0

    //anaylse all info collected
    let max_inactive_time = time_diff_between_messages.length > 0 ? MathJs.max(time_diff_between_messages) : 0
    let max_inactive_time_before_review = time_diff_between_messages_before_review.length > 0 ? MathJs.max(time_diff_between_messages_before_review) : 0
    let is_inactive = false;
    if (max_inactive_time > 2190) {
        //3 month
        is_inactive = true
    }

    let avg_time_between_msg = time_diff_between_messages.length > 0 ? MathJs.mean(time_diff_between_messages) : 0
    let avg_time_between_msg_before_revision = time_diff_between_messages_before_review.length > 0 ? MathJs.mean(time_diff_between_messages_before_review) : 0

    let revision_time = []
    let revision_time_before_close = []
    let time_between_revision = []
    let time_between_revision_before_close = []
    for (let i = 0; i < revisions_list.length; i++) {
        let rev_item = revisions_list[i];
        let start = rev_item["start"];
        let end = rev_item["end"];
        revision_time.push(timeDiff(start, end)) //todo before revision

        if (i > 0) {
            time_between_revision.push(timeDiff(revisions_list[i - 1]["end"], revisions_list[i]["start"]))
        }

        if (start < first_review_in_message_date) {
            if (start < first_review_in_message_date)
                revision_time_before_close.push(timeDiff(start, end))
            else
                revision_time_before_close.push(timeDiff(start, revision_time_before_close))
            if (i > 0) {
                time_between_revision_before_close.push(timeDiff(revisions_list[i - 1]["end"], revisions_list[i]["start"]))
            }
        }

    }

    let avg_time_revision = revision_time.length > 0 ? MathJs.mean(revision_time) : 0
    let avg_time_revision_before_close = revision_time_before_close.length > 0 ? MathJs.mean(revision_time_before_close) : 0
    let avg_time_between_revision = time_between_revision > 0 ? MathJs.mean(time_between_revision) : 0
    let avg_time_between_revision_before_close = time_between_revision_before_close > 0 ? MathJs.mean(time_between_revision_before_close) : 0

    //message per account
    let messages_per_account_array = []
    for (let key in messages_per_account) {
        messages_per_account_array.push({account: key, num_messages: messages_per_account[key]})
    }

    //analyse build info
    let build_info = analyse_build_info(build_message_list, revisions_list, first_review_in_message_date)
    let avg_build_time = build_info.avg_time_of_build;
    let num_of_build_success = build_info.num_of_build_success;
    let num_of_build_failures = build_info.num_of_build_failures;

    let avg_build_time_before_close = build_info.avg_time_of_build_before_close;
    let num_of_build_success_before_close = build_info.num_of_build_success_before_close;
    let num_of_build_failures_before_close = build_info.num_of_build_failures_before_close;

    return {
        messages_count: messages_count,
        messages_per_account: messages_per_account_array,
        messages_human_count: messages_human_count,
        messages_bot_count: messages_bot_count,
        is_inactive: is_inactive,
        max_inactive_time: max_inactive_time,
        max_inactive_time_before_review: max_inactive_time_before_review,
        has_auto_tag_merged: has_auto_tag_merged,
        has_auto_tag_abandoned: has_auto_tag_abandoned,
        avg_time_between_msg: avg_time_between_msg,
        avg_time_between_msg_before_revision: avg_time_between_msg_before_revision,
        avg_time_revision: avg_time_revision,
        avg_time_revision_before_close: avg_time_revision_before_close,
        avg_time_between_revision: avg_time_between_revision,
        avg_time_between_revision_before_close: avg_time_between_revision_before_close,
        has_been_review_in_message: has_been_review,
        first_review_in_message_date: first_review_in_message_date,
        avg_build_time: avg_build_time,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,
        avg_build_time_before_close: avg_build_time_before_close,
        num_of_build_success_before_close: num_of_build_success_before_close,
        num_of_build_failures_before_close: num_of_build_failures_before_close,
    };
}

//todo time to add reviewer

function get_bot_message(message_info) {
    let date = message_info.date;
    let revision_number = message_info._revision_number;

    if (!message_info.author)
        return undefined;

    let author_id = message_info.author._account_id;

    let message = message_info.message;
    //console.log(typeof message)
    let is_a_bot = MetricsUtils.isABot(author_id, projectName)

    if (!is_a_bot)
        return undefined

    //let url_pat = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gm
    let url_pat = /\bhttps?:\/\/\S+/gi
    const urls = message.match(url_pat);

    if (['qt'].includes(projectName)) {
        let build_start_patt = /.*(Added to build .* for .*|Pre Continuous Integration Quick Check: Running).*/mi
        let build_success_patt = /.*(Continuous Integration: Passed|Pre Continuous Integration Quick Check: Passed).*/mi
        let build_failed_patt = /.*(Continuous Integration: (Failed|Cancelled)|Pre Continuous Integration Quick Check: (Failed|Cancelled)).*/mi;
        let ref_patt = /\brefs\/builds\/[^\s-]*\/\d+/i
        let urls_ref_patt = /\bhttps:\/\/testresults.qt.io\/\S+/i
        let refs = message.match(ref_patt);

        if (message.match(ref_patt))
            refs = message.match(ref_patt)[0]
        else if (message.match(urls_ref_patt))
            refs = message.match(urls_ref_patt)[0];

        if (build_start_patt.test(message)) {
            return {
                date: date,
                "ci_tag": "started",
                author_id: author_id,
                url: urls,
                revision_number: revision_number,
                refs: refs
            }
        } else if (build_success_patt.test(message)) {
            return {
                date: date,
                "ci_tag": "success",
                author_id: author_id,
                failed: false,
                success: true,
                url: urls,
                revision_number: revision_number,
                refs: refs
            }
        } else if (build_failed_patt.test(message)) {
            return {
                date: date,
                ci_tag: "failed",
                author_id: author_id,
                failed: true,
                success: false,
                url: urls,
                revision_number: revision_number,
                refs: refs
            }
        }

    } else if (['android'].includes(projectName)) {
        let build_start_patt = /.*Started presubmit run: .*/mi
        let build_finished_patt = /.*TreeHugger finished with: .*/mi
        let verified_failed_patt = /.*Presubmit-Verified(-1|-2).*/mi
        let verified_success_patt = /.*Presubmit-Verified(\+1|\+2).*/mi
        let ref_patt = /\bhttps?:\/\/android-build.googleplex.com\/builds\/\S+/i
        let build_refs_patt = /L[0-9]+\S+/i
        const refs = message.match(ref_patt) ? message.match(ref_patt)[0] : null;
        const build_refs = message.match(build_refs_patt) ? message.match(build_refs_patt)[0] : null;
        /*console.log(refs)
        console.log(build_refs)
        if(refs)
            console.log(message)*/
        if (build_start_patt.test(message)) {
            //console.log(message)
            return {
                date: date,
                ci_tag: "started",
                author_id: author_id,
                url: urls,
                revision_number: revision_number,
                refs: refs,
                build_refs: build_refs,
            }
        } else if (build_finished_patt.test(message)) {
            const failed = verified_failed_patt.test(message);
            const success = verified_success_patt.test(message);
            return {
                date: date,
                "ci_tag": "finished",
                author_id: author_id,
                url: urls,
                failed: failed,
                success: success,
                revision_number: revision_number,
                refs: refs,
                build_refs: build_refs,
            }
        }
    }
    //if (['libreoffice', 'asterisk', 'scilab', 'eclipse', 'onap'].contains(projectName)) {
    else {
        let build_start_patt = /.*Build (Started|queued).*\bhttps?:\/\/\S+.*/mi
        let build_success_patt = /.*Build Successful .* \bhttps?:\/\/\S+.* : SUCCESS /mi
        let build_succeeded_patt = /.*Build succeeded \(check pipeline\).*/mi
        let build_failed_patt = /.*Build Failed .* \bhttps?:\/\/\S+.* : (FAILURE|ABORTED) /mi;

        let url_pat = /\bhttps?:\/\/\S+/gi
        let success_pat = /\bSUCCESS\S+/gi
        let failure_pat = /\bFAILURE\S+/gi
        //let failure_pat = /\bSKIPPED\S+/gi
        const refs = message.match(url_pat);

        if (build_start_patt.test(message)) {
            return {
                date: date, "ci_tag": "started",
                author_id: author_id, url: urls, revision_number: revision_number, refs: refs

            }
        } else if (build_success_patt.test(message)) {
            return {
                date: date, "ci_tag": "success", author_id: author_id, url: urls,
                failed: false,
                success: true,
                revision_number: revision_number, refs: refs
            }
        } else if (build_failed_patt.test(message)) {
            return {
                date: date, "ci_tag": "failed", author_id: author_id,
                url: urls, revision_number: revision_number, failed: true,
                success: false, refs: refs
            }
        } else if (build_succeeded_patt.test(message)) {
            let success_num = message.match(success_pat) ? message.match(success_pat).length : 0;
            let fail_num = message.match(failure_pat) ? message.match(failure_pat).length : 0;
            return {
                date: date,
                "ci_tag": "succeeded",
                author_id: author_id,
                url: urls,
                revision_number: revision_number,
                fail_num: fail_num,
                success_num: success_num
            }
        }
    }

    return undefined
}

function analyse_android_build_info(build_message_list, revisions_list, first_review_date_in_message_date) {
    let build_time = {};
    let num_of_build_success = 0;
    let num_of_build_failures = 0;
    let avg_time_of_build = 0;
    let build_time_array = [];

    let build_time_before_close = {};
    let build_time_array_before_close = [];
    let avg_time_of_build_before_close = 0;
    let num_of_build_success_before_close = 0;
    let num_of_build_failures_before_close = 0;

    for (let i = 0; i < build_message_list.length; i++) {
        let build_message = build_message_list[i];
        if (build_message["ci_tag"] === "started") {
            let refs = build_message["refs"]
            if (!build_time[refs])
                build_time[refs] = {}
            build_time[refs]["started"] = build_message["date"];
        } else if (build_message["ci_tag"] === "finished") {
            let refs = build_message["refs"]
            if (!build_time[refs])
                build_time[refs] = {}
            build_time[refs]["finished"] = build_message["date"];
            if (build_message["failed"])
                num_of_build_failures += 1
            if (build_message["success"])
                num_of_build_success += 1
        }

        if (build_message["date"] < first_review_date_in_message_date) {
            if (build_message["ci_tag"] === "finished") {
                if (build_message["failed"])
                    num_of_build_failures_before_close += 1
                if (build_message["success"])
                    num_of_build_success_before_close += 1
            }
        }

    }
    for (let key in build_time) {
        build_time_array.push(timeDiff(build_time[key]["started"], build_time[key]["finished"]))
    }

    for (let key in build_time_before_close) {
        if (build_time_before_close[key]["started"] <= first_review_date_in_message_date && build_time_before_close[key]["finished"] <= first_review_date_in_message_date)
            build_time_array_before_close.push(timeDiff(build_time_before_close[key]["started"], build_time_before_close[key]["finished"]))
    }
    avg_time_of_build = build_time_array.length > 0 ? MathJs.mean(build_time_array) : 0
    avg_time_of_build_before_close = build_time_array_before_close.length > 0 ? MathJs.mean(build_time_array_before_close) : 0
    return {
        avg_time_of_build: avg_time_of_build,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,

        avg_time_of_build_before_close: avg_time_of_build_before_close,
        num_of_build_success_before_close: num_of_build_success_before_close,
        num_of_build_failures_before_close: num_of_build_failures_before_close,
    }
}

function analyse_qt_build_info(build_message_list, revisions_list, first_review_date_in_message_date) {
    let build_time = {};
    let num_of_build_success = 0;
    let num_of_build_failures = 0;
    let avg_time_of_build = 0;
    let build_time_array = [];

    let build_time_before_close = {};
    let build_time_array_before_close = [];
    let avg_time_of_build_before_close = 0;
    let num_of_build_success_before_close = 0;
    let num_of_build_failures_before_close = 0;

    for (let i = 0; i < build_message_list.length; i++) {
        let build_message = build_message_list[i];
        if (build_message["ci_tag"] === "started") {
            let refs = build_message["refs"]
            if (!build_time[refs])
                build_time[refs] = {}
            build_time[refs]["started"] = build_message["date"];
        } else if (build_message["ci_tag"] === "failed" || build_message["ci_tag"] === "success") {
            let refs = build_message["refs"]
            if (!build_time[refs])
                build_time[refs] = {}
            build_time[refs]["finished"] = build_message["date"];
            if (build_message["failed"])
                num_of_build_failures += 1
            if (build_message["success"])
                num_of_build_success += 1
        }

        if (build_message["date"] < first_review_date_in_message_date) {
            if (build_message["ci_tag"] === "failed" || build_message["ci_tag"] === "success") {
                if (build_message["failed"])
                    num_of_build_failures += 1
                if (build_message["success"])
                    num_of_build_success += 1
            }
        }

    }

    for (let key in build_time) {
        let start = build_time[key]["started"]
        if(!start)
            start = get_revision_stared_date(build_time[key]["revision_number"], revisions_list)

        if (start && build_time[key]["finished"])
            build_time_array.push(timeDiff(start, build_time[key]["finished"]))
    }

    for (let key in build_time_before_close) {
        if (build_time_before_close[key]["started"] <= first_review_date_in_message_date && build_time_before_close[key]["finished"] <= first_review_date_in_message_date)
            if (build_time_before_close[key]["finished"])
                build_time_array_before_close.push(timeDiff(build_time_before_close[key]["started"], build_time_before_close[key]["finished"]))
    }
    avg_time_of_build = build_time_array.length > 0 ? MathJs.mean(build_time_array) : 0
    avg_time_of_build_before_close = build_time_array_before_close.length > 0 ? MathJs.mean(build_time_array_before_close) : 0
    return {
        avg_time_of_build: avg_time_of_build,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,

        avg_time_of_build_before_close: avg_time_of_build_before_close,
        num_of_build_success_before_close: num_of_build_success_before_close,
        num_of_build_failures_before_close: num_of_build_failures_before_close,
    }
}

function get_revision_stared_date(revision_number, revisions_list){
    for (let k in revisions_list){
        let rev = revisions_list[k];
        if(rev.revision === revision_number)
            return rev.start
    }
}

function analyse_build_info(build_message_list, revisions_list, first_review_date_in_message_date) {
    //console.log(build_message_list)
    let num_of_build_success = 0;
    let num_of_build_failures = 0;
    let avg_time_of_build = 0;
    let build_time_array = [];
    let build_time_array_before_close = [];
    let avg_time_of_build_before_close = 0;
    let num_of_build_success_before_close = 0;
    let num_of_build_failures_before_close = 0;

    if (['android'].includes(projectName)) {
        return analyse_android_build_info(build_message_list, revisions_list, first_review_date_in_message_date)
    } else if (['qt'].includes(projectName)) {
        return analyse_qt_build_info(build_message_list, revisions_list, first_review_date_in_message_date)
    } else {
        let build_time = {};
        let build_succeeded_time = {};
        for (let i = 0; i < build_message_list.length; i++) {
            let build_message = build_message_list[i];
            let bot_id = build_message.owner_id;
            if (build_message["ci_tag"] === "succeeded") {
                build_succeeded_time.push(
                    {
                        date: build_message["date"],
                        revision: build_message["revision_number"],
                        success_num: build_message["success_num"],
                        fail_num: build_message["fail_num"]
                    }
                )
            } else if (build_message["ci_tag"] === "started") {
                let refs = build_message["refs"]
                for (let k in refs) {
                    let ref = refs[k]
                    build_time[bot_id][ref]["started"] = build_message["date"];
                    build_time[bot_id][ref]["revision"] = build_message["revision_number"]
                }
            } else if (build_message["ci_tag"] === "failed" || build_message["ci_tag"] === "success") {
                let refs = build_message["refs"]
                for (let k in refs) {
                    let ref = refs[k]
                    build_time[bot_id][ref]["finished"] = build_message["date"];
                    build_time[bot_id][ref]["revision"] = build_message["revision_number"]
                    if ([ref]["failed"])
                        num_of_build_failures += 1
                    if ([ref]["success"])
                        num_of_build_success += 1
                }
            }
        }
        //get bot avg time
        let build_time_array_for_bot_individually = []
        for (let k in build_time) {
            //build_time_array.push(timeDiff(build_time[key]["started"], build_time[key]["finished"]))
            let bot_build_time = build_time[k]
            let bot_build_time_array = []
            for (let key in bot_build_time) {
                let bot_time = bot_build_time[key];
                if (bot_time["started"])
                    bot_build_time_array.push(timeDiff(bot_time["started"], bot_time["finished"]))
                else {
                    let revision_number = bot_time["revision_number"]
                    let revision_start_date = 0
                    for (let j in revisions_list) {
                        if (revisions_list[j]["revision_number"] === revision_number)
                            revision_start_date = revisions_list[j]["date"]
                    }

                    bot_build_time_array.push(timeDiff(revision_start_date, bot_time["finished"]))
                }
            }
            let avg_bot_build_time = bot_build_time_array.length > 0 ? MathJs.mean(bot_build_time_array) : 0
            build_time_array_for_bot_individually.push(avg_bot_build_time)
        }
        //get succeeded time
        let build_time_array_for_all = []
        for (let k in build_succeeded_time) {
            let bot_build_succeeded_time = build_succeeded_time[k]
            num_of_build_failures = bot_build_succeeded_time["fail_num"]
            num_of_build_success = bot_build_succeeded_time["success_num"]
            let revision_number = bot_build_succeeded_time["revision_number"]
            let revision_start_date = revisions_list[revisions_list.length - 1]["date"]
            build_time_array_for_all.push(timeDiff(revision_start_date, build_time[k]["finished"]))
        }

        if (build_time_array_for_all.length > 0) {
            let avg_time = MathJs.mean(build_time_array_for_all)
            build_time_array.push(avg_time)
        } else {
            let avg_time = build_time_array_for_bot_individually.length > 0 ? MathJs.mean(build_time_array_for_bot_individually) : 0
            build_time_array.push(avg_time)
        }

    }

    avg_time_of_build = build_time_array.length > 0 ? MathJs.mean(build_time_array) : 0
    return {
        avg_time_of_build: avg_time_of_build,
        num_of_build_success: num_of_build_success,
        num_of_build_failures: num_of_build_failures,
    }
}

function analyse_auto_tag(message_info) {
    let pat_auto_tag_merged = /.*autogenerated:gerrit:merged.*/;
    let pat_auto_tag_abandon = /.*autogenerated:gerrit:abandon.*/;
    let date = message_info.date;

    if (!message_info.author)
        return undefined;
    let author_id = message_info.author._account_id;

    let message = message_info.message;
    if (pat_auto_tag_merged.test(message)) {
        return {date: date, tag: "merged", author_id: author_id}
    } else if (pat_auto_tag_abandon.test(message)) {
        return {date: date, tag: "abandoned", author_id: author_id}
    } else {
        return undefined
    }
}

function analyse_code_review(message_info) {
    let pat_plus_2 = /.*Code-Review\+2.*/;
    let pat_plus_1 = /.*Code-Review\+1.*/;
    let pat_minus_2 = /.*Code-Review-2.*/;
    let pat_minus_1 = /.*Code-Review-1.*/;
    let date = message_info.date;

    if (!message_info.author)
        return undefined;

    let author_id = message_info.author._account_id;

    let message = message_info.message
    if (pat_plus_2.test(message)) {
        return {date: date, "Code-Review": 2, author_id: author_id}
    } else if (pat_minus_2.test(message)) {
        return {date: date, "Code-Review": -2, author_id: author_id}
    } else if (pat_plus_1.test(message)) {
        return {date: date, "Code-Review": 1, author_id: author_id}
    } else if (pat_minus_1.test(message)) {
        return {date: date, "Code-Review": -1, author_id: author_id}
    } else {
        return undefined
    }
}

function is_equal(time1, time2) {
    return time1 === time2;
}

function get_review_time_in_label(json) {
    let labels = json["labels"];
    let time = undefined

    if (!!!labels)
        return time;

    let code_review = []
    if (labels["Code-Review"]) {
        if (labels["Code-Review"]["all"])
            code_review = labels["Code-Review"]["all"];
        else
            return time;
    } else {
        return time;
    }

    for (let i = 0; i < code_review.length; i++) {
        let review = code_review[i];
        let value = review.value;
        if (value === 2 || value === -2) {
            time = review.date
        }
    }
    return time;
}

function timeDiff(time1, time2) {
    let createdTime = Moment.utc(time1);
    let updatedTime = Moment.utc(time2);
    let time = Math.abs(createdTime.toDate() - updatedTime.toDate());
    return Moment.duration(time).asHours()
}