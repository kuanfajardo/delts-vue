import { dutyKeys, dutyTemplateKeys, puntKeys, puntMakeupKeys, puntMakeupTemplateKeys, partyKeys } from './keys'
import * as fb from '../plugins/firebase'
import { getNextDayOfWeek } from '../definitions'
import store from '../store'
import firebase from 'firebase'

// TODO: split into public and private
// TODO: HUGE MY GUY :: CUSTOM OBJS FOR FIRESTORE : https://firebase.google.com/docs/firestore/manage-data/add-data#custom_objects
export default {
  // CREATE
  generateDutySheet (startOfWeek, callback) {
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfWeekDay = startOfWeek.getDay()

    var dutySheetBatch = fb.db.batch()

    store.state.dutiesStore.getters.customDutyTemplates.forEach(dutyTemplate => { // Iterate over templates
      Object.keys(dutyTemplate.schedule).forEach(weekday => { // Iterate over weekdays
        for (let i = 0; i < dutyTemplate.schedule[weekday]; i++) { // Iterate over duties per weekday
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
            [dutyKeys.template]: fb.dutyTemplatesRef.doc(dutyTemplate.id)
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

  // TODO: createUser
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

  // TODO: createPunt
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

  // TODO: createPuntBatch
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

  // TODO: createMakeupTemplate
  createNewMakeupTemplate (templateName, templateDescription, callback) {
    // TODO: type checking OOH or can do it in cloud

    const makeupTemplateObj = {
      [puntMakeupTemplateKeys.name]: templateName,
      [puntMakeupTemplateKeys.description]: templateDescription,
      [puntMakeupTemplateKeys.date]: new Date(),
      [puntMakeupTemplateKeys.value]: 1
    }

    fb.puntMakeupTemplatesRef.add(makeupTemplateObj)
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  },

  // TODO: createParty
  createNewParty (name, theme, start, end, capacity, callback) {
    const newPartyObj = {
      [partyKeys.capacity]: capacity,
      [partyKeys.name]: name,
      [partyKeys.theme]: theme,
      [partyKeys.startTimestamp]: start,
      [partyKeys.endTimestamp]: end,
      [partyKeys.photos]: null,
      [partyKeys.isActive]: true
    }

    fb.partiesCollectionRef.add(newPartyObj)
      .then(() => { // SUCCESS
        callback(null)
      }, (error) => { // FAILURE
        callback(new Error(error))
      }).catch((error) => { // ERROR IN CALLBACK
        throw error
      })
  },

  // READ

  // UPDATE
  // TODO: updateDutyCheckoff
  checkoffDuty (duty, callback) {
    // TODO: move to better place?
    const currentUserID = firebase.auth().currentUser.uid
    fb.allDutiesRef.doc(duty.id).update({
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

  // TODO: updateDutyCheckoff
  undoCheckoffForDuty (duty, callback) {
    fb.allDutiesRef.doc(duty.id).update({
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

  // TODO: updateDutyAssignee
  updateAssigneeForDuty (duty, assignee, callback) { // Duty obj, User obj
    const assigneeRef = assignee ? fb.usersRef.doc(assignee.id) : null
    fb.allDutiesRef.doc(duty.id).update({
      [dutyKeys.assignee]: assigneeRef
    }).then(() => { // Success
      callback(null)
    }, (error) => { // Failure
      callback(new Error(error))
    }).catch((error) => { // Error in callback
      throw error
    })
  },

  updateUserWithData (userObj, updateData, callback) {
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

  // TODO: updatePuntBatchMakeup
  // TODO: Change to accept makeupObj
  updatePuntsWithMakeup (puntObjArr, makeupTemplateID, markAsComplete, callback) {
    var batch = fb.db.batch()

    const makeupTemplateRef = fb.puntMakeupTemplatesRef.doc(makeupTemplateID)
    const completionTime = markAsComplete ? new Date() : null

    puntObjArr.forEach(puntObj => {
      const assigneeRef = fb.usersRef.doc(puntObj[puntKeys.assignee].id)

      if (puntObj[puntKeys.makeUp] !== null) {
        const oldMakeupRef = fb.puntMakeupsRef.doc(puntObj[puntKeys.makeUp].id)

        const makeupUpdateObj = {
          [puntMakeupKeys.completionTime]: completionTime,
          [puntMakeupKeys.makeupTemplate]: makeupTemplateRef
        }

        batch.update(oldMakeupRef, makeupUpdateObj)
      } else {
        const newMakeupRef = fb.puntMakeupsRef.doc()
        const newMakeupObj = {
          [puntMakeupKeys.completionTime]: completionTime,
          [puntMakeupKeys.makeupTemplate]: makeupTemplateRef,
          [puntMakeupKeys.assignedTo]: assigneeRef
        }

        batch.set(newMakeupRef, newMakeupObj)

        const puntRef = fb.allPuntsRef.doc(puntObj.id)
        const puntUpdateObj = {
          [puntKeys.makeUp]: newMakeupRef
        }

        batch.update(puntRef, puntUpdateObj)
      }
    })

    batch.commit()
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  },

  updateMakeupTemplateWithData (makeupTemplateObj, updateData, callback) {
    fb.puntMakeupTemplatesRef.doc(makeupTemplateObj.id)
      .update(updateData)
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  },

  updatePartyWithData (partyObj, updateData, callback) {
    fb.partiesRef.doc(partyObj.id)
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

  deletePunt (puntObj, callback) {
    fb.allPuntsRef.doc(puntObj.id).delete()
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  },

  // TODO: deletePuntBatch
  deletePuntsBatch (puntObjArr, callback) {
    var puntsBatch = fb.db.batch()

    puntObjArr.forEach(puntObj => {
      const puntRef = fb.allPuntsRef.doc(puntObj.id)
      puntsBatch.delete(puntRef)
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

  deleteParty (partyObj, callback) {
    fb.partiesRef.doc(partyObj.id)
      .delete()
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  },

  // OTHER
  // TODO: Use this!
  run (f, callback) {
    f().then(() => {
      callback(null)
    }, (error) => {
      callback(new Error(error))
    }).catch((error) => {
      throw error
    })
  }

}

export * from './keys'
