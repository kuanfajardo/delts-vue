import Vue from 'vue'
import Vuex from 'vuex'
import { EDIT_SELECTED_DUTY } from './mutation-types'
import { SET_DUTY_TEMPLATES_REF, SET_USERS_REF, SET_ALL_DUTIES_REF, SET_WEEK_DUTIES_REF } from './action-types'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import { dutyTemplatesRef } from '../plugins/firebase'
import { getAllIndexes } from '../definitions'

Vue.use(Vuex)

const dutiesStore = {
  state: {
    dutyTemplates: [], // Will be bound to duty-templates collection
    users: [], // Will be bound to users collection,
    allDuties: [], // Will be bound to duties collection,
    weekDuties: [], // Will be bound to duties collection, filtered for this week,
    selectedDuty: null, // Actual duty firestore object
    isDutySheetLive: false
  },

  mutations: {
    [EDIT_SELECTED_DUTY] (state, duty) {
      state.selectedDuty = duty
    }
  },

  actions: {
    [SET_DUTY_TEMPLATES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('dutyTemplates', ref)
    }),

    [SET_USERS_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('users', ref)
    }),

    [SET_ALL_DUTIES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('allDuties', ref)
    }),

    [SET_WEEK_DUTIES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('weekDuties', ref)
    })
  },

  getters: {
    dutyMap: (state, getters) => {
      var mapReal = []
      state.dutyTemplates.forEach(template => {
        var maxNumDuties = 0
        Object.keys(template.schedule).forEach(weekday => {
          maxNumDuties = Math.max(template.schedule[weekday], maxNumDuties)
        })

        var allDuties = []
        for (let i = 0; i < maxNumDuties; i++) {
          var localSchedule = {}
          for (let j = 0; j < 7; j++) {
            localSchedule[j] = null
          }
          allDuties.push({ 'name': template.name, 'schedule': localSchedule, templateRef: dutyTemplatesRef.doc(template.id) })
        }

        mapReal = mapReal.concat(allDuties)
      })

      state.weekDuties.forEach(duty => {
        const dutyDate = new Date(duty.date.seconds * 1000) // * 1000 to get ms
        const dutyWeekday = dutyDate.getDay()

        const templateIdxs = getAllIndexes(getters.dutyTemplateIDs, duty.duty.id)
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

    dutyNames: state => {
      var names = []
      state.dutyTemplates.forEach(template => {
        var maxNumDuties = 0
        Object.keys(template.schedule).forEach(weekday => {
          maxNumDuties = Math.max(template.schedule[weekday], maxNumDuties)
        })

        for (let i = 0; i < maxNumDuties; i++) {
          names.push(template.name)
        }
      })

      return names
    },

    dutyTemplateIDs: state => {
      var ids = []
      state.dutyTemplates.forEach(template => {
        var maxNumDuties = 0
        Object.keys(template.schedule).forEach(weekday => {
          maxNumDuties = Math.max(template.schedule[weekday], maxNumDuties)
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
        Object.keys(template.schedule).forEach(weekday => {
          if (template.schedule[weekday] <= 0) return

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

      return typeof dutyObj === 'undefined' ? null : dutyObj
    }
  }
}

export default new Vuex.Store({
  modules: {
    dutiesStore
  },

  mutations: firebaseMutations
})
