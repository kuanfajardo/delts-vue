<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <!-- ACTIVATOR BUTTON -->
    <template slot="activator">
    <slot></slot>
    </template>

    <v-card
      height="auto"
    >

      <v-card-title>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>New Punt</v-toolbar-title>
        </v-toolbar>
      </v-card-title>

      <!-- FORM -->
      <v-form v-model="valid">
      <v-container grid-list-md class="pb-2 pt-3 px-4">
        <v-layout wrap>
          <v-flex xs12>
            <v-select
              :items="users"
              v-model="puntModel.assignees"
              label="Brother(s)"
              multiple
              chips
              clearable
              deletable-chips
              solo
              hint="Select brother(s) to assign punt to."
              persistent-hint
              return-object
              v-validate="'required'"
              data-vv-name="assignees"
              :error-messages="errors.collect('assignees')"
            >
            </v-select>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="puntModel.reason"
              label="Reason"
              v-validate="'required'"
              data-vv-name="reason"
              :error-messages="errors.collect('reason')"
            ></v-text-field>
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
        <v-btn class="mb-2" color="primary" @click.native="save">Punt</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'new-punt-dialog',

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      // DIALOG
      dialog: false,

      // MODEL
      puntModel: {
        assignees: null,
        reason: null
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

    if (this.model) {
      this.puntModel = Object.assign({}, this.model)
    }
  },

  computed: {
    ...mapGetters({
      users: 'customUsers'
    })
  },

  methods: {
    cancel () {
      this.dialog = false

      setTimeout(() => {
        this.puntModel = Object.assign({}, this.model)
        this.$validator.reset()
      }, 300)

      this.onCancel()
    },

    save () {
      this.$validator.validateAll().then(valid => {
        this.onSave(valid, this.puntModel, () => {
          if (valid) this.cancel()
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.new-punt-dialog {

}
</style>
