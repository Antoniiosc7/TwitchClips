const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

//API Antonio Saborido

const _ = require('lodash');
const axios = require('axios').default;
/*
*/
const config = require('./config.json');


module.exports.register = (app) => {
    console.log("hola");
    app.use(bodyParser.json());
    (async () => {
        /* Get access token */
        /* Get access token */
        const access_token = 'Bearer ' + (await axios({
            method: 'post',
            url: 'https://id.twitch.tv/oauth2/token',
            params: {
                client_id: config.client_id,
                client_secret: config.client_secret,
                grant_type: 'client_credentials'
            }
        })).data.access_token;



        /* Set a date limit (Friday 23h42) */
        //const prevFriday = new Date();
        const prevFriday = "2022-04-12T21:44:41Z";
        //prevFriday.setDate(prevFriday.getDate() - (prevFriday.getDay() + 2) % 7);
        //prevFriday.setHours(23, 42);

        /* Retrieve channel's latest clips */


        /* Computes and sorts the best clippers */
        // ################################################# ME ######################################## //


        /*
        const th3antonioclips = _.groupBy((await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '39115143',
                started_at: prevFriday,
                first: '5',
            }
        })).data.data, 'broadcaster_id');
        */
        const th3antonioclips = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '39115143',
                started_at: prevFriday,
                first: '100',
            }
        })).data.data;

        app.get(BASE_API + "/th3antonio", (req, res) => {
            res.send(JSON.stringify(th3antonioclips));
        });

        const ojoninja = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '39692658',
                started_at: prevFriday,
                first: '100',
            }
        })).data.data;

        app.get(BASE_API + "/elojoninja", (req, res) => {
            res.send(JSON.stringify(ojoninja));
        });

        const werlyb = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '30357893',
                started_at: prevFriday,
                first: '100',
            }
        })).data.data;

        app.get(BASE_API + "/werlyb", (req, res) => {
            res.send(JSON.stringify(werlyb));
        });

        const elyoya = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '427520929',
                started_at: prevFriday,
                first: '100',
            }
        })).data.data;

        app.get(BASE_API + "/elyoya", (req, res) => {
            res.send(JSON.stringify(elyoya));
        });

        const koldo = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '131736363',
                started_at: prevFriday,
                first: '100',
            }
        })).data.data;

        app.get(BASE_API + "/koldo", (req, res) => {
            res.send(JSON.stringify(koldo));
        });

        const skain = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '106867975',
                started_at: prevFriday,
                first: '100',
            }
        })).data.data;

        app.get(BASE_API + "/skain", (req, res) => {
            res.send(JSON.stringify(skain));
        });
    })();





}