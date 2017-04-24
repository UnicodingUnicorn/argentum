<template>
  <div class="row">
    <form class="col m10 offset-m1" v-on:submit.prevent="login">
        <div v-show="message" class="row">
          <div class="col m12">
            <div class="card-panel red">
              <span class="white-text">{{message}}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-field col m12">
            <input id="username" type="text" class="validate" v-model="login_data.username">
            <label for="username">Username</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col m12">
            <input id="password" type="password" class="validate" v-model="login_data.password">
            <label for="password">Password</label>
          </div>
        </div>
        <input class="btn" type="submit" value="Login"> <router-link to="/signup" class="btn">Signup!</router-link>
    </form>
  </div>
</template>

<script>
  export default{
    name : 'login',
    data(){
      return {
        message : "",
        login_data : {
          username : "",
          password : ""
        }
      }
    },
    methods : {
      login : function(event) {
        this.$http.post("/api/login", this.login_data).then(
          res => {
            this.$cookie.set('token', res.body.token.token, res.body.token.expiry);
            this.$router.push('/');
          }, res => {
            this.message = res.body.message
        });

    }
  }
}
</script>
