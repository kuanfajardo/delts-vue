<template>
  <div class="duties-table px-5">
    <!-- DATA TABLE -->
    <v-data-table
        :headers="headers"
        :items="duties"
        :search="dutySearch"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
    >

      <template slot="items" slot-scope="props">

        <!-- DATE -->
        <td>{{ props.item.dateString }}</td>

        <!-- DUTY -->
        <td>{{ props.item.name }}</td>

        <!-- ASSIGNEE -->
        <td>{{ props.item.assigneeName }}</td>

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

        <!-- CHECKER -->
        <td>{{ props.item.checkerName }}</td>

        <!-- CHECK TIME -->
        <td>{{ props.item.checkTimeString }}</td>

      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { DutyStatus } from '../definitions'
import { permissionsMixin } from '../mixins'
import { ProxyHandler, DutyProxy } from '../definitions/model'

export default {
  name: 'duties-table',
  mixins: [permissionsMixin],
  data () {
    return {
      headers: [
        { text: 'Date', align: 'left', value: 'dateString' },
        { text: 'Duty', align: 'left', value: 'name' },
        { text: 'Assignee', align: 'left', value: 'assigneeName' },
        { text: 'Status', value: 'statusString' },
        { text: 'Checker', value: 'checkerName' },
        { text: 'Check Time', value: 'checkTimeString' }
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
    duties () {
      const dutiesToShow = this.isFullDutiesAdmin ? this.allDuties : this.userDuties

      const localHandler = ProxyHandler
        .new(DutyProxy)
        .addGetter({
          field: 'statusColor',
          get: (target, proxy) => {
            switch (proxy.status) {
              case DutyStatus.unclaimed:
                return 'warning'
              case DutyStatus.claimed:
                return 'primary'
              case DutyStatus.completed:
                return 'success'
              case DutyStatus.punted:
                return 'error'
              default:
                return 'transparent'
            }
          }
        })
        .addGetter({
          field: 'dateString',
          get: (target, proxy) => {
            return proxy.date.toDateString()
          }
        })
        .addGetter({
          field: 'checkTimeString',
          get: (target, proxy) => {
            return proxy.checkTime ? proxy.checkTime.toUTCString() : ''
          }
        })

      return dutiesToShow.map((duty) => {
        return DutyProxy.proxyHandler().merge(localHandler).generateProxy(duty.object)
      })
    },

    ...mapState({
      dutySearch: state => state.dutiesStore.dutySearch
    }),

    ...mapGetters({
      allDuties: 'customAllDuties',
      userDuties: 'customUserDuties'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.duties-table {

}
</style>
