<template>
  <v-toolbar
      id="punts-toolbar"
      class="mb-3 mt-2"
      style="opacity: 1; width: 825px;"
  >
    <template v-if="tab === 0">
      <template v-if="isAnyPuntsAdmin">
        <!-- PUNT BUTTON -->
        <v-btn dark color="error" @click.stop="puntButtonClicked">New Punt
          <v-icon right>add_circle</v-icon>
        </v-btn>

        <v-divider
          class="mx-3"
          vertical
        ></v-divider>
      </template>

      <!-- SEARCH BOX -->
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        solo
        hide-details
        class="px-1 py-0 my-0"
      ></v-text-field>
    </template>

    <template v-if="tab === 1">
      <!-- SEARCH BOX -->
      <v-text-field
        v-model="search_2"
        append-icon="search"
        label="Search"
        single-line
        solo
        hide-details
        class="px-1 py-0 my-0"
      ></v-text-field>
    </template>
    <!-- TODO: Menus for other tabs -->
  </v-toolbar>
</template>

<script>
import { puntsMixin } from '../mixins'
import { mapMutations } from 'vuex'
import { EDIT_PUNT_SEARCH } from '../store'

export default {
  name: 'duties-admin-bar',

  mixins: [puntsMixin],

  data () {
    return {
      //-------------------------+
      //    Duty Sheet (Tab 0)   |
      //-------------------------+

      search: '',

      //-------------------------+
      //    Duties Tab (Tab 1)   |
      //-------------------------+

      search_2: ''
    }
  },

  props: {
    tab: Number
  },

  methods: {

    //----------------------+
    //     Punts  (Tab 0)   |
    //----------------------+

    puntButtonClicked () {
      alert('Punt Button Clicked')
    },

    // STORE MAPS
    ...mapMutations({
      EDIT_PUNT_SEARCH
    })

    //----------------------+
    //    Makeups (Tab 1)   |
    //----------------------+

  },

  computed: {

    //-------------------+
    //      All Tabs     |
    //-------------------+

    //-------------------------+
    //    Duty Sheet (Tab 0)   |
    //-------------------------+

  },

  watch: {

    //-------------------------+
    //    Duty Sheet (Tab 0)   |
    //-------------------------+

    search (newValue) {
      this.EDIT_PUNT_SEARCH(newValue)
    }

    //-------------------------+
    //    Duties Tab (Tab 1)   |
    //-------------------------+

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#admin-bar {

}
</style>
