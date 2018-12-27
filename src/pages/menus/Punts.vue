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
      <punts-toolbar :tab="tab"></punts-toolbar>
      <v-spacer></v-spacer>
    </v-layout>

    <!-- Main Component -->
    <keep-alive>
      <component :is="mainComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
import PuntsTable from '../../components/PuntsTable'
import DutiesAdminBar from '../../components/DutiesAdminBar'
import PuntsToolbar from '../../components/PuntsToolbar'
import DutiesTable from '../../components/DutiesTable'

export default {
  name: 'punts-page',

  components: { DutiesAdminBar, PuntsTable, DutiesTable, PuntsToolbar },

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      tab: null,
      tabNames: [
        'Punts',
        'Punt Makeups'
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
          return PuntsTable
        case 1:
          return DutiesTable
        default:
          return null
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.punts-page {

}
</style>
