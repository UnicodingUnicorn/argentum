module.exports = function(mongoose, models){
	var User = models.User;
	var Station = models.Station;
	
	var express = require("express");
	var bodyParser = require("body-parser");
	var oauthserver = require("oauth2-server");
	
	var passport = require("passport");
	var localStrategy = require("passport-local"); 
	passport.use(new localStrategy(function(user, password, done){
		User.findOne({username : user}, function(err, user){
			if(err){
				done(err);
			}
			if(!user){
				done(null, false);
			}
			if(user.password == password){
				done(null, user);
			}else{
				done(null, false);
			}
		});
	}));
	
	var backend = express.Router();
	
	backend.use(bodyParser.json());
	backend.use(bodyParser.urlencoded({extended : true}));
	
	backend.oauth = oauthserver({
		model : require("./tokenModel"),
		grants : ['password', 'authorization_code'],
		debug : true,
		accessTokenLifetime : 60 * 60 * 24,
		clientIdRegex: '^[A-Za-z0-9-_\^]{5,30}$'
	});
	
	backend.use(function(req, res, next){
		res.data = {};
		next();
	});
	
	backend.all('/oauth/token', backend.oauth.grant());
	
	backend.post('/createuser', function(req, res, next){
		User.find({email : req.body.email, username : req.body.username}, function(err, user){
			if(err || !user){
				var new_user = new User({
					username : req.body.username,
					email : req.body.email,
					password : req.body.password
				});
				new_user.save(function(err){
					if(err){
						res.data.error = "server";
						res.data.success = null;
					}else{
						res.data.error = null;
						res.data.success = user;
					}
				});
			}else{
				res.data.error = "client";
				res.data.success = null;
			}
		});
		next();
	});
	
	backend.post('/login', passport.authenticate('local', {failureRedirect : '/login'}, function(req, res, next){
		res.data.token = backend.oauth.grant();
		next();
	}));
	
	return backend;
};