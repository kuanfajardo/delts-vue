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
                v-for="weekday in weekdaysToUse"
                :key="`weekdayHeader_${weekday}`"
                xs2
            >
              <v-card
                  :dark="isWeekdayToday(weekday)"
                  :color="isWeekdayToday(weekday) ? 'surface darken-4' : 'surface darken-2'"
              >
                <v-card-text class="px-0">{{WEEKDAYS[weekday].name}}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </template>

      <!-- DUTY SHEET (V-FOR over each ROW) -->
      <template v-for="(duty, idx) in dutyTemplateNames">

        <!-- Duty Name -->
        <v-flex xs2 :key="`dutyHeader_${duty}_${idx}`">
          <v-card light color="surface darken-2">
            <v-card-text class="px-0">{{duty}}</v-card-text>
          </v-card>
        </v-flex>

        <!-- Weekday Slots-->
        <v-flex
            xs10
            :key="`dutyRow_${duty}_${idx}`"
        >
          <v-layout row wrap>
             <v-flex
                 v-for="weekday in weekdaysToUse"
                 :key="`dutySlot_${duty}${idx}_${weekday}`"
                 :id="idForDuty(idx, weekday)"
                 :style="{ 'border-bottom-color': colorForDuty(idx, weekday) }"
                 xs2
             >
                <!-- Available Duty -->
                <template v-if="isDutyIDAvailable(idx, weekday)">
                  <v-tooltip bottom>
                    <!-- For XS screens, (1) weekday text in btn and (2) constrained width -->
                    <v-btn
                        slot="activator"
                        block
                        dark
                        class="duty-button"
                        :class="{ 'xs' : isXSmall }"
                        :style="styleForDuty(idx, weekday)"
                        :color="colorForDuty(idx, weekday)"
                        @click.stop="dutyClicked(idx, weekday)"
                    >
                      <span
                          v-if="isXSmall
                          && isDutySheetLive
                          && statusForDutyID(idx, weekday) === DutyStatus.unclaimed"
                      >
                        {{WEEKDAYS[weekday].abb}}
                      </span>

                      <v-icon v-else :color="iconColorForDuty(idx, weekday)">{{iconForDuty(idx, weekday)}}</v-icon>
                    </v-btn>
                    <span>{{tooltipForDuty(idx, duty, weekday)}}</span>
                  </v-tooltip>
                </template>

               <!-- Unavailable Slots -->
                <template v-else>
                  <v-card
                      dark
                      class="duty-button"
                      :color="colorForDuty(idx, weekday)"
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
import { dutiesMixin } from '@/mixins'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { DutyStatus, Permissions } from '@/definitions'
import { dutyKeys, userKeys } from '../api'

export default {
  name: 'duties-picker',
  mixins: [dutiesMixin],

  data () {
    return {
      // CONSTANTS
      // TODO: move to defs
      WEEKDAYS: [
        {
          'name': 'Sunday',
          'abb': 'U'
        },
        {
          'name': 'Monday',
          'abb': 'M'
        },
        {
          'name': 'Tuesday',
          'abb': 'T'
        },
        {
          'name': 'Wednesday',
          'abb': 'W'
        },
        {
          'name': 'Thursday',
          'abb': 'R'
        },
        {
          'name': 'Friday',
          'abb': 'F'
        },
        {
          'name': 'Saturday',
          'abb': 'S'
        }
      ]
    }
  },

  methods: {
    // STATUS
    // TODO: find better method names lol
    statusForDutyID (dutyIdx, weekday) {
      return this.statusForDuty(this.dutyObjForID(this.idForDuty(dutyIdx, weekday)))
    },

    isDutyIDAvailable (dutyIdx, weekday) {
      return this.isDutyAvailable(this.dutyObjForID(this.idForDuty(dutyIdx, weekday)))
    },

    // STYLING
    colorForDuty (dutyIdx, weekday) {
      const dutyStatus = this.statusForDutyID(dutyIdx, weekday)
      const dutyObj = this.dutyMap[dutyIdx]['schedule'][weekday]
      const isMyDuty = this.isDutyForCurrentUser(dutyObj)

      switch (dutyStatus) {
        case DutyStatus.unavailable:
          return 'surface darken-3'

        case DutyStatus.unclaimed:
          if (this.isAnyAdmin) return 'warning'
          else return this.isDutySheetLive ? 'primary' : 'surface darken-1'

        case DutyStatus.claimed:
          if (isMyDuty) return this.isDutySheetLive ? 'success' : 'primary'
          else return 'surface darken-1'

        case DutyStatus.completed:
          // Duty CAN'T be completed while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyAdmin) return 'success'
          else return isMyDuty ? 'success' : 'surface darken-1'

        case DutyStatus.punted:
          // Duty CAN'T be punted while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyAdmin) return 'error'
          else return isMyDuty ? 'error' : 'surface darken-1'

        default:
          return null
      }
    },

    // TODO: Remove if decide not needed
    styleForDuty (dutyIdx, weekday) {
      if (this.isAnyAdmin) {
        var opacity = 1
        if (!this.isDutySheetLive && this.isWeekdayPast(weekday)) {
          opacity = 1
        }
      } else {
        opacity = 1
      }

      return { 'opacity': opacity }
    },

    tooltipForDuty (dutyIdx, dutyName, weekday) {
      const dutyStatus = this.statusForDutyID(dutyIdx, weekday)
      const dutyObj = this.dutyMap[dutyIdx]['schedule'][weekday]
      const isMyDuty = this.isDutyForCurrentUser(dutyObj)

      const checker = dutyObj[dutyKeys.checker] === null ? 'System' : dutyObj[dutyKeys.checker][userKeys.firstName]
      const assignee = dutyObj[dutyKeys.assignee] === null ? 'System' : dutyObj[dutyKeys.assignee][userKeys.firstName]

      var infoString

      switch (dutyStatus) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          infoString = ' ' + dutyName + ' (' + this.WEEKDAYS[weekday].abb + ')'

          if (this.isAnyAdmin) return 'Assign' + infoString
          else return this.isDutySheetLive ? 'Claim' + infoString : 'Unclaimed'

        case DutyStatus.claimed:
          return assignee

        case DutyStatus.completed:
          // Duty CAN'T be completed while sheet is live!!
          if (this.isDutySheetLive) return null

          infoString = assignee + ' (checked off by ' + checker + ')'
          if (this.isAnyAdmin) return infoString
          else return isMyDuty ? infoString : assignee

        case DutyStatus.punted:
          // Duty CAN'T be punted while sheet is live!!
          if (this.isDutySheetLive) return null

          infoString = 'Punted by ' + assignee
          if (this.isAnyAdmin) return infoString
          else return isMyDuty ? infoString : assignee

        default:
          return null
      }
    },

    iconForDuty (dutyIdx, weekday) {
      const dutyStatus = this.statusForDutyID(dutyIdx, weekday)
      const dutyObj = this.dutyMap[dutyIdx]['schedule'][weekday]
      const isMyDuty = this.isDutyForCurrentUser(dutyObj)

      switch (dutyStatus) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          if (this.isAnyAdmin) return this.isDutySheetLive ? 'assignment_ind' : 'warning'
          else return 'assignment_ind'

        case DutyStatus.claimed:
          return 'how_to_reg'

        case DutyStatus.completed:
          // Duty CAN'T be completed while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyAdmin) return 'check_circle'
          else return isMyDuty ? 'check_circle' : 'how_to_reg'

        case DutyStatus.punted:
          // Duty CAN'T be punted while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyAdmin) return 'error'
          else return isMyDuty ? 'error' : 'how_to_reg'

        default:
          return null
      }
    },

    iconColorForDuty (dutyIdx, weekday) {
      const dutyStatus = this.statusForDutyID(dutyIdx, weekday)
      const dutyObj = this.dutyMap[dutyIdx]['schedule'][weekday]
      const isMyDuty = this.isDutyForCurrentUser(dutyObj)

      switch (dutyStatus) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          if (this.isAnyAdmin) return 'onWarning'
          else return this.isDutySheetLive ? 'onPrimary' : 'onSurface darken-1'

        case DutyStatus.claimed:
          if (isMyDuty) return this.isDutySheetLive ? 'onSuccess' : 'onPrimary'
          else return 'onSurface darken-1'

        case DutyStatus.completed:
          // Duty CAN'T be completed while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyAdmin) return 'onSuccess'
          else return isMyDuty ? 'onSuccess' : 'onSurface darken-1'

        case DutyStatus.punted:
          // Duty CAN'T be punted while sheet is live!!
          if (this.isDutySheetLive) return null

          if (this.isAnyAdmin) return 'onError'
          else return isMyDuty ? 'onError' : 'onSurface darken-1'

        default:
          return null
      }
    },

    idForDuty (dutyIdx, weekday) {
      try {
        return this.dutyMap[dutyIdx]['schedule'][weekday].id
      } catch (e) {
        return null
      }
    },

    // ACTIONS
    dutyClicked (dutyIdx, weekday) {
      const dutyID = this.idForDuty(dutyIdx, weekday)
      if (this.selectedDuty !== null && this.selectedDuty.id === dutyID) {
        this.deselectDuty()
      } else {
        if (this.selectedDuty !== null) {
          this.deselectDuty()
        }
        this.selectDuty(dutyID)
      }
    },

    // STATE MUTATIONS (and UI?)
    selectDuty (dutyID) {
      document.getElementById(dutyID).classList.add('selected')
      this.EDIT_SELECTED_DUTY(this.dutyObjForID(dutyID))
    },

    deselectDuty () {
      document.getElementById(this.selectedDuty.id).classList.remove('selected')
      this.EDIT_SELECTED_DUTY(null)
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
      isDutySheetLive: state => state.dutiesStore.isDutySheetLive,
    }),

    ...mapGetters([
      'dutyTemplateNames', 'dutyMap', 'weekdaysToUse', 'dutyIDs', 'dutyObjForID', 'currentUserHasPermissions'
    ]),

    // Local and Store Computed
    dutySheetStyle () {
      if (this.currentUserHasPermissions(Permissions.Checker)) {
        return this.isDutySheetLive ? this.DutySheetStyle.AdminLive : this.DutySheetStyle.Admin
      } else {
        return this.isDutySheetLive ? this.DutySheetStyle.UserLive : this.DutySheetStyle.User
      }
    },

    // TODO: move to duties mixin (along with the check in duties admin bar), rename appropriately
    isAnyAdmin () {
      return this.currentUserHasPermissions(Permissions.Checker)
    }
  },

  created () {
    if (this.selectedDuty !== null) {
      // Can't call this.deselectDuty() b/c DOM elements have not been instantiated yet, so will fail
      this.EDIT_SELECTED_DUTY(null)
    }
  },

  watch: {
    isXSmall (newValue, oldValue) {
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
