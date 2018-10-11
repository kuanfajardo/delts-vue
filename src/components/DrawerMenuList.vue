<template>
  <div class="drawer-menu-list">
    <v-list>
      <v-list-tile
          v-for="(menu, i) in menus"
          :color="i === activeIndex ? 'dark' : 'dark'"
          :key="menu.title"
          @click.exact="activeIndex = i"
          ripple
      >
        <v-list-tile-action>
            <v-icon :color="i === activeIndex ? 'accent' : 'dark'">{{ menu.icon }}</v-icon>
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
      activeIndex: 0,
      // TODO: Export to const in api/
      menus: [
        {
          title: 'Dashboard',
          icon: 'dashboard'
        },
        {
          title: 'Duties',
          icon: 'work',
          target: '_blank'
        },
        {
          title: 'Social',
          icon: 'local_bar',
          target: '_blank'
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
