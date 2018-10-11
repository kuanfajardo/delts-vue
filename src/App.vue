<template>
  <v-app dark>
    <app-navigation></app-navigation>
  </v-app>
</template>

<script>

import AppNavigation from './components/AppNavigation'

export default {
  name: 'App',
  components: { AppNavigation },
  data () {
    return {
      drawer: true
    }
  }
}
</script>
