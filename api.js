module.exports = function(nano){
  var config = require("./config");
  var users = nano.db.use("users");
  var stations = nano.db.use("stations");

  var async = require("async");
  var icecast = require("icecast");

  var express = require("express");
  var bodyParser = require("body-parser");

  var secret = config.secret;
  var expiry = config.expiry;
  var jwt = require("jsonwebtoken");

  var api = express.Router();
  api.use(bodyParser.urlencoded({extended : true}));
  api.use(bodyParser.json());

  /**
   * @api {get} / Ping API
   * @apiName Ping
   * @apiGroup General
   *
   * @apiSuccess {String} message "Received"
   *
   * @apiSuccessExample Success-Response:
   * 	HTTP/1.1 200 OK
   * 	{
   *	    "message" : "Received"
   * 	}
   */
  api.get("/", function(req, res){
    res.status(200).json({
      message : "Received"
    });
  });

  /**
   * @api {post} /adduser Add a user with error checking
   * @apiName AddUser
   * @apiGroup User
   *
   * @apiParam {String} username Proposed username for new user
   * @apiParam {String} email New user's email
   * @apiParam {String} password Proposed password for new user. Minimum strength is not enforced server-side.
   *
   * @apiSuccess {String} message Success!
   * @apiSuccess {String} token.token JWT token used for verification. Keep it safe.
   * @apiSuccess {String} token.expiry Expiry time for aforementioned JWT.
   *
   * @apiSuccessExample Success-Response:
   * 	HTTP/1.1 200 OK
   * 	{
   *	    "message" : "Success",
   *	    "token" : {"token" : "<JWT>", "expiry" : 1}
   *	}
   *
   * @apiError DatabaseError The database encountered some sort of error.
   *
   * @apiErrorExample {json} Database Error:
   * 	HTTP/1.1 500 Internal Server Error
   * 	{
   *	    "message" : "Database error"
   * 	}
   *
   * @apiError UserAlreadyExists The user you want to add (based on email) already exists
   *
   * @apiErrorExample {json} User Exists:
   * 	HTTP/1.1 400 Bad Request
   * 	{
   *	    "message" : "User already exists"
   * 	}
   */
  api.post("/adduser", function(req, res){
    users.get(req.body.username, function(err, body){
      if(err){
        if(err.statusCode == 404){
          users.insert({email : req.body.email, password : req.body.password}, req.body.username, function(err, body){
            if(err){
              res.status(500).json({
                message : "Database error"
              });
            }else{
              users.get(req.body.username, function(err, body){
                res.status(200).json({
                  message : "Success!",
                  token : {token : jwt.sign(body, secret), expiry : expiry}
                });
              });
            }
          });
        }else{
          res.status(500).json({
            message : "Database error"
          });
        }
      }else{
        res.status(400).json({
          message : "User already exists"
        });
      }
    });
  });

  /**
   * @api {post} /login Log a user in based on username and password
   * @apiName Login
   * @apiGroup User
   *
   * @apiParam {String} username User's username
   * @apiParam {String} password User's password
   *
   * @apiSuccess {String} message Success!
   * @apiSuccess {String} token.token User's JWT token
   * @apiSuccess {String} token.expiry Expiry for JWT token
   * @apiSuccessExample {json} Success-Response:
   * 	HTTP/1.1 200 OK
   * 	{
   *	    "message" : "Success!",
   *	    "token" : {"token" : "<JWT>", "expiry" : 1}
   * 	}
   *
   *  @apiError DatabaseError The database has encountered some form of error
   *  @apiErrorExample {json} Database Error:
   *  	HTTP/1.1 500 Internal Server Error
   *  	{
   *	    message : "Database error"
   *  	}
   *
   *  @apiError UserNotFound User's username led to no one
   *  @apiErrorExample {json} User not Found:
   *  	HTTP/1.1 400 Bad Request
   *  	{
   *	    message : "User not found"
   *  	}
   *
   *  @apiError IncorrectPassword User's password was incorrect
   *  @apiErrorExample {json} Incorrect Password:
   *  	HTTP/1.1 400 Bad Request
   *  	{
   *	    message : "Incorrect Password"
   *  	}
   */
  api.post('/login', function(req, res){
    users.get(req.body.username, function(err, body){
      console.log(body);
      if(err){
        if(err.statusCode == 404){
          res.status(400).json({
            message : "User not found"
          });
        }else{
          res.status(500).json({
            message : "Database error"
          })
        }
      }else{
        if(body.password == req.body.password){
          res.status(200).json({
            message : "Success!",
            token : {token : jwt.sign(body, secret), expiry : expiry}
          })
        }else {
          res.status(400).json({
            message : "Incorrect password"
          });
        }
      }
    });
  });

  /**
   * @api {get} /stations Get all the stations
   * @apiName GetStations
   * @apiGroup Station
   *
   * @apiSuccess {String} message Success!
   * @apiSuccess {json} stations JSON array of all the stations
   * @apiSuccessExample Success Response:
   * 	HTTP/1.1 200 OK
   * 	{
   *	    "message" : "Success!",
   *	    "stations" : [{station}...]
   * 	}
   *
   * @apiError DatabaseError The database encountered an error
   * @apiErrorExample {json} Database Error
   * 	HTTP/1.1 500 Internal Server Error
   * 	{
   *	    "message" : "Database Error"
   *	}
   */
  api.get("/stations", function(req, res){
    stations.list(function(err, body){
      if(err){
        res.status(500).json({
          message : "Database error",
          data : err
        });
      }else{
        var stations_data = [];
        async.each(body.rows, function(doc, station_cb){
          stations.get(doc.id, function(err, station){
            if(err){
              station_cb(err);
            }else{
              stations_data.push(station);
              station_cb(null);
            }
          });
        }, function(err){
          if(err){
            res.status(500).json({
              message : "Database error",
              data : err
            });
          }else{
            res.status(200).json({
              message : "Success!",
              stations : stations_data
            });
          }
        });
      }
    });
  });

  /**
   * @api {get} /stations/:station Get a specific station by ID
   * @apiName GetStationID
   * @apiGroup Station
   *
   * @apiParam station ID of the station
   *
   * @apiSuccess {String} message Success!
   * @apiSuccess {json} station JSON Object of the Station
   * @apiSuccessExample Success-Response:
   * 	HTTP/1.1 200 OK
   *	{
   *	    "message" : "Success!"
   *	    "station" : {<station>}
   *	}
   */
  api.get("/stations/:station", function(req, res){
    stations.get(req.params.station, function(err, body){
      if(err){
        res.status(400).json({
          message : err
        });
      }else{
        res.status(200).json({
          message : "Success!",
          station : body
        });
      }
    });
  });

  /**
   * @api {get} /user Get a user's infomation from his JWT
   * @apiName GetUserToken
   * @apiGroup User
   *
   * @apiParam {String} token JWT
   *
   * @apiSuccess {String} message Success!
   * @apiSuccess {json} user JSON object of user
   *
   * @apiSuccessExample {json} Success-Response:
   *	HTTP/1.1 200 OK
   *	{
   *	    "message" : "Success!"
   *	    "user" : {<user>}
   *	}
   */
  api.get("/user", function(req, res){
    jwt.verify(req.query.token, secret, function(err, decoded){
      if(err){
        res.status(400).json({
          message : err
        });
      }else{
        res.status(200).json({
          message : "Success!",
          user : decoded
        });
      }
    });
  });

  /**
   * @api {get} /user/:username Get a user by username
   * @apiName GetUserUsername
   * @apiGroup User
   *
   * @apiParam {String} username User's username
   *
   * @apiSuccess {String} message Success!
   * @apiSuccess {json} user JSON Object of user
   *
   * @paiSuccessExample Success-Response:
   * 	HTTP/1.1 200 OK
   * 	{
   *	    "message" : "Success!",
   *	    "user" : {<user>}
   * 	}
   */
  api.get("/user/:username", function(req, res){
    users.get(req.params.username, function(err, body){
      if(err){
        res.status(400).json({
          message : err
        });
      }else{
        res.status(200).json({
          message : "Success!",
          user : body
        });
      }
    });
  });

  /**
   * @api {post} /addstation Add a station
   * @apiName AddStation
   * @apiGroup Station
   *
   * @apiParam {String} token User JWT for authentication
   * @apiParam {String} name Name of new Station
   * @apiParam {String} stream Stream URL of new Station
   *
   * @apiSuccess {String} message Success!
   * @apiSuccess {json} station New station body
   *
   * @apiSuccessExample Success=Response
   * 	HTTP/1.1 200 OK
   * 	{
   *	    "message" : "Success!"
   *	    "station" : {<station>}
   * 	}
   *
   */
  api.post("/addstation", function(req, res){
    jwt.verify(req.body.token, secret, function(err, decoded){
      if(err){
        res.status(400).json({
          message : "Invalid token",
          data : err
        });
      }else{
        if(req.body.name == ''){
          res.status(400).json({
            message : "Please enter a name!"
          });
        }else if(req.body.genre == ''){
          res.status(400).json({
            message : "Please enter a genre!"
          });
        }else if(req.body.description == ''){
          res.status(400).json({
            message : "Please enter a description!"
          });
        }else if(req.body.website == ''){
          res.status(400).json({
            message : "Please enter a website!"
          });
        }else if(req.body.stream == ''){
          res.status(400).json({
            message : "Please enter at least one stream url"
          });
        }else{
          icecast.get(req.body.stream, function(res){
            if(res.headers['icy-name']){
              stations.insert({stream : req.body.stream}, req.body.name, function(err, body){
                if(err){
                  res.status(500).json({
                    message : err
                  });
                }else{
                  res.status(200).json({
                    message : "Success",
                    station : body
                  });
                }
              });
            }else{
              res.status(400).json({
                message : "Please enter valid stream url"
              });
            }
          });
        }
      }
    });
  });

  return api;
};
