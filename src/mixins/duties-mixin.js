import { DutyStatus } from '@/definitions'

export const dutiesMixin = {
  data () {
    return {}
  },

  methods: {
    // STATUS
    statusForDuty (dutyObj) {
      if (!this.isDutyAvailable(dutyObj)) return DutyStatus.unavailable

      const dutyWeekday = new Date(dutyObj.date.seconds * 1000).getDay() // * 1000 to get ms

      // TODO: change this.$store.dutiesStore to something nice
      if (this.$store.state.dutiesStore.isDutySheetLive || (this.isWeekdayFuture(dutyWeekday))) {
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
    }
  }
}
