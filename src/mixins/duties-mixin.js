import { SET_DUTY_TEMPLATES_REF, SET_USERS_REF, SET_ALL_DUTIES_REF, SET_WEEK_DUTIES_REF } from '../store'
import { DutyStatus } from '@/definitions'
import { dutyTemplatesRef, usersRef, allDutiesRef, weekDutiesRef } from '../plugins/firebase'

export const dutiesMixin = {
  data () {
    return {}
  },

  methods: {
    // STATUS
    statusForDuty (dutyIdx, weekday) {
      const isAvailable = this.isDutyAvailable(dutyIdx, weekday)
      if (!isAvailable) {
        return DutyStatus.unavailable
      }

      // TODO: change this.$store.dutiesStore to something nice
      if (this.$store.state.dutiesStore.isDutySheetLive || !this.isWeekdayPast(weekday)) {
        const isClaimed = this.isDutyClaimed(dutyIdx, weekday)
        return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed
      } else {
        const isCheckedOff = this.isDutyCheckedOff(dutyIdx, weekday)
        return isCheckedOff ? DutyStatus.completed : DutyStatus.punted
      }
    },

    isDutyAvailable (dutyIdx, weekday) {
      return this.$store.getters.dutyMap[dutyIdx]['schedule'][weekday] !== null
    },

    isDutyClaimed (dutyIdx, weekday) {
      return this.$store.getters.dutyMap[dutyIdx]['schedule'][weekday].brother !== null
    },

    isDutyCheckedOff (dutyIdx, weekday) {
      return this.$store.getters.dutyMap[dutyIdx]['schedule'][weekday].checktime !== null
    },

    // WEEKDAY
    isWeekdayPast (weekday) {
      const currentDate = new Date()
      return weekday < currentDate.getDay() - 2
    },

    isWeekdayToday (weekday) {
      const currentDate = new Date()
      return weekday === currentDate.getDay() - 2
    },

    isWeekdayFuture (weekday) {
      const currentDate = new Date()
      return weekday > currentDate.getDay() - 2
    }
  },

  created () {
    this.$store.dispatch(SET_DUTY_TEMPLATES_REF, dutyTemplatesRef)
    this.$store.dispatch(SET_USERS_REF, usersRef)
    this.$store.dispatch(SET_ALL_DUTIES_REF, allDutiesRef)
    this.$store.dispatch(SET_WEEK_DUTIES_REF, weekDutiesRef)
  }
}
