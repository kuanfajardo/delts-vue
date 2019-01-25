<template>
  <div class="punts-table px-3">
    <v-toolbar dense class="elevation-2">
      <v-toolbar-title>
        Punt Makeups
      </v-toolbar-title>
    </v-toolbar>

    <!-- DATA TABLE -->
    <v-data-table
        :headers="headers"
        :items="punts"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
        item-key="id"
    >

      <template slot="items" slot-scope="props">

        <!-- TIME -->
        <td>{{ props.item.puntTimeString }}</td>

        <!-- ASSIGNEE -->
        <td>{{ props.item.assigneeName }}</td>

        <!-- REASON -->
        <td>{{ props.item.reason }}</td>

        <!-- STATUS -->
        <td>
          <v-btn
              :color="props.item.statusColor"
              class="elevation-0"
              round
              small
          >
            {{ props.item.statusString }}
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <div v-if="focusedTemplate">
          No makeups currently are using this template.
        </div>
        <div v-else>
          Click on a template's
          <v-btn outline dark color="secondary"><v-icon dark>arrow_forward</v-icon></v-btn>
          button to see corresponding punt makeups.
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { PuntStatus } from '../definitions'
import { permissionsMixin } from '../mixins'

export default {
  name: 'punts-table',

  mixins: [permissionsMixin],

  data () {
    return {
      headers: [
        { text: 'Date', align: 'left', value: 'puntTimeString' },
        { text: 'Assignee', align: 'left', value: 'assigneeName' },
        { text: 'Reason', align: 'left', value: 'reason' },
        { text: 'Status', value: 'statusString' }
      ],

      pagination: {
        rowsPerPage: 25
      },

      rowsPerPageItems: [
        25, 50, { text: 'All', value: -1 }
      ]
    }
  },

  computed: {
    punts () {
      const puntsToShow = this.allPunts.filter(punt => {
        try {
          return punt.makeUp.makeupTemplate.id === this.focusedTemplate.id
        } catch (e) {
          return false
        }
      })

      puntsToShow.forEach((punt) => {
        punt.statusColor = this.statusColorForPunt(punt)
      })

      return puntsToShow
    },

    ...mapState({
      focusedTemplate: state => state.puntsStore.focusedMakeupTemplate
    }),

    ...mapGetters({
      allPunts: 'customAllPunts'
    })
  },

  methods: {
    // TODO: Export b/c also used in Punts Table
    statusColorForPunt (punt) {
      switch (punt.status) {
        case PuntStatus.Punted:
          return 'error'
        case PuntStatus.MakeUpClaimed:
          return 'primary'
        case PuntStatus.MadeUp:
          return 'success'
        default:
          return 'transparent'
      }
    }
  }
}
</script>
