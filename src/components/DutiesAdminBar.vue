<template>
  <v-toolbar v-if="showAdmin"  id="admin-bar" class="mb-3 mt-2" style="opacity: 1">
    <template v-if="tab === 0">
      <!-- General Actions-->
      <v-btn color="primary" @click.stop="liveButtonClicked">Go Live
        <v-icon right>visibility</v-icon>
      </v-btn>

      <v-btn dark color="teal" @click.stop="editDutySheetButtonClicked">Edit Duty Sheet
        <v-icon dark right>edit</v-icon>
      </v-btn>

      <v-divider
        class="mx-3"
        vertical
      ></v-divider>

      <!-- Edit Duty Actions -->
      <template v-if="selectedDuty !== null">
        <v-overflow-btn
          editable
          clearable
          :items="dropdownNames"
          :label="overflowLabel"
          hide-details
          class="pa-0"
          v-model="assignee"
        ></v-overflow-btn>

        <v-btn
            v-if="showActionButton"
            dark
            :color="colorForActionButton"
            @click.stop="actionButtonClicked"
        >
          {{ textForActionButton }}
          <v-icon right>{{ iconForActionButton }}</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-spacer></v-spacer>
        <v-btn class="elevation-0">
          Select a Duty to Edit
        </v-btn>
        <v-spacer></v-spacer>
    </template>
    </template>
    <!-- TODO: Menus for other tabs -->
  </v-toolbar>
</template>

<script>
import { dutiesMixin } from '../mixins/duties-mixin'
import { mapState } from 'vuex'
import api from '../api'
import { DutyStatus } from '../definitions'

export default {
  name: 'duties-admin-bar',
  mixins: [dutiesMixin],

  data () {
    return {
      showAdmin: true,
      checked_off: false,
      assignee: null
    }
  },

  props: {
    tab: Number
  },

  methods: {
    liveButtonClicked () {
      alert('Live button clicked')
      const refDate = new Date(2018, 11, 16)
      api.generateDutySheet(refDate)
    },

    editDutySheetButtonClicked () {
      alert('Edit duty sheet button clicked')
    },

    actionButtonClicked () {
      switch (this.selectedDutyStatus) {
        case DutyStatus.unavailable:
        case DutyStatus.unclaimed:
          // Shouldn't even be possible!
          return null
        case DutyStatus.claimed:
        case DutyStatus.punted:
          // Checkoff
          alert('checkoff')
          break
        case DutyStatus.completed:
          // Undo Checkoff
          alert('undo checkoff')
          break
        default:
          return null
      }
    }
  },

  computed: {
    ...mapState({
      selectedDuty: state => state.dutiesStore.selectedDuty,
      users: state => state.dutiesStore.users
    }),

    selectedDutyStatus () {
      return this.statusForDuty(this.selectedDuty)
    },

    colorForActionButton () {
      switch (this.selectedDutyStatus) {
        case DutyStatus.unavailable:
        case DutyStatus.unclaimed:
          // No button
          return null
        case DutyStatus.claimed:
        case DutyStatus.punted:
          // Checkoff
          return '#27af6a'
        case DutyStatus.completed:
          // Undo Checkoff
          return 'error'
        default:
          return null
      }
    },

    textForActionButton () {
      switch (this.selectedDutyStatus) {
        case DutyStatus.unavailable:
        case DutyStatus.unclaimed:
          // No button
          return null
        case DutyStatus.claimed:
        case DutyStatus.punted:
          // Checkoff
          return 'Checkoff'
        case DutyStatus.completed:
          // Undo Checkoff
          return 'Undo Checkoff'
        default:
          return null
      }
    },

    iconForActionButton () {
      switch (this.selectedDutyStatus) {
        case DutyStatus.unavailable:
        case DutyStatus.unclaimed:
          // No button
          return null
        case DutyStatus.claimed:
        case DutyStatus.punted:
          // Checkoff
          return 'check_circle'
        case DutyStatus.completed:
          // Undo Checkoff
          return 'block'
        default:
          return null
      }
    },

    showActionButton () {
      switch (this.selectedDutyStatus) {
        case DutyStatus.unavailable:
        case DutyStatus.unclaimed:
          // No button
          return false
        case DutyStatus.claimed:
        case DutyStatus.completed:
        case DutyStatus.punted:
          // Yes button :D
          return true
        default:
          return false
      }
    },

    dropdownNames () {
      return this.users.map(user => {
        return { text: user.first + ' ' + user.last }
      })
    },

    overflowLabel () {
      if (this.selectedDuty.brother !== null) {
        return this.selectedDuty.brother.first + ' ' + this.selectedDuty.brother.last
      } else {
        return 'Edit Assignee'
      }
    }
  },

  watch: {
    assignee (newValue, oldValue) {
      console.log(newValue)
    },

    selectedDuty (newValue, oldValue) {
      if (newValue === null) {
        this.assignee = null
      } else {
        if (newValue.brother !== null) {
          this.assignee = newValue.brother.first + ' ' + newValue.brother.last
        } else {
          this.assignee = null
        }
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #admin-bar {
    margin-left: 12.5%;
    margin-right: 12.5%;
    max-width: 75%;
  }
</style>
