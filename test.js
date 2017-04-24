var icecast = require("icecast");

icecast.get("http://radio.bronyradiogermany.com:8006/daydj", function(res){
  console.log(res.headers['icy-name']);
})
