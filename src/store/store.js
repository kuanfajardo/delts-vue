import Vue from 'vue'
import Vuex from 'vuex'

// TODO: Import *
import { EDIT_SELECTED_DUTY, SET_CURRENT_USER, SET_DUTY_SHEET_LIVE, EDIT_DUTY_SEARCH, EDIT_PUNT_SEARCH,
  EDIT_SELECTED_PUNTS, EDIT_SELECTED_MAKEUP_TEMPLATE, EDIT_MAKEUP_TEMPLATE_SEARCH, EDIT_PARTY_SEARCH } from './mutation-types'
import {
  SET_DUTY_TEMPLATES_REF, SET_USERS_REF, SET_ALL_DUTIES_REF, SET_WEEK_DUTIES_REF, SET_USER_DUTIES_REF,
  SET_ALL_PUNTS_REF, SET_USER_PUNTS_REF, SET_PUNT_MAKEUPS_REF, SET_PUNT_MAKEUP_TEMPLATES_REF, SET_PARTIES_REF
} from './action-types'

import { firebaseMutations, firebaseAction } from 'vuexfire'

import { Party, DutyMap, DutyProxy, DutyTemplateProxy, UserProxy, PuntMakeupTemplateProxy, PuntProxy, PuntMakeupProxy, PartyProxy  } from '../definitions/model'

Vue.use(Vuex)

const dutiesStore = {
  state: {
    /* BOUND TO FIRESTORE */
    dutyTemplates: [], // Will be bound to duty-templates collection
    allDuties: [], // Will be bound to duties collection.
    // TODO: do a batched read for this! https://firebase.google.com/docs/firestore/manage-data/transactions
    weekDuties: [], // Will be bound to duties collection, filtered for this week.
    userDuties: [], // Will be bound to duties collection, filtered for current user.

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
    customAllDuties: (state) => {
      return state.allDuties.map((dutyObj) => {
        return DutyProxy.createFromFirestoreObject(dutyObj)
      })
    },

    customUserDuties: (state) => {
      return state.userDuties.map((dutyObj) => {
        return DutyProxy.createFromFirestoreObject(dutyObj)
      })
    },

    customWeekDuties: (state) => {
      return state.weekDuties.map((dutyObj) => {
        return DutyProxy.createFromFirestoreObject(dutyObj)
      })
    },

    customDutyTemplates: (state) => {
      return state.dutyTemplates.map((dutyTemplateObj) => {
        return DutyTemplateProxy.createFromFirestoreObject(dutyTemplateObj)
      })
    },

    dutyMap: (state, getters) => {
      return new DutyMap(getters.customDutyTemplates, getters.customWeekDuties)
    },

    dutyObjForID: (state) => (dutyID) => {
      const dutyObj = state.weekDuties.find(duty => {
        return duty.id === dutyID
      })

      return dutyObj ? DutyProxy.createFromFirestoreObject(dutyObj) : null
    },

    dutySheetHasBeenGenerated: (state) => {
      return state.weekDuties.length > 0
    }
  }
}

const puntsStore = {
  state: {
    /* BOUND TO FIRESTORE */
    // TODO: do a batched read for this! https://firebase.google.com/docs/firestore/manage-data/transactions
    allPunts: [], // Will be bound to punts collection.
    userPunts: [], // Will be bound to punts collection, filtered for current user.
    puntMakeups: [], // Will be bound to punt makeups collection
    makeupTemplates: [],

    /* LOCAL */
    // Punts Tab 0
    puntSearch: '',
    selectedPunts: [],

    // Punts Tab 1
    makeupTemplateSearch: '',
    focusedMakeupTemplate: null
  },

  mutations: {
    [EDIT_PUNT_SEARCH] (state, search) {
      state.puntSearch = search
    },

    [EDIT_SELECTED_PUNTS] (state, selected) {
      state.selectedPunts = selected
    },

    // TODO: Rename to 'focused'
    [EDIT_SELECTED_MAKEUP_TEMPLATE] (state, selected) {
      state.focusedMakeupTemplate = selected
    },

    [EDIT_MAKEUP_TEMPLATE_SEARCH] (state, search) {
      state.makeupTemplateSearch = search
    }
  },

  actions: {
    // TODO: can you make the string refs constants? And then use [] notation in state obj above?
    [SET_ALL_PUNTS_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('allPunts', ref)
    }),

    [SET_USER_PUNTS_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('userPunts', ref)
    }),

    [SET_PUNT_MAKEUPS_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('puntMakeups', ref)
    }),

    [SET_PUNT_MAKEUP_TEMPLATES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('makeupTemplates', ref)
    })
  },

  getters: {
    customAllPunts: (state) => {
      return state.allPunts.map((puntObj) => {
        return PuntProxy.createFromFirestoreObject(puntObj)
      })
    },

    customUserPunts: (state) => {
      return state.userPunts.map((puntObj) => {
        return PuntProxy.createFromFirestoreObject(puntObj)
      })
    },

    customPuntMakeups: (state) => {
      return state.puntMakeups.map((puntMakeupObj) => {
        return PuntMakeupProxy.createFromFirestoreObject(puntMakeupObj)
      })
    },

    customPuntMakeupTemplates: (state) => {
      return state.makeupTemplates.map((makeupTemplateObj) => {
        return PuntMakeupTemplateProxy.createFromFirestoreObject(makeupTemplateObj)
      })
    }
  }
}

const socialStore = {
  state: {
    /* BOUND TO FIRESTORE */
    parties: [],

    /* LOCAL */
    partySearch: ''
  },

  mutations: {
    [EDIT_PARTY_SEARCH] (state, search) {
      state.partySearch = search
    }
  },

  actions: {
    [SET_PARTIES_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('parties', ref)
    })
  },

  getters: {
    customParties: state => {
      return state.parties.map((partyObj) => {
        return PartyProxy.createFromFirestoreObject(partyObj)
      })
    }
  }
}

export default new Vuex.Store({
  state: {
    /* BOUND TO FIRESTORE */
    users: [], // Will be bound to users collection

    /* LOCAL */
    // TODO: Replace ALL calls to firebase current user with this. Or make decision on that
    // TODO: Make getter for getting current user ref here?
    currentUser: null
  },

  actions: {
    [SET_USERS_REF]: firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, ref) => {
      bindFirebaseRef('users', ref)
    })
  },

  modules: {
    dutiesStore,
    puntsStore,
    socialStore
  },

  mutations: {
    [SET_CURRENT_USER] (state, user) {
      state.currentUser = user
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

      return userObj ? UserProxy.createFromFirestoreObject(userObj) : null
    },

    customUsers: (state) => {
      return state.users.map((userObj) => {
        return UserProxy.createFromFirestoreObject(userObj)
      })
    }
  }
})
