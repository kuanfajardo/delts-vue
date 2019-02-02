<template>
  <v-toolbar
      id="punts-toolbar"
      class="mb-3 mt-2"
      style="opacity: 1; width: 900px;"
  >
    <template v-if="tab === 0">
      <template v-if="isAnyPuntsAdmin">
        <!-- PUNT DIALOG -->
        <new-punt-dialog
          :on-save="savePuntDialog"
        >
          <v-btn
            color="primary"
            :loading="isPuntButtonBusy"
          >
            New Punt
            <v-icon right>add_circle</v-icon>
          </v-btn>
        </new-punt-dialog>

        <!-- MAKEUP DIALOG -->
        <edit-punt-dialog
          :on-save="saveMakeupDialog"
          :on-cancel="closeMakeupDialog"
          :model="makeupDialogModel"
        >
          <v-btn
            color="secondary"
            :loading="isMakeupButtonBusy"
            :disabled="isMakeupDialogDisabled"
          >
            Makeup
            <v-icon right>edit</v-icon>
          </v-btn>
        </edit-punt-dialog>

        <!-- DELETE DIALOG -->
        <delete-punt-dialog
          :on-delete="saveDeleteDialog"
          :on-cancel="closeDeleteDialog"
        >
          <v-btn
            color="error"
            :loading="isDeleteButtonBusy"
            :disabled="disableDeleteButton"
          >
            Delete
            <v-icon right>delete</v-icon>
          </v-btn>
        </delete-punt-dialog>

        <v-divider
          class="mx-3"
          vertical
        ></v-divider>
      </template>

      <!-- SEARCH BOX -->
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        solo
        hide-details
        class="px-1 py-0 my-0"
      ></v-text-field>
    </template>

    <template v-if="tab === 1">

      <!-- NEW MAKEUP DIALOG -->
      <new-punt-makeup-template-dialog
        :on-save="saveNewMakeupDialog"
      >
        <v-btn
          color="primary"
          :loading="isNewMakeupTemplateButtonBusy"
        >
          New Template
          <v-icon right>add_circle</v-icon>
        </v-btn>
      </new-punt-makeup-template-dialog>

      <v-divider
          class="mx-3"
          vertical
        ></v-divider>

      <!-- SEARCH BOX -->
      <v-text-field
        v-model="search_2"
        append-icon="search"
        label="Search"
        single-line
        solo
        hide-details
        class="px-1 py-0 my-0"
      ></v-text-field>
    </template>
  </v-toolbar>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import { EDIT_PUNT_SEARCH, EDIT_SELECTED_PUNTS, EDIT_MAKEUP_TEMPLATE_SEARCH } from '../store'
import api from '../api'
import { eventNames as appEvents } from '../events'
import { PuntStatus } from '../definitions'
import { permissionsMixin } from '../mixins'
import NewPuntDialog from './NewPuntDialog'
import EditPuntDialog from './EditPuntDialog'
import NewPuntMakeupTemplateDialog from './NewPuntMakeupTemplateDialog'
import DeletePuntDialog from './DeletePuntDialog'

export default {
  name: 'punts-toolbar',
  components: { DeletePuntDialog, NewPuntMakeupTemplateDialog, EditPuntDialog, NewPuntDialog },
  mixins: [permissionsMixin],

  data () {
    return {
      //-------------------------+
      //    Duty Sheet (Tab 0)   |
      //-------------------------+

      search: '',

      // New Punt Dialog
      isPuntButtonBusy: false,

      // Makeup Dialog
      makeupDialogCommonTemplate: null,
      makeupDialogCheckedOff: false,
      isMakeupDialogDisabled: true,
      isMakeupButtonBusy: false,

      // Delete Dialog
      isDeleteButtonBusy: false,

      //-------------------------+
      //    Duties Tab (Tab 1)   |
      //-------------------------+

      search_2: '',

      isNewMakeupTemplateButtonBusy: false
    }
  },

  props: {
    tab: Number
  },

  methods: {

    //----------------------+
    //     Punts  (Tab 0)   |
    //----------------------+

    savePuntDialog (valid, model, callback) {
      if (valid) {
        this.isPuntButtonBusy = true
        api.createNewPuntsBatch(model.assignees, model.reason, (error) => {
          if (error === null) {
            this.$_glob.root.$emit(appEvents.apiSuccess, 'ASSIGN PUNTS success')
          } else {
            this.$_glob.root.$emit(appEvents.apiSuccess, 'ASSIGN PUNTS failed')
          }

          this.isPuntButtonBusy = false
        })
      }

      callback()
    },

    closeMakeupDialog () {
      this.EDIT_SELECTED_PUNTS([])
    },

    saveMakeupDialog (valid, model, callback) {
      if (valid) {
        this.isMakeupButtonBusy = true
        api.updatePuntsWithMakeup(this.selectedPunts, model.makeupTemplate, model.checkedOff, (error) => {
          if (error === null) {
            this.$_glob.root.$emit(appEvents.apiSuccess, 'MAKEUP PUNTS success')
          } else {
            this.$_glob.root.$emit(appEvents.apiFailure, 'MAKEUP PUNTS failed')
          }

          this.isMakeupButtonBusy = false
        })
      }

      callback()
    },

    closeDeleteDialog () {
      this.EDIT_SELECTED_PUNTS([])
    },

    saveDeleteDialog (callback) {
      this.isDeleteButtonBusy = true

      const puntsObjArr = this.selectedPunts.map(punt => {
        return punt.object
      })

      api.deletePuntsBatch(puntsObjArr, (error) => {
        if (error === null) {
          this.$_glob.root.$emit(appEvents.apiSuccess, 'PUNTS DELETE success')
        } else {
          this.$_glob.root.$emit(appEvents.apiFailure, 'PUNTS DELETE failed')
        }

        this.isDeleteButtonBusy = false
      })

      callback()
    },

    // STORE MAPS
    ...mapMutations({
      EDIT_PUNT_SEARCH,
      EDIT_SELECTED_PUNTS
    }),

    //----------------------+
    //    Makeups (Tab 1)   |
    //----------------------+

    saveNewMakeupDialog (valid, model, callback) {
      if (valid) {
        this.isNewMakeupTemplateButtonBusy = true
        api.createNewMakeupTemplate(model.templateName, model.templateDescription, (error) => {
          if (error === null) {
            this.$_glob.root.$emit(appEvents.apiSuccess, 'NEW MAKEUP success')
          } else {
            this.$_glob.root.$emit(appEvents.apiFailure, 'NEW MAKEUP failed')
          }

          this.isNewMakeupTemplateButtonBusy = false
        })
      }

      callback()
    },

    ...mapMutations({
      EDIT_MAKEUP_TEMPLATE_SEARCH
    })
  },

  computed: {

    //-------------------+
    //      All Tabs     |
    //-------------------+

    //-------------------------+
    //    Duty Sheet (Tab 0)   |
    //-------------------------+

    makeupDialogModel () {
      return {
        makeupTemplate: this.makeupDialogCommonTemplate,
        checkedOff: this.makeupDialogCheckedOff
      }
    },

    disableDeleteButton () {
      if (this.isFullPuntsAdmin) {
        return this.selectedPunts.length === 0
      }

      if (this.isAnyPuntsAdmin) {
        for (const selectedPunt of this.selectedPunts) {
          if (selectedPunt.giver.id !== this.currentFirestoreUser.id) {
            return true
          }
        }

        return this.selectedPunts.length === 0
      }

      return true
    },

    ...mapState({
      selectedPunts: state => state.puntsStore.selectedPunts
    }),

    ...mapGetters({
      users: 'customUsers',
      makeupTemplates: 'customPuntMakeupTemplates'
    }),

    ...mapGetters([
      'currentFirestoreUser'
    ])
  },

  watch: {

    //-------------------------+
    //    Duty Sheet (Tab 0)   |
    //-------------------------+

    search (newValue) {
      this.EDIT_PUNT_SEARCH(newValue)
    },

    //-------------------------+
    //    Duties Tab (Tab 1)   |
    //-------------------------+

    search_2 (newValue) {
      this.EDIT_MAKEUP_TEMPLATE_SEARCH(newValue)
    },

    selectedPunts (newValue) {
      if (newValue.length === 0) {
        this.isMakeupDialogDisabled = true
        this.makeupDialogCheckedOff = false
        this.makeupDialogCommonTemplate = null
        return
      }

      var firstPunt = newValue[0]
      var commonStatus = firstPunt.status

      var commonMakeupTemplate
      if (commonStatus === PuntStatus.MakeUpClaimed || commonStatus === PuntStatus.MadeUp) {
        commonMakeupTemplate = firstPunt.makeUp.template
      } else {
        commonMakeupTemplate = null
      }

      for (const selectedPunt of newValue) {
        if (!this.isFullPuntsAdmin) {
          this.isMakeupDialogDisabled = !selectedPunt.isGivenByCurrentUser()
          return
        }

        if (selectedPunt.status !== commonStatus) {
          this.isMakeupDialogDisabled = true
          return
        }

        if (commonStatus === PuntStatus.MakeUpClaimed || commonStatus === PuntStatus.MadeUp) {
          if (commonMakeupTemplate.id !== selectedPunt.makeUp.template.id) {
            this.isMakeupDialogDisabled = true
            return
          }
        }
      }

      this.isMakeupDialogDisabled = false

      if (commonMakeupTemplate) {
        this.makeupDialogCommonTemplate = commonMakeupTemplate
        this.makeupDialogCheckedOff = commonStatus === PuntStatus.MakeUpClaimed
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#admin-bar {

}
</style>
