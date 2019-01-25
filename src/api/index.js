import { dutyKeys, puntKeys, puntMakeupKeys, puntMakeupTemplateKeys, partyKeys } from './keys'
import * as fb from '../plugins/firebase'
import store from '../store'
import firebase from 'firebase'
import { setDay, startOfWeek, startOfDay } from 'date-fns'

// TODO: HUGE MY GUY :: CUSTOM OBJS FOR FIRESTORE : https://firebase.google.com/docs/firestore/manage-data/add-data#custom_objects
export default {
  // CREATE
  generateDutySheet (weekStart, callback) {
    // Make sure it is the start of week
    weekStart = startOfDay(startOfWeek(weekStart))

    // TODO: Check to make sure there isn't a duty sheet generated for this week already

    var dutySheetBatch = fb.db.batch()

    store.state.dutiesStore.getters.customDutyTemplates.forEach(dutyTemplate => { // Iterate over templates
      Object.keys(dutyTemplate.schedule).forEach(weekday => { // Iterate over weekdays
        for (let i = 0; i < dutyTemplate.schedule[weekday]; i++) { // Iterate over duties per weekday
          weekday = parseInt(weekday) // keys are strings!

          var dutyDate = setDay(weekStart, weekday)

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
  createNewPunt (puntee, reason, callback) { // User, String
    // TODO: make helpers for ref objects
    // TODO: make helper for current user ref
    // TODO: just centralize all ref calculations (probs in firebase.js)
    // TODO: sanitize other api calls

    if (typeof punteeID !== 'string') throw TypeError('{punteeID} should be a string')
    if (typeof reason !== 'string') throw TypeError('{reason} should be a string')

    const punteeRef = fb.usersRef.doc(puntee.id)
    const currentUserRef = fb.usersRef.doc(firebase.auth().currentUser.uid) // TODO: For consistency, use store
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
  createNewPuntsBatch (puntees, reason, callback) { // [User], String
    var puntsBatch = fb.db.batch()

    const currentUserRef = fb.usersRef.doc(firebase.auth().currentUser.uid) // TODO: For consistency, use store
    puntees.forEach(puntee => {
      console.log(puntee)
      const punteeRef = fb.usersRef.doc(puntee.id)

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
  updateAssigneeForDuty (duty, assignee, callback) { // Duty custom obj, User custom obj
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
  updatePuntsWithMakeup (puntArr, makeupTemplate, markAsComplete, callback) { // [Punt], PuntMakeupTemplate, Bool
    var batch = fb.db.batch()

    const makeupTemplateRef = fb.puntMakeupTemplatesRef.doc(makeupTemplate.id)
    const completionTime = markAsComplete ? new Date() : null

    puntArr.forEach(punt => {
      const assigneeRef = fb.usersRef.doc(punt.assignee.id)

      if (punt.makeUp !== null) {
        const oldMakeupRef = fb.puntMakeupsRef.doc(punt.makeUp.id)

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

        const puntRef = fb.allPuntsRef.doc(punt.id)
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

  updateMakeupTemplateWithData (makeupTemplate, updateData, callback) {
    fb.puntMakeupTemplatesRef.doc(makeupTemplate.id)
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
  deleteUser (user, callback) {
    // TODO: Add Admin SDK to delete user
    callback(new Error('Delete User not implemented yet'))
  },

  deletePunt (punt, callback) {
    fb.allPuntsRef.doc(punt.id).delete()
      .then(() => { // Success
        callback(null)
      }, (error) => { // Failure
        callback(new Error(error))
      }).catch((error) => { // Error in callback
        throw error
      })
  },

  // TODO: deletePuntBatch
  deletePuntsBatch (puntArr, callback) {
    var puntsBatch = fb.db.batch()

    puntArr.forEach(punt => {
      const puntRef = fb.allPuntsRef.doc(punt.id)
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
