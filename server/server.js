const path = require("path");
const express = require("express");

var app = express();
const serverPath = path.join(__dirname, "..", "dist");

app.use(express.static(serverPath));

app.get("*", (req, res) => {
    res.sendfile(path.join(serverPath, "index.html"));
})

app.listen(3000)
