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
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editMap[userKeys.firstName]" label="First"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editMap[userKeys.phone]" label="Phone" mask="phone"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editMap[userKeys.email]" label="Email"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editMap[userKeys.facebook]" label="Facebook"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editMap[userKeys.snapchat]" label="Snapchat"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editMap[userKeys.state]" label="State"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>

          <v-divider></v-divider>

          <v-card-actions color="white">
            <v-spacer></v-spacer>
            <v-btn flat color="error" @click.native="close">Cancel</v-btn>
            <v-btn flat color="primary" @click.native="save">Save</v-btn>
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
              :return-value.sync="props.item.first"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item.first }}
              <div slot="input" class="mt-3 title">Update First Name</div>
              <v-text-field
                slot="input"
                v-model="props.item.first"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
              :return-value.sync="props.item.last"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item.last }}
              <div slot="input" class="mt-3 title">Update First Last</div>
              <v-text-field
                slot="input"
                v-model="props.item.last"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">
          <v-edit-dialog
              :return-value.sync="props.item.phone"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item.phone }}
              <div slot="input" class="mt-3 title">Update Phone</div>
              <v-text-field
                slot="input"
                mask="phone"
                v-model="props.item.phone"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-center">
           <v-edit-dialog
              :return-value.sync="props.item.email"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item.email }}
              <div slot="input" class="mt-3 title">Update Email</div>
              <v-text-field
                slot="input"
                v-model="props.item.email"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-center">
          <a :href="props.item.facebook">
            {{ typeof props.item.facebook !== 'undefined' ? 'Link' : '' }}
          </a>
        </td>
        <td class="text-xs-center">
           <v-edit-dialog
              :return-value.sync="props.item.snapchat"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item.snapchat }}
              <div slot="input" class="mt-3 title">Update Snapchat</div>
              <v-text-field
                slot="input"
                v-model="props.item.snapchat"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-center">
           <v-edit-dialog
              :return-value.sync="props.item.state"
              large
              lazy
              @save="inlineSave(props.item)"
            >
              {{ props.item.state }}
              <div slot="input" class="mt-3 title">Update State</div>
              <v-text-field
                slot="input"
                v-model="props.item.state"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
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

export default {
  name: 'contacts-table',

  data () {
    return {
      search: '',
      dialog: false,
      selected: [],
      headers: [
        { text: 'First', align: 'left', sortable: true, value: userKeys.firstName },
        { text: 'Last', align: 'left', sortable: true, value: userKeys.lastName },
        { text: 'Phone', align: 'left', value: userKeys.phone, sortable: false },
        { text: 'Email', value: userKeys.email },
        { text: 'Facebook', value: userKeys.facebook },
        { text: 'Snapchat', value: userKeys.snapchat },
        { text: 'State', value: userKeys.state },
      ],
      isDialogEdit: false,
      editMap: {},
    }
  },

  computed: {
    formTitle () {
      return this.isDialogEdit ? 'Edit User' : 'New User'
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
      this.isDialogEdit = false

      setTimeout(() => {
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
