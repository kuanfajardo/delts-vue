import Vue from 'vue'
import Vuex from 'vuex'
import { EDIT_SELECTED_DUTY } from './mutation-types'
import { SET_DUTY_TEMPLATES_REF, SET_USERS_REF, SET_ALL_DUTIES_REF, SET_WEEK_DUTIES_REF } from './action-types'
import { firebaseMutations, firebaseAction } from 'vuexfire'

Vue.use(Vuex)

const dutiesStore = {
  state: {
    dutyTemplates: [], // Will be bound to duty-templates collection
    users: [], // Will be bound to users collection,
    allDuties: [], // Will be bound to duties collection,
    weekDuties: [], // Will be bound to duties collection, filtered for this week
    selectedDuty: null,
    currentSheet: [
      {'Kitchen': {
        0: {
          'assignee': 'Juan',
          'checkoff': null
        },
        3: {
          'assignee': 'Juan',
          'checkoff': null
        },
        4: {
          'assignee': 'Juan',
          'checkoff': null
        },
        5: {
          'assignee': 'Malik',
          'checkoff': 'Juan'
        }
      }},
      {'Kitchen': {
        3: {
          'assignee': 'Juan',
          'checkoff': null
        },
        4: {
          'assignee': 'Juan',
          'checkoff': null
        },
        5: {
          'assignee': 'Malik',
          'checkoff': 'Juan'
        }
      }},
      {'Miscellaneous': {

      }},
      {'Basement': {
        0: {
          'assignee': 'Jorge',
          'checkoff': null
        },
        2: {
          'assignee': 'Nonye',
          'checkoff': 'Malik'
        },
        4: {
          'assignee': 'Rianna',
          'checkoff': 'Mo'
        },
        5: {
          'assignee': 'Lo',
          'checkoff': 'Scotty'
        }
      }},
      {'2nd Bathrooms': {
        2: {
          'assignee': 'YEET',
          'checkoff': 'Malk'
        },
        4: {
          'assignee': 'MOOOO',
          'checkoff': null
        }
      }},
    ],
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
    dutyMap: state => {
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
            localSchedule[j] = false
          }
          allDuties.push({ 'name': template.name, 'schedule': localSchedule })
        }

        Object.keys(template.schedule).forEach(weekday => {
          let numDuties = template.schedule[weekday]
          for (let i = 0; i < numDuties; i++) {
            allDuties[i]['schedule'][weekday] = true
          }
        })

        mapReal = mapReal.concat(allDuties)
      })

      return mapReal
    },

    dutyNames: state => {
      var names = []
      state.dutyTemplates.forEach(value => {
        var maxNumDuties = 0
        Object.keys(value.schedule).forEach(weekday => {
          maxNumDuties = Math.max(value.schedule[weekday], maxNumDuties)
        })

        for (let i = 0; i < maxNumDuties; i++) {
          names.push(value.name)
        }
      })

      return names
    }
  }
}

export default new Vuex.Store({
  modules: {
    dutiesStore
  },

  mutations: firebaseMutations
})
