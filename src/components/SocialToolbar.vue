<template>
  <v-toolbar
      id="punts-toolbar"
      class="mb-3 mt-2"
      style="opacity: 1; width: 900px;"
  >
    <template v-if="tab === 0">
      <!-- NEW PARTY DIALOG -->
      <edit-party-dialog :on-save="submitNewParty">
        <v-btn
          dark
          color="primary"
        >
          New Party
          <v-icon right>add_circle</v-icon>
        </v-btn>
      </edit-party-dialog>

      <v-divider
        class="mx-3"
        vertical
      ></v-divider>

      <!-- TODO: Search box component -->
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
    </template>
    <template v-if="tab === 2">
    </template>
  </v-toolbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import api from '../api'
import { eventNames as appEvents } from '../events'
import { EDIT_PARTY_SEARCH } from '../store'
import EditPartyDialog from './EditPartyDialog'

export default {
  name: 'social-toolbar',
  components: { EditPartyDialog },
  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      search: ''
    }
  },

  props: {
    tab: Number
  },

  computed: {
    // Store-Computed
    ...mapState({})
  },

  //------------------+
  //      METHODS     |
  //------------------+

  methods: {
    submitNewParty (valid, partyModel, callback) {
      if (valid) {
        // Create Date obj from start date and time
        const start = new Date(partyModel.startDate) // "yyyy-mm-dd"
        var startTime = partyModel.startTime // "hh:mm"
        start.setHours(startTime.substring(0, 2), startTime.substring(3))

        // Create Date obj from end date and time
        const end = new Date(partyModel.endDate) // "yyyy-mm-dd"
        var endTime = partyModel.startTime // "hh:mm"
        end.setHours(endTime.substring(0, 2), endTime.substring(3))

        api.createNewParty(partyModel.name, partyModel.theme, start, end, parseInt(partyModel.capacity),
          (error) => {
            if (error === null) {
              this.$_glob.root.$emit(appEvents.apiSuccess, 'NEW PARTY success')
            } else {
              this.$_glob.root.$emit(appEvents.apiFailure, 'NEW PARTY failed')
            }
          })

        callback()
      }
    },

    ...mapMutations({
      EDIT_PARTY_SEARCH
    })
  },

  watch: {
    search (newValue) {
      this.EDIT_PARTY_SEARCH(newValue)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.social-toolbar {

}
</style>
