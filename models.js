var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//OAUTH

var OAuthTokens = new Schema({
	accessToken: { type: String },
	accessTokenExpiresOn: { type: Date },
	clientId: { type: String },
	refreshToken: { type: String },
	refreshTokenExpiresOn: { type: Date },
	userId: { type: String }
});

var OAuthClients = new Schema({
	clientId: { type: String },
	clientSecret: { type: String },
	redirectUris: { type: Array }
});



//Others

var User = new Schema({
	username : String,
	email : String,
	password : String
});

var Station = new Schema({
	name : String,
	is_active : Boolean,
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
});

module.exports = {
	OAuthTokens : OAuthTokens,
	OAuthClients : OAuthClients,
	User : User,
	Station : Station
};