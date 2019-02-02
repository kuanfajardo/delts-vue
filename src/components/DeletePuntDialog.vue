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
          <v-toolbar-title>Delete Punt(s)</v-toolbar-title>
        </v-toolbar>
      </v-card-title>

      <v-alert
        type="error"
        color="accent"
        class="mx-4"
        :value="true"
      >
        After you delete a punt, it's permanently deleted. Punts can't be undeleted.
      </v-alert>

      <v-card-text>
        {{ 'Are you sure you want to delete these punts?' }}
      </v-card-text>

      <!-- DIALOG ACTIONS -->
      <v-card-actions color="white">
        <v-spacer></v-spacer>
        <!-- CANCEL BUTTON -->
        <v-btn class="mb-2" color="error" @click.native="cancel">Cancel</v-btn>
        <!-- SAVE BUTTON -->
        <v-btn class="mb-2" outline color="primary" @click.native="submit">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'delete-punt-dialog',

  //-------------------+
  //     PROPERTIES    |
  //-------------------+

  data () {
    return {
      // DIALOG
      dialog: false,
    }
  },

  props: {
    onDelete: {
      type: Function,
      default: () => {}
    },
    onCancel: {
      type: Function,
      default: () => {}
    }
  },

  methods: {
    cancel () {
      this.dialog = false
      this.onCancel()
    },

    submit () {
      this.onDelete(() => {
        this.cancel()
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
