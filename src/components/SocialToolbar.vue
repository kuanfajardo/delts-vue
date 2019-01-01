<template>
  <v-toolbar
      id="punts-toolbar"
      class="mb-3 mt-2"
      style="opacity: 1; width: 900px;"
  >
    <template v-if="tab === 0">
    </template>
    <template v-if="tab === 1">
    </template>
    <template v-if="tab === 2">
    </template>
  </v-toolbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'social-toolbar',

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      msg: 'msg'
    }
  },

  computed: {
    // Local-Computed
    compute () {
      return null
    },

    // Store-Computed
    ...mapState({})
  },

  //------------------+
  //      METHODS     |
  //------------------+

  methods: {
    method () {
      // Do Something
    },

    ...mapMutations({})
  },

  // https://vuejs.org/v2/api/#watch
  watch: {
    msg: 'someMethod'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.social-toolbar {

}
</style>
