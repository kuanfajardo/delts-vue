<template>
  <v-dialog
    v-model="dialog"
    max-width="550px"
    persistent
  >

    <!-- ACTIVATOR BUTTON -->
    <template slot="activator">
    <slot></slot>
    </template>

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
                v-model="partyModel.name"
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
              v-model="partyModel.theme"
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
                v-model="partyModel.startDate"
                label="Start Date"
                prepend-icon="event_available"
                readonly
                v-validate="'required|date_format:YYYY-MM-DD'"
                data-vv-name="startDate"
                :error-messages="errors.collect('startDate')"
                ref="startDate"
              ></v-text-field>
              <v-date-picker v-model="partyModel.startDate" @input="partyStartDateMenu = false"></v-date-picker>
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
              :return-value.sync="partyModel.startTime"
              full-width
            >
              <v-text-field
                slot="activator"
                v-model="partyModel.startTime"
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
                  v-model="partyModel.startTime"
                  @change="$refs.startTimeMenu.save(partyModel.startTime)"
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
                v-model="partyModel.endDate"
                label="End Date"
                prepend-icon="event_busy"
                readonly
                v-validate="'required|date_format:YYYY-MM-DD|after:startDate, true'"
                data-vv-name="endDate"
                :error-messages="errors.collect('endDate')"
              ></v-text-field>
              <v-date-picker v-model="partyModel.endDate" @input="partyEndDateMenu = false"></v-date-picker>
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
              :return-value.sync="partyModel.endTime"
            >
              <v-text-field
                slot="activator"
                v-model="partyModel.endTime"
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
                  v-model="partyModel.endTime"
                  @change="$refs.endTimeMenu.save(partyModel.endTime)"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="partyModel.capacity"
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
        <v-btn class="mb-2" outline color="error" @click.stop="cancel">Cancel</v-btn>
        <!-- SUBMIT BUTTON -->
        <v-btn class="mb-2" color="primary" @click.stop="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { partyKeys } from '../api'

export default {
  name: 'edit-party-dialog',

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      dialog: false,
      isActivatorBusy: false,

      partyStartDateMenu: false,
      partyStartTimeMenu: false,
      partyEndDateMenu: false,
      partyEndTimeMenu: false,

      partyModel: {
        name: null,
        theme: null,

        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,

        capacity: null
      },

      valid: false
    }
  },

  props: {
    onSave: {
      type: Function,
      default: () => {}
    },
    onCancel: {
      type: Function,
      default: () => {}
    },
    model: {
      type: Object,
      default: null
    }
  },

  //------------------+
  //      METHODS     |
  //------------------+

  $_veeValidate: {
    validator: 'new'
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)

    if (this.model) {
      this.partyModel = Object.assign({}, this.model)

      const start = new Date(this.model[partyKeys.startTimestamp].seconds * 1000)
      this.partyModel.startDate = this.dateStringFromDate(start)
      this.partyModel.startTime = this.timeStringFromDate(start)

      const end = new Date(this.model[partyKeys.endTimestamp].seconds * 1000)
      this.partyModel.endDate = this.dateStringFromDate(end)
      this.partyModel.endTime = this.timeStringFromDate(end)
    }
  },

  computed: {
    // Local-Computed
    hintForCapacity () {
      // TODO: Constantize
      const numBrothers = 40
      return '~' + Math.round(this.partyModel.capacity / numBrothers) + ' invites per brother'
    }
  },

  methods: {
    dateStringFromDate (date) {
      const year = date.getFullYear()
      var month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }

      var monthDate = date.getDate()
      if (monthDate < 10) {
        monthDate = '0' + monthDate
      }

      return year + '-' + month + '-' + monthDate
    },

    timeStringFromDate (date) {
      var hours = date.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }

      var minutes = date.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }

      return hours + ':' + minutes
    },

    cancel () {
      this.dialog = false

      setTimeout(() => {
        this.partyModel = Object.assign({}, this.model)
        this.$validator.reset()
      }, 300)

      this.onCancel()
    },

    save () {
      this.$validator.validateAll().then(valid => {
        this.onSave(valid, this.partyModel, () => {
          if (valid) this.cancel()
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit-party-dialog {

}
</style>
