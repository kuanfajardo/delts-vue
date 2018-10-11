<template>
  <div class="app-drawer">
    <v-navigation-drawer
      persistent
      clipped="true"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'app-drawer',

  data () {
    return {
      items: [
        {
          icon: 'add',
          title: 'Dashboard'
        },
        {
          icon: 'bubble_chart',
          title: 'Duties'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .app-drawer {

  }
</style>
