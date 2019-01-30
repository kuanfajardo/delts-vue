<template>
  <div class="contacts-table">
    <v-toolbar class="elevation-1">
      <!-- SEARCH BOX -->
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>

      <v-spacer></v-spacer>

      <template v-if="isContactsAdmin">
        <!-- NEW / EDIT DIALOG -->
        <v-dialog
            v-model="dialog"
            max-width="500px"
        >

          <!-- NEW USER BUTTON -->
          <v-btn
              slot="activator"
              color="primary"
              class="mb-2"
          >
            New User
            <v-icon right>add_circle</v-icon>
          </v-btn>

          <!-- DIALOG CARD (EDIT) -->
          <v-card class="ma-auto">
            <v-card-title>
              <div class="mt-2 ml-2 mb-0">
                <span class="headline pb-2">{{ formTitle }}</span>
                <div class="mt-1">{{ formSubheader }}</div>
              </div>
            </v-card-title>

            <!-- FORM -->
            <v-container grid-list-md class="pb-2 pt-0">
              <v-layout wrap>
                <v-flex v-if="isDialogEdit" xs12 sm6 md4>
                  <v-text-field v-model="editMap[userKeys.firstName]" label="First"></v-text-field>
                </v-flex>
                <v-flex v-if="isDialogEdit" xs12 sm6 md4>
                  <v-text-field v-model="editMap[userKeys.lastName]" label="Last"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 :md4="isDialogEdit" :md12="!isDialogEdit">
                  <v-text-field v-model="editMap[userKeys.email]" label="Email"></v-text-field>
                </v-flex>
                <template v-if="isDialogEdit">
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editMap[userKeys.phoneNumber]" label="Phone" mask="phone"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select :items="courses" v-model="editMap[userKeys.courseNumber]" label="Course"></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select :items="years" v-model="editMap[userKeys.classYear]" label="Class Year"></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editMap[userKeys.givenName]" label="Given Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editMap[userKeys.snapchatHandle]" label="Snapchat"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                   <v-select :items="states" v-model="editMap[userKeys.homeState]" label="State"></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="editMap[userKeys.facebookURL]" label="Facebook"></v-text-field>
                </v-flex>
                </template>
              </v-layout>
            </v-container>

            <v-divider></v-divider>

            <!-- DIALOG ACTIONS -->
            <v-card-actions color="white">
              <v-spacer></v-spacer>
              <!-- CANCEL BUTTON -->
              <v-btn flat color="error" @click.native="close">Cancel</v-btn>
              <!-- SAVE/INVITE BUTTON -->
              <v-btn flat color="primary" :disabled="!editMap[userKeys.email]" @click.native="save">{{ isDialogEdit ? 'Save' : 'Invite'}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- EDIT USER BUTTON -->
        <v-btn
          :disabled="selected.length !== 1"
          color="secondary"
          class="mb-2"
          @click.stop="editSelectedItem"
        >
          Edit User
          <v-icon right>edit</v-icon>
        </v-btn>

        <!-- DELETE DIALOG -->
        <v-btn
          v-if="selected.length === 0"
          color="error"
          disabled
          class="mb-2"
        >
          {{ deleteButtonTitle }}
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
          class="mb-2"
        >
          {{ deleteButtonTitle }}
          <v-icon right>delete</v-icon>
        </v-btn>

        <!-- DIALOG CARD -->
        <v-card class="ma-auto">
          <v-card-title>
            <div class="mt-2 ml-2 mb-0">
              <span class="headline pb-2">Delete account</span>
            </div>
          </v-card-title>
           <v-alert
            type="error"
            color="accent"
            class="mx-4"
            :value="true"
          >
            After you delete an account, it's permanently deleted. Accounts can't be undeleted.
          </v-alert>

          <v-card-text>
            {{ 'Are you sure you want to delete ' + selected.length + ' users? \n' +
            selected.map(user => { return user[userKeys.firstName] + ' ' + user[userKeys.lastName]}).join(', ') }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- CANCEL BUTTON -->
            <v-btn color="primary" @click.stop="deleteDialog = false">Cancel</v-btn>
            <!-- DELETE BUTTON -->
            <v-btn color="accent" flat @click.stop="deleteSelectedItems">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </template>
    </v-toolbar>

    <!-- DATA TABLE -->
    <v-data-table
        v-model="selected"
        :headers="headers"
        :items="users"
        :search="search"
        class="elevation-1"
        :select-all="isContactsAdmin">

      <template slot="items" slot-scope="props">

        <!-- SELECTION CHECKBOXES -->
        <td v-if="isContactsAdmin">
          <v-checkbox
            v-model="props.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>

        <!-- FIRST NAME -->
        <contacts-table-row
            :edit-item="props.item"
            edit-field="firstName"
            title="First Name"
            :save="inlineSave"
            :editable="isContactsAdmin">
        </contacts-table-row>

        <!-- LAST NAME -->
        <contacts-table-row
            :edit-item="props.item"
            edit-field="lastName"
            title="Last Name"
            :save="inlineSave"
            :editable="isContactsAdmin">
        </contacts-table-row>

        <!-- PHONE -->
        <contacts-table-row
            :edit-item="props.item"
            edit-field="phoneNumber"
            mask="phone"
            title="Phone"
            :save="inlineSave"
            :editable="isContactsAdmin">
        </contacts-table-row>

        <!-- EMAIL -->
        <contacts-table-row
            :edit-item="props.item"
            edit-field="email"
            title="Email"
            :save="inlineSave"
            :editable="isContactsAdmin">
        </contacts-table-row>

        <!-- COURSE NUMBER -->
        <contacts-table-row
            :edit-item="props.item"
            edit-field="courseNumber"
            title="Course"
            dialog-type="select"
            :items="courses"
            :save="inlineSave"
            :editable="isContactsAdmin">
        </contacts-table-row>

        <!-- CLASS YEAR -->
        <contacts-table-row
            :edit-item="props.item"
            edit-field="classYear"
            title="Class Year"
            dialog-type="select"
            :items="years"
            :save="inlineSave"
            :editable="isContactsAdmin">
        </contacts-table-row>

        <!-- FACEBOOK LINK -->
        <td class="text-xs-center">
          <a :href="props.item.facebookURL">
            {{ typeof props.item.facebookURL !== 'undefined' ? 'Link' : '' }}
          </a>
        </td>

        <!-- SNAPCHAT HANDLE -->
        <contacts-table-row
            :edit-item="props.item"
            edit-field="snapchatHandle"
            title="Snapchat"
            :save="inlineSave"
            :editable="isContactsAdmin">
        </contacts-table-row>

        <!-- HOMETOWN STATE -->
        <contacts-table-row
            :edit-item="props.item"
            edit-field="homeState"
            title="Home State"
            dialog-type="select"
            :items="states"
            :save="inlineSave"
            :editable="isContactsAdmin">
        </contacts-table-row>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api, { userKeys } from '../api'
import { eventNames as appEvents } from '../events'
import { stateAbbreviations, getClassYears, courseNumbers } from '../definitions'
import ContactsTableRow from './ContactsTableRow'

export default {
  name: 'contacts-table',
  components: { ContactsTableRow },
  data () {
    return {
      search: '',
      dialog: false, // Edit / new dialog
      deleteDialog: false, // Delete dialog
      selected: [],
      headers: [
        { text: 'First', align: 'left', value: 'firstName' },
        { text: 'Last', align: 'left', value: 'lastName' },
        { text: 'Phone', align: 'left', value: 'phoneNumber', sortable: false },
        { text: 'Email', value: 'email' },
        { text: 'Course', value: 'courseNumber' },
        { text: 'Year', value: 'classYear' },
        { text: 'Facebook', value: 'facebookURL' },
        { text: 'Snapchat', value: 'snapchatHandle' },
        { text: 'State', value: 'homeState' }
      ],
      isDialogEdit: false,
      editMap: {},
      states: stateAbbreviations,
      years: getClassYears(),
      courses: courseNumbers.concat('Undecided')
    }
  },

  computed: {
    formTitle () {
      return this.isDialogEdit ? 'Edit User' : 'Invite New User'
    },

    formSubheader () {
      return this.isDialogEdit ? ''
        : 'The new user will receive an email asking them to sign up and fill in the rest of their details. ' +
        '(P.S. I don\'t have validation on the text field so PLEASE ENTER A REAL EMAIL.)'
    },

    deleteButtonTitle () {
      return this.selected.length > 1 ? 'Delete Users' : 'Delete User'
    },

    userKeys () {
      return userKeys
    },

    isContactsAdmin () {
      return true
    },

    ...mapGetters({
      users: 'customUsers'
    })
  },

  methods: {
    // TOOLBAR ACTIONS
    editSelectedItem () {
      if (this.selected.length !== 1) return

      this.isDialogEdit = true
      this.dialog = true

      // We use a separate edit map in order to avoid changing the user obj. As long as all the properties on
      // userToEdit are primitive, this is a deep copy.
      const userToEdit = this.selected[0]
      this.editMap = Object.assign({}, userToEdit.object)
    },

    // DELETE DIALOG ACTIONS
    deleteSelectedItems () {
      this.deleteDialog = false
      for (const user of this.selected) {
        this.deleteUser(user)
      }
    },

    deleteUser (user) {
      api.deleteUser(user, (error) => {
        if (error === null) {
          this.$_glob.root.$emit(appEvents.apiSuccess, 'USER DELETE success')
        } else {
          this.$_glob.root.$emit(appEvents.apiFailure, 'USER DELETE failed')
        }
      })
    },

    // EDIT/NEW DIALOG ACTIONS
    save () {
      if (this.isDialogEdit) { // Update
        const editedUser = this.selected[0]
        api.updateUserWithData(editedUser, this.editMap, (error) => {
          if (error === null) {
            this.$_glob.root.$emit(appEvents.apiSuccess, 'USER UPDATE success')
          } else {
            this.$_glob.root.$emit(appEvents.apiFailure, 'USER UPDATE failed')
          }
        })
      } else { // New
        if (this.editMap[userKeys.email]) {
          api.createNewUser(this.editMap[userKeys.email], (error) => {
            if (error === null) {
              this.$_glob.root.$emit(appEvents.apiSuccess, 'USER CREATE success')
            } else {
              console.log(error)
              this.$_glob.root.$emit(appEvents.apiFailure, 'USER CREATE failed')
            }
          })
        }
      }

      this.close()
    },

    close () {
      this.dialog = false
      this.selected = []
      setTimeout(() => {
        this.isDialogEdit = false
        this.editMap = {}
      }, 300)
    },

    // INLINE ACTIONS
    inlineSave (user) {
      api.updateUserWithData(user, user.object, (error) => {
        if (error === null) {
          console.log('User ' + user.id + ' updated successfully')
          this.$_glob.root.$emit(appEvents.apiSuccess, 'USER UPDATE success')
        } else {
          console.log('User ' + user.id + ' updated successfully')
          this.$_glob.root.$emit(appEvents.apiFailure, 'USER UPDATE failed')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contacts-table {

  }
</style>
