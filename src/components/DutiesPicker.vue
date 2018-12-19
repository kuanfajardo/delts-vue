<template>
  <v-container grid-list-md text-xs-center>
    <v-layout :column="isXSmall" wrap>
      <template v-if="!isXSmall">
        <v-flex xs2></v-flex>
        <v-flex xs10>
          <v-layout row wrap>
            <v-flex v-for="weekday in weekdays" :key="`weekdayHeader_${weekday}`" xs2>
              <v-card light color="#E0E0E0">
                <v-card-text class="px-0">{{weekday}}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </template>
      <template v-for="duty in dutyNames">
        <v-flex xs2 :key="`dutyHeader_${duty}`">
          <v-card light color="#E0E0E0">
            <v-card-text class="px-0">{{duty}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs10 :key="`dutyRow_${duty}`">
          <v-layout row wrap>
             <v-flex v-for="weekday in weekdayAbbs" :key="`dutySlot_${duty}_${weekday}`" xs2>
              <!--<v-card dark :color="colorForDuty(duty, weekday)">-->
                <v-tooltip bottom>
                  <v-btn v-if="isXSmall" slot="activator" block dark class="duty_button xs" :color="colorForDuty(duty, weekday)">{{weekday}}</v-btn>
                  <v-btn v-else slot="activator" block dark class="duty_button" :color="colorForDuty(duty, weekday)">-</v-btn>
                  <span>Tooltip</span>
                </v-tooltip>
              <!--</v-card>-->
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
      ALL_WEEKDAYS: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      ALL_WEEKDAY_ABBS: [
        'U',
        'M',
        'T',
        'W',
        'R',
        'F',
        'S'
      ],

      // FROM API CALLS
      weekdaysToUse: [0, 1, 2, 3, 4, 5],
      dutyMap: {
        'Kitchen 1': {
          'U': true,
          'M': true,
          'T': true,
          'W': true,
          'R': true,
          'F': true
        },
        'Kitchen 2': {
          'U': true,
          'M': true,
          'T': true,
          'W': true,
          'R': true,
          'F': true
        },
        'Basement': {
          'U': true,
          'M': false,
          'T': true,
          'W': false,
          'R': true,
          'F': false
        },
        '2nd Bathrooms': {
          'U': true,
          'M': false,
          'T': true,
          'W': false,
          'R': true,
          'F': false
        },
        '3rd Bathrooms': {
          'U': true,
          'M': false,
          'T': true,
          'W': false,
          'R': true,
          'F': false
        },
        '4th Bathrooms': {
          'U': true
        }
      },
      currentSheet: {
        'Kitchen 1': {
          'U': '',
          'F': ''
        },
        'Basement': {
          'U': '',
          'T': '',
          'R': ''
        },
        '2nd Bathrooms': {
          'T': ''
        },
        '3rd Bathrooms': {
          'R': ''
        }
      }
    }
  },

  methods: {
    colorForDuty (duty, weekday) {
      const UNAVAILABLE_COLOR = '#707070'
      const UNSELECTED_COLOR = '#E57373'
      const SELECTED_COLOR = '#27af6a'

      var isAvailable = this.dutyMap[duty][weekday]
      if (typeof isAvailable === 'undefined') {
        isAvailable = false
      }

      if (!isAvailable) {
        return UNAVAILABLE_COLOR
      }

      var isSelected = false
      if (duty in this.currentSheet) {
        if (weekday in this.currentSheet[duty]) {
          isSelected = true
        }
      }

      return isSelected ? SELECTED_COLOR : UNSELECTED_COLOR
    }
  },

  computed: {
    isXSmall () {
      return (this.$vuetify.breakpoint.xs)
    },

    dutyNames () {
      return Object.keys(this.dutyMap)
    },

    weekdays () {
      var wd = []
      this.ALL_WEEKDAYS.forEach((value, index) => {
        if (this.weekdaysToUse.includes(index)) {
          wd.push(value)
        }
      })

      return wd
    },

    weekdayAbbs () {
      var abbs = []
      this.ALL_WEEKDAY_ABBS.forEach((value, index) => {
        if (this.weekdaysToUse.includes(index)) {
          abbs.push(value)
        }
      })

      return abbs
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.duty_button {
  margin-top: 0;
  margin-bottom: 0;
  padding: 16px 0 16px 0;
  height: auto;
}

.duty_button.xs {
  margin: 0;
  min-width: 0;
  width: 100%;
}

</style>
