<template>
  <div class="punts-page">
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
      <duties-admin-bar :tab="tab"></duties-admin-bar>
      <v-spacer></v-spacer>
    </v-layout>

    <!-- Main Component -->
    <keep-alive>
      <component :is="mainComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
import DutiesTable from '../../components/DutiesTable'
import DutiesAdminBar from '../../components/DutiesAdminBar'

export default {
  name: 'punts-page',
  components: { DutiesAdminBar, DutiesTable },

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      tab: null,
      tabNames: [
        'Punts',
        'Punt Makeups',
      ],
      tabIcons: [
        'warning',
        'build'
      ]
    }
  },

  computed: {
    mainComponent () {
      switch (this.tab) {
        case 0:
          return DutiesTable
        case 1:
          return DutiesTable
        default:
          return null
      }
    }
  },

  //------------------+
  //      METHODS     |
  //------------------+

  methods: {
    method () {
      // Do Something
    }
  },

  // https://vuejs.org/v2/api/#watch
  watch: {
    msg: 'someMethod'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.punts-page {

}
</style>
