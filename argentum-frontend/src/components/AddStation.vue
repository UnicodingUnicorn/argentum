<template>
  <div class="row">
    <form v-if="token" class="col m8 offset-m2" v-on:submit.prevent="add">
      <div v-show="message" class="row">
        <div class="col m12">
          <div class="card-panel red">
            <span class="white-text">{{message}}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="name" type="text" class="validate" v-model="station_data.name">
          <label for="name">Station Name</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="stream" type="text" class="validate" v-model="station_data.stream">
          <label for="stream">Stream URL</label>
        </div>
      </div>
      <input class="btn" type="submit" value="Submit">
    </form>
    <div v-else class="col m3 s4 offset-s4 offset-m3 card">
      <div class="card-content">
        <p>Please login to submit a new station!</p>
      </div>
      <div class="card-action">
        <a><router-link to="/login">Login</router-link></a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name : 'addstation',
    data(){
      return {
        token : this.$cookie.get('token'),
        message : "",
        station_data : {
          token : this.$cookie.get('token'),
          name : "",
          stream : ""
        }
      }
    },
    methods : {
      add : function(){
        this.$http.post("/api/addstation", this.station_data).then(
          res => {
            Materialize.toast("Success!", 4000);
            this.$router.push("/");
          }, res => {
            this.message = res.body.message;
        });
      }
    }
  }
</script>
