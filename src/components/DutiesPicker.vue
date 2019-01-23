<template>
  <v-container
      grid-list-md
      text-xs-center
  >
    <v-layout :column="isXSmall" wrap>

      <!-- WEEKDAY HEADERS -->
      <template v-if="!isXSmall">
        <v-flex xs2></v-flex>
        <v-flex xs10>
          <v-layout row wrap>
            <v-flex
                v-for="date in dutyMap.dates"
                :key="`weekdayHeader_${date.toDateString()}`"
                xs2
            >
              <v-card
                  :dark="isToday(date)"
                  :color="isToday(date) ? 'surface darken-4' : 'surface darken-2'"
              >
                <v-card-text class="px-0">{{ weekdayNameForDate(date) }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </template>

      <!-- DUTY SHEET (V-FOR over each ROW) -->
      <template v-for="(duty, idx) in dutyMap.templateNames">

        <!-- Duty Name -->
        <v-flex xs2 :key="`dutyHeader_${duty}_${idx}`">
          <v-card light color="surface darken-2">
            <v-card-text class="px-0">{{ duty }}</v-card-text>
          </v-card>
        </v-flex>

        <!-- Weekday Slots-->
        <v-flex
            xs10
            :key="`dutyRow_${duty}_${idx}`"
        >
          <v-layout row wrap>
             <v-flex
                 v-for="date in dutyMap.dates"
                 :key="`dutySlot_${duty}${idx}_${date.getDay()}`"
                 :data-duty="dutyForProperties(idx, date)"
                 :id="elementIDForDuty(dutyForProperties(idx, date))"
                 :style="{ 'border-bottom-color': colorForDuty(dutyForProperties(idx, date)) }"
                 xs2
             >
                <!-- Available Duty -->
                <template v-if="dutyForProperties(idx, date)">
                  <v-tooltip bottom>
                    <!-- For XS/S screens, (1) weekday text in btn and (2) constrained width -->
                    <v-btn
                        slot="activator"
                        block
                        dark
                        class="duty-button"
                        :class="{ 'xs' : isXSmall }"
                        :color="colorForDuty(dutyForProperties(idx, date))"
                        @click.stop="dutyClicked(dutyForProperties(idx, date))"
                    >
                      <span
                          v-if="isXSmall
                          && isDutySheetLive
                          && dutyForProperties(idx, date).status === DutyStatus.unclaimed"
                      >
                        {{ weekdayAbbreviationForDate(date) }}
                      </span>

                      <v-icon v-else :color="iconColorForDuty(dutyForProperties(idx, date))">
                        {{ iconForDuty(dutyForProperties(idx, date)) }}
                      </v-icon>
                    </v-btn>
                    <span>
                      {{ tooltipForDuty(dutyForProperties(idx, date)) }}
                    </span>
                  </v-tooltip>
                </template>

                <!-- Unavailable Slots -->
                <template v-else>
                  <v-card
                      dark
                      class="duty-button"
                      :color="colorForDuty(dutyForProperties(idx, date))"
                  ></v-card>
                </template>

            </v-flex>
          </v-layout>
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>

<script>
import { EDIT_SELECTED_DUTY } from '../store'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { DutyStatus } from '../definitions'
import api from '../api'
import { eventNames as appEvents } from '../events'
import { isSameDay, format } from 'date-fns'
import { permissionsMixin } from '../mixins'

export default {
  name: 'duties-picker',
  mixins: [permissionsMixin],
  methods: {
    // STATE

    dutyForProperties (dutyTemplateIndex, date) {
      return this.dutyMap.dutyForTemplateAndWeekdayIndices(dutyTemplateIndex, date.getDay())
    },

    // STYLING

    elementIDForDuty (duty) {
      return duty ? duty.id : null
    },

    colorForDuty (duty) {
      if (!duty) return

      const isMyDuty = duty.isDutyForCurrentUser()
      switch (duty.status) {
        case DutyStatus.unavailable:
          return 'surface darken-3'

        case DutyStatus.unclaimed:
          if (this.isFullDutiesAdmin) return this.isDutySheetLive ? 'primary' : 'warning'
          else return this.isDutySheetLive ? 'primary' : 'surface darken-1'

        case DutyStatus.claimed:
          if (isMyDuty) return this.isDutySheetLive ? 'success' : 'primary'
          else return 'surface darken-1'

        case DutyStatus.completed:
          // Duty CAN'T be completed while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyDutiesAdmin) return 'success'
          else return isMyDuty ? 'success' : 'surface darken-1'

        case DutyStatus.punted:
          // Duty CAN'T be punted while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyDutiesAdmin) return 'error'
          else return isMyDuty ? 'error' : 'surface darken-1'

        default:
          return null
      }
    },

    tooltipForDuty (duty) {
      if (!duty) return

      const isMyDuty = duty.isDutyForCurrentUser()

      const checker = duty.checkerName
      const assignee = duty.assigneeName

      var infoString

      switch (duty.status) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          infoString = ' ' + duty.name + ' (' + format(duty.date, 'E') + ')'

          if (this.isAnyDutiesAdmin) return 'Assign' + infoString
          else return this.isDutySheetLive ? 'Claim' + infoString : 'Unclaimed'

        case DutyStatus.claimed:
          return assignee

        case DutyStatus.completed:
          // Duty CAN'T be completed while sheet is live!!
          if (this.isDutySheetLive) return null

          infoString = assignee + ' (checked off by ' + checker + ')'
          if (this.isAnyDutiesAdmin) return infoString
          else return isMyDuty ? infoString : assignee

        case DutyStatus.punted:
          // Duty CAN'T be punted while sheet is live!!
          if (this.isDutySheetLive) return null

          infoString = 'Punted by ' + assignee
          if (this.isAnyDutiesAdmin) return infoString
          else return isMyDuty ? infoString : assignee

        default:
          return null
      }
    },

    iconForDuty (duty) {
      if (!duty) return
      const isMyDuty = duty.isDutyForCurrentUser()

      switch (duty.status) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          if (this.isAnyDutiesAdmin) return this.isDutySheetLive ? 'assignment_ind' : 'warning'
          else return 'assignment_ind'

        case DutyStatus.claimed:
          return 'how_to_reg'

        case DutyStatus.completed:
          // Duty CAN'T be completed while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyDutiesAdmin) return 'check_circle'
          else return isMyDuty ? 'check_circle' : 'how_to_reg'

        case DutyStatus.punted:
          // Duty CAN'T be punted while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyDutiesAdmin) return 'error'
          else return isMyDuty ? 'error' : 'how_to_reg'

        default:
          return null
      }
    },

    iconColorForDuty (duty) {
      if (!duty) return
      const isMyDuty = duty.isDutyForCurrentUser()

      switch (duty.status) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          if (this.isFullDutiesAdmin) return 'onWarning'
          else return this.isDutySheetLive ? 'onPrimary' : 'onSurface darken-1'

        case DutyStatus.claimed:
          if (isMyDuty) return this.isDutySheetLive ? 'onSuccess' : 'onPrimary'
          else return 'onSurface darken-1'

        case DutyStatus.completed:
          // Duty CAN'T be completed while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyDutiesAdmin) return 'onSuccess'
          else return isMyDuty ? 'onSuccess' : 'onSurface darken-1'

        case DutyStatus.punted:
          // Duty CAN'T be punted while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyDutiesAdmin) return 'onError'
          else return isMyDuty ? 'onError' : 'onSurface darken-1'

        default:
          return null
      }
    },

    // DATE HELPERS

    isToday (date) {
      // TODO: Remove! Change to new Date()
      return isSameDay(date, this.$_glob.root.today)
    },

    weekdayNameForDate (date) {
      return format(date, 'EEEE')
    },

    weekdayAbbreviationForDate (date) {
      return format(date, 'E')
    },

    // ACTIONS

    dutyClicked (duty) {
      if (this.isAnyDutiesAdmin) {
        if (this.selectedDuty !== null && this.selectedDuty.id === duty.id) {
          this.deselectDuty()
        } else {
          if (this.selectedDuty !== null) {
            this.deselectDuty()
          }
          this.selectDuty(duty)
        }
      } else {
        if (this.isDutySheetLive) {
          if (duty.status === DutyStatus.unclaimed) this.claimDuty(duty)
          if (duty.status === DutyStatus.claimed) this.unclaimDuty(duty)
        }
      }
    },

    // STATE MUTATIONS (and UI?)

    selectDuty (duty) {
      document.getElementById(duty.id).classList.add('selected')
      this.EDIT_SELECTED_DUTY(duty)
    },

    deselectDuty () {
      document.getElementById(this.selectedDuty.id).classList.remove('selected')
      this.EDIT_SELECTED_DUTY(null)
    },

    // API STUFF

    claimDuty (duty) {
      // Don't override! TODO: Make rules against this in firestore rules
      if (duty.status !== DutyStatus.unclaimed) return

      api.updateAssigneeForDuty(duty.object, this.currentFirestoreUser, (error) => {
        if (!error) {
          console.log('Success claiming duty ' + duty.id)
          this.$_glob.root.$emit(appEvents.apiSuccess, 'CLAIM success')
        } else {
          console.log('Failure claiming duty ' + duty.id)
          this.$_glob.root.$emit(appEvents.apiFailure, 'CLAIM failed')
        }
      })
    },

    unclaimDuty (duty) {
      // Make sure it's yours and not punted/completed! TODO: Make rules against this in firestore rules
      if (duty.statyus !== DutyStatus.claimed) return
      if (!duty.isDutyForCurrentUser()) return

      api.updateAssigneeForDuty(duty.object, null, (error) => {
        if (!error) {
          console.log('Success de-claiming duty ' + duty.id)
          this.$_glob.root.$emit(appEvents.apiSuccess, 'DE-CLAIM success')
        } else {
          console.log('Failure de-claiming assignee for duty ' + duty.id)
          this.$_glob.root.$emit(appEvents.apiFailure, 'DE-CLAIM failed')
        }
      })
    },

    ...mapMutations({
      EDIT_SELECTED_DUTY
    })
  },

  computed: {
    // Local Computed
    isXSmall () {
      return (this.$vuetify.breakpoint.smAndDown)
    },

    // Store Computed
    ...mapState({
      selectedDuty: state => state.dutiesStore.selectedDuty,
      isDutySheetLive: state => state.dutiesStore.isDutySheetLive
    }),

    ...mapGetters([
      'dutyMap', 'currentFirestoreUser'
    ])
  },

  created () {
    if (this.selectedDuty !== null) {
      // Can't call this.deselectDuty() b/c DOM elements have not been instantiated yet, so will fail
      this.EDIT_SELECTED_DUTY(null)
    }
  },

  watch: {
    isXSmall () {
      console.log('xsmall changed')
      console.log(this.$vuetify.breakpoint.name)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.duty-button {
  margin-top: 0;
  margin-bottom: 0;
  height: 54px; /* To get value, simply inspect to see height of duty name cards */
}

.duty-button.xs {
  margin: 0;
  min-width: 0;
  width: 100%;
}

.selected {
  border-bottom-style: solid;
  border-bottom-width: 4px;
  /*border-bottom-color: #c1bdbe;*/
  /*border-radius: 4px;*/
}

.past {
  opacity: 0.2;
}

.today-or-future {
  opacity: 1;
}

</style>
