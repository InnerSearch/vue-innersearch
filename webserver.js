const express = require("express");

var app = express();
app.listen(3000, () => {
    console.log("Serveur lance au port 3000")
});

app.use(express.static(__dirname + "/view/"));

app.get("/search/:id", (req, res) => {
    res.send("Hey");
});

app.post("/search/", (req, res) => {
    console.log(req);
    console.log(req.body);
    res.send(req.body);
});

// Lancer le serveur : nodemon webserver.js

/*
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon webserver.js"
  },

  npm run start  ==> lance le script start (qui lance le serveur)
*/


// http://localhost:3000/
/* app.get("/", function(req, res){
    res.sendFile("hey");
}) */

/* // http://localhost:3000/user?nom=yin&cp=73000
app.get("/user", function(req, res){
    console.log(req.query.name); // 'yin'
  	console.log(req.query.cp) // '73000'
})

// http://localhost:3000/user/yin/73000
app.get("/user/:nom/:cp", function(req, res){
    console.log(req.params.name); // 'yin'
  	console.log(req.params.cp) // '73000'
})

// post
app.post("/user", function(req, res){
    console.log(req.body.name); // 'yin'
  	console.log(req.body.cp) // '73000'
}) */