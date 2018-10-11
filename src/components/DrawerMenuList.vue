<template>
  <div class="drawer-menu-list">
    <v-list>
      <v-list-tile
          v-for="menu in menus"
          :key="menu.title"
          :to="{name: menu.title}"
          ripple
      >
        <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>

export default {
  name: 'drawer-menu-list',

  data () {
    return {
      // TODO: Export to const in api/
      menus: [
        {
          title: 'Dashboard',
          icon: 'dashboard'
        },
        {
          title: 'Duties',
          icon: 'work'
        },
        {
          title: 'Social',
          icon: 'local_bar'
        },
        {
          title: 'Contacts',
          icon: 'contacts'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .drawer-menu-list {

  }
</style>
