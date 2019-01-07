<template>
  <div class="social-page">
    <!-- Tabs -->
    <v-tabs grow icons-and-text color="transparent" v-model="tab">
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-tab
        v-for="i in tabNames.length"
        :key="i"
      >
        {{tabNames[i - 1]}}
        <v-icon>{{tabIcons[i - 1]}}</v-icon>
      </v-tab>
    </v-tabs>

    <!-- Header -->
    <v-layout row class="align-center layout px-4 pt-4 app--page-header">
      <v-spacer></v-spacer>
      <social-toolbar :tab="tab"></social-toolbar>
      <v-spacer></v-spacer>
    </v-layout>

    <!-- Main Component -->
    <keep-alive>
      <component :is="mainComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
import SocialToolbar from '../../components/SocialToolbar'
import PartyIterator from '../../components/PartyIterator'

export default {
  name: 'social-page',
  components: { SocialToolbar, PartyIterator },
  data () {
    return {
      tab: null,
      tabNames: [
        'Parties',
        'Invite List',
        'Bouncing'
      ],
      tabIcons: [
        'local_bar',
        'face',
        'assignment'
      ]
    }
  },

  computed: {
    mainComponent () {
      switch (this.tab) {
        case 0:
          return PartyIterator
        default:
          return null
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .social-page {

  }
</style>
