var vm = new Vue({
	el : "#app",
	data : {
		message : "test",
		success : false
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
							
					}
				},
				function(res){
					this.message = "Something went wrong!";
				}
			);
		}
	}
});
