<template>
  <v-toolbar
      id="punts-toolbar"
      class="mb-3 mt-2"
      style="opacity: 1; width: 900px;"
  >
    <template v-if="tab === 0">
      <template v-if="isAnyPuntsAdmin">
        <!-- PUNT DIALOG -->
        <new-punt-dialog :on-save="savePuntDialog">
          <v-btn
            dark
            color="primary"
          >
            New Punt
            <v-icon right>add_circle</v-icon>
          </v-btn>
        </new-punt-dialog>

        <!--<v-dialog-->
            <!--v-model="puntDialog"-->
            <!--max-width="500px"-->
        <!--&gt;-->

          <!--&lt;!&ndash; PUNT BUTTON &ndash;&gt;-->
          <!--<v-btn-->
              <!--dark-->
              <!--color="primary"-->
              <!--slot="activator"-->
              <!--:loading="isPuntButtonBusy">-->
            <!--New Punt-->
            <!--<v-icon right>add_circle</v-icon>-->
          <!--</v-btn>-->

          <!--&lt;!&ndash; DIALOG CARD &ndash;&gt;-->
          <!--<v-card class="ma-auto">-->
            <!--<v-card-title>-->
              <!--<div class="mt-2 ml-2 mb-0">-->
                <!--<span class="headline pb-2">New Punt</span>-->
                <!--<div class="mt-1">The puntee(s) will be notified as soon as you submit.</div>-->
              <!--</div>-->
            <!--</v-card-title>-->

            <!--&lt;!&ndash; FORM &ndash;&gt;-->
            <!--<v-container grid-list-md class="pb-2 pt-0">-->
              <!--<v-layout wrap>-->
                <!--<v-flex xs12>-->
                  <!--<v-select-->
                    <!--:items="users"-->
                    <!--v-model="assignees"-->
                    <!--label="Brother(s)"-->
                    <!--multiple-->
                    <!--chips-->
                    <!--clearable-->
                    <!--deletable-chips-->
                    <!--solo-->
                    <!--hint="Select brother(s) to assign punt to."-->
                    <!--persistent-hint-->
                    <!--return-object-->
                  <!--&gt;-->
                  <!--</v-select>-->
                <!--</v-flex>-->
                <!--<v-flex xs12>-->
                  <!--<v-text-field v-model="reason" label="Reason"></v-text-field>-->
                <!--</v-flex>-->
              <!--</v-layout>-->
            <!--</v-container>-->

            <!--<v-divider></v-divider>-->

            <!--&lt;!&ndash; DIALOG ACTIONS &ndash;&gt;-->
            <!--<v-card-actions color="white">-->
              <!--<v-spacer></v-spacer>-->
              <!--&lt;!&ndash; CANCEL BUTTON &ndash;&gt;-->
              <!--<v-btn flat color="error" @click.native="closePuntDialog">Cancel</v-btn>-->
              <!--&lt;!&ndash; PUNT BUTTON &ndash;&gt;-->
              <!--<v-btn flat color="primary" :disabled="!assignees || !reason" @click.native="savePuntDialog">Punt</v-btn>-->
            <!--</v-card-actions>-->
          <!--</v-card>-->
        <!--</v-dialog>-->

        <!-- MAKEUP DIALOG -->
        <v-btn
            v-if="disableMakeupButton"
            light
            disabled
            color="secondary"
            :loading="isMakeupButtonBusy">
        Makeup
          <v-icon dark right>edit</v-icon>
        </v-btn>

        <v-dialog
            v-else
            v-model="makeupDialog"
            max-width="500px"
        >

          <!-- MAKEUP BUTTON -->
          <v-btn
              dark
              color="secondary"
              slot="activator"
              :loading="isMakeupButtonBusy">
          Makeup
            <v-icon dark right>edit</v-icon>
          </v-btn>

          <!-- DIALOG CARD -->
          <v-card class="ma-auto">
            <v-card-title>
              <div class="mt-2 ml-2 mb-0">
                <span class="headline pb-2">{{ 'Assign Makeup to ' + selectedPunts.length + ' Punt' + (selectedPunts.length > 1 ? 's' : '') }}</span>
              </div>
            </v-card-title>

            <!-- FORM -->
            <v-container grid-list-md class="pb-2 pt-0">
              <v-layout wrap>
                <v-flex xs12>
                  <v-select
                    :items="makeupTemplates"
                    v-model="makeupDialogMakeup"
                    label="Makeup"
                    solo
                    hint="Select makeup to assign to punt."
                    persistent-hint
                    return-object
                  >
                  </v-select>
                </v-flex>
                <v-flex xs12>
                  <v-checkbox
                    v-model="makeupDialogCheck"
                    color="primary"
                    hide-details
                    label="Mark makeup as complete"
                  ></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>

            <v-divider></v-divider>

            <!-- DIALOG ACTIONS -->
            <v-card-actions color="white">
              <v-spacer></v-spacer>
              <!-- CANCEL BUTTON -->
              <v-btn flat color="error" @click.native="closeMakeupDialog">Cancel</v-btn>
              <!-- PUNT BUTTON -->
              <v-btn flat color="primary" :disabled="!makeupDialogMakeup" @click.native="saveMakeupDialog">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- DELETE DIALOG -->
        <v-btn
          v-if="disableDeleteButton"
          color="error"
          disabled
          :loading="isDeleteButtonBusy"
        >
          Delete
          <v-icon right>delete</v-icon>
        </v-btn>

        <v-dialog
          v-else
          v-model="deleteDialog"
          persistent
          max-width="450">

          <!-- DELETE BUTTON-->
          <v-btn
            color="error"
            slot="activator"
            :loading="isDeleteButtonBusy"
          >
            Delete
            <v-icon right>delete</v-icon>
          </v-btn>

          <!-- DIALOG CARD -->
          <v-card class="ma-auto">
            <v-card-title>
              <div class="mt-2 ml-2 mb-0">
                <span class="headline pb-2">{{ 'Delete ' + selectedPunts.length + ' Punt' + (selectedPunts.length > 1 ? 's' : '') }}</span>
              </div>
            </v-card-title>
             <v-alert
              type="error"
              color="accent"
              class="mx-4"
              :value="true"
            >
              After you delete a punt, it's permanently deleted. Punts can't be undeleted.
            </v-alert>

            <v-card-text>
              {{ 'Are you sure you want to delete ' + selectedPunts.length + ' punts?' }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- CANCEL BUTTON -->
              <v-btn color="primary" @click.stop="closeDeleteDialog">Cancel</v-btn>
              <!-- DELETE BUTTON -->
              <v-btn color="accent" flat @click.stop="saveDeleteDialog">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
      <v-dialog
          v-model="newMakeupDialog"
          max-width="500px"
        >

          <!-- NEW MAKEUP BUTTON -->
          <v-btn
            dark
            color="primary"
            slot="activator"
            :loading="isNewMakeupButtonBusy">
            New Template
            <v-icon right>add_circle</v-icon>
          </v-btn>

          <!-- DIALOG CARD -->
          <v-card class="ma-auto">
            <v-card-title>
              <div class="mt-2 ml-2 mb-0">
                <span class="headline pb-2">New Makeup Template</span>
                <div class="mt-1">This will serve as a general template for a set of punt makeups.</div>
              </div>
            </v-card-title>

            <!-- FORM -->
            <v-container grid-list-md class="pb-2 pt-0">
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="templateName" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="templateDescription" label="Description"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>

            <v-divider></v-divider>

            <!-- DIALOG ACTIONS -->
            <v-card-actions color="white">
              <v-spacer></v-spacer>
              <!-- CANCEL BUTTON -->
              <v-btn flat color="error" @click.native="closeNewMakeupDialog">Cancel</v-btn>
              <!-- SAVE BUTTON -->
              <v-btn flat color="primary" :disabled="!templateName || !templateDescription" @click.native="saveNewMakeupDialog">Save</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>

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

export default {
  name: 'punts-toolbar',
  components: { NewPuntDialog },
  mixins: [permissionsMixin],

  data () {
    return {
      //-------------------------+
      //    Duty Sheet (Tab 0)   |
      //-------------------------+
      search: '',

      puntDialog: false,
      makeupDialog: false,
      deleteDialog: false,

      // TODO: Make dialog into form so no need for this
      assignees: null,
      reason: '',

      isPuntButtonBusy: false,
      isMakeupButtonBusy: false,
      isDeleteButtonBusy: false,

      makeupDialogCheck: false,
      makeupDialogMakeup: null,

      //-------------------------+
      //    Duties Tab (Tab 1)   |
      //-------------------------+

      search_2: '',
      newMakeupDialog: false,
      isNewMakeupButtonBusy: false,
      templateName: '',
      templateDescription: ''
    }
  },

  props: {
    tab: Number
  },

  methods: {

    //----------------------+
    //     Punts  (Tab 0)   |
    //----------------------+

    savePuntDialog (valid, puntModel, callback) {
      // this.isPuntButtonBusy = true
      if (valid) {
        api.createNewPuntsBatch(puntModel.assignees, puntModel.reason, (error) => {
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
      this.makeupDialog = false
      this.makeupDialogCheck = false
      this.makeupDialogMakeup = null
      this.EDIT_SELECTED_PUNTS([])
    },

    saveMakeupDialog () {
      this.isMakeupButtonBusy = true

      api.updatePuntsWithMakeup(this.selectedPunts, this.makeupDialogMakeup, this.makeupDialogCheck, (error) => {
        if (error === null) {
          this.$_glob.root.$emit(appEvents.apiSuccess, 'MAKEUP PUNTS success')
        } else {
          this.$_glob.root.$emit(appEvents.apiFailure, 'MAKEUP PUNTS failed')
        }

        this.isMakeupButtonBusy = false
      })

      this.closeMakeupDialog()
    },

    closeDeleteDialog () {
      this.deleteDialog = false
      this.EDIT_SELECTED_PUNTS([])
    },

    saveDeleteDialog () {
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

      this.closeDeleteDialog()
    },

    // STORE MAPS
    ...mapMutations({
      EDIT_PUNT_SEARCH,
      EDIT_SELECTED_PUNTS
    }),

    //----------------------+
    //    Makeups (Tab 1)   |
    //----------------------+

    closeNewMakeupDialog () {
      this.newMakeupDialog = false
      this.templateDescription = ''
      this.templateName = ''
    },

    saveNewMakeupDialog () {
      this.isNewMakeupButtonBusy = true

      api.createNewMakeupTemplate(this.templateName, this.templateDescription, (error) => {
        if (error === null) {
          this.$_glob.root.$emit(appEvents.apiSuccess, 'NEW MAKEUP success')
        } else {
          this.$_glob.root.$emit(appEvents.apiFailure, 'NEW MAKEUP failed')
        }

        this.isNewMakeupButtonBusy = false
      })

      this.closeNewMakeupDialog()
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

    disableMakeupButton () {
      if (this.selectedPunts.length === 0) return true

      // Rules:
      //    1) If any selected are MADE UP => Disable
      //    2) If selected includes both PUNTED and MAKE UP CLAIMED => Disable
      //    3) If selected includes all MAKE UP CLAIMED,
      //         and all selected don't share the same make up template => Disable
      //    4) Everything else, Enable

      var firstPunt = this.selectedPunts[0]
      var commonStatus = firstPunt.status

      var commonMakeupTemplate
      if (commonStatus === PuntStatus.MakeUpClaimed || commonStatus === PuntStatus.MadeUp) {
        commonMakeupTemplate = firstPunt.makeUp.template
      } else {
        commonMakeupTemplate = null
      }

      for (const selectedPunt of this.selectedPunts) {
        if (!this.isFullPuntsAdmin) {
          return !selectedPunt.isGivenByCurrentUser()
        }

        if (selectedPunt.status !== commonStatus) {
          return true
        }

        if (commonStatus === PuntStatus.MakeUpClaimed || commonStatus === PuntStatus.MadeUp) {
          if (commonMakeupTemplate.id !== selectedPunt.makeUp.template.id) {
            return true
          }
        }
      }

      if (commonMakeupTemplate) {
        this.makeupDialogMakeup = commonMakeupTemplate
        this.makeupDialogCheck = commonStatus === PuntStatus.MakeUpClaimed
      }

      return false
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

    disableMakeupButton (newValue) {
      // To make sure props are reset after selecting and then deselecting rows
      if (newValue === true) {
        this.makeupDialogMakeup = null
        this.makeupDialogCheck = false
      }
    },

    //-------------------------+
    //    Duties Tab (Tab 1)   |
    //-------------------------+

    search_2 (newValue) {
      this.EDIT_MAKEUP_TEMPLATE_SEARCH(newValue)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#admin-bar {

}
</style>
