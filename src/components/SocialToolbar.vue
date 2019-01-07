<template>
  <v-toolbar
      id="punts-toolbar"
      class="mb-3 mt-2"
      style="opacity: 1; width: 900px;"
  >
    <template v-if="tab === 0">
      <!-- NEW PARTY DIALOG -->
      <v-dialog
          v-model="newPartyDialog"
          max-width="550px"
          persistent
        >

          <!-- PUNT BUTTON -->
          <v-btn
              dark
              color="primary"
              slot="activator"
              :loading="isNewPartyButtonBusy">
            New Party
            <v-icon right>add_circle</v-icon>
          </v-btn>

          <v-card
            height="auto"
          >

            <v-card-title>
              <v-toolbar color="primary" dark>
                <v-toolbar-title>New Party</v-toolbar-title>
              </v-toolbar>
            </v-card-title>

            <!-- FORM -->
            <v-form v-model="valid">
            <v-container grid-list-md class="pb-2 pt-3 px-4">
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                      v-model="newPartyModel.name"
                      solo
                      label="Party Name"
                      v-validate="'required'"
                      data-vv-name="name"
                      :error-messages="errors.collect('name')"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                   <v-textarea
                    label="Theme / Dress"
                    rows="2"
                    outline
                    v-model="newPartyModel.theme"
                    v-validate="'required'"
                    data-vv-name="theme"
                    :error-messages="errors.collect('theme')"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-menu
                    :close-on-content-click="false"
                    v-model="partyStartDateMenu"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                  >
                    <v-text-field
                      slot="activator"
                      v-model="newPartyModel.startDate"
                      label="Start Date"
                      prepend-icon="event_available"
                      readonly
                      v-validate="'required|date_format:YYYY-MM-DD'"
                      data-vv-name="startDate"
                      :error-messages="errors.collect('startDate')"
                      ref="startDate"
                    ></v-text-field>
                    <v-date-picker v-model="newPartyModel.startDate" @input="partyStartDateMenu = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-menu
                    ref="startTimeMenu"
                    :close-on-content-click="false"
                    v-model="partyStartTimeMenu"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    :return-value.sync="newPartyModel.startTime"
                    full-width
                  >
                    <v-text-field
                      slot="activator"
                      v-model="newPartyModel.startTime"
                      label="Start Time"
                      prepend-icon="timer"
                      readonly
                      v-validate="'required'"
                      data-vv-name="startTime"
                      :error-messages="errors.collect('startTime')"
                    ></v-text-field>
                    <v-time-picker
                        v-if="partyStartTimeMenu"
                        format="24hr"
                        v-model="newPartyModel.startTime"
                        @change="$refs.startTimeMenu.save(newPartyModel.startTime)"
                    ></v-time-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-menu
                    :close-on-content-click="false"
                    v-model="partyEndDateMenu"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                  >
                    <v-text-field
                      slot="activator"
                      v-model="newPartyModel.endDate"
                      label="End Date"
                      prepend-icon="event_busy"
                      readonly
                      v-validate="'required|date_format:YYYY-MM-DD|after:startDate, true'"
                      data-vv-name="endDate"
                      :error-messages="errors.collect('endDate')"
                    ></v-text-field>
                    <v-date-picker v-model="newPartyModel.endDate" @input="partyEndDateMenu = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-menu
                    ref="endTimeMenu"
                    :close-on-content-click="false"
                    v-model="partyEndTimeMenu"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    :return-value.sync="newPartyModel.endTime"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="newPartyModel.endTime"
                      label="End Time"
                      prepend-icon="timer_off"
                      readonly
                      v-validate="'required'"
                      data-vv-name="endTime"
                      :error-messages="errors.collect('endTime')"
                    ></v-text-field>
                    <v-time-picker
                        v-if="partyEndTimeMenu"
                        format="24hr"
                        v-model="newPartyModel.endTime"
                        @change="$refs.endTimeMenu.save(newPartyModel.endTime)"
                    ></v-time-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="newPartyModel.capacity"
                    prepend-icon="people"
                    type="number"
                    label="Capacity"
                    :hint="hintForCapacity"
                    persistent-hint
                    v-validate="'required|integer|min_value:0'"
                    data-vv-name="capacity"
                    :error-messages="errors.collect('capacity')"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            </v-form>

            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- CANCEL BUTTON -->
              <v-btn class="mb-2" outline color="error" @click.stop="closeNewParty">Cancel</v-btn>
              <!-- SUBMIT BUTTON -->
              <v-btn class="mb-2" color="primary" @click.stop="submitNewParty">Save</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>

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

export default {
  name: 'social-toolbar',
  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  $_veeValidate: {
    validator: 'new'
  },

  data () {
    return {
      newPartyDialog: false,
      isNewPartyButtonBusy: false,

      partyStartDateMenu: false,
      partyStartTimeMenu: false,
      partyEndDateMenu: false,
      partyEndTimeMenu: false,

      newPartyModel: {
        name: null,
        theme: null,

        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,

        capacity: null
      },

      valid: false,
      search: ''
    }
  },

  props: {
    tab: Number
  },

  computed: {
    // Local-Computed
    hintForCapacity () {
      // TODO: Constantize
      const numBrothers = 40
      return '~' + Math.round(this.newPartyModel.capacity / numBrothers) + ' invites per brother'
    },

    // Store-Computed
    ...mapState({})
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  //------------------+
  //      METHODS     |
  //------------------+

  methods: {
    submitNewParty () {
      console.log(this.newPartyModel)
      this.$validator.validateAll().then(valid => {
        if (valid) {
          // Create Date obj from start date and time
          const start = new Date(this.newPartyModel.startDate)
          var startTime = this.newPartyModel.startTime // "hh:mm"
          start.setHours(startTime.substring(0, 2), startTime.substring(3))

          // Create Date obj from end date and time
          const end = new Date(this.newPartyModel.endDate)
          var endTime = this.newPartyModel.startTime // "hh:mm"
          end.setHours(endTime.substring(0, 2), endTime.substring(3))

          api.createNewParty(this.newPartyModel.name, this.newPartyModel.theme, start, end, parseInt(this.newPartyModel.capacity),
            (error) => {
              if (error === null) {
                this.$_glob.root.$emit(appEvents.apiSuccess, 'NEW PARTY success')
              } else {
                this.$_glob.root.$emit(appEvents.apiFailure, 'NEW PARTY failed')
              }
            })

          this.closeNewParty()
        }
      })
    },

    closeNewParty () {
      this.newPartyDialog = false

      setTimeout(() => {
        this.newPartyModel = {}
        this.$validator.reset()
      }, 300)
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
