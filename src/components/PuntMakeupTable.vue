<template>
  <div class="punts-table px-3">
    <v-toolbar dense class="elevation-2">
      <v-toolbar-title>
        Makeup Templates
      </v-toolbar-title>
      <v-subheader>To edit, simply click on a name/description</v-subheader>
    </v-toolbar>
    <!-- DATA TABLE -->
    <v-data-table
        v-model="selected"
        :headers="headers"
        :search="makeupTemplateSearch"
        :items="makeupTemplates"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
        item-key="id"
    >

      <template slot="items" slot-scope="props">
        <!-- DATE -->
        <td>{{ props.item.dateString }}</td>

        <!-- NAME -->
        <!-- TODO: Rename -->
        <contacts-table-row
            :edit-item="props.item"
            :edit-field="'name'"
            title="Name"
            :save="inlineSave"
            editable>
        </contacts-table-row>

        <!-- DESCRIPTION -->
        <contacts-table-row
            :edit-item="props.item"
            :edit-field="'description'"
            title="Description"
            :save="inlineSave"
            editable>
        </contacts-table-row>

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
import { mapState, mapMutations, mapGetters } from 'vuex'
import api, { puntMakeupTemplateKeys } from '../api'
import { EDIT_SELECTED_MAKEUP_TEMPLATE } from '../store'
import { eventNames as appEvents } from '../events'
import ContactsTableRow from './ContactsTableRow'
import { permissionsMixin } from '../mixins'

export default {
  name: 'punts-table',
  components: { ContactsTableRow },
  mixins: [permissionsMixin],

  data () {
    return {
      headers: [
        { text: 'Date', align: 'left', value: 'dateString' },
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
    ...mapState({
      focusedTemplate: state => state.puntsStore.focusedMakeupTemplate,
      makeupTemplateSearch: state => state.puntsStore.makeupTemplateSearch
    }),

    ...mapGetters({
      makeupTemplates: 'customPuntMakeupTemplates'
    })
  },

  methods: {
    seeMakeups (makeupTemplate) {
      this.EDIT_SELECTED_MAKEUP_TEMPLATE(makeupTemplate)
    },

    isFocused (makeupTemplate) {
      if (!this.focusedTemplate) return false
      return makeupTemplate.id === this.focusedTemplate.id
    },

    inlineSave (makeupTemplate) {
      const updateData = {
        [puntMakeupTemplateKeys.name]: makeupTemplate.name,
        [puntMakeupTemplateKeys.description]: makeupTemplate.description
      }

      api.updateMakeupTemplateWithData(makeupTemplate, updateData, (error) => {
        if (error === null) {
          this.$_glob.root.$emit(appEvents.apiSuccess, 'MAKEUP TEMPLATE UPDATE success')
        } else {
          this.$_glob.root.$emit(appEvents.apiFailure, 'MAKEUP TEMPLATE UPDATE failed')
        }
      })
    },

    ...mapMutations({
      EDIT_SELECTED_MAKEUP_TEMPLATE
    })
  }
}
</script>
