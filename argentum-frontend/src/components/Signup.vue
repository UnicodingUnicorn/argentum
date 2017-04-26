<template>
  <div class="row">
    <form class="col m10 offset-m1" id="signup" v-on:submit.prevent="signup">
        <div v-show="message" class="row">
          <div class="col m12">
            <div class="card-panel red">
              <span class="white-text">{{message}}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-field col m12">
            <input id="email" type="email" class="validate" v-model="signup_data.email">
            <label for="email">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col m12">
            <input id="username" type="text" class="validate" v-model="signup_data.username">
            <label for="username">Username</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col m12">
            <input id="password" type="password" class="validate" v-model="signup_data.password">
            <label for="password">Password</label>
          </div>
        </div>
        <input class="btn" type="submit" value="Signup">
    </form>
  </div>
</template>

<script>
  export default{
    name : 'signup',
    data() {
      return {
        signup_data : {
          email : '',
          username : '',
          password : ''
        },
        message : ''
      }
    },
    methods : {
      signup : function(event){
        this.$http.post("/api/adduser", this.signup_data, {emulateJSON : true}).then(
          res => {
            this.$cookie.set('token', res.body.token.token, res.body.token.expiry);
            this.$store.commit('setToken', this.$cookie.get('token'));
            this.$router.push('/');
          },
          res => {
            this.message = res.body.message;
          }
        );
      }
    }
  };
</script>
