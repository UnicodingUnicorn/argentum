var express = require("express");

var app = express();

var models = require("./models");

var mongoose = require("mongoose");
mongoose.connect("mongodb://argentum:silver@localhost:27017/argentum");

var api = require("./api")(mongoose, models);

app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/views"));

app.use("/api", api);

app.listen(1837, function(){
	console.log("Listening");
});
