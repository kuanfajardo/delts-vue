<template>
  <div class="appRoot">
    <template v-if="!$route.meta.public">
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
      <!--<v-app dark>-->
        <transition>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      <!--</v-app>-->
    </template>
  </div>
</template>

<script>

import AppNavigation from './components/AppNavigation'

export default {
  name: 'App',
  components: { AppNavigation },
  data () {
    return {
    }
  }
}
</script>

<style>
  .page-wrapper {
    min-height: calc(100vh - 64px - 50px - 81px );
  }
</style>
