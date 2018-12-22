import * as fb from '../plugins/firebase'
import { getNextDayOfWeek } from '../definitions'
import store from '../store'

export default {
  // CREATE
  generateDutySheet (startOfWeek) {
    store.getters.dutyMap.forEach(duty => {
      Object.keys(duty['schedule']).forEach(weekday => {
        for (let i = 0; i < duty['schedule'][weekday]; i++) {
          const dutyObj = {
            brother: null,
            checktime: null,
            checker: null,
            date: getNextDayOfWeek(weekday, startOfWeek),
            duty: duty.templateRef
          }

          fb.allDutiesRef.add(dutyObj)
        }
      })
    })
  }

  // READ

  // UPDATE

  // DELETE
}
