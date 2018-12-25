import * as fb from '../plugins/firebase'
import { getNextDayOfWeek } from '../definitions'
import store from '../store'
import firebase from 'firebase'

// TODO: split into public and private
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
  },

  // READ

  // UPDATE
  // TODO: make all properties of objects in firestore (i.e. 'checker' or 'check-time' constants!
  checkoffDuty (dutyObj, callback) {
    // TODO: move to better place?
    const currentUserID = firebase.auth().currentUser.uid
    fb.allDutiesRef.doc(dutyObj.id).update({
      checker: fb.usersRef.doc(currentUserID),
      checktime: new Date()
    }).then(() => { // Success
      callback(null)
    }, (error) => { // Failure
      callback(new Error(error))
    }).catch((error) => { // Error in callback
      throw error
    })
  },

  undoCheckoffForDuty (dutyObj, callback) {
    fb.allDutiesRef.doc(dutyObj.id).update({
      checker: null,
      checktime: null
    }).then(() => { // Success
      callback(null)
    }, (error) => { // Failure
      callback(new Error(error))
    }).catch((error) => { // Error in callback
      throw error
    })
  },

  updateAssigneeForDuty (dutyObj, assigneeObj, callback) {
    fb.allDutiesRef.doc(dutyObj.id).update({
      brother: fb.usersRef.doc(assigneeObj.id)
    }).then(() => { // Success
      callback(null)
    }, (error) => { // Failure
      callback(new Error(error))
    }).catch((error) => { // Error in callback
      throw error
    })
  }

  // DELETE
}
