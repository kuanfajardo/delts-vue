<template>
  <div class="app-navigation">

    <!-- DRAWER -->
    <v-navigation-drawer
      persistent
      clipped
      enable-resize-watcher
      v-model="drawer"
      fixed
      width="260"
      app
    >
      <drawer-menu-list></drawer-menu-list>
    </v-navigation-drawer>

    <!-- TOOLBAR -->
    <v-toolbar
      app
      clipped-left
      color="primary"
      dark
    >
      <v-toolbar-side-icon @click.stop="drawer = (!drawer)"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- AVATAR -->
      <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
        <v-btn icon large flat slot="activator">
          <v-avatar color="error" size="44px">
            <span class="white--text headline">C</span>
          </v-avatar>
        </v-btn>

        <!-- AVATAR DROP DOWN MENU -->
        <v-list class="pa-0">
          <v-list-tile
              v-for="(item,index) in menuItems"
              :to="!item.href ? { name: item.name } : null"
              :href="item.href"
              @click="item.click"
              ripple="ripple"
              :disabled="item.disabled"
              :target="item.target"
              rel="noopener"
              :key="index"
          >
            <v-list-tile-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
import DrawerMenuList from './DrawerMenuList'
import auth from  '@/auth'

export default {
  name: 'app-navigation',

  components: { DrawerMenuList },

  data () {
    return {
      drawer: true,
      title: 'Delts Manager',
      menuItems: [
        {
          icon: 'account_circle',
          href: '#',
          title: 'Profile',
          click: (e) => {
            console.log(e)
          }
        },
        {
          icon: 'settings',
          href: '#',
          title: 'Settings',
          click: (e) => {
            console.log(e)
          }
        },
        {
          icon: 'fullscreen_exit',
          href: '#',
          title: 'Logout',
          click: (e) => {
            auth.signOut(success => {
              if (success) {
                this.$router.replace('/login')
              }
            })
          }
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .app-navigation {

  }
</style>
