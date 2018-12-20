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
      <template v-for="duty in dutyNames">

        <!-- Duty Name -->
        <v-flex xs2 :key="`dutyHeader_${duty}`">
          <v-card light color="#E0E0E0">
            <v-card-text class="px-0">{{duty}}</v-card-text>
          </v-card>
        </v-flex>

        <!-- Weekday Slots-->
        <v-flex
            xs10
            :key="`dutyRow_${duty}`"
        >
          <v-layout row wrap>
             <v-flex
                 v-for="weekday in weekdaysToUse"
                 :key="`dutySlot_${duty}_${weekday}`"
                 xs2
             >
                <!-- Available Duty -->
                <template v-if="isDutyAvailable(duty, weekday)">
                  <v-tooltip bottom>
                    <!-- For XS screens, (1) weekday text in btn and (2) constrained width -->
                    <v-btn
                        slot="activator"
                        block
                        dark
                        class="duty-button"
                        :class="{ 'xs' : isXSmall }"
                        :style="styleForDuty(duty, weekday)"
                        :color="colorForDuty(duty, weekday)"
                    >
                      <span
                          v-if="isXSmall
                          && isDutySheetLive
                          && statusForDuty(duty, weekday) === DutyStatus.unclaimed"
                      >
                        {{WEEKDAYS[weekday].abb}}
                      </span>

                      <v-icon v-else :color="iconColorForDuty(duty, weekday)">{{iconForDuty(duty, weekday)}}</v-icon>
                    </v-btn>
                    <span>{{tooltipForDuty(duty, weekday)}}</span>
                  </v-tooltip>
                </template>

               <!-- Unavailable Slots -->
                <template v-else>
                  <v-card
                      dark
                      class="duty-button"
                      :color="colorForDuty(duty, weekday)"
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
export default {
  name: 'duties-picker',

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
      ],
      DutyStatus: {
        'unavailable': 0,
        'unclaimed': 1,
        'claimed': 2,
        'completed': 3,
        'punted': 4
      },

      // FROM API CALLS
      isDutySheetLive: false,
      weekdaysToUse: [0, 1, 2, 3, 4, 5],
      dutyMap: {
        'Kitchen 1': {
          0: true,
          1: true,
          2: true,
          3: true,
          4: true,
          5: true
        },
        'Kitchen 2': {
          0: true,
          1: true,
          2: true,
          3: true,
          4: true,
          5: true
        },
        'Basement': {
          0: true,
          1: false,
          2: true,
          3: false,
          4: true,
          5: false
        },
        '2nd Bathrooms': {
          0: true,
          1: false,
          2: true,
          3: false,
          4: true,
          5: false
        },
        '3rd Bathrooms': {
          0: true,
          1: false,
          2: true,
          3: false,
          4: true,
          5: false
        },
        '4th Bathrooms': {
          0: true
        }
      },
      currentSheet: {
        'Kitchen 1': {
          0: {
            'assignee': 'Juan',
            'checkoff': null
          },
          3: {
            'assignee': 'Juan',
            'checkoff': null
          },
          4: {
            'assignee': 'Juan',
            'checkoff': null
          },
          5: {
            'assignee': 'Malik',
            'checkoff': 'Juan'
          }
        },
        'Kitchen 2': {
          3: {
            'assignee': 'Juan',
            'checkoff': null
          },
          4: {
            'assignee': 'Juan',
            'checkoff': null
          },
          5: {
            'assignee': 'Malik',
            'checkoff': 'Juan'
          }
        },
        'Basement': {
          0: {
            'assignee': 'Jorge',
            'checkoff': null
          },
          2: {
            'assignee': 'Nonye',
            'checkoff': 'Malik'
          },
          4: {
            'assignee': 'Rianna',
            'checkoff': 'Mo'
          }
        },
        '2nd Bathrooms': {
          2: {
            'assignee': 'YEET',
            'checkoff': 'Malk'
          },
          4: {
            'assignee': 'MOOOO',
            'checkoff': null
          }
        },
        '3rd Bathrooms': {
          4: {
            'assignee': 'MOOOO',
            'checkoff': null
          }
        }
      }
    }
  },

  // For ALL methods, duty :: string name of duty (i.e. key in dutyMap); weekday :: int (Sunday = 0)
  methods: {
    // STATUS
    statusForDuty (duty, weekday) {
      const isAvailable = this.isDutyAvailable(duty, weekday)

      if (!isAvailable) {
        return this.DutyStatus.unavailable
      }

      if (this.isDutySheetLive || this.isWeekdayFuture(weekday) || this.isWeekdayToday(weekday)) {
        const isClaimed = this.isDutyClaimed(duty, weekday)
        return isClaimed ? this.DutyStatus.claimed : this.DutyStatus.unclaimed
      } else {
        const isCheckedOff = this.isDutyCheckedOff(duty, weekday)
        return isCheckedOff ? this.DutyStatus.completed : this.DutyStatus.punted
      }
    },

    isDutyAvailable (duty, weekday) {
      var isAvailable = this.dutyMap[duty][weekday]
      if (typeof isAvailable === 'undefined') {
        isAvailable = false
      }

      return isAvailable
    },

    isDutyClaimed (duty, weekday) {
      var isClaimed = false
      if (duty in this.currentSheet) {
        if (weekday in this.currentSheet[duty]) {
          isClaimed = true
        }
      }

      return isClaimed
    },

    isDutyCheckedOff (duty, weekday) {
      var isCheckedOff = false
      if (duty in this.currentSheet) {
        if (weekday in this.currentSheet[duty]) {
          isCheckedOff = this.currentSheet[duty][weekday]['checkoff'] !== null
        }
      }

      return isCheckedOff
    },

    // STYLING
    colorForDuty (duty, weekday) {
      const dutyStatus = this.statusForDuty(duty, weekday)

      switch (dutyStatus) {
        case this.DutyStatus.unavailable:
          return '#707070'

        case this.DutyStatus.unclaimed:
          return this.isDutySheetLive ? 'primary' : '#8a95ff' //'#685dee'

        case this.DutyStatus.claimed:
          return this.isDutySheetLive ? '#eeeeee' : 'primary'

        case this.DutyStatus.completed:
          return '#27af6a'

        case this.DutyStatus.punted:
          return '#E57373'

        default:
          return '#000000'
      }
    },

    styleForDuty (duty, weekday) {
      var opacity = 1
      if (!this.isDutySheetLive && this.isWeekdayPast(weekday)) {
        opacity = 1
      }

      return { 'opacity': opacity }
    },

    tooltipForDuty (duty, weekday) {
      const dutyStatus = this.statusForDuty(duty, weekday)

      switch (dutyStatus) {
        case this.DutyStatus.unavailable:
          return null

        case this.DutyStatus.unclaimed:
          return 'Claim ' + duty + ' (' + this.WEEKDAYS[weekday].abb + ')'

        case this.DutyStatus.claimed:
          return this.currentSheet[duty][weekday]['assignee']

        case this.DutyStatus.completed:
          var dutyObj = this.currentSheet[duty][weekday]
          return dutyObj.assignee + ' (checked off by ' + dutyObj.checkoff + ')'

        case this.DutyStatus.punted:
          return 'Punted by ' + ''

        default:
          return null
      }
    },

    iconForDuty (duty, weekday) {
      const dutyStatus = this.statusForDuty(duty, weekday)

      switch (dutyStatus) {
        case this.DutyStatus.unavailable:
          return null

        case this.DutyStatus.unclaimed:
          return this.isDutySheetLive ? 'assignment_ind' : 'warning'

        case this.DutyStatus.claimed:
          return 'how_to_reg'

        case this.DutyStatus.completed:
          return 'check_circle'

        case this.DutyStatus.punted:
          return 'error'

        default:
          return null
      }
    },

    iconColorForDuty (duty, weekday) {
      const dutyStatus = this.statusForDuty(duty, weekday)

      switch (dutyStatus) {
        case this.DutyStatus.unavailable:
          return null

        case this.DutyStatus.unclaimed:
          return '#ffffff'

        case this.DutyStatus.claimed:
          return this.isDutySheetLive ? '#797a7a' : '#ffffff'

        case this.DutyStatus.completed:
          return '#ffffff'

        case this.DutyStatus.punted:
          return '#ffffff'

        default:
          return '#000000'
      }
    },

    // WEEKDAY
    isWeekdayPast (weekday) {
      const currentDate = new Date()
      return weekday < currentDate.getDay()-1
    },

    isWeekdayToday (weekday) {
      const currentDate = new Date()
      return weekday === currentDate.getDay()-1
    },

    isWeekdayFuture (weekday) {
      const currentDate = new Date()
      return weekday > currentDate.getDay()-1
    }
  },

  computed: {
    isXSmall () {
      return (this.$vuetify.breakpoint.xs)
    },

    dutyNames () {
      return Object.keys(this.dutyMap)
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

.past {
  opacity: 0.2;
}

.today-or-future {
  opacity: 1;
}

</style>
