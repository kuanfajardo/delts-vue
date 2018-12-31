<template>
  <div class="punts-table px-3">
    <!-- DATA TABLE -->
    <v-data-table
        :headers="headers"
        :items="punts"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
        :item-key="PropKeys.id"
    >

      <template slot="items" slot-scope="props">

        <!-- TIME -->
        <td>{{ props.item[PropKeys.puntTime] }}</td>

        <!-- ASSIGNEE -->
        <td>{{ props.item[PropKeys.assignee] }}</td>

        <!-- REASON -->
        <td>{{ props.item[PropKeys.reason] }}</td>

        <!-- STATUS -->
        <td>
          <v-btn
              :color="props.item[PropKeys.statusColor]"
              class="elevation-0"
              round
              small
          >
            {{ props.item[PropKeys.statusString] }}
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { puntKeys, puntMakeupKeys, userKeys } from '../api'
import { puntsMixin } from '../mixins'
import { PuntStatus } from '../definitions'

export default {
  name: 'punts-table',

  mixins: [puntsMixin],

  data () {
    return {
      // TODO: Move outside, so can use in headers
      PropKeys: Object.freeze({
        puntTime: 'puntTime',
        reason: 'reason',
        assignee: 'assignee',
        status: 'status',
        statusString: 'statusString',
        statusColor: 'statusColor',
        id: 'id'
      }),

      headers: [ // LOL can't use PropKeys
        { text: 'Date', align: 'left', value: 'puntTime' },
        { text: 'Assignee', align: 'left', value: 'assignee' },
        { text: 'Reason', align: 'left', value: 'reason' },
        { text: 'Status', value: 'statusString' }
      ],

      pagination: {
        rowsPerPage: 25
      },

      rowsPerPageItems: [
        25, 50, { text: 'All', value: -1 }
      ],

      selectedTemplateID: '0obgqtYtOwdL91DEql75' // TODO: Make a prop
    }
  },

  computed: {
    punts () {
      const puntsToShow = this.allPunts.filter(punt => {
        try {
          return punt[puntKeys.makeUp][puntMakeupKeys.makeupTemplate].id === this.selectedTemplateID
        } catch (e) {
          return false
        }
      })

      return puntsToShow.map((punt) => {
        return { // TODO: make constructor in object i.e. 'PuntsTableObj(punt)'
          [this.PropKeys.id]: punt.id, // Needed for sorting
          [this.PropKeys.puntTime]: this.timeForItem(punt),
          [this.PropKeys.reason]: this.reasonForItem(punt),
          [this.PropKeys.assignee]: this.assigneeForItem(punt),
          [this.PropKeys.status]: this.statusForPunt(punt),
          [this.PropKeys.statusString]: this.stringForPuntStatus(this.statusForPunt(punt)),
          [this.PropKeys.statusColor]: this.statusColorForItem(punt),
        }
      })
    },

    ...mapState({
      allPunts: state => state.puntsStore.allPunts,
    })
  },

  methods: {
    timeForItem (item) {
      const itemDate = new Date(item[puntKeys.puntTime].seconds * 1000)

      const date = itemDate.getDate()
      const month = itemDate.getMonth() + 1 // Months are zero based
      const year = itemDate.getFullYear()
      const twoDigitYear = year.toString().slice(2)

      return month + '/' + date + '/' + twoDigitYear
    },

    reasonForItem (item) {
      return item[puntKeys.reason]
    },

    assigneeForItem (item) {
      if (item[puntKeys.assignee]) {
        // TODO: full name helper (or use user display name)
        return item[puntKeys.assignee][userKeys.firstName] + ' ' + item[puntKeys.assignee][userKeys.lastName]
      }
      return ''
    },

    statusColorForItem (item) {
      const puntStatues = this.statusForPunt(item)
      switch (puntStatues) {
        case PuntStatus.Punted:
          return 'error'
        case PuntStatus.MakeUpClaimed:
          return 'primary'
        case PuntStatus.MadeUp:
          return 'success'
        default:
          return 'transparent'
      }
    },

    stringForPuntStatus (status) {
      switch (status) {
        case PuntStatus.Punted:
          return 'Punted'
        case PuntStatus.MakeUpClaimed:
          return 'Making Up'
        case PuntStatus.MadeUp:
          return 'Made Up'
        default:
          return ''
      }
    }
  }
}
</script>
