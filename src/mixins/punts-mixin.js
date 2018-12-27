import { mapGetters } from 'vuex'
import { PuntStatus, Permissions } from '../definitions'
import { puntKeys, puntMakeupKeys } from '../api'

export const puntsMixin = {
  data () {
    return {}
  },

  methods: {
    statusForPunt (puntObj) {
      if (puntObj[puntKeys.makeUp] === null) {
        return PuntStatus.Punted
      }

      // TODO: Use a statusForPuntMakeup method
      if (puntObj[puntKeys.makeUp][puntMakeupKeys.completionTime] !== null) {
        return PuntStatus.MadeUp
      } else {
        return PuntStatus.MakeUpClaimed
      }
    }
  },

  computed: {
    isFullPuntsAdmin () {
      console.log('yeet')
      return this.currentUserHasPermissions(Permissions.Punts_Admin)
    },

    isAnyPuntsAdmin () {
      return this.currentUserHasPermissions(Permissions.Punts_Giver)
    },

    ...mapGetters([
      'currentUserHasPermissions'
    ])
  }
}
