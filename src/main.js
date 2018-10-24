import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/'
import store from './store'
import VeeValidate from 'vee-validate'
import firebase from 'firebase'

Vue.config.productionTip = false

let app;
let config = {
  apiKey: 'AIzaSyCYos8q_4IeiPVsuS-2xQkR8wvkXMYQ164',
  authDomain: 'delts-app.firebaseapp.com',
  databaseURL: 'https://delts-app.firebaseio.com',
  projectId: 'delts-app',
  storageBucket: 'delts-app.appspot.com',
  messagingSenderId: '1088281406702'
}

firebase.initializeApp(config)

Vue.use(VeeValidate, { fieldsBagName: 'formFields' })

firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
