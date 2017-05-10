<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">{{station._id}}</span>
      <p>
        <span>
          <i class="material-icons clickable" v-show="!(playingStation == station._id)" v-on:click="play">play_arrow</i>
          <i class="material-icons clickable" v-show="playingStation == station._id" v-on:click="pause">pause</i>
        </span>
        <div v-show="song_data"> {{song_data.title}}</div>
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
        playing : false,
        song_data : {
          artist : "",
          title : "",
          listeners : 0
        }
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
    sockets:{
      connect: function(){
        console.log('socket connected')
      },
      update: function(val){
        if(val.id == this.station._id){
          this.song_data.listeners = 0;
          for(var i = 0; i < val.metadata.source.length; i++){
            var source = val.metadata.source[i];
            if(source.artist){
              this.song_data.artist = source.artist;
              this.song_data.title = source.title;
            }else if(source.title){
              this.song_data.artist = source.title.split(" - ")[0];
              this.song_data.title = source.title.split(" - ")[1];
            }
            if(source.listeners){
              this.song_data.listeners += source.listeners;
            }
            console.log(this.song_data);
          }
          this.metadata = val.metadata;
        }
      }
    },
    watch : {
      playingStation : function(value){
        value == this.station._id ? this.$refs.audio.play() : this.$refs.audio.pause();
      }
    }
  }
</script>
