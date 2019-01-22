import { PermissionTester } from '../definitions'
import store from '../store'

export const permissionsMixin = {
  data () {
    return {}
  },

  computed: {
    isFullDutiesAdmin () {
      return PermissionTester.isDutiesAdmin(store.getters.currentFirestoreUser)
    },

    isAnyDutiesAdmin () {
      return PermissionTester.isDutiesChecker(store.getters.currentFirestoreUser)
    }
  }
}
