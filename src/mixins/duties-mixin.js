import { SET_DUTY_TEMPLATES_REF, SET_USERS_REF, SET_ALL_DUTIES_REF, SET_WEEK_DUTIES_REF } from '../store'
import { DutyStatus } from '@/definitions'
import { dutyTemplatesRef, usersRef, allDutiesRef, weekDutiesRef } from '../plugins/firebase'

export const dutiesMixin = {
  data () {
    return {}
  },

  methods: {
    // STATUS
    statusForDuty (dutyObj) {
      if (!this.isDutyAvailable(dutyObj)) return DutyStatus.unavailable

      const dutyDate = new Date(dutyObj.date.seconds * 1000) // * 1000 to get ms
      const currentDate = new Date()
      // TODO: remove + 4 lol
      const isWeekdayPast = dutyDate.getDay() < currentDate.getDay() + 4

      // TODO: change this.$store.dutiesStore to something nice
      if (this.$store.state.dutiesStore.isDutySheetLive || !isWeekdayPast) {
        const isClaimed = this.isDutyClaimed(dutyObj)
        return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed
      } else {
        const isCheckedOff = this.isDutyCheckedOff(dutyObj)
        return isCheckedOff ? DutyStatus.completed : DutyStatus.punted
      }
    },

    isDutyAvailable (dutyObj) {
      return dutyObj !== null
    },

    isDutyClaimed (dutyObj) {
      return dutyObj.brother !== null
    },

    isDutyCheckedOff (dutyObj) {
      return dutyObj.checktime !== null
    },

    // WEEKDAY
    isWeekdayPast (weekday) {
      const currentDate = new Date()
      return weekday < currentDate.getDay() + 4
    }
  },

  created () {
    this.$store.dispatch(SET_DUTY_TEMPLATES_REF, dutyTemplatesRef)
    this.$store.dispatch(SET_USERS_REF, usersRef)
    this.$store.dispatch(SET_ALL_DUTIES_REF, allDutiesRef)
    this.$store.dispatch(SET_WEEK_DUTIES_REF, weekDutiesRef)
  }
}
