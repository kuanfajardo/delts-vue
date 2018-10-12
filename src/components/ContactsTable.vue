<template>
  <div class="contacts-table">
    <v-toolbar dark>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">New User</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedUser.name" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedUser.phone" label="Phone"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedUser.email" label="Email"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedUser.fb" label="Facebook"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedUser.snap" label="Snapchat"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedUser.state" label="State"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="headers" :items="users" :search="search" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.phone }}</td>
        <td class="text-xs-center">{{ props.item.email }}</td>
        <td class="text-xs-center">{{ props.item.fb }}</td>
        <td class="text-xs-center">{{ props.item.snap }}</td>
        <td class="text-xs-center">{{ props.item.state }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small class="mr-2" @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>

export default {
  name: 'contacts-table',

  data () {
    return {
      search: '',
      dialog: false,
      headers: [
        { text: 'Name', align: 'left', sortable: false, value: 'name' },
        { text: 'Phone', align: 'left', value: 'phone', sortable: false },
        { text: 'Email', value: 'email' },
        { text: 'Facebook', value: 'fb' },
        { text: 'Snapchat', value: 'snap' },
        { text: 'State', value: 'state' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      users: [],
      editedIndex: -1,
      editedUser: {
        name: '',
        phone: '000-000-0000',
        email: '',
        fb: '',
        snap: '',
        state: ''
      },
      defaultUser: {
        name: '',
        phone: '',
        email: '',
        fb: '',
        snap: '',
        state: ''
      }
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.users = [
        {
          name: 'Juan Fajardo',
          phone: '954-204-6060',
          email: 'jfajardo@mit.edu',
          fb: 'kuanfajardo',
          snap: 'juanfajardo',
          state: 'Florida'
        },
        {
          name: 'Malik Coville',
          phone: '954-204-6060',
          email: 'jfajardo@mit.edu',
          fb: 'kuanfajardo',
          snap: 'juanfajardo',
          state: 'Florida'
        },
        {
          name: 'Tim Plump',
          phone: '954-204-6060',
          email: 'timplump@mit.edu',
          fb: 'kuanfajardo',
          snap: 'timoteomo3',
          state: 'New Jersey'
        }
      ]
    },

    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.users.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedUser)
      } else {
        this.users.push(this.editedUser)
      }
      this.close()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contacts-table {

  }
</style>
