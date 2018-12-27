<template>
  <v-toolbar
      id="punts-toolbar"
      class="mb-3 mt-2"
      style="opacity: 1; width: 825px;"
  >
    <template v-if="tab === 0">
      <template v-if="isAnyPuntsAdmin">
        <!-- PUNT DIALOG -->
        <v-dialog
            v-model="dialog"
            max-width="500px"
        >

          <!-- PUNT BUTTON -->
          <v-btn
              dark
              color="error"
              slot="activator"
              :loading="isPuntButtonBusy"
          >New Punt
            <v-icon right>add_circle</v-icon>
          </v-btn>

          <!-- DIALOG CARD -->
          <v-card class="ma-auto">
            <v-card-title>
              <div class="mt-2 ml-2 mb-0">
                <span class="headline pb-2">New Punt</span>
                <div class="mt-1">The puntee(s) will be notified as soon as you submit.</div>
              </div>
            </v-card-title>

            <!-- FORM -->
            <v-container grid-list-md class="pb-2 pt-0">
              <v-layout wrap>
                <v-flex xs12>
                  <!--<v-subheader>Brother(s)</v-subheader>-->
                  <v-select
                    :items="selectUsers"
                    v-model="assignees"
                    label="Brother(s)"
                    multiple
                    chips
                    clearable
                    deletable-chips
                    solo
                    hint="Select brother(s) to assign punt to."
                    persistent-hint>
                  </v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="reason" label="Reason"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>

            <v-divider></v-divider>

            <!-- DIALOG ACTIONS -->
            <v-card-actions color="white">
              <v-spacer></v-spacer>
              <!-- CANCEL BUTTON -->
              <v-btn flat color="error" @click.native="close">Cancel</v-btn>
              <!-- PUNT BUTTON -->
              <v-btn flat color="primary" @click.native="save">Punt</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
import { mapMutations, mapState } from 'vuex'
import { EDIT_PUNT_SEARCH } from '../store'
import api, { userKeys } from '../api'
import { eventNames as appEvents } from '../events'

export default {
  name: 'punts-toolbar',

  mixins: [puntsMixin],

  data () {
    return {
      //-------------------------+
      //    Duty Sheet (Tab 0)   |
      //-------------------------+

      search: '',
      dialog: false,
      assignees: [],
      reason: '',
      isPuntButtonBusy: false,

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

    close () {
      this.dialog = false
      this.reason = ''
      this.assignees = []
    },

    save () {
      this.isPuntButtonBusy = true

      api.createNewPuntsBatch(this.assignees, this.reason, (error) => {
        if (error === null) {
          this.$_glob.root.$emit(appEvents.apiSuccess, 'ASSIGN PUNTS success')
        } else {
          this.$_glob.root.$emit(appEvents.apiSuccess, 'ASSIGN PUNTS failed')
        }

        this.isPuntButtonBusy = false
      })

      this.close()
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

    // TODO: make a helper method (not only place!)
    selectUsers () {
      return this.users.map(user => {
        return {
          text: user[userKeys.firstName] + ' ' + user[userKeys.lastName],
          value: user.id
        }
      })
    },

    ...mapState([
      'users'
    ])
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
