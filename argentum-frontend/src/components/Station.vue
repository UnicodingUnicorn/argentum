<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">{{station._id}}</span>
      <p>
        <i class="material-icons clickable" v-show="!(playingStation == station._id)" v-on:click="play">play_arrow</i>
        <i class="material-icons clickable" v-show="playingStation == station._id" v-on:click="pause">pause</i>
      </p>
    </div>
    <audio v-bind:src="station.stream" ref="audio"></audio>
  </div>
</template>
<style>
  .clickable {
    cursor : pointer;
  }
</style>
<script>
  export default {
    data(){
      return {
        playing : false
      }
    },
    props : ['station', 'playingStation'],
    methods : {
      play : function(event){
        this.playing = true;
        this.$refs.audio.play();
        this.$emit('playing', this.station._id);
      },
      pause : function(event){
        this.playing = false;
        this.$refs.audio.pause();
        this.$emit('playing', "");
      }
    },
    mounted : function(){
      this.$refs.audio.pause();
    },
    watch : {
      playingStation : function(value){
        value == this.station._id ? this.$refs.audio.play() : this.$refs.audio.pause();
      }
    }
  }
</script>
