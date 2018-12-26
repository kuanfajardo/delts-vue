<template>
  <div class="contacts-table">
    <v-toolbar class="elevation-1">
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog
          v-model="dialog"
          max-width="500px"
      >
        <v-btn
            slot="activator"
            color="primary"
            class="mb-2"
        >
          New User
        </v-btn>
        <v-btn
            v-if="selected.length === 1"
            slot="activator"
            color="primary"
            class="mb-2"
            @click.stop="editSelectedItem"
        >
          Edit User
        </v-btn>
        <v-card class="ma-auto">
          <v-card-title>
            <div class="mt-2 ml-2 mb-0">
              <span class="headline pb-2">{{ formTitle }}</span>
              <div class="mt-1">{{ formSubheader }}</div>
            </div>
          </v-card-title>

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
                <v-text-field v-model="editMap[userKeys.phone]" label="Phone" mask="phone"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-select :items="courses" v-model="editMap[userKeys.course]" label="Course"></v-select>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-select :items="years" v-model="editMap[userKeys.year]" label="Class Year"></v-select>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editMap[userKeys.givenName]" label="Given Name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editMap[userKeys.snapchat]" label="Snapchat"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                 <v-select :items="states" v-model="editMap[userKeys.state]" label="State"></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editMap[userKeys.facebook]" label="Facebook"></v-text-field>
              </v-flex>
              </template>
            </v-layout>
          </v-container>

          <v-divider></v-divider>

          <v-card-actions color="white">
            <v-spacer></v-spacer>
            <v-btn flat color="error" @click.native="close">Cancel</v-btn>
            <v-btn flat color="primary" @click.native="save">{{ isDialogEdit ? 'Save' : 'Invite'}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
          v-if="selected.length > 0"
          color="error"
          @click.stop="deleteSelectedItems"
      >
        {{ deleteButtonTitle }}
      </v-btn>
    </v-toolbar>

    <v-data-table v-model="selected" :headers="headers" :items="users" :search="search" class="elevation-1" select-all>
      <template slot="items" slot-scope="props">
        <td>
          <v-checkbox
            v-model="props.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td>
          <v-edit-dialog
              :return-value.sync="props.item[userKeys.firstName]"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item[userKeys.firstName] }}
              <div slot="input" class="mt-3 title">Update First Name</div>
              <v-text-field
                slot="input"
                v-model="props.item[userKeys.firstName]"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
              :return-value.sync="props.item[userKeys.lastName]"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item[userKeys.lastName] }}
              <div slot="input" class="mt-3 title">Update First Last</div>
              <v-text-field
                slot="input"
                v-model="props.item[userKeys.lastName]"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">
          <v-edit-dialog
              :return-value.sync="props.item[userKeys.phone]"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item[userKeys.phone] }}
              <div slot="input" class="mt-3 title">Update Phone</div>
              <v-text-field
                slot="input"
                mask="phone"
                v-model="props.item[userKeys.phone]"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-center">
           <v-edit-dialog
              :return-value.sync="props.item[userKeys.email]"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item[userKeys.email] }}
              <div slot="input" class="mt-3 title">Update Email</div>
              <v-text-field
                slot="input"
                v-model="props.item[userKeys.email]"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
         <td class="text-xs-center">
           <v-edit-dialog
              :return-value.sync="props.item[userKeys.course]"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item[userKeys.course] }}
              <div slot="input" class="mt-3 title">Update Course</div>
              <v-select
                :items="courses"
                slot="input"
                v-model="props.item[userKeys.course]"
                label="Course"
                autofocus
             ></v-select>
          </v-edit-dialog>
        </td>
         <td class="text-xs-center">
           <v-edit-dialog
              :return-value.sync="props.item[userKeys.year]"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item[userKeys.year] }}
              <div slot="input" class="mt-3 title">Update Year</div>
             <v-select
              :items="years"
              slot="input"
              v-model="props.item[userKeys.year]"
              label="Class Year"
              autofocus
            ></v-select>
          </v-edit-dialog>
        </td>
        <td class="text-xs-center">
          <a :href="props.item[userKeys.facebook]">
            {{ typeof props.item[userKeys.facebook] !== 'undefined' ? 'Link' : '' }}
          </a>
        </td>
        <td class="text-xs-center">
           <v-edit-dialog
              :return-value.sync="props.item[userKeys.snapchat]"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item[userKeys.snapchat] }}
              <div slot="input" class="mt-3 title">Update Snapchat</div>
              <v-text-field
                slot="input"
                v-model="props.item[userKeys.snapchat]"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-center">
           <v-edit-dialog
              :return-value.sync="props.item[userKeys.state]"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item[userKeys.state] }}
              <div slot="input" class="mt-3 title">Update State</div>
              <v-select
                :items="states"
                slot="input"
                v-model="props.item[userKeys.state]"
                label="State"
                autofocus
              ></v-select>
          </v-edit-dialog>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api, { userKeys } from '../api'
import { eventNames as appEvents } from '../events'
import { stateAbbreviations, classYears, courseNumbers } from '../definitions'

export default {
  name: 'contacts-table',

  data () {
    return {
      search: '',
      dialog: false,
      selected: [],
      headers: [
        { text: 'First', align: 'left', value: userKeys.firstName },
        { text: 'Last', align: 'left', value: userKeys.lastName },
        { text: 'Phone', align: 'left', value: userKeys.phone, sortable: false },
        { text: 'Email', value: userKeys.email },
        { text: 'Course', value: userKeys.course },
        { text: 'Year', value: userKeys.year },
        { text: 'Facebook', value: userKeys.facebook },
        { text: 'Snapchat', value: userKeys.snapchat },
        { text: 'State', value: userKeys.state }
      ],
      isDialogEdit: false,
      editMap: {},
      states: stateAbbreviations,
      years: classYears(),
      courses: courseNumbers.concat('Undecided')
    }
  },

  computed: {
    formTitle () {
      return this.isDialogEdit ? 'Edit User' : 'Invite New User'
    },

    formSubheader () {
      return this.isDialogEdit ? '' :
        'The new user will receive an email asking them to sign up and fill in the rest of their details.'
    },

    deleteButtonTitle () {
      return this.selected.length > 1 ? 'Delete Users' : 'Delete User'
    },

    userKeys () {
      return userKeys
    },

    ...mapState([
      'users'
    ])
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
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
      this.editMap = Object.assign({}, userToEdit)
    },

    deleteItem (item) {
      const index = this.users.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1)
    },

    deleteSelectedItems () {
      confirm('Are you sure you want to delete ' + this.selected.length + ' items?')
    },

    // DIALOG ACTIONS

    close () {
      this.dialog = false
      this.selected = []
      setTimeout(() => {
        this.isDialogEdit = false
        this.editMap = {}
      }, 300)
    },

    save () {
      if (this.isDialogEdit) { // Update
        const editedUserObj = this.selected[0]
        api.updateUser(editedUserObj, this.editMap, (error) => {
          if (error === null) {
            this.$_glob.root.$emit(appEvents.apiSuccess, 'USER UPDATE success')
          } else {
            this.$_glob.root.$emit(appEvents.apiFailure, 'USER UPDATE failed')
          }
        })
      } else { // New
        api.createNewUser(this.editMap[userKeys.email], (error) => {
          if (error === null) {
            this.$_glob.root.$emit(appEvents.apiSuccess, 'USER CREATE success')
          } else {
            console.log(error)
            this.$_glob.root.$emit(appEvents.apiFailure, 'USER CREATE failed')
          }
        })
      }

      this.close()
    },

    // INLINE ACTIONS
    inlineSave (userObj) {
      api.updateUser(userObj, userObj, (error) => {
        if (error === null) {
          console.log('User ' + userObj.id + ' updated successfully')
          this.$_glob.root.$emit(appEvents.apiSuccess, 'USER UPDATE success')
        } else {
          console.log('User ' + userObj.id + ' updated successfully')
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
