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

  api.get("/", function(req, res){
    res.status(200).json({
      message : "Received"
    });
  });

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
                res.json({
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
            message : "Database has encountered an error"
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
