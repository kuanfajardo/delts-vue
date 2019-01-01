<template>
  <div class="punts-table px-5">
    <!-- DATA TABLE -->
    <v-data-table
        v-model="selected"
        :headers="headers"
        :items="punts"
        :search="puntSearch"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
        :item-key="PropKeys.id"
        select-all
    >

      <template slot="items" slot-scope="props">

        <td>
          <v-checkbox
            v-model="props.selected"
            color="primary"
            hide-details
          ></v-checkbox>
        </td>

        <!-- TIME -->
        <td>{{ props.item[PropKeys.puntTime] }}</td>

        <!-- ASSIGNEE -->
        <td :class="classForItem(props.item)">{{ props.item[PropKeys.assignee] }}</td>

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
import { mapState, mapMutations } from 'vuex'
import { puntKeys, puntMakeupKeys, userKeys, puntMakeupTemplateKeys } from '../api'
import { puntsMixin } from '../mixins'
import { PuntStatus } from '../definitions'
import { EDIT_SELECTED_PUNTS } from '../store'

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
        givenBy: 'givenBy',
        id: 'id',
        object: 'object'
      }),

      headers: [ // LOL can't use PropKeys
        { text: 'Date', align: 'left', value: 'puntTime' },
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
      ],

      selected: []
    }
  },

  computed: {
    punts () {
      return this.puntsToShow.map((punt) => {
        return { // TODO: make constructor in object i.e. 'PuntsTableObj(punt)'
          [this.PropKeys.id]: punt.id, // Needed for sorting
          [this.PropKeys.object]: punt, // Needed for later (when in 'selected')
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

    puntsToShow () {
      if (this.isFullPuntsAdmin) {
        return this.allPunts
      }

      if (this.isAnyPuntsAdmin) {
        return this.allPunts.filter(punt => {
          const isAssignedToMe = punt[puntKeys.assignee].id === this.currentUser.uid
          const isGivenByMe = punt[puntKeys.givenBy].id === this.currentUser.uid

          return isAssignedToMe || isGivenByMe
        })
      }

      return this.userPunts
    },

    ...mapState({
      allPunts: state => state.puntsStore.allPunts,
      userPunts: state => state.puntsStore.userPunts,
      puntSearch: state => state.puntsStore.puntSearch,
      selectedPunts: state => state.puntsStore.selectedPunts
    }),

    ...mapState([
      'currentUser'
    ])
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
      // TODO: make functions for all this! have it check for undefined and return something if not defined
      if (item[puntKeys.makeUp]) {
        if (item[puntKeys.makeUp][puntMakeupKeys.makeupTemplate]) {
          return item[puntKeys.makeUp][puntMakeupKeys.makeupTemplate][puntMakeupTemplateKeys.name]
        }
      }
      return ''
    },

    makeUpTimeForItem (item) {
      if (item[puntKeys.makeUp]) {
        if (item[puntKeys.makeUp][puntMakeupKeys.completionTime]) {
          return new Date(item[puntKeys.makeUp][puntMakeupKeys.completionTime].seconds * 1000).toDateString()
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
    },

    classForItem (item) {
      const isMyPunt = (item[this.PropKeys.object][puntKeys.assignee].id === this.currentUser.uid)
      return {
        'my-punt': isMyPunt
      }
    },

    ...mapMutations({
      EDIT_SELECTED_PUNTS
    })
  },

  watch: {
    selected (newValue) {
      this.EDIT_SELECTED_PUNTS(newValue)
    },

    // If some other component changes store, reflect in local storage. Have to do this b/c v-model of data table
    // can't directly be the store's selectedPunts b/c of how commits work (i.e. can't directly change it)
    selectedPunts (newValue) {
      this.selected = newValue
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.punts-table {

}

.my-punt {
  background-color: rgba(15, 81, 184, 0.44);
}
</style>
