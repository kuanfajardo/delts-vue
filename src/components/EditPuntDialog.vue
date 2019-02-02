<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
     <!--ACTIVATOR BUTTON -->
    <template slot="activator">
    <slot></slot>
    </template>

    <v-card
      height="auto"
    >

      <v-card-title>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Assign Makeup to Punt(s)</v-toolbar-title>
        </v-toolbar>
      </v-card-title>

      <!-- FORM -->
      <v-form v-model="valid">
      <v-container grid-list-md class="pb-2 pt-3 px-4">
        <v-layout wrap>
          <v-flex xs12>
            <v-select
              :items="makeupTemplates"
              v-model="localModel.makeupTemplate"
              label="Makeup"
              solo
              hint="Select makeup to assign to punt."
              persistent-hint
              return-object
              v-validate="'required'"
              data-vv-name="template"
              :error-messages="errors.collect('template')"
            >
            </v-select>
          </v-flex>
          <v-flex xs12>
            <v-checkbox
              v-model="localModel.checkedOff"
              color="primary"
              hide-details
              label="Mark makeup as complete"
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </v-container>
      </v-form>

      <!-- DIALOG ACTIONS -->
      <v-card-actions color="white">
        <v-spacer></v-spacer>
        <!-- CANCEL BUTTON -->
        <v-btn class="mb-2" outline color="error" @click.native="cancel">Cancel</v-btn>
        <!-- SAVE BUTTON -->
        <v-btn class="mb-2" color="primary" @click.native="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'edit-punt-dialog',

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      // DIALOG
      dialog: false,

      // MODEL
      localModel: {
        makeupTemplate: null,
        checkedOff: false
      },

      // FORM
      valid: false
    }
  },

  props: {
    onSave: {
      type: Function,
      default: () => {}
    },
    onCancel: {
      type: Function,
      default: () => {}
    },
    model: {
      type: Object,
      default: null
    }
  },

  $_veeValidate: {
    validator: 'new'
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  computed: {
    ...mapGetters({
      makeupTemplates: 'customPuntMakeupTemplates'
    })
  },

  methods: {
    cancel () {
      this.dialog = false

      setTimeout(() => {
        this.localModel = Object.assign({}, this.model)
        this.$validator.reset()
      }, 300)

      this.onCancel()
    },

    save () {
      this.$validator.validateAll().then(valid => {
        this.onSave(valid, this.localModel, () => {
          if (valid) this.cancel()
        })
      })
    }
  },

  watch: {
    model (newValue) {
      if (newValue) {
        this.localModel = Object.assign({}, newValue)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.new-punt-dialog {

}
</style>
