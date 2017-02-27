var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model("User", new Schema({
	username : String,
	email : String,
	password : String
}));

var Station = mongoose.model("Station", new Schema({
	name : String,
	is_active : Boolean,
	submitter : { type: Schema.Types.ObjectId, ref: 'User'},
	streams : [{ type: Schema.Types.ObjectId, ref: 'Stream'}],
	//category : ref to category,
	affiliation : String,
	//weight : int, no idea what this does yet
	genre : String,
	country : String,
	current_listeners : Number,
	max_listeners : Number,
	//TODO: station image,
	//TODO: banner image,
	contact_email : String,
	web_url : String,
	irc : String,
	twitter_url : String
}));

var Stream = mongoose.model("Stream", new Schema({
	name : String,
	url : String
}));

module.exports = {
	User : User,
	Station : Station,
	Stream : Stream
};
