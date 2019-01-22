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
          <v-card-title class="subheading font-weight-bold">
            {{ props.item[partyKeys.name] }}
            <v-spacer></v-spacer>
            <v-chip :color="props.item[partyKeys.isActive] ? 'primary' : 'white'" text-color="white" class="ma-0 pa-0">
              Active
            </v-chip>
          </v-card-title>

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
            <edit-party-dialog v-if="props.item[partyKeys.isActive]" class="my-1 pr-2 mr-1 elevation-0" :model="props.item.object" :on-save="updateParty">
              <v-btn
                  class="elevation-4"
                  small
                  fab
                  color="secondary"
              >
                <v-icon>
                  edit
                </v-icon>
              </v-btn>
            </edit-party-dialog>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="primary" @click.native="viewInviteListForParty(props.item)"><v-icon>face</v-icon></v-btn>
            <v-btn :disabled="props.item[partyKeys.photos] === null" class="my-1 mr-1 elevation-4" small fab color="white" :href="props.item[partyKeys.photos]" target="_blank"><v-icon color="black">photo_camera</v-icon></v-btn>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="accent" @click.native="deleteParty(props.item)"><v-icon>delete</v-icon></v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { partyKeys } from '../api'
import EditPartyDialog from './EditPartyDialog'
import api from '../api'

export default {
  name: 'party-iterator',
  components: { EditPartyDialog },
  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      pagination: {
        rowsPerPage: 0
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
        return {
          [partyKeys.name]: partyObj[partyKeys.name],
          [partyKeys.capacity]: partyObj[partyKeys.capacity],
          [partyKeys.theme]: partyObj[partyKeys.theme],
          [partyKeys.photos]: partyObj[partyKeys.photos],
          [partyKeys.startTimestamp]: this.dateForTimestamp(partyObj[partyKeys.startTimestamp]),
          [partyKeys.endTimestamp]: this.dateForTimestamp(partyObj[partyKeys.endTimestamp]),
          [partyKeys.isActive]: partyObj[partyKeys.isActive],
          object: partyObj
        }
      })
    },

    breakpoint () {
      return this.$vuetify.breakpoint.name
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

    updateParty (valid, partyModel, callback) {
      if (valid) {
        // Create Date obj from start date and time
        const start = new Date(partyModel.startDate) // "yyyy-mm-dd"
        var startTime = partyModel.startTime // "hh:mm"
        start.setHours(startTime.substring(0, 2), startTime.substring(3))

        // Create Date obj from end date and time
        const end = new Date(partyModel.endDate) // "yyyy-mm-dd"
        var endTime = partyModel.startTime // "hh:mm"
        end.setHours(endTime.substring(0, 2), endTime.substring(3))

        callback()
      }
    },

    viewInviteListForParty (item) {
      alert('Invite list for ' + item[partyKeys.name])
    },

    deleteParty (item) {
      alert('Deleting ' + item[partyKeys.name])
    },

    numRowItemsForBreakpoint (breakpointName) {
      switch (breakpointName) {
        case 'xl':
        case 'lg':
          return 4
        case 'md':
          return 3
        case 'sm':
          return 2
        case 'xs':
          return 1
        default:
          return 0
      }
    },

    updateRowsPerPage () {
      this.pagination.rowsPerPage = this.numRowItemsForBreakpoint(this.$vuetify.breakpoint.name)
    }
  },

  mounted () {
    this.updateRowsPerPage()
  },

  // https://vuejs.org/v2/api/#watch
  watch: {
    breakpoint: 'updateRowsPerPage'
  }
}
</script>
