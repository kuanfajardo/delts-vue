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
    >

      <template slot="items" slot-scope="props">
        <!-- DATE -->
        <td>{{ props.item[PropKeys.date] }}</td>

        <!-- NAME -->
        <td>{{ props.item[PropKeys.name] }}</td>

        <!-- DESCRIPTION -->
        <td>{{ props.item[PropKeys.description] }}</td>

        <!-- ACTIONS -->
        <td class="justify-center layout px-0">
          <v-btn
            v-if="isFocused(props.item)"
            dark
            class="elevation-0"
            color="secondary"
            @click.stop="seeMakeups(null)"
          >
            <v-icon>arrow_forward</v-icon>
          </v-btn>
          <v-btn
            v-else
            outline
            dark
            color="secondary"
            @click.stop="seeMakeups(props.item)"
          >
            <v-icon dark>arrow_forward</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { puntMakeupTemplateKeys } from '../api'
import { puntsMixin } from '../mixins'
import { EDIT_SELECTED_MAKEUP_TEMPLATE } from '../store'

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
        { text: 'Description', align: 'left', value: 'description' },
        { text: 'See Makeups', sortable: false, value: false }
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
      makeupTemplates: state => state.puntsStore.makeupTemplates,
      focusedTemplate: state => state.puntsStore.focusedMakeupTemplate
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
    },

    seeMakeups (item) {
      this.EDIT_SELECTED_MAKEUP_TEMPLATE(item)
    },

    isFocused (item) {
      if (!this.focusedTemplate) return false
      return item[this.PropKeys.id] === this.focusedTemplate.id
    },

    ...mapMutations({
      EDIT_SELECTED_MAKEUP_TEMPLATE
    })
  }
}
</script>
