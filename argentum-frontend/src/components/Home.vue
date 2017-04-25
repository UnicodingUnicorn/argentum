<template>
  <div class="row">
    <div class="col m10 offset-m1">
      <div class="row">
        <div v-for="station in stations" class="col s4">
          <station :playingStation="playingStation" :station="station"  v-on:playing="switchPlayer"></station>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name : 'home',
    data() {
      return {
        user : null,
        token : this.$cookie.get("token"),
        stations : [],
        playingStation : ""
      }
    },
    methods : {
      switchPlayer : function(event){
        this.playingStation = event;
      }
    },
    beforeMount : function() {
      this.$http.get("/api/stations").then(
        res => {
          this.stations = res.body.stations
        }, res => {
          console.log(res.body.data);
      });
      if(this.token){
        this.$http.get("/api/user", {params : {token : this.token}}).then(
          res => {
            this.user = res.body.user;
          }, res => {
            //Materialize.toast(res.body.message, 4000);
            console.log(res.body.message);
        });
      }
    }
  }
</script>
