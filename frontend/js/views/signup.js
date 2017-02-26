var vm = new Vue({
	el : "#app",
	data : {
		message : "",
		success : undefined,
		loggedin : Cookies.get("token")
	},
	methods : {
		signup : function(event){
			var formData = {
				username : $("#username").val(),
				password : $("#password").val(),
				unit : $("#unit").val()
			};
			this.$http.post("/api/createuser", formData, {emulateJSON : true}).then(
				function(res){
					this.message = res.body;
					this.success = res.body.success;
					if(res.body.success){
						Cookies.set("token", res.body.token.token, {expires : res.body.token.expires});
						//document.cookie = "token=" + res.body.token.token + ";max-age=" + res.body.token.expires;
						window.location.href = "index.html";
						//this.message = Cookies.get("token");
					}else{
						this.message = res.body.success;
					}
				},
				function(res){
					this.message = "Something went wrong!";
				}
			);
		}
	}
});
