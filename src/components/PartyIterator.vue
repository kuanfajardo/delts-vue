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
            {{ props.item.name }}
            <v-spacer></v-spacer>
            <v-chip :color="props.item.isActive ? 'primary' : 'white'" text-color="white" class="ma-0 pa-0">
              Active
            </v-chip>
          </v-card-title>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Theme:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.theme }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>Start:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.startDateString }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>End:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.endDateString }}</v-list-tile-content>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>Capacity:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.capacity }}</v-list-tile-content>
            </v-list-tile>
          </v-list>

          <v-divider class="mt-1"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <edit-party-dialog v-if="props.item.isActive" class="my-1 pr-2 mr-1 elevation-0" :model="props.item.object" :on-save="updateParty">
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
            <v-btn :disabled="props.item.photoURL === null" class="my-1 mr-1 elevation-4" small fab color="white" :href="props.item.photoURL" target="_blank"><v-icon color="black">photo_camera</v-icon></v-btn>
            <v-btn class="my-1 mr-1 elevation-4" small fab color="accent" @click.native="deleteParty(props.item)"><v-icon>delete</v-icon></v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { format } from 'date-fns'
import { PartyProxy } from '../definitions/model'

import api, { partyKeys } from '../api'
import EditPartyDialog from './EditPartyDialog'

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
    }
  },

  computed: {
    partyKeys () {
      return partyKeys
    },

    // TODO: Obj factories for these maps
    // TODO: Custom objs!
    parties () {
      const localHandler = PartyProxy.proxyHandler()
        .addGetter({
          field: 'startDateString',
          get: (target, proxy) => { return format(proxy.startDate, 'MM/dd/yy @ p') }
        })
        .addGetter({
          field: 'endDateString',
          get: (target, proxy) => { return format(proxy.endDate, 'MM/dd/yy @ p') }
        })

      return this.customParties.map((party) => {
        return localHandler.generateProxy(party.object)
      })
    },

    breakpoint () {
      return this.$vuetify.breakpoint.name
    },

    ...mapState({
      partySearch: state => state.socialStore.partySearch
    }),

    ...mapGetters({
      customParties: 'customParties'
    })
  },

  //------------------+
  //      METHODS     |
  //------------------+

  methods: {
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
    },

    formatDate (date, formatStr) {
      return format(date, formatStr)
    }
  },

  mounted () {
    this.updateRowsPerPage()
  },

  watch: {
    breakpoint: 'updateRowsPerPage'
  }
}
</script>
