<template>
  <v-toolbar
      v-if="isAnyDutiesAdmin"
      id="admin-bar"
      class="mb-3 mt-2"
      :class="{ 'full-admin': isFullDutiesAdmin, 'any-admin': isAnyDutiesAdmin }"
      style="opacity: 1"
  >
    <template v-if="tab === 0">
      <!-- General Actions-->
      <template v-if="isFullDutiesAdmin">
        <v-btn color="primary" @click.stop="liveButtonClicked">Go Live
          <v-icon right>visibility</v-icon>
        </v-btn>

        <v-btn dark color="secondary" @click.stop="editDutySheetButtonClicked">Edit Duty Sheet
          <v-icon dark right>edit</v-icon>
        </v-btn>

        <v-divider
          class="mx-3"
          vertical
        ></v-divider>
      </template>
      <!-- Edit Duty Actions -->
      <template v-if="selectedDuty !== null">
        <v-overflow-btn
          v-if="isFullDutiesAdmin"
          editable
          :disabled="isOverflowBusy"
          :items="dropdownNames"
          :label="overflowLabel"
          :loading="isOverflowBusy"
          hide-details
          class="pa-0"
          v-model="assignee"
        ></v-overflow-btn>

        <!-- Spacers to center action button if overflow button not present -->
        <v-spacer v-if="!isFullDutiesAdmin"></v-spacer>
        <!-- Action Button -->
        <v-btn
            :dark="!isActionButtonDisabled"
            :disabled="isActionButtonDisabled"
            :loading="isActionButtonBusy"
            :color="colorForActionButton"
            @click.stop="actionButtonClicked"
        >
          {{ textForActionButton }}
          <v-icon right>{{ iconForActionButton }}</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
      </template>
      <template v-else>
        <v-spacer></v-spacer>
        <v-btn class="elevation-0">
          {{ promptButtonText }}
        </v-btn>
        <v-spacer></v-spacer>
      </template>
    </template>
    <!-- TODO: Menus for other tabs -->
  </v-toolbar>
</template>

<script>
import { dutiesMixin } from '../mixins/duties-mixin'
import { mapState, mapMutations, mapGetters } from 'vuex'
import api, { userKeys, dutyKeys } from '../api'
import { DutyStatus } from '../definitions'
import { EDIT_SELECTED_DUTY } from '../store'
import { eventNames as appEvents } from '../events'

export default {
  name: 'duties-admin-bar',
  mixins: [dutiesMixin],

  data () {
    return {
      assignee: null,
      // Used to distinguish changes in assignee due to (1) selecting a different duty (should be ignored), and
      // (2) actually changing the assignee via the overflow button (should take action)
      ignoreAssigneeUpdate: false,
      isOverflowBusy: false,
      isActionButtonBusy: false
    }
  },

  props: {
    tab: Number
  },

  methods: {
    liveButtonClicked () {
      alert('Live button clicked')
      // TODO: eventually change to current date in cron job
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
          this.checkoffSelectedDuty()
          break
        case DutyStatus.completed:
          // Undo Checkoff
          this.undoCheckoffForSelectedDuty()
          break
        default:
          return null
      }
    },

    // TODO: Add emits for snackbars!
    checkoffSelectedDuty () {
      if (this.selectedDuty === null) return

      console.log('Checking off duty ' + this.selectedDuty.id)
      this.isActionButtonBusy = true

      api.checkoffDuty(this.selectedDuty, (error) => {
        if (error === null) {
          console.log('Success checking off duty ' + this.selectedDuty.id)
          this.EDIT_SELECTED_DUTY(this.dutyObjForID(this.selectedDuty.id))
          this.$_glob.root.$emit(appEvents.apiSuccess, 'CHECKOFF success')
        } else {
          console.log('Failure checking off duty ' + this.selectedDuty.id + '. ' + error.message)
          this.$_glob.root.$emit(appEvents.apiFailure, 'CHECKOFF failed')
          throw error
        }

        this.isActionButtonBusy = false
      })
    },

    undoCheckoffForSelectedDuty () {
      if (this.selectedDuty === null) return

      console.log('Undoing checkoff for duty ' + this.selectedDuty.id)
      this.isActionButtonBusy = true

      api.undoCheckoffForDuty(this.selectedDuty, (error) => {
        if (error === null) {
          console.log('Success undoing checkoff for duty ' + this.selectedDuty.id)
          this.EDIT_SELECTED_DUTY(this.dutyObjForID(this.selectedDuty.id))
          this.$_glob.root.$emit(appEvents.apiSuccess, 'UNDO CHECKOFF success')
        } else {
          console.log('Failure undoing checkoff for duty ' + this.selectedDuty.id + '. ' + error.message)
          this.$_glob.root.$emit(appEvents.apiFailure, 'UNDO CHECKOFF failed')
        }

        this.isActionButtonBusy = false
      })
    },

    updateAssigneeForSelectedDuty () {
      if (this.selectedDuty === null) return

      console.log('Changing assignee for duty ' + this.selectedDuty.id)
      this.isOverflowBusy = true

      api.updateAssigneeForDuty(this.selectedDuty, this.assignee, (error) => {
        // TODO: Change all checks for === null to just !error
        if (error === null) {
          console.log('Success updating assignee for duty ' + this.selectedDuty.id)
          this.EDIT_SELECTED_DUTY(this.dutyObjForID(this.selectedDuty.id))
          this.$_glob.root.$emit(appEvents.apiSuccess, 'UPDATE ASSIGNEE success')
        } else {
          console.log('Failure updating assignee for duty ' + this.selectedDuty.id)
          this.$_glob.root.$emit(appEvents.apiFailure, 'UPDATE ASSIGNEE failed')
        }

        this.isOverflowBusy = false
      })
    },

    ...mapMutations({
      EDIT_SELECTED_DUTY
    })
  },

  computed: {
    ...mapState({
      selectedDuty: state => state.dutiesStore.selectedDuty,
      isDutySheetLive: state => state.dutiesStore.isDutySheetLive,
    }),

    ...mapState([
      'users', 'currentUser'
    ]),

    ...mapGetters([
      'dutyObjForID'
    ]),

    promptButtonText () {
      if (this.isFullDutiesAdmin) return 'Select a Duty to Edit'
      if (this.isAnyDutiesAdmin) return 'Select a Duty to Checkoff'
    },

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
          return 'success'
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
          // No button
          return null
        case DutyStatus.unclaimed:
          // Fake button (i.e. disabled) when duty sheet live
          return 'Checkoff'
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
          // No button
          return null
        case DutyStatus.unclaimed:
          // Fake button (i.e. disabled)
          return 'check_circle'
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

    isActionButtonDisabled () {
      if (this.isDutySheetLive) return true

      switch (this.selectedDutyStatus) {
        case DutyStatus.unavailable:
        case DutyStatus.unclaimed:
          return true
        case DutyStatus.claimed:
          // TODO: use actual time functions, not weekday ones
          return this.isWeekdayFuture(this.weekdayForDuty(this.selectedDuty))
        case DutyStatus.completed:
        case DutyStatus.punted:
          // Yes button :D
          return false
        default:
          return true
      }
    },

    dropdownNames () {
      return this.users.map(user => {
        return {
          text: user[userKeys.firstName] + ' ' + user[userKeys.lastName],
          value: user
        }
      })
    },

    overflowLabel () {
      if (this.selectedDuty[dutyKeys.assignee] !== null) {
        // TODO: helper for full name
        return this.selectedDuty[dutyKeys.assignee][userKeys.firstName] + ' ' +
          this.selectedDuty[dutyKeys.assignee][userKeys.lastName]
      } else {
        return 'Edit Assignee'
      }
    }
  },

  watch: {
    assignee (newValue, oldValue) {
      if (!this.ignoreAssigneeUpdate) {
        this.updateAssigneeForSelectedDuty()
      }
      // Start listening to changes again.
      this.ignoreAssigneeUpdate = false
    },

    selectedDuty (newValue, oldValue) {
      // Ignore changes to assignee due while changing it in response to a change in the selected duty. This will be
      // reverted at the end of the watcher function for this.assignee (see above).
      this.ignoreAssigneeUpdate = true
      if (newValue === null) { // Deselecting a duty
        this.assignee = null
      } else {
        if (newValue[dutyKeys.assignee] !== null) { // Selecting a claimed duty
          this.assignee = {
            text: newValue[dutyKeys.assignee][userKeys.firstName] + ' ' + newValue[dutyKeys.assignee][userKeys.lastName],
            value: newValue[dutyKeys.assignee]
          }
        } else { // Selecting an unclaimed duty
          this.assignee = null

          // If selecting an unclaimed duty from either another unclaimed duty or no duty at all, this.assignee is
          // already null! This means that the above line won't trigger the assignee watcher, and therefore
          // this.ignoreAssigneeUpdate will stay true. In this case, we must manually start listening to changes in
          // this.assignee.
          if (oldValue === null || oldValue[dutyKeys.assignee] === null) {
            this.ignoreAssigneeUpdate = false
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #admin-bar.any-admin {
    width: 300px
  }

  #admin-bar.full-admin {
    width: 825px;
  }
</style>
