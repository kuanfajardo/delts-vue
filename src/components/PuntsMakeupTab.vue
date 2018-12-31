<template>
  <div class="punts-makeup-tab px-2 pt-3">
    <v-layout row wrap>
      <v-flex xs6>
        <punt-makeup-table></punt-makeup-table>
      </v-flex>
      <v-flex xs6>
        <punt-makeup-complement-table></punt-makeup-complement-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import PuntMakeupTable from './PuntMakeupTable'
import PuntMakeupComplementTable from './PuntMakeupComplementTable'

export default {
  name: 'punts-makeup-tab',
  components: { PuntMakeupTable, PuntMakeupComplementTable },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.punts-makeup-tab {

}
</style>
