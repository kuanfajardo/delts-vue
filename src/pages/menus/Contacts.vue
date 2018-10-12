<template>
  <div class="contacts-page">
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12>
          <v-layout row>
            <v-flex xs11>
              <div class="page-header-left">
                <h1 class="pr-3">Contacts</h1>
              </div>
            </v-flex>
            <v-flex xs1>
              <div class="page-header-right">
                <v-btn icon>
                  <v-icon class="text--secondary">refresh</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <contacts-table></contacts-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import ContactsTable from '../../components/ContactsTable'

export default {
  name: 'contacts-page',
  components: { ContactsTable, PageHeader },
  data () {
    return {
      msg: 'msg'
    }
  },

  props: {
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contacts-page {

  }
</style>
