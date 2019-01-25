import { PermissionTester } from '../definitions'
import store from '../store'

export const permissionsMixin = {
  data () {
    return {}
  },

  computed: {
    // TODO: Maybe redo?
    isFullDutiesAdmin () {
      return PermissionTester.isDutiesAdmin(store.getters.currentFirestoreUser)
    },

    isAnyDutiesAdmin () {
      return PermissionTester.isDutiesChecker(store.getters.currentFirestoreUser)
    },

    isFullPuntsAdmin () {
      return PermissionTester.isPuntsAdmin(store.getters.currentFirestoreUser)
    },

    isAnyPuntsAdmin () {
      return PermissionTester.isPuntsGiver(store.getters.currentFirestoreUser)
    }
  }
}
