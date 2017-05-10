/*var request = require("request");
var prettyjson = require("prettyjson");

var stream_url = "http://radio.bronyradiogermany.com:8006/daydj";
var metadata_url = stream_url.match(/http:\/\/[\w|\.]+:\d{4}\//) + "status-json.xsl";

console.log(metadata_url);

request(metadata_url, function (error, response, body) {
  console.log(prettyjson.render(body, { noColor: true }));
});*/

var nano = require("nano")("http://localhost:5984");
var async = require("async");
var request = require("request");

var stations = nano.db.use("stations");

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
                console.log(body);
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
