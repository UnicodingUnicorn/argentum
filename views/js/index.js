var Vue = require("vue");
var cookies = require("js-cookie");
//Vue.use(cookies);

var app = new Vue({
	el : "#app",
	data : {
		
	},
	computed : {
		loggedIn : function(){
			return Cookies.get("token") != undefined;
		},
		message : function(){
			if(Cookies.get("token") != undefined){
				return "Yep";
			}else{
				return "Nope";
			}
		}
	},
	methods : {
		login : function(event){
			$.post("/login", {username : $("#loginEmail").val(), password : $("#loginPassword").val()}, function(data){
				Cookies.set("token", data.token, {expires : data.expires_in})
			});
		},
		createUser : function(event){
			
		}
	}
});
