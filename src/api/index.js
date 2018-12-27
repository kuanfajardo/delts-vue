import { dutyKeys, dutyTemplateKeys } from './keys'
import * as fb from '../plugins/firebase'
import { getNextDayOfWeek } from '../definitions'
import store from '../store'
import firebase from 'firebase'

// TODO: split into public and private
export default {
  // CREATE
  generateDutySheet (startOfWeek, callback) {
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfWeekDay = startOfWeek.getDay()

    var dutySheetBatch = fb.db.batch()

    store.state.dutiesStore.dutyTemplates.forEach(template => {
      Object.keys(template[dutyTemplateKeys.schedule]).forEach(weekday => {
        for (let i = 0; i < template[dutyTemplateKeys.schedule][weekday]; i++) {
          var dutyDate
          if (weekday == startOfWeekDay) { // {weekday} is string, {startOfWeekDay} is number, need ==
            console.log('same day mofos')
            dutyDate = new Date(startOfWeek.getTime())
          } else {
            dutyDate = getNextDayOfWeek(weekday, startOfWeek)
          }

          const dutyObj = {
            [dutyKeys.assignee]: null,
            [dutyKeys.checkTime]: null,
            [dutyKeys.checker]: null,
            [dutyKeys.date]: dutyDate,
            [dutyKeys.template]: fb.dutyTemplatesRef.doc(template.id)
          }

          var newDutyRef = fb.allDutiesRef.doc()
          dutySheetBatch.set(newDutyRef, dutyObj)
        }
      })
    })

    dutySheetBatch.commit()
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  },

  createNewUser (email, callback) {
    const defaultPassword = 'tempPass'
    firebase.auth().createUserWithEmailAndPassword(email, defaultPassword)
      .then(() => {
        // If successful, send sign-in email
        const actionCodeSettings = {
          url: 'http://localhost:8080/#/register',
          handleCodeInApp: true
        }

        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
          .then(() => {
            callback(null)
          }, (error) => {
            callback(new Error(error))
          }).catch((error) => {
            throw error
          })
      }, (error) => {
        callback(new Error(error))
      }).catch((error) => {
        throw error
      })
  },

  deleteUser (userObj, callback) {
    // TODO: Add Admin SDK to delete user
    callback(new Error('Delete User not implemented yet'))
  },

  // READ

  // UPDATE
  checkoffDuty (dutyObj, callback) {
    // TODO: move to better place?
    const currentUserID = firebase.auth().currentUser.uid
    fb.allDutiesRef.doc(dutyObj.id).update({
      [dutyKeys.checker]: fb.usersRef.doc(currentUserID),
      [dutyKeys.checkTime]: new Date()
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
      [dutyKeys.checker]: null,
      [dutyKeys.checkTime]: null
    }).then(() => { // Success
      callback(null)
    }, (error) => { // Failure
      callback(new Error(error))
    }).catch((error) => { // Error in callback
      throw error
    })
  },

  updateAssigneeForDuty (dutyObj, assigneeObj, callback) {
    const assignee = assigneeObj ? fb.usersRef.doc(assigneeObj.id) : null
    fb.allDutiesRef.doc(dutyObj.id).update({
      [dutyKeys.assignee]: assignee
    }).then(() => { // Success
      callback(null)
    }, (error) => { // Failure
      callback(new Error(error))
    }).catch((error) => { // Error in callback
      throw error
    })
  },

  updateUser (userObj, updateData, callback) {
    fb.usersRef.doc(userObj.id)
      .update(updateData)
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  }

  // DELETE

  // OTHER

}

export * from './keys'
