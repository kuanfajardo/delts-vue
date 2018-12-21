import Vue from 'vue'
import Vuex from 'vuex'
import { EDIT_SELECTED_DUTY } from './mutation-types'

Vue.use(Vuex)

const dutiesStore = {
  state: {
    selectedDuty: null,
    dutyMap: {
      'Kitchen 1': {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true
      },
      'Kitchen 2': {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true
      },
      'Basement': {
        0: true,
        1: false,
        2: true,
        3: false,
        4: true,
        5: false
      },
      '2nd Bathrooms': {
        0: true,
        1: false,
        2: true,
        3: false,
        4: true,
        5: false
      },
      '3rd Bathrooms': {
        0: true,
        1: false,
        2: true,
        3: false,
        4: true,
        5: false
      },
      '4th Bathrooms': {
        0: true
      }
    },
    currentSheet: {
      'Kitchen 1': {
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
      },
      'Kitchen 2': {
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
      },
      'Basement': {
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
        }
      },
      '2nd Bathrooms': {
        2: {
          'assignee': 'YEET',
          'checkoff': 'Malk'
        },
        4: {
          'assignee': 'MOOOO',
          'checkoff': null
        }
      },
      '3rd Bathrooms': {
        4: {
          'assignee': 'MOOOO',
          'checkoff': null
        }
      }
    },
    isDutySheetLive: true
  },
  mutations: {
    [EDIT_SELECTED_DUTY] (state, duty) {
      state.selectedDuty = duty
    }
  },
  actions: {

  }
}

export default new Vuex.Store({
  modules: {
    dutiesStore
  }
})
