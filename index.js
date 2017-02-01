var express = require("express");

var app = express();

var models = require("./models");

var mongoose = require("mongoose");
mongoose.connect("mongodb://admin:password@localhost:27017/argentum");

var backend = require("./backend")(mongoose, models);
var frontend = require("./frontend")(mongoose, models);

app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/views"));

app.use(backend);
app.use(frontend);

/*app.listen(process.env.PORT || 8080, function(){
	console.log("Listening");
});*/
app.listen(1837, function(){
	console.log("Listening");
});