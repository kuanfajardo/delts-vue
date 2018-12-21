import store from '../store/store'

export const dutiesMixin = {
  data () {
    return {
      DutyStatus: {
        'unavailable': 0,
        'unclaimed': 1,
        'claimed': 2,
        'completed': 3,
        'punted': 4
      }
    }
  },

  methods: {
    // STATUS
    statusForDuty (duty, weekday) {
      const isAvailable = this.isDutyAvailable(duty, weekday)

      if (!isAvailable) {
        return dutiesMixin.data().DutyStatus.unavailable
      }

      if (store.state.dutiesStore.isDutySheetLive || this.isWeekdayFuture(weekday) || this.isWeekdayToday(weekday)) {
        const isClaimed = this.isDutyClaimed(duty, weekday)
        return isClaimed ? dutiesMixin.data().DutyStatus.claimed : dutiesMixin.data().DutyStatus.unclaimed
      } else {
        const isCheckedOff = this.isDutyCheckedOff(duty, weekday)
        return isCheckedOff ? dutiesMixin.data().DutyStatus.completed : dutiesMixin.data().DutyStatus.punted
      }
    },

    isDutyAvailable (duty, weekday) {
      var isAvailable = store.state.dutiesStore.dutyMap[duty][weekday]
      if (typeof isAvailable === 'undefined') {
        isAvailable = false
      }

      return isAvailable
    },

    isDutyClaimed (duty, weekday) {
      var isClaimed = false
      if (duty in store.state.dutiesStore.currentSheet) {
        if (weekday in store.state.dutiesStore.currentSheet[duty]) {
          isClaimed = true
        }
      }

      return isClaimed
    },

    isDutyCheckedOff (duty, weekday) {
      var isCheckedOff = false
      if (duty in store.state.dutiesStore.currentSheet) {
        if (weekday in store.state.dutiesStore.currentSheet[duty]) {
          isCheckedOff = store.state.dutiesStore.currentSheet[duty][weekday]['checkoff'] !== null
        }
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
  }
}
