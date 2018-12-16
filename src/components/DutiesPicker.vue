<template>
  <v-container grid-list-md text-xs-center>
    <v-layout :column="isXSmall" wrap>
      <template v-if="!isXSmall">
        <v-flex xs2></v-flex>
        <v-flex xs10>
          <v-layout row wrap>
            <v-flex v-for="i in 6" :key="`A1${i}`" xs2>
              <v-card light color="#E0E0E0">
                <v-card-text class="px-0">{{weekdays[i - 1]}}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </template>
      <template v-for="i in dutyNames.length">
        <v-flex xs2 :key="`dutyName_${i}`">
          <v-card light color="#E0E0E0">
            <v-card-text class="px-0">{{dutyNames[i - 1]}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs10 :key="`dutyPicker_${i}`">
          <v-layout row wrap>
             <v-flex v-for="i in weekdays.length" :key="`A2${i}`" xs2>
              <v-card dark color="#E57373">
                <v-card-text v-if="isXSmall" class="px-0">{{weekdayAbbs[i - 1]}}</v-card-text>
                <v-card-text v-else class="px-0">.</v-card-text>
              </v-card>
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
      msg: 'msg',
      weekdays: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      weekdayAbbs: [
        'U',
        'M',
        'T',
        'W',
        'R',
        'F'
      ],
      dutyNames: [
        'Kitchen 1',
        'Kitchen 2',
        'Basement',
        '2nd Bathrooms',
        '3rd Bathrooms'
      ]
    }
  },

  methods: {
    randomColor () {
      let color = '#' + Math.floor(Math.random() * 16777215).toString(16)
      console.log(color)
      return color
    }
  },

  computed: {
    isXSmall () {
      return (this.$vuetify.breakpoint.xs)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .duties-picker {

  }
</style>
