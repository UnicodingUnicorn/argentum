import Vue from 'vue';
import Router from 'vue-router';

import Hello from '@/components/Hello';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import Home from '@/components/Home';
import AddStation from '@/components/AddStation'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path : '/login',
      name : 'Login',
      component : Login
    },
    {
      path : '/signup',
      name : 'Signup',
      component : Signup
    },
    {
      path : '/addstation',
      name : 'AddStation',
      component : AddStation
    }
  ]
});
