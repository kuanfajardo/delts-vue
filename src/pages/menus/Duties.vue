<template>
  <div class="duties-page">
    <!-- Tabs -->
    <v-tabs grow icons-and-text color="transparent" v-model="tab">
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-tab
        v-for="i in 3"
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
import PageHeader from '../../components/PageHeader'
import DutiesPicker from '../../components/DutiesPicker'
import DutiesTable from '../../components/DutiesTable'
import DutiesAdminBar from '../../components/DutiesAdminBar'

export default {
  name: 'duties-page',
  components: { DutiesAdminBar, DutiesPicker, DutiesTable, PageHeader },
  data () {
    return {
      tab: null,
      tabNames: [
        'Duty Sheet',
        'Duties',
        'Punts'
      ],
      tabIcons: [
        'assignment',
        'work',
        'warning'
      ]
    }
  },

  computed: {
    mainComponent () {
      switch (this.tab) {
        case 0:
          return DutiesPicker
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
  .duties-page {

  }
</style>
