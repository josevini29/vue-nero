import Vue from 'vue'
import * as firebase from 'firebase'
import VueRouter from 'vue-router'

import Login from './components/Login/Login'
import Dashboard from './components/Dashboard/Dashboard'

Vue.use(VueRouter)
/* eslint-disable no-new */

var config = {
  apiKey: 'AIzaSyDO4PWqU6BzXwVYCzGYriCSta_mHfOyjXE',
  authDomain: 'orc-pessoal.firebaseapp.com',
  databaseURL: 'https://orc-pessoal.firebaseio.com',
  projectId: 'orc-pessoal',
  storageBucket: 'orc-pessoal.appspot.com',
  messagingSenderId: '249423719471'
}

firebase.initializeApp(config)

const App = {
  template: '<router-view></router-view>'
}

const routes = [
  { path: '/', redirect: 'dashboard' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard }
]

const router = new VueRouter({
  routes, mode: 'history'
})

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
