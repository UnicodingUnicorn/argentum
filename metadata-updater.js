module.exports = function(nano){
  var config = require("./config");
  var stations = nano.db.use("stations");

  var async = require("async");
  var request = require("request");

  var http = require("http").Server(require("express")());
  var io = require("socket.io")(http);

  stations.list(function(err, body){
    if(err){
      console.error("Error getting stations list");
    }else{
      stations_data = [];
      async.each(body.rows, function(doc, station_cb){
          stations.get(doc.id, function(err, station){
            if(err){
              station_cb(err);
            }else{
              var metadata_url = station.stream.match(/http:\/\/[\w|\.]+:\d{4}\//) + "status-json.xsl";
              setInterval(function(){
                request(metadata_url, function (error, response, body) {
                  if(JSON.stringify(body) != JSON.stringify(stations_data[station._id])){
                    io.emit('update', {id : station._id, metadata : JSON.parse(body).icestats});
                  }
                  stations_data[station._id] = body;
                });
              }, 10000);
              station_cb(null);
            }
          });
        }, function(err){
          if(err){
            console.log("Error getting full station data");
          }
      });
    }
  });

  http.listen(config.metadata_port, function(err){
    err ? console.log(err) : console.log("Metadata listening at " + config.metadata_port);
  });
}
