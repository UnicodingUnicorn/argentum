<template>
  <ul class="collection">
    <li class="collection-item avatar">
      <img src="http://placehold.it/250x250" alt="" class="circle">
      <span class="title">{{station._id}}<span class="badge">{{song_data.listeners}}</span></span>
      <p>{{song_data.title}} <br>
         {{song_data.artist}}
      </p>
      <a class="secondary-content">
        <i class="material-icons clickable" v-show="!(playingStation == station._id)" v-on:click="play">play_arrow</i>
        <i class="material-icons clickable" v-show="playingStation == station._id" v-on:click="pause">pause</i>
      </a>
    </li>
    <audio v-bind:src="station.stream" ref="audio" style="position:absolute"></audio>
  </ul>
  <!--div class="card horizontal">
    <div class="card-image">
      <img src="http://placehold.it/250x250">
    </div>
    <div class="card-stacked">
      <span class="card-title">
        {{station._id}}
        <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
      </span>
      <div class="card-content">
        <p>
          <span>
            <i class="material-icons clickable" v-show="!(playingStation == station._id)" v-on:click="play">play_arrow</i>
            <i class="material-icons clickable" v-show="playingStation == station._id" v-on:click="pause">pause</i>
          </span>
          <div v-show="song_data"> {{song_data.title}}</div>
        </p>
      </div>
      <audio v-bind:src="station.stream" ref="audio" style="position:absolute"></audio>
    </div>
  </div-->
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
