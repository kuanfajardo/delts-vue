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
        <td>{{ props.item[PropKeys.date] }}</td>

        <!-- DUTY -->
        <td>{{ props.item[PropKeys.name] }}</td>

        <!-- ASSIGNEE -->
        <td>{{ props.item[PropKeys.assignee] }}</td>

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

        <!-- CHECKER -->
        <td>{{ props.item[PropKeys.checker] }}</td>

        <!-- CHECK TIME -->
        <td>{{ props.item[PropKeys.checkTime] }}</td>

      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dutyKeys, dutyTemplateKeys, userKeys } from '../api'
import { dutiesMixin } from '../mixins'
import { DutyStatus } from '../definitions'

export default {
  name: 'duties-table',

  mixins: [dutiesMixin],

  data () {
    return {
      // TODO: Move outside, so can use in headers
      PropKeys: Object.freeze({
        date: 'date',
        name: 'name',
        assignee: 'assignee',
        status: 'status',
        statusString: 'statusString',
        statusColor: 'statusColor',
        checker: 'checker',
        checkTime: 'checkTime'
      }),

      headers: [ // LOL can't use PropKeys
        { text: 'Date', align: 'left', value: 'date' },
        { text: 'Duty', align: 'left', value: 'name' },
        { text: 'Assignee', align: 'left', value: 'assignee' },
        { text: 'Status', value: 'statusString' },
        { text: 'Checker', value: 'checker' },
        { text: 'Check Time', value: 'checkTime' }
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
      return dutiesToShow.map((duty) => {
        return {
          [this.PropKeys.date]: this.dateForItem(duty),
          [this.PropKeys.name]: this.dutyNameForItem(duty),
          [this.PropKeys.assignee]: this.assigneeForItem(duty),
          [this.PropKeys.status]: this.statusForDuty(duty),
          [this.PropKeys.statusString]: this.stringForDutyStatus(this.statusForDuty(duty)),
          [this.PropKeys.statusColor]: this.statusColorForItem(duty),
          [this.PropKeys.checker]: this.checkerForItem(duty),
          [this.PropKeys.checkTime]: this.checkTimeForItem(duty)
        }
      })
    },

    ...mapState({
      allDuties: state => state.dutiesStore.allDuties,
      userDuties: state => state.dutiesStore.userDuties,
      dutySearch: state => state.dutiesStore.dutySearch
    })
  },

  methods: {
    dateForItem (item) {
      return new Date(item[dutyKeys.date].seconds * 1000).toDateString()
    },

    dutyNameForItem (item) {
      return item[dutyKeys.template][dutyTemplateKeys.name]
    },

    assigneeForItem (item) {
      if (item[dutyKeys.assignee]) {
        // TODO: full name helper (or use user display name)
        return item[dutyKeys.assignee][userKeys.firstName] + ' ' + item[dutyKeys.assignee][userKeys.lastName]
      }
      return ''
    },

    statusColorForItem (item) {
      const dutyStatus = this.statusForDuty(item)
      switch (dutyStatus) {
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
    },

    checkerForItem (item) {
      if (item[dutyKeys.checker]) {
        return item[dutyKeys.checker][userKeys.firstName] + ' ' + item[dutyKeys.checker][userKeys.lastName]
      }
      return ''
    },

    checkTimeForItem (item) {
      if (item[dutyKeys.checkTime]) {
        return new Date(item[dutyKeys.checkTime].seconds * 1000).toUTCString()
      }
      return ''
    },

    stringForDutyStatus (status) {
      switch (status) {
        case DutyStatus.unavailable:
          return ''
        case DutyStatus.unclaimed:
          return 'Unclaimed'
        case DutyStatus.claimed:
          return 'Claimed'
        case DutyStatus.completed:
          return 'Checked'
        case DutyStatus.punted:
          return 'Punted'
        default:
          return ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.duties-table {

}
</style>
