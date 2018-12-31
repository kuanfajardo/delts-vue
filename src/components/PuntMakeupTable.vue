<template>
  <div class="punts-table px-3">
    <!-- DATA TABLE -->
    <v-data-table
        v-model="selected"
        :headers="headers"
        :items="templates"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
        :item-key="PropKeys.id"
        select-all
    >

      <template slot="items" slot-scope="props">

        <td>
          <v-checkbox
            v-model="props.selected"
            color="primary"
            hide-details
          ></v-checkbox>
        </td>

        <!-- DATE -->
        <td>{{ props.item[PropKeys.date] }}</td>

        <!-- NAME -->
        <td>{{ props.item[PropKeys.name] }}</td>

        <!-- DESCRIPTION -->
        <td>{{ props.item[PropKeys.description] }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { puntMakeupTemplateKeys } from '../api'
import { puntsMixin } from '../mixins'

export default {
  name: 'punts-table',

  mixins: [puntsMixin],

  data () {
    return {
      // TODO: Move outside, so can use in headers
      PropKeys: Object.freeze({
        date: 'date',
        name: 'name',
        description: 'description',
        id: 'id',
        object: 'object'
      }),

      headers: [ // LOL can't use PropKeys
        { text: 'Date', align: 'left', value: 'date' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Description', align: 'left', value: 'description' }
      ],

      pagination: {
        rowsPerPage: 25
      },

      rowsPerPageItems: [
        25, 50, { text: 'All', value: -1 }
      ],

      selected: []
    }
  },

  computed: {
    templates () {
      return this.makeupTemplates.map((template) => {
        return { // TODO: make constructor in object i.e. 'PuntsTableObj(punt)'
          [this.PropKeys.id]: template.id, // Needed for sorting
          [this.PropKeys.object]: template, // Needed for later (when in 'selected')
          [this.PropKeys.date]: this.dateForItem(template),
          [this.PropKeys.name]: this.nameForItem(template),
          [this.PropKeys.description]: this.descriptionForItem(template)
        }
      })
    },

    ...mapState({
      makeupTemplates: state => state.puntsStore.makeupTemplates
    })
  },

  methods: {
    dateForItem (item) {
      // TODO: Make a helper function
      const itemDate = new Date(item[puntMakeupTemplateKeys.date].seconds * 1000)

      const date = itemDate.getDate()
      const month = itemDate.getMonth() + 1 // Months are zero based
      const year = itemDate.getFullYear()
      const twoDigitYear = year.toString().slice(2)

      return month + '/' + date + '/' + twoDigitYear
    },

    nameForItem (item) {
      return item[puntMakeupTemplateKeys.name]
    },

    descriptionForItem (item) {
      return item[puntMakeupTemplateKeys.description]
    }
  }
}
</script>
