<template>
  <div>
    <nav>
      <div class="nav-wrapper teal">
        <a class="brand-logo">Argentum</a>
        <ul id="nav-mobile" class="right">
          <li v-show="!token"><router-link to="/login">Login</router-link></li>
          <li v-show="!token"><router-link to="/signup">Signup</router-link></li>
          <li v-show="token"><router-link to="/addstation">Add Station</router-link></li>
          <li v-show="token"><a v-on:click="logout">Logout</a></li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed : {
    token : function(){
      return this.$store.state.token;
    }
  },
  methods : {
    logout : function(event){
      this.$cookie.delete("token");
      this.$store.commit('setToken', "");
    }
  },
  created : function(){
    this.$store.commit('setToken', this.$cookie.get('token'));
  }
}
</script>
