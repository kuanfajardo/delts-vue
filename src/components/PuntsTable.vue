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
        :item-key="'id'"
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
        <td>{{ props.item.puntTimeString }}</td>

        <!-- ASSIGNEE -->
        <td :class="classForPunt(props.item)">{{ props.item.assigneeName }}</td>

        <!-- REASON -->
        <td>{{ props.item.reason }}</td>

        <!-- GIVEN BY -->
        <td>{{ props.item.giverName }}</td>

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

        <!-- MAKEUP TIME -->
        <td>{{ props.item.makeUpTimeString }}</td>

        <!-- MAKEUP -->
        <td>{{ props.item.makeUpName }}</td>

      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { PuntStatus } from '../definitions'
import { EDIT_SELECTED_PUNTS } from '../store'
import { permissionsMixin } from '../mixins'
import { PuntProxy } from '../definitions/model'

export default {
  name: 'punts-table',

  mixins: [permissionsMixin],

  data () {
    return {
      headers: [
        { text: 'Date', align: 'left', value: 'puntTimeString' },
        { text: 'Assignee', align: 'left', value: 'assigneeName' },
        { text: 'Reason', align: 'left', value: 'reason' },
        { text: 'Given By', value: 'giverName' },
        { text: 'Status', value: 'statusString' },
        { text: 'Make-Up Time', value: 'makeUpTimeString' },
        { text: 'Make-Up', value: 'makeUpName' }
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
      const puntsToShow = this.puntsToShow

      const localHandler = PuntProxy.proxyHandler()
        .addGetter({
          field: 'statusColor',
          get: (target, proxy) => {
            switch (proxy.status) {
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
        })
        .addGetter({
          field: 'puntTimeString',
          get: (target, proxy) => {
            return proxy.puntTime.toDateString()
          }
        })
        .addGetter({
          field: 'makeUpTimeString',
          get: (target, proxy) => {
            return proxy.makeUp.completionTime.toDateString()
          }
        })
        .addGetter({
          field: 'makeUpName',
          get: (target, proxy) => { return proxy.makeUp.name }
        })

      return puntsToShow.map((punt) => {
        return localHandler.generateProxy(punt.object)
      })
    },

    puntsToShow () {
      if (this.isFullPuntsAdmin) {
        return this.allPunts
      }

      if (this.isAnyPuntsAdmin) {
        return this.allPunts.filter(punt => {
          return punt.isAssignedToCurrentUser() || punt.isGivenByCurrentUser()
        })
      }

      return this.userPunts
    },

    ...mapState({
      puntSearch: state => state.puntsStore.puntSearch,
      selectedPunts: state => state.puntsStore.selectedPunts
    }),

    ...mapState([
      'currentUser'
    ]),

    ...mapGetters({
      allPunts: 'customAllPunts',
      userPunts: 'customUserPunts'
    })
  },

  methods: {
    classForPunt (punt) {
      const isMyPunt = punt.isAssignedToCurrentUser()
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
