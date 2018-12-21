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
                 :id="duty + '_' + weekday"
                 :style="{ 'border-bottom-color': colorForDuty(duty, weekday) }"
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
                        @click.stop="dutyClicked(duty, weekday)"
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
import { SELECTED_DUTY_MUTATION } from '@/store/mutation-types'
import { dutiesMixin } from '../mixins/duties-mixin'

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

      // FROM API CALLS
      weekdaysToUse: [0, 1, 2, 3, 4, 5]
    }
  },

  // For ALL methods, duty :: string name of duty (i.e. key in dutyMap); weekday :: int (Sunday = 0)
  methods: {
    isDutyAvailable (duty, weekday) {
      return dutiesMixin.methods.isDutyAvailable(duty, weekday)
    },

    // STYLING
    colorForDuty (duty, weekday) {
      const dutyStatus = dutiesMixin.methods.statusForDuty(duty, weekday)

      switch (dutyStatus) {
        case dutiesMixin.data().DutyStatus.unavailable:
          return '#707070'

        case dutiesMixin.data().DutyStatus.unclaimed:
          return this.$store.state.dutiesStore.isDutySheetLive ? 'primary' : '#8a95ff' //'#685dee'

        case dutiesMixin.data().DutyStatus.claimed:
          return this.$store.state.dutiesStore.isDutySheetLive ? '#eeeeee' : 'primary'

        case dutiesMixin.data().DutyStatus.completed:
          return '#27af6a'

        case dutiesMixin.data().DutyStatus.punted:
          return '#E57373'

        default:
          return '#000000'
      }
    },

    styleForDuty (duty, weekday) {
      var opacity = 1
      if (!this.$store.state.dutiesStore.isDutySheetLive && dutiesMixin.methods.isWeekdayPast(weekday)) {
        opacity = 0.75
      }

      return { 'opacity': opacity }
    },

    tooltipForDuty (duty, weekday) {
      const dutyStatus = dutiesMixin.methods.statusForDuty(duty, weekday)

      switch (dutyStatus) {
        case dutiesMixin.data().DutyStatus.unavailable:
          return null

        case dutiesMixin.data().DutyStatus.unclaimed:
          return 'Claim ' + duty + ' (' + this.WEEKDAYS[weekday].abb + ')'

        case dutiesMixin.data().DutyStatus.claimed:
          return this.$store.state.dutiesStore.currentSheet[duty][weekday]['assignee']

        case dutiesMixin.data().DutyStatus.completed:
          var dutyObj = this.$store.state.dutiesStore.currentSheet[duty][weekday]
          return dutyObj.assignee + ' (checked off by ' + dutyObj.checkoff + ')'

        case dutiesMixin.data().DutyStatus.punted:
          return 'Punted by ' + ''

        default:
          return null
      }
    },

    iconForDuty (duty, weekday) {
      const dutyStatus = dutiesMixin.methods.statusForDuty(duty, weekday)

      switch (dutyStatus) {
        case dutiesMixin.data().DutyStatus.unavailable:
          return null

        case dutiesMixin.data().DutyStatus.unclaimed:
          return this.$store.state.dutiesStore.isDutySheetLive ? 'assignment_ind' : 'warning'

        case dutiesMixin.data().DutyStatus.claimed:
          return 'how_to_reg'

        case dutiesMixin.data().DutyStatus.completed:
          return 'check_circle'

        case dutiesMixin.data().DutyStatus.punted:
          return 'error'

        default:
          return null
      }
    },

    iconColorForDuty (duty, weekday) {
      const dutyStatus = dutiesMixin.methods.statusForDuty(duty, weekday)

      switch (dutyStatus) {
        case dutiesMixin.data().DutyStatus.unavailable:
          return null

        case dutiesMixin.data().DutyStatus.unclaimed:
          return '#ffffff'

        case dutiesMixin.data().DutyStatus.claimed:
          return this.$store.state.dutiesStore.isDutySheetLive ? '#797a7a' : '#ffffff'

        case dutiesMixin.data().DutyStatus.completed:
          return '#ffffff'

        case dutiesMixin.data().DutyStatus.punted:
          return '#ffffff'

        default:
          return '#000000'
      }
    },

    // ACTIONS
    dutyClicked (duty, weekday) {
      if (this.selectedDuty !== null && this.selectedDuty.name === duty && this.selectedDuty.weekday === weekday) {
        this.deselectDuty(duty, weekday)
      } else {
        if (this.selectedDuty !== null) {
          this.deselectDuty(this.selectedDuty.name, this.selectedDuty.weekday)
        }
        this.selectDuty(duty, weekday)
      }
    },

    // STATE MUTATIONS
    selectDuty (duty, weekday) {
      document.getElementById(duty + '_' + weekday).classList.add('selected')
      this.$store.commit(SELECTED_DUTY_MUTATION, {
        'name': duty,
        'weekday': weekday
      })
    },

    deselectDuty (duty, weekday) {
      document.getElementById(duty + '_' + weekday).classList.remove('selected')
      this.$store.commit(SELECTED_DUTY_MUTATION, null)
    }
  },

  computed: {
    isXSmall () {
      return (this.$vuetify.breakpoint.xs)
    },

    dutyNames () {
      return Object.keys(this.$store.state.dutiesStore.dutyMap)
    },

    selectedDuty () {
      return this.$store.state.dutiesStore.selectedDuty
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
