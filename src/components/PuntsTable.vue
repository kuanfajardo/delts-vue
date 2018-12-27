<template>
  <div class="punts-table px-5">
    <!-- DATA TABLE -->
    <v-data-table
        :headers="headers"
        :items="punts"
        :search="puntSearch"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
    >

      <template slot="items" slot-scope="props">

        <!-- TIME -->
        <td>{{ props.item[PropKeys.puntTime] }}</td>

        <!-- ASSIGNEE -->
        <td>{{ props.item[PropKeys.assignee] }}</td>

        <!-- REASON -->
        <td>{{ props.item[PropKeys.reason] }}</td>

        <!-- GIVEN BY -->
        <td>{{ props.item[PropKeys.givenBy] }}</td>

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

        <!-- MAKEUP TIME -->
        <td>{{ props.item[PropKeys.makeUpTime] }}</td>

        <!-- MAKEUP -->
        <td>{{ props.item[PropKeys.makeUp] }}</td>

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
        makeUp: 'makeUp',
        makeUpTime: 'makeUpTime',
        status: 'status',
        statusString: 'statusString',
        statusColor: 'statusColor',
        givenBy: 'givenBy'
      }),

      headers: [ // LOL can't use PropKeys
        { text: 'Time', align: 'left', value: 'puntTime' },
        { text: 'Assignee', align: 'left', value: 'assignee' },
        { text: 'Reason', align: 'left', value: 'reason' },
        { text: 'Given By', value: 'givenBy' },
        { text: 'Status', value: 'statusString' },
        { text: 'Make-Up Time', value: 'makeUpTime' },
        { text: 'Make-Up', value: 'makeUp' }
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
      console.log(this.isFullPuntsAdmin)
      const puntsToShow = this.isFullPuntsAdmin ? this.allPunts : this.userPunts
      return puntsToShow.map((punt) => {
        return {
          [this.PropKeys.puntTime]: this.timeForItem(punt),
          [this.PropKeys.reason]: this.reasonForItem(punt),
          [this.PropKeys.assignee]: this.assigneeForItem(punt),
          [this.PropKeys.status]: this.statusForPunt(punt),
          [this.PropKeys.statusString]: this.stringForPuntStatus(this.statusForPunt(punt)),
          [this.PropKeys.statusColor]: this.statusColorForItem(punt),
          [this.PropKeys.makeUp]: this.makeUpForItem(punt),
          [this.PropKeys.makeUpTime]: this.makeUpTimeForItem(punt),
          [this.PropKeys.givenBy]: this.givenByForItem(punt)
        }
      })
    },

    ...mapState({
      allPunts: state => state.puntsStore.allPunts,
      userPunts: state => state.puntsStore.userPunts,
      puntSearch: state => state.puntsStore.puntSearch
    })
  },

  methods: {
    timeForItem (item) {
      return new Date(item[puntKeys.puntTime].seconds * 1000).toDateString()
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

    makeUpForItem (item) {
      if (item[puntKeys.makeUp]) {
        return item[puntKeys.makeUp][puntMakeupKeys.name]
      }
      return ''
    },

    makeUpTimeForItem (item) {
      if (item[puntKeys.makeUp]) {
        if (item[puntKeys.makeUp][puntMakeupKeys.completionTime]) {
          return new Date(item[puntKeys.makeUp][puntMakeupKeys.completionTime].seconds * 1000).toDateString()
        } else {
          return ''
        }
      }
      return ''
    },

    givenByForItem (item) {
      if (item[puntKeys.givenBy]) {
        return item[puntKeys.givenBy][userKeys.firstName]
      }
      return ''
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.punts-table {

}
</style>
