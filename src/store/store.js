import Vue from 'vue'
import Vuex from 'vuex'

import { EDIT_SELECTED_DUTY, SET_CURRENT_USER, SET_DUTY_SHEET_LIVE, EDIT_DUTY_SEARCH } from './mutation-types'
import { SET_DUTY_TEMPLATES_REF, SET_USERS_REF, SET_ALL_DUTIES_REF, SET_WEEK_DUTIES_REF, SET_USER_DUTIES_REF } from './action-types'

import { firebaseMutations, firebaseAction } from 'vuexfire'

import { dutyTemplatesRef } from '../plugins/firebase'
import { getAllIndexes, PermissionSets, comparePermissions, containsAllPermission } from '../definitions'
import { dutyTemplateKeys, dutyKeys, userKeys } from '../api'

Vue.use(Vuex)

const dutiesStore = {
  state: {
    /* BOUND TO FIRESTORE */
    dutyTemplates: [], // Will be bound to duty-templates collection
    allDuties: [], // Will be bound to duties collection,
    // TODO: do a batched read for this! https://firebase.google.com/docs/firestore/manage-data/transactions
    weekDuties: [], // Will be bound to duties collection, filtered for this week,
    userDuties: [], // Will be bound to duties collection, filtered for current user,

    /* LOCAL */
    selectedDuty: null, // Actual firestore object
    isDutySheetLive: false,
    dutySearch: ''
  },

  mutations: {
    [EDIT_SELECTED_DUTY] (state, duty) {
      state.selectedDuty = duty
    },

    [SET_DUTY_SHEET_LIVE] (state, live) {
      state.isDutySheetLive = live
    },

    [EDIT_DUTY_SEARCH] (state, search) {
      state.dutySearch = search
    }
  },

  actions: {
    // TODO: can you make the string refs constants? And then use [] notation in state obj above?
    [SET_DUTY_TEMPLATES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('dutyTemplates', ref)
    }),

    [SET_ALL_DUTIES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('allDuties', ref)
    }),

    [SET_WEEK_DUTIES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('weekDuties', ref)
    }),

    [SET_USER_DUTIES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('userDuties', ref)
    })
  },

  getters: {
    dutyMap: (state, getters) => {
      var mapReal = []
      state.dutyTemplates.forEach(template => {
        var maxNumDuties = 0
        Object.keys(template[dutyTemplateKeys.schedule]).forEach(weekday => {
          maxNumDuties = Math.max(template[dutyTemplateKeys.schedule][weekday], maxNumDuties)
        })

        var allDuties = []
        for (let i = 0; i < maxNumDuties; i++) {
          var localSchedule = {}
          for (let j = 0; j < 7; j++) {
            localSchedule[j] = null
          }
          allDuties.push({
            name: template[dutyTemplateKeys.name],
            schedule: localSchedule,
            templateRef: dutyTemplatesRef.doc(template.id) })
        }

        mapReal = mapReal.concat(allDuties)
      })

      state.weekDuties.forEach(duty => {
        const dutyDate = new Date(duty[dutyKeys.date].seconds * 1000) // * 1000 to get ms
        const dutyWeekday = dutyDate.getDay()

        const templateIdxs = getAllIndexes(getters.dutyTemplateIDs, duty[dutyKeys.template].id)
        for (const templateIdx of templateIdxs) {
          // Place in correct spot for templates with multiple slots / day (i.e. Kitchen)
          if (mapReal[templateIdx]['schedule'][dutyWeekday] === null) {
            mapReal[templateIdx]['schedule'][dutyWeekday] = duty
            break
          }
        }
      })

      return mapReal
    },

    dutyTemplateNames: state => {
      var names = []
      state.dutyTemplates.forEach(template => {
        var maxNumDuties = 0
        Object.keys(template[dutyTemplateKeys.schedule]).forEach(weekday => {
          maxNumDuties = Math.max(template[dutyTemplateKeys.schedule][weekday], maxNumDuties)
        })

        for (let i = 0; i < maxNumDuties; i++) {
          names.push(template[dutyTemplateKeys.name])
        }
      })

      return names
    },

    dutyTemplateIDs: state => {
      var ids = []
      state.dutyTemplates.forEach(template => {
        var maxNumDuties = 0
        Object.keys(template[dutyTemplateKeys.schedule]).forEach(weekday => {
          maxNumDuties = Math.max(template[dutyTemplateKeys.schedule][weekday], maxNumDuties)
        })

        for (let i = 0; i < maxNumDuties; i++) {
          ids.push(template.id)
        }
      })

      return ids
    },

    weekdaysToUse: state => {
      var startDate = 6
      var endDate = 0

      state.dutyTemplates.forEach(template => {
        Object.keys(template[dutyTemplateKeys.schedule]).forEach(weekday => {
          weekday = parseInt(weekday) // keys come as strings!

          if (template[dutyTemplateKeys.schedule][weekday] <= 0) return

          if (weekday < startDate) {
            startDate = weekday
          }

          if (weekday > endDate) {
            endDate = weekday
          }
        })
      })

      var weekdays = []
      for (let i = startDate; i <= endDate; i++) {
        weekdays.push(i)
      }

      return weekdays
    },

    dutyObjForID: (state) => (dutyID) => {
      const dutyObj = state.weekDuties.find(duty => {
        return duty.id === dutyID
      })

      return dutyObj || null
    },

    dutySheetHasBeenGenerated: (state) => {
      return state.weekDuties.length > 0
    }
  }
}

export default new Vuex.Store({
  state: {
    /* BOUND TO FIRESTORE */
    users: [], // Will be bound to users collection

    /* LOCAL */
    currentUser: null
  },

  actions: {
    [SET_USERS_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('users', ref)
    })
  },

  modules: {
    dutiesStore
  },

  mutations: {
    [SET_CURRENT_USER] (state, user) {
      state.currentUser = user
      console.log(user)
    },

    ...firebaseMutations
  },

  getters: {
    currentFirestoreUser: (state) => {
      if (!state.currentUser) return null

      const uid = state.currentUser.uid
      const userObj = state.users.find(user => {
        return user.id === uid
      })

      return userObj || null
    },

    currentPermissionSet: (state, getters) => {
      if (!getters.currentFirestoreUser) return PermissionSets.User
      return getters.currentFirestoreUser[userKeys.permissionSet] || PermissionSets.User
    },

    // Returns if current user has ONE of the permissions in permissionSet
    currentUserHasPermissions: (state, getters) => (permissionSet) => {
      return comparePermissions(getters.currentPermissionSet, permissionSet)
    },

    // Returns if current user has ALL of the permissions in permissionSet
    currentUserHasAllPermissions: (state, getters) => (permissionSet) => {
      return containsAllPermission(getters.currentPermissionSet, permissionSet)
    }
  }
})
