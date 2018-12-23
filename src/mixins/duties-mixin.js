import { SET_DUTY_TEMPLATES_REF, SET_USERS_REF, SET_ALL_DUTIES_REF, SET_WEEK_DUTIES_REF } from '../store'
import { DutyStatus } from '@/definitions'
import { dutyTemplatesRef, usersRef, allDutiesRef, weekDutiesRef } from '../plugins/firebase'

export const dutiesMixin = {
  data () {
    return {}
  },

  methods: {
    // STATUS
    statusForDuty (dutyID) {
      if (dutyID === null) {
        return DutyStatus.unavailable
      }

      const isAvailable = this.isDutyAvailable(dutyID)
      if (!isAvailable) {
        return DutyStatus.unavailable
      }

      const dutyObj = this.$store.getters.dutyObjForID(dutyID)
      const dutyDate = new Date(dutyObj.date.seconds * 1000) // * 1000 to get ms
      const dutyWeekday = dutyDate.getDay()

      // TODO: change this.$store.dutiesStore to something nice
      if (this.$store.state.dutiesStore.isDutySheetLive || !this.isWeekdayPast(dutyWeekday)) {
        const isClaimed = this.isDutyClaimed(dutyObj)
        return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed
      } else {
        const isCheckedOff = this.isDutyCheckedOff(dutyObj)
        return isCheckedOff ? DutyStatus.completed : DutyStatus.punted
      }
    },

    isDutyAvailable (dutyID) {
      if (dutyID === null) {
        return false
      }
      
      const dutyObj = this.$store.getters.dutyObjForID(dutyID)
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
