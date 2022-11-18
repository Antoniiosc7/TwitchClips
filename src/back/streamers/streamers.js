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
        const prevFriday = "2022-11-13T00:00:00Z";
        const numclips =  '30';
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
                first: numclips,
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
                first: numclips,
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
                first: numclips,
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
                first: '80',
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
                first: numclips,
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
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/skain", (req, res) => {
            res.send(JSON.stringify(skain));
        });

        const kerios = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '118974117',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/kerios", (req, res) => {
            res.send(JSON.stringify(kerios));
        });

        const carmensandwich = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '232316529',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/carmensandwich", (req, res) => {
            res.send(JSON.stringify(carmensandwich));
        });
        const nissaxter = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '42351942',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/nissaxter", (req, res) => {
            res.send(JSON.stringify(nissaxter));
        });
        const pochipoom = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '45878070',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/pochipoom", (req, res) => {
            res.send(JSON.stringify(pochipoom));
        });
        const ffaka = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '40909862',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/ffaka", (req, res) => {
            res.send(JSON.stringify(ffaka));
        });

        const th3antonio = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '39115143',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/th3antonio", (req, res) => {
            res.send(JSON.stringify(th3antonio));
        });

        const JavierrLoL = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '98048949',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/JavierrLoL", (req, res) => {
            res.send(JSON.stringify(JavierrLoL));
        });

        const Zeling = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '58753574',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/Zeling", (req, res) => {
            res.send(JSON.stringify(Zeling));
        });

        const grekko_ = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '51525345',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/grekko_", (req, res) => {
            res.send(JSON.stringify(grekko_));
        });
        const xixauxas = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '152463923',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/xixauxas", (req, res) => {
            res.send(JSON.stringify(xixauxas));
        });
        const send0o = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '33734881',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/send0o", (req, res) => {
            res.send(JSON.stringify(send0o));
        });

        const pausenpaii = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '61473477',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/pausenpaii", (req, res) => {
            res.send(JSON.stringify(pausenpaii));
        });
        const holasoysergio1 = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '81795200',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/holasoysergio1", (req, res) => {
            res.send(JSON.stringify(holasoysergio1));
        });
        const miniduke = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '42973421',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/miniduke", (req, res) => {
            res.send(JSON.stringify(miniduke));
        });
        const getflakked = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '159785521',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/getflakked", (req, res) => {
            res.send(JSON.stringify(getflakked));
        });

        const elmiillor = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '44880944',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/elmiillor", (req, res) => {
            res.send(JSON.stringify(elmiillor));
        });

        const jaimemellado_ = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '141078391',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/jaimemellado_", (req, res) => {
            res.send(JSON.stringify(jaimemellado_));
        });

        const champi14 = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '47919664',
                started_at: prevFriday,
                first: numclips,
            }
        })).data.data;

        app.get(BASE_API + "/champi14", (req, res) => {
            res.send(JSON.stringify(champi14));
        });

        const pepiinero = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '50872216',
                started_at: prevFriday,
                first: '80',
            }
        })).data.data;

        app.get(BASE_API + "/pepiinero", (req, res) => {
            res.send(JSON.stringify(pepiinero));
        });

        const ibai = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '83232866',
                started_at: prevFriday,
                first: '80',
            }
        })).data.data;

        app.get(BASE_API + "/ibai", (req, res) => {
            res.send(JSON.stringify(ibai));
        });

        const knekro = (await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                broadcaster_id: '152633332',
                started_at: prevFriday,
                first: '80',
            }
        })).data.data;

        app.get(BASE_API + "/knekro", (req, res) => {
            res.send(JSON.stringify(knekro));
        });
    })();





}