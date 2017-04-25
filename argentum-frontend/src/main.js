// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Resource from 'vue-resource'
import Cookie from 'vue-cookie';
import Vuex from 'vuex';

import Station from "./components/Station"

Vue.config.productionTip = false

Vue.use(Resource);
Vue.use(Cookie);
Vue.use(Vuex);

Vue.component("station", Station);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
