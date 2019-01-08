<template>
  <v-container fluid grid-list-md id="party-iterator">
    <v-data-iterator
      :items="parties"
      :rows-per-page-items="[4]"
      :pagination.sync="pagination"
      content-tag="v-layout"
      row
      wrap
      :search="partySearch"
    >
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg3
      >
        <v-card>
          <v-card-title class="subheading font-weight-bold">{{ props.item[partyKeys.name] }}</v-card-title>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Theme:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item[partyKeys.theme] }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>Start:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item[partyKeys.startTimestamp] }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>End:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item[partyKeys.endTimestamp] }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>Capacity:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item[partyKeys.capacity] }}</v-list-tile-content>
            </v-list-tile>
          </v-list>

          <v-divider class="mt-1"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="secondary" @click.native="editParty(props.item)"><v-icon>edit</v-icon></v-btn>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="primary" @click.native="viewInviteListForParty(props.item)"><v-icon>face</v-icon></v-btn>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="white" :href="props.item[partyKeys.photos]"><v-icon color="black">photo_camera</v-icon></v-btn>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="accent" @click.native="deleteParty(props.item)"><v-icon>delete</v-icon></v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-data-iterator>
    <!--<v-dialog-->
        <!--v-model="editDialog"-->
        <!--max-width="500px"-->
      <!--&gt;-->
        <!--&lt;!&ndash; DIALOG CARD &ndash;&gt;-->
        <!--<v-card class="ma-auto">-->
          <!--<v-card-title>-->
            <!--<div class="mt-2 ml-2 mb-0">-->
              <!--<span class="headline pb-2">Edit Party</span>-->
              <!--<div class="mt-1">Ian McNally is 10/10.</div>-->
            <!--</div>-->
          <!--</v-card-title>-->

          <!--&lt;!&ndash; FORM &ndash;&gt;-->
          <!--<v-form v-model="isEditFormValid">-->
          <!--<v-container grid-list-md class="pb-2 pt-3 px-4">-->
            <!--<v-layout wrap>-->
              <!--<v-flex xs12>-->
                <!--<v-text-field-->
                    <!--v-model="editFormModel.name"-->
                    <!--solo-->
                    <!--label="Party Name"-->
                    <!--v-validate="'required'"-->
                    <!--data-vv-name="name"-->
                    <!--:error-messages="errors.collect('name')"-->
                <!--&gt;</v-text-field>-->
              <!--</v-flex>-->
              <!--<v-flex xs12>-->
                 <!--<v-textarea-->
                  <!--label="Theme / Dress"-->
                  <!--rows="2"-->
                  <!--outline-->
                  <!--v-model="editFormModel.theme"-->
                  <!--v-validate="'required'"-->
                  <!--data-vv-name="theme"-->
                  <!--:error-messages="errors.collect('theme')"-->
                <!--&gt;</v-textarea>-->
              <!--</v-flex>-->
              <!--<v-flex xs12 sm6>-->
                <!--<v-menu-->
                  <!--:close-on-content-click="false"-->
                  <!--v-model="partyStartDateMenu"-->
                  <!--:nudge-right="40"-->
                  <!--lazy-->
                  <!--transition="scale-transition"-->
                  <!--offset-y-->
                  <!--full-width-->
                <!--&gt;-->
                  <!--<v-text-field-->
                    <!--slot="activator"-->
                    <!--v-model="editFormModel.startDate"-->
                    <!--label="Start Date"-->
                    <!--prepend-icon="event_available"-->
                    <!--readonly-->
                    <!--v-validate="'required|date_format:YYYY-MM-DD'"-->
                    <!--data-vv-name="startDate"-->
                    <!--:error-messages="errors.collect('startDate')"-->
                    <!--ref="startDate"-->
                  <!--&gt;</v-text-field>-->
                  <!--<v-date-picker v-model="editFormModel.startDate" @input="partyStartDateMenu = false"></v-date-picker>-->
                <!--</v-menu>-->
              <!--</v-flex>-->
              <!--<v-flex xs12 sm6>-->
                <!--<v-menu-->
                  <!--ref="startTimeMenu"-->
                  <!--:close-on-content-click="false"-->
                  <!--v-model="partyStartTimeMenu"-->
                  <!--:nudge-right="40"-->
                  <!--lazy-->
                  <!--transition="scale-transition"-->
                  <!--offset-y-->
                  <!--:return-value.sync="editFormModel.startTime"-->
                  <!--full-width-->
                <!--&gt;-->
                  <!--<v-text-field-->
                    <!--slot="activator"-->
                    <!--v-model="editFormModel.startTime"-->
                    <!--label="Start Time"-->
                    <!--prepend-icon="timer"-->
                    <!--readonly-->
                    <!--v-validate="'required'"-->
                    <!--data-vv-name="startTime"-->
                    <!--:error-messages="errors.collect('startTime')"-->
                  <!--&gt;</v-text-field>-->
                  <!--<v-time-picker-->
                      <!--v-if="partyStartTimeMenu"-->
                      <!--format="24hr"-->
                      <!--v-model="editFormModel.startTime"-->
                      <!--@change="$refs.startTimeMenu.save(editFormModel.startTime)"-->
                  <!--&gt;</v-time-picker>-->
                <!--</v-menu>-->
              <!--</v-flex>-->
              <!--<v-flex xs12 sm6>-->
                <!--<v-menu-->
                  <!--:close-on-content-click="false"-->
                  <!--v-model="partyEndDateMenu"-->
                  <!--:nudge-right="40"-->
                  <!--lazy-->
                  <!--transition="scale-transition"-->
                  <!--offset-y-->
                  <!--full-width-->
                <!--&gt;-->
                  <!--<v-text-field-->
                    <!--slot="activator"-->
                    <!--v-model="editFormModel.endDate"-->
                    <!--label="End Date"-->
                    <!--prepend-icon="event_busy"-->
                    <!--readonly-->
                    <!--v-validate="'required|date_format:YYYY-MM-DD|after:startDate, true'"-->
                    <!--data-vv-name="endDate"-->
                    <!--:error-messages="errors.collect('endDate')"-->
                  <!--&gt;</v-text-field>-->
                  <!--<v-date-picker v-model="editFormModel.endDate" @input="partyEndDateMenu = false"></v-date-picker>-->
                <!--</v-menu>-->
              <!--</v-flex>-->
              <!--<v-flex xs12 sm6>-->
                <!--<v-menu-->
                  <!--ref="endTimeMenu"-->
                  <!--:close-on-content-click="false"-->
                  <!--v-model="partyEndTimeMenu"-->
                  <!--:nudge-right="40"-->
                  <!--lazy-->
                  <!--transition="scale-transition"-->
                  <!--offset-y-->
                  <!--full-width-->
                  <!--:return-value.sync="editFormModel.endTime"-->
                <!--&gt;-->
                  <!--<v-text-field-->
                    <!--slot="activator"-->
                    <!--v-model="editFormModel.endTime"-->
                    <!--label="End Time"-->
                    <!--prepend-icon="timer_off"-->
                    <!--readonly-->
                    <!--v-validate="'required'"-->
                    <!--data-vv-name="endTime"-->
                    <!--:error-messages="errors.collect('endTime')"-->
                  <!--&gt;</v-text-field>-->
                  <!--<v-time-picker-->
                      <!--v-if="partyEndTimeMenu"-->
                      <!--format="24hr"-->
                      <!--v-model="editFormModel.endTime"-->
                      <!--@change="$refs.endTimeMenu.save(editFormModel.endTime)"-->
                  <!--&gt;</v-time-picker>-->
                <!--</v-menu>-->
              <!--</v-flex>-->
              <!--<v-flex xs12 sm6>-->
                <!--<v-text-field-->
                  <!--v-model="editFormModel.capacity"-->
                  <!--prepend-icon="people"-->
                  <!--type="number"-->
                  <!--label="Capacity"-->
                  <!--:hint="hintForCapacity"-->
                  <!--persistent-hint-->
                  <!--v-validate="'required|integer|min_value:0'"-->
                  <!--data-vv-name="capacity"-->
                  <!--:error-messages="errors.collect('capacity')"-->
                <!--&gt;</v-text-field>-->
              <!--</v-flex>-->
            <!--</v-layout>-->
          <!--</v-container>-->
          <!--</v-form>-->

          <!--<v-divider></v-divider>-->

          <!--&lt;!&ndash; DIALOG ACTIONS &ndash;&gt;-->
          <!--<v-card-actions color="white">-->
            <!--<v-spacer></v-spacer>-->
            <!--&lt;!&ndash; CANCEL BUTTON &ndash;&gt;-->
            <!--<v-btn flat color="error" @click.native="closePuntDialog">Cancel</v-btn>-->
            <!--&lt;!&ndash; PUNT BUTTON &ndash;&gt;-->
            <!--<v-btn flat color="primary" :disabled="!assignees || !reason" @click.native="savePuntDialog">Punt</v-btn>-->
          <!--</v-card-actions>-->
        <!--</v-card>-->
      <!--</v-dialog>-->
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { partyKeys } from '../api'

export default {
  name: 'party-iterator',

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      pagination: {
        rowsPerPage: 4
      },

      editDialog: false,
      isEditFormValid: false,
      editFormModel: {}

    }
  },

  computed: {
    partyKeys () {
      return partyKeys
    },

    // TODO: Obj factories for these maps
    // TODO: Custom objs!
    parties () {
      return this.partyObjects.map((partyObj) => {
        console.log(partyObj)
        return {
          [partyKeys.name]: partyObj[partyKeys.name],
          [partyKeys.capacity]: partyObj[partyKeys.capacity],
          [partyKeys.theme]: partyObj[partyKeys.theme],
          [partyKeys.photos]: partyObj[partyKeys.photos],
          [partyKeys.startTimestamp]: this.dateForTimestamp(partyObj[partyKeys.startTimestamp]),
          [partyKeys.endTimestamp]: this.dateForTimestamp(partyObj[partyKeys.endTimestamp]),
          object: partyObj
        }
      })
    },

    ...mapState({
      partyObjects: state => state.socialStore.parties,
      partySearch: state => state.socialStore.partySearch
    })
  },

  //------------------+
  //      METHODS     |
  //------------------+

  methods: {
    // TODO: Make function for to string with string format
    dateForTimestamp (item) {
      const itemDate = new Date(item.seconds * 1000)

      const date = itemDate.getDate()
      const month = itemDate.getMonth() + 1 // Months are zero based
      const year = itemDate.getFullYear()
      const twoDigitYear = year.toString().slice(2)

      var hour = itemDate.getHours()
      var amOrPm = hour < 12 ? 'AM' : 'PM'

      hour = hour % 12
      if (hour === 0) hour = 12

      const minute = itemDate.getMinutes()
      var minuteString = (minute.toString().length === 1 ? '0' : '') + minute

      return month + '/' + date + '/' + twoDigitYear + ' @ ' + hour + ':' + minuteString + ' ' + amOrPm
    },

    editParty (item) {
      alert('Editing ' + item[partyKeys.name])
    },

    viewInviteListForParty (item) {
      alert('Invite list for ' + item[partyKeys.name])
    },

    deleteParty (item) {
      alert('Deleting ' + item[partyKeys.name])
    }
  },

  // https://vuejs.org/v2/api/#watch
  watch: {
    msg: 'someMethod'
  }
}
</script>
