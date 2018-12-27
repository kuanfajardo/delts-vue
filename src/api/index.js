import { dutyKeys, dutyTemplateKeys, puntKeys } from './keys'
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
          weekday = parseInt(weekday) // keys are strings!

          var dutyDate
          if (weekday === startOfWeekDay) {
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

  createNewPunt (punteeID, reason, callback) {
    // TODO: make helpers for ref objects
    // TODO: make helper for current user ref
    // TODO: just centralize all ref calculations (probs in firebase.js)
    // TODO: sanitize other api calls

    if (typeof punteeID !== 'string') throw TypeError('{punteeID} should be a string')
    if (typeof reason !== 'string') throw TypeError('{reason} should be a string')

    const punteeRef = fb.usersRef.doc(punteeID)
    const currentUserRef = fb.usersRef.doc(firebase.auth().currentUser.uid)
    const puntObj = {
      [puntKeys.assignee]: punteeRef,
      [puntKeys.reason]: reason,
      [puntKeys.puntTime]: new Date(),
      [puntKeys.givenBy]: currentUserRef,
      [puntKeys.makeUp]: null
    }

    fb.allPuntsRef.add(puntObj)
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  },

  createNewPuntsBatch (punteeIDs, reason, callback) {
    var puntsBatch = fb.db.batch()

    const currentUserRef = fb.usersRef.doc(firebase.auth().currentUser.uid)
    punteeIDs.forEach(punteeID => {
      const punteeRef = fb.usersRef.doc(punteeID)

      const puntObj = {
        [puntKeys.assignee]: punteeRef,
        [puntKeys.reason]: reason,
        [puntKeys.puntTime]: new Date(),
        [puntKeys.givenBy]: currentUserRef,
        [puntKeys.makeUp]: null
      }

      var newPuntRef = fb.allPuntsRef.doc()
      puntsBatch.set(newPuntRef, puntObj)
    })

    puntsBatch.commit()
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
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
  },

  // DELETE
  deleteUser (userObj, callback) {
    // TODO: Add Admin SDK to delete user
    callback(new Error('Delete User not implemented yet'))
  },

  // OTHER

}

export * from './keys'
