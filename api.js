module.exports = function(mongoose, models){
	var User = models.User;
	var Station = models.Station;
	
	var express = require("express");
	var bodyParser = require("body-parser");
	var jwt = require("jsonwebtoken");
	
	var secret= "pone";
	
	var api = express.Router();
	
	api.use(bodyParser.json());
	api.use(bodyParser.urlencoded({extended : true}));
	
	function jwtAuth(req, res, next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if(token){
			jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
				if(err){
					res.status(403).json({
						success: false,
						message: 'Failed to authenticate token.'
					});    
					return;
				}else{
					req.decoded = decoded;    
					next();
				}
			});
		}else{
			res.status(403).json({
				success : false,
				message : "No token available"
			});
			return;
		}
	}
	
	api.use(function(req, res, next){
		res.data = {};
		next();
	});
	
	api.post('/createuser', function(req, res, next){
		User.find({email : req.body.email, username : req.body.username}, function(err, user){
			if(err){
				res.json({
					success : false,
					message : err
				});
			}else if(user){
				res.json({
					success : false,
					message : "User already exists"
				});
			}else{
				var new_user = new User({
					username : req.body.username,
					email : req.body.email,
					password : req.body.password
				});
				new_user.save(function(err){
					if(err){
						res.json({
							success : false,
							message : err
						})
					}else{
						var token = jwt.sign(user, secret, {expiresIn : 60 * 60 * 24});
						res.json({
							success : true,
							message : "success",
							token : token
						});
					}
				});
			}
		});
	});
	
	api.post('/login', function(req, res, next){
		User.findOne({username : req.body.username}, function(err, user){
			if(err){
				res.json({
					success : false,
					message : err
				});
			}else if(user){
				if(user.password == req.body.password){
					var token = jwt.sign(user, secret, {expiresIn : 60 * 60 * 24});
					res.json({
						success : true,
						message : "success",
						token : token
					});
				}else{
					res.json({
						success : false,
						message : "password does not match"
					});
				}
			}
		});
	});
	
	return api;
};