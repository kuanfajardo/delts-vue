import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/'
import store, {SET_CURRENT_USER} from './store'
import VeeValidate from 'vee-validate'
import firebase from 'firebase'
import './plugins/firebase'

Vue.config.productionTip = false

let app

Vue.use(VeeValidate, { fieldsBagName: 'formFields' })
Vue.prototype.$_glob = {}

firebase.auth().onAuthStateChanged(function (user) { // TODO: Move to another file (maybe auth?)
  store.commit(SET_CURRENT_USER, user)
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
