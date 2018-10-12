import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/'
import store from './store'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false

Vue.use(VeeValidate, { fieldsBagName: 'formFields' })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
