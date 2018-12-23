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
                  light
                  color="#E0E0E0"
              >
                <v-card-text class="px-0">{{WEEKDAYS[weekday].name}}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </template>

      <!-- DUTY SHEET (V-FOR over each ROW) -->
      <template v-for="(duty, idx) in dutyNames">

        <!-- Duty Name -->
        <v-flex xs2 :key="`dutyHeader_${duty}_${idx}`">
          <v-card light color="#E0E0E0">
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
                <template v-if="isDutyAvailable(idForDuty(idx, weekday))">
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
                          && statusForDuty(idForDuty(idx, weekday)) === DutyStatus.unclaimed"
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
import { DutyStatus } from '@/definitions'

export default {
  name: 'duties-picker',
  mixins: [dutiesMixin],

  data () {
    return {
      // CONSTANTS
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
    // STYLING
    colorForDuty (dutyIdx, weekday) {
      const dutyStatus = this.statusForDuty(this.idForDuty(dutyIdx, weekday))

      switch (dutyStatus) {
        case DutyStatus.unavailable:
          return '#707070'

        case DutyStatus.unclaimed:
          return this.isDutySheetLive ? 'primary' : '#8a95ff' //'#685dee'

        case DutyStatus.claimed:
          return this.isDutySheetLive ? '#eeeeee' : 'primary'

        case DutyStatus.completed:
          return '#27af6a'

        case DutyStatus.punted:
          return '#E57373'

        default:
          return '#000000'
      }
    },

    styleForDuty (dutyIdx, weekday) {
      var opacity = 1
      if (!this.isDutySheetLive && this.isWeekdayPast(weekday)) {
        opacity = 0.75
      }

      return { 'opacity': opacity }
    },

    tooltipForDuty (dutyIdx, dutyName, weekday) {
      const dutyStatus = this.statusForDuty(this.idForDuty(dutyIdx, weekday))

      switch (dutyStatus) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          return 'Claim ' + dutyName + ' (' + this.WEEKDAYS[weekday].abb + ')'

        case DutyStatus.claimed:
          return this.dutyMap[dutyIdx]['schedule'][weekday].brother.first

        case DutyStatus.completed:
          var dutyObj = this.dutyMap[dutyIdx]['schedule'][weekday]
          return dutyObj.brother.first + ' (checked off by ' + dutyObj.checker.first + ')'

        case DutyStatus.punted:
          return 'Punted by ' + ''

        default:
          return null
      }
    },

    iconForDuty (dutyIdx, weekday) {
      const dutyStatus = this.statusForDuty(this.idForDuty(dutyIdx, weekday))

      switch (dutyStatus) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          return this.isDutySheetLive ? 'assignment_ind' : 'warning'

        case DutyStatus.claimed:
          return 'how_to_reg'

        case DutyStatus.completed:
          return 'check_circle'

        case DutyStatus.punted:
          return 'error'

        default:
          return null
      }
    },

    iconColorForDuty (dutyIdx, weekday) {
      const dutyStatus = this.statusForDuty(this.idForDuty(dutyIdx, weekday))

      switch (dutyStatus) {
        case DutyStatus.unavailable:
          return null

        case DutyStatus.unclaimed:
          return '#ffffff'

        case DutyStatus.claimed:
          return this.isDutySheetLive ? '#797a7a' : '#ffffff'

        case DutyStatus.completed:
          return '#ffffff'

        case DutyStatus.punted:
          return '#ffffff'

        default:
          return '#000000'
      }
    },

    idForDuty (dutyIdx, weekday) {
      try {
        return this.dutyMap[dutyIdx]['schedule'][weekday].id
      } catch (e) {
        return 'temp'
      }
    },

    // ACTIONS
    dutyClicked (dutyIdx, weekday) {
      const dutyID = this.idForDuty(dutyIdx, weekday)
      if (this.selectedDuty !== null && this.selectedDuty.id === dutyID) {
        this.deselectDuty(dutyID)
      } else {
        if (this.selectedDuty !== null) {
          this.deselectDuty(this.selectedDuty.id)
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
      'dutyNames', 'dutyMap', 'weekdaysToUse', 'dutyIDs', 'dutyObjForID'
    ])
  },

  created () {
    if (this.selectedDuty !== null) {
      this.deselectDuty()
    }
  },

  watch: {
    isXSmall (newValue, oldValue) {
      console.log('xsmall changed')
      console.log(this.$vuetify.breakpoint.name)
    }
  },
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
