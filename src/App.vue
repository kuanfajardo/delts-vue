<template>
  <v-app>
    <app-drawer></app-drawer>
    <app-toolbar></app-toolbar>
  </v-app>
</template>

<script>

import AppToolbar from './components/AppToolbar'
import AppDrawer from './components/AppDrawer'

export default {
  name: 'App',
  components: { AppDrawer, AppToolbar },
  data () {
    return {
      msg: true
    }
  }
}
</script>
