import { DutyStatus } from '@/definitions'
import { dutyKeys } from '../api'

export const dutiesMixin = {
  data () {
    return {}
  },

  methods: {
    // STATUS
    statusForDuty (dutyObj) {
      if (!this.isDutyAvailable(dutyObj)) return DutyStatus.unavailable

      const isClaimed = this.isDutyClaimed(dutyObj)
      const isCheckedOff = this.isDutyCheckedOff(dutyObj)
      const dutyWeekday = new Date(dutyObj.date.seconds * 1000).getDay() // * 1000 to get ms

      // TODO: change this.$store.dutiesStore to something nice
      if (this.$store.state.dutiesStore.isDutySheetLive) {
        return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed
      }

      if (this.isWeekdayPast(dutyWeekday)) {
        return isCheckedOff ? DutyStatus.completed : DutyStatus.punted
      }

      if (this.isWeekdayToday(dutyWeekday)) {
        return isCheckedOff ? DutyStatus.completed : (isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed)
      }

      if (this.isWeekdayFuture(dutyWeekday)) {
        return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed
      }
    },

    isDutyAvailable (dutyObj) {
      return dutyObj !== null
    },

    isDutyClaimed (dutyObj) {
      return dutyObj[dutyKeys.assignee] !== null
    },

    isDutyCheckedOff (dutyObj) {
      return dutyObj[dutyKeys.checkTime] !== null
    },

    // TODO: consolidate into one function
    // WEEKDAY
    isWeekdayPast (weekday) {
      // TODO: use currentDate
      const currentDate = new Date()
      return weekday < this.$_glob.today.getDay()
    },

    isWeekdayToday (weekday) {
      // TODO: use currentDate
      const currentDate = new Date()
      return weekday === this.$_glob.today.getDay()
    },

    isWeekdayFuture (weekday) {
      // TODO: use currentDate
      const currentDate = new Date()
      return weekday > this.$_glob.today.getDay()
    },

    // USER
    isDutyForCurrentUser (dutyObj) {
      // debugger
      const dutyStatus = this.statusForDuty(dutyObj)
      if (dutyStatus === DutyStatus.unavailable || dutyStatus === DutyStatus.unclaimed) {
        return false
      }

      // TODO: remove when sure that all claimed duties have an assignee object (rn can be punted w/o an assignee)
      const dutyAssignee = dutyObj[dutyKeys.assignee] || {}
      return dutyAssignee.id === this.$store.state.currentUser.uid
    }
  }
}
