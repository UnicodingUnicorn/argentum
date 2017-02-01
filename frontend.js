//API Frontend
module.exports = function(mongoose, models){	
	var express = require("express");
	
	var frontend = express.Router();
	
	frontend.post("/createuser", function(req, res){
		if(res.data.success){
			res.status(200).send(res.data.success);
		}else if(res.data.error == "client"){
			res.status(400).send(res.data.error);
		}else{
			res.status(500).send(res.data.success);
		}
	});
	
	return frontend;
};