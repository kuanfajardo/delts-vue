import { SET_DUTY_TEMPLATES_REF, SET_USERS_REF } from '@/store'
import { DutyStatus } from '@/definitions'
import { dutyTemplatesRef, usersRef } from '@/plugins/firebase'

export const dutiesMixin = {
  data () {
    return {}
  },

  methods: {
    // STATUS
    statusForDuty (dutyIdx, dutyName, weekday) {
      const isAvailable = this.isDutyAvailable(dutyIdx, dutyName, weekday)

      if (!isAvailable) {
        return DutyStatus.unavailable
      }

      if (this.$store.state.dutiesStore.isDutySheetLive || this.isWeekdayFuture(weekday) || this.isWeekdayToday(weekday)) {
        const isClaimed = this.isDutyClaimed(dutyIdx, dutyName, weekday)
        return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed
      } else {
        const isCheckedOff = this.isDutyCheckedOff(dutyIdx, dutyName, weekday)
        return isCheckedOff ? DutyStatus.completed : DutyStatus.punted
      }
    },

    isDutyAvailable (dutyIdx, dutyName, weekday) {
      var isAvailable = this.$store.getters.dutyMap[dutyIdx][dutyName][weekday]
      if (typeof isAvailable === 'undefined') {
        isAvailable = false
      }

      return isAvailable
    },

    isDutyClaimed (dutyIdx, dutyName, weekday) {
      var isClaimed = false
      if (weekday in this.$store.state.dutiesStore.currentSheet[dutyIdx][dutyName]) {
        isClaimed = true
      }

      return isClaimed
    },

    isDutyCheckedOff (dutyIdx, dutyName, weekday) {
      var isCheckedOff = false
      if (weekday in this.$store.state.dutiesStore.currentSheet[dutyIdx][dutyName]) {
        isCheckedOff = this.$store.state.dutiesStore.currentSheet[dutyIdx][dutyName][weekday]['checkoff'] !== null
      }

      return isCheckedOff
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
  }
}
