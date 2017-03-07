<template>
  <div v-if="loggedin">
    <div class="card-panel col s8 offset-s2">
      <span class="card-content">You've already logged in!</span>
    </div>
  </div>
  <div v-else>
    <div v-if="success==false" class="red card-panel col s8 offset-s2">
      <span class="card-content white-text">{{message}}</span>
    </div>
    <form id="signup" class="col s8 offset-s2" v-on:submit.prevent="signup">
      <div class="row">
        <div class="input-field col s12">
          <input id="username" type="text" class="validate">
          <label for="username">Username</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="unit" type="email" class="validate">
          <label for="unit">Email</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="password" type="password" class="validate">
          <label for="password">Password</label>
        </div>
      </div>
      <input class="waves-effect waves-light btn" type="submit" value="Submit!">
    </form>
  </div>
</template>
<script>
  import Cookies from 'js-cookie';
  import vueResource from 'vue-resource';
  export default {
    name : 'signup',
    data : {
  		message : "",
  		success : undefined,
  		loggedin : Cookies.get("token") != undefined
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
  						window.location.href = "index.html";
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
  };
</script>
