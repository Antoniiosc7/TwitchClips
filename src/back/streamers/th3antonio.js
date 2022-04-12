const bodyParser = require("body-parser");

const BASE_API = "/api/v1";

//API Antonio Saborido

const _ = require('lodash');
const axios = require('axios').default;
/*
*/
const config = require('./config.json');


module.exports.register = (app) =>{
   console.log("hola");
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
        const prevFriday = new Date();
    
        prevFriday.setDate(prevFriday.getDate() - (prevFriday.getDay() + 2) % 7);
        prevFriday.setHours(23, 42);
    
        /* Retrieve channel's latest clips */
        const clips = _.groupBy((await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            headers: {
                'Authorization': access_token,
                'Client-Id': config.client_id
            },
            params: {
                game_id: '21779',
                started_at: prevFriday,
                first: '2',
                language: 'es'
            }
        })).data.data, 'creator_name');
    
        /* Computes and sorts the best clippers */
      // ################################################# ME ######################################## //
        
    
    
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
                first: '100',
            }
        })).data.data, 'creator_name');
    
        app.get(BASE_API+"/th3antonio", (req, res)=>{
            res.send(th3antonioclips);
        });

    })();

    
    
}