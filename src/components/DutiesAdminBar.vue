<template>
  <v-toolbar
      v-if="shouldDisplayToolbar"
      id="admin-bar"
      class="mb-3 mt-2"
      style="opacity: 1"
      :style="{ width: toolbarWidth + 'px' }"
  >
    <template v-if="tab === 0">
      <!-- General Actions-->
      <template v-if="isFullDutiesAdmin">
        <v-btn :color="colorForLiveButton" @click.stop="liveButtonClicked">{{ textForLiveButton }}
          <v-icon right>{{ iconForLiveButton }}</v-icon>
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

    <template v-if="tab === 1">
      <!-- SEARCH BOX -->
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        solo
        hide-details
        class="px-1 py-0 my-0"
      ></v-text-field>

      <!--<v-spacer></v-spacer>-->
    </template>
    <!-- TODO: Menus for other tabs -->
  </v-toolbar>
</template>

<script>
import { dutiesMixin } from '../mixins/duties-mixin'
import { mapState, mapMutations, mapGetters } from 'vuex'
import api, { userKeys, dutyKeys } from '../api'
import { DutyStatus } from '../definitions'
import { EDIT_SELECTED_DUTY, SET_DUTY_SHEET_LIVE, EDIT_DUTY_SEARCH } from '../store'
import { eventNames as appEvents } from '../events'

export default {
  name: 'duties-admin-bar',

  mixins: [dutiesMixin],

  data () {
    return {
      //-------------------------+
      //    Duty Sheet (Tab 0)   |
      //-------------------------+

      assignee: null,
      // Used to distinguish changes in assignee due to (1) selecting a different duty (should be ignored), and
      // (2) actually changing the assignee via the overflow button (should take action)
      ignoreAssigneeUpdate: false,
      isOverflowBusy: false,
      isActionButtonBusy: false,

      //-------------------------+
      //    Duties Tab (Tab 1)   |
      //-------------------------+

      search: ''
    }
  },

  props: {
    tab: Number
  },

  methods: {

    //-------------------------+
    //    Duty Sheet (Tab 0)   |
    //-------------------------+

    // LIVE BUTTON
    liveButtonClicked () {
      if (this.isDutySheetLive) {
        this.SET_DUTY_SHEET_LIVE(false)
      } else {
        if (this.dutySheetHasBeenGenerated) {
          this.SET_DUTY_SHEET_LIVE(true)
        } else {
          this.generateDutySheet()
        }
      }
    },

    generateDutySheet () {
      // TODO: Change to real date
      api.generateDutySheet(this.$_glob.today, (error) => {
        if (error === null) {
          console.log('Success in generating duty sheet starting on ' + this.$_glob.today)
          this.$_glob.root.$emit(appEvents.apiSuccess, 'SHEET GENERATION success')
          this.SET_DUTY_SHEET_LIVE(true)
        } else {
          console.log('Failure in generating duty sheet starting on ' + this.$_glob.today)
          this.$_glob.root.$emit(appEvents.apiSuccess, 'SHEET GENERATION failed')
        }
      })
    },

    // EDIT SHEET BUTTON
    editDutySheetButtonClicked () {
      alert('Edit duty sheet button clicked')
    },

    // ACTION BUTTON
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

    // OVERFLOW BUTTON
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

    // STORE MAPS
    ...mapMutations({
      EDIT_SELECTED_DUTY, SET_DUTY_SHEET_LIVE
    }),

    //-------------------------+
    //    Duties Tab (Tab 1)   |
    //-------------------------+

    // STORE MAPS
    ...mapMutations({
      EDIT_DUTY_SEARCH
    })
  },

  computed: {

    //-------------------+
    //      All Tabs     |
    //-------------------+

    shouldDisplayToolbar () {
      switch (this.tab) {
        case 0:
          return this.isAnyDutiesAdmin
        case 1:
          return true
        default:
          return this.isAnyDutiesAdmin
      }
    },

    toolbarWidth () {
      switch (this.tab) {
        case 0:
          return this.isFullDutiesAdmin ? 825 : 300
        case 1:
          return 825
        default:
          return 825
      }
    },

    //-------------------------+
    //    Duty Sheet (Tab 0)   |
    //-------------------------+

    // STORE MAPS
    ...mapState({
      selectedDuty: state => state.dutiesStore.selectedDuty,
      isDutySheetLive: state => state.dutiesStore.isDutySheetLive,
      dutySearch: state => state.dutiesStore.dutySearch
    }),

    ...mapState([
      'users', 'currentUser'
    ]),

    ...mapGetters([
      'dutyObjForID', 'dutySheetHasBeenGenerated'
    ]),

    // STATE
    selectedDutyStatus () {
      return this.statusForDuty(this.selectedDuty)
    },

    // PROMPT BUTTON
    promptButtonText () {
      if (this.isFullDutiesAdmin) return 'Select a Duty to Edit'
      if (this.isAnyDutiesAdmin) return 'Select a Duty to Checkoff'
    },

    // LIVE BUTTON
    colorForLiveButton () {
      return this.isDutySheetLive ? 'accent' : 'primary'
    },

    textForLiveButton () {
      return this.isDutySheetLive ? 'Close Sheet' : 'Go Live'
    },

    iconForLiveButton () {
      return this.isDutySheetLive ? 'visibility_off' : 'visibility'
    },

    // ACTION BUTTON
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

    // OVERFLOW BUTTON
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

    //-------------------------+
    //    Duty Sheet (Tab 0)   |
    //-------------------------+

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
    },

    //-------------------------+
    //    Duties Tab (Tab 1)   |
    //-------------------------+

    search (newValue) {
      this.EDIT_DUTY_SEARCH(newValue)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#admin-bar {

}
</style>
