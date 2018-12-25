<template>
  <div class="appRoot">
    <template v-if="$route.meta.appMenu">
      <v-app light>
        <app-navigation></app-navigation>
        <v-content>
          <div class="page-wrapper">
            <router-view></router-view>
          </div>
        </v-content>
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
    <v-container>
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        top
        id="snack"
      >
        {{ snackbar.text }}
        <v-btn
          dark
          flat
          @click="snackbar.show = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import appEvents from './events'
import AppNavigation from './components/AppNavigation'

export default {
  name: 'App',
  components: { AppNavigation },
  data () {
    return {
      snackbar: {
        show: false,
        text: '',
        color: '',
        timeout: 3000
      }
    }
  },

  created () {
    appEvents.forEach(item => {
      this.$on(item.name, item.callback)
    })
    this.$_glob.root = this
  }
}
</script>

<style>
  .page-wrapper {
    min-height: calc(100vh - 64px - 50px - 81px );
  }

  /* For some reason, Vuetify doesn't catch snackbar */
  #snack {
   font-family: 'Roboto', 'sans-serif';
  }
</style>
