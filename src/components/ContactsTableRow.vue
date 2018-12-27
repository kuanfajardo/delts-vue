<template>
  <td class="contacts-table-row">
    <template v-if="editable">
      <v-edit-dialog
          :return-value.sync="editItem[editField]"
          large
          lazy
          @save="save(editItem)"
        >
          {{ editItem[editField] }}
          <div slot="input" class="mt-3 title">{{ title }}</div>
          <v-text-field
            v-if="dialogType === 'text'"
            slot="input"
            v-model="editItem[editField]"
            :mask="mask"
            :label="label"
            single-line
            counter
            autofocus
          ></v-text-field>
          <v-select
            v-else
            :items="items"
            slot="input"
            v-model="editItem[editField]"
            :label="label"
            autofocus
          ></v-select>
      </v-edit-dialog>
    </template>
    <template v-else>
      {{ editItem[editField] }}
    </template>
  </td>
</template>

<script>
export default {
  name: 'contacts-table-row',

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      defaultDialogType: 'text',
      validDialogTypes: ['text', 'select']
    }
  },

  props: {
    // REQUIRED (DATA)
    editItem: {
      type: Object,
      required: true
    },

    editField: {
      type: String,
      required: true
    },

    // PROPERTIES
    dialogType: {
      type: String,
      default: 'text',
      validator: (value) => {
        // The value must match one of these strings
        return ['text', 'select'].indexOf(value) !== -1
      }
    },

    title: {
      type: String,
      default: 'Update'
    },

    save: {
      type: Function
    },

    editable: {
      type: Boolean,
      default: true
    },

    label: String,

    // SELECT DIALOG
    items: {
      type: Array,
      default: () => { return [] }
    },

    // TEXT DIALOG
    mask: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contacts-table-row {

}
</style>
