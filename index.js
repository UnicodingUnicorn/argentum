var config = require("./config");
var nano = require("nano")(config.dburl);

var express = require("express");
var path = require("path");
var api = require("./api")(nano);

var app = express();
app.use("/api", api);

if(config.serveFrontend) app.use(express.static(__dirname + "/argentum-frontend/dist"));

app.listen(config.port, function(err){
  err ? console.log(err) : console.log("Listening at " + config.port);
});
