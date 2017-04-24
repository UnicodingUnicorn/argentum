<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">{{station._id}}</span>
      <p>
        <i class="material-icons clickable" v-show="!playing" v-on:click="play">play_arrow</i>
        <i class="material-icons clickable" v-show="playing" v-on:click="pause">pause</i>
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
    props : ['station'],
    methods : {
      play : function(event){
        this.playing = true;
        this.$refs.audio.play();
      },
      pause : function(event){
        this.playing = false;
        this.$refs.audio.pause();
      }
    },
    mounted : function(){
      this.$refs.audio.pause();
    }
  }
</script>
