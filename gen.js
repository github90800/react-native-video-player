import firebase from 'firebase';
import axios from 'axios';
import {Alert, YellowBox} from "react-native";
import _ from "lodash";
import { Permissions, Notifications } from 'expo';

const CONNECTION_STRING = "https://es.lolmenow.com";
const UNIVERSITY_NAME = 'maryland';

const config = {
    auth: {
        username: 'lolmenow',
        password: 'lolmenow1234'
    },
    dataType: 'json',
}

export class Gen {
    static removeYellowWarning() {
        YellowBox.ignoreWarnings(['Setting a timer']);
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };
    }

    static sendNotification(uid) {
        Gen.getUniversityDatabase().child(`Users/${uid}/expoToken`).once('value').then(function(snapshot) {
            const token = snapshot.val();
            console.log("token ", token)
            Gen.axiosInstance.post("https://exp.host/--/api/v2/push/send", {
                "to": token,
                "title":"Someone has answered!",
                "body": "There is an activity on your question, please check!"
            }, config)
                .then((success) => {
                    console.log("sent notification")
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    }

    static async registerForPushNotificationsAsync(uid) {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        Gen.getUniversityDatabase()
            .child(`Users/${uid}`)
            .set({
                uid,
                expoToken: token
            });
    }

    static initSearch() {
        const axiosInstance = axios.create({
            baseURL: CONNECTION_STRING
        });
        this.axiosInstance = axiosInstance;
    }

    static addToSearchIndex(question, id) {

        this.axiosInstance.post(`${CONNECTION_STRING}/frienduno/question`, {
                "question": question.toString(),
                "id": id.toString(),
            }, config)
        .then((success) => {
        })
        .catch((error) => {
            console.log(error);
        });
    }

    static search(searchString, callback) {
        const query = {
                "query": {
                    "match": {
                        "question" : {
                            "query": searchString,
                            "analyzer": "standard"
                        }
                    }
                }
        };

        const params = {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        }

        this.axiosInstance.get(`${CONNECTION_STRING}/frienduno/question/_search`, {...params, ...config})
            .then((success) => {
                const data = success.data.hits.hits;
                const results =  data.map(d => d._source);
                callback(results);
            })
            .catch((error) => {
                console.log("Axios get request",error);
            });
    }

    static initializeFirebase() {
        const config = {
            apiKey: "AIzaSyDL5UKQOMFZpPoouYYQLJbh5S1hUm486gs",
            authDomain: "frienduno-68e5b.firebaseapp.com",
            databaseURL: "https://frienduno-68e5b.firebaseio.com",
            projectId: "frienduno-68e5b",
            storageBucket: "frienduno-68e5b.appspot.com",
            messagingSenderId: "694851440116"
        };

        !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
    }
    static getDatabase() {
        return firebase.database();
    }

    static getUniversityDatabase() {
        return firebase.database().ref(UNIVERSITY_NAME);
    }

    static getBestAnswer(answers) {
        if(!answers) return '';
        let bestAnswer = '';
        let bestAnswerTimeStamp = -1;
        Object.entries(answers).forEach(
            ([key, value]) => {
                if(value.approve == 1 && value.timestamp > bestAnswerTimeStamp) {
                    bestAnswerTimeStamp = value.timestamp;
                    bestAnswer = value.answer;
                }
            }
        );
        return bestAnswer;
    }

    static trim(str) {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }
}
