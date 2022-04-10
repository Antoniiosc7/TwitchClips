const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const BASE_API_URL = "/api/v1"; 
//hola


app.use(bodyParser.json());
app.use("/",express.static('public'));


app.get("/cool", (req,res) => {
    console.log("Requested / route");
    res.send(`<html>
                <body>
                    <h1>`+cool()+`</h1>
                </body>
            </html>`);
});


app.listen(port, () => {
    console.log(`Server ready at port ${port}`);
});

//############## TRABAJO OPCIONAL ALBERTO MARTIN MARTIN (API) ###########################

const backend_premier_league = require("./src/back/premier-league-stats/premier-league");
backend_premier_league(app);

//API Antonio Saborido
const tennis_API = require("./src/back/tennis/tennis.js");
const Datastore = require('nedb');

db_tennis = new Datastore();
app.use(bodyParser.json());

tennis_API.register(app,db_tennis);


//API Fernando Pardo Beltrán(nba-stats)

const nbaStats_API = require("./src/back/nba-stats/index")
nbaStats_API.register(app);
