<template>
  <v-toolbar v-if="showAdmin"  id="admin-bar" class="mb-3 mt-2" style="opacity: 1">
    <template v-if="tab === 0">
      <!-- General Actions-->
      <v-btn color="primary">Go Live
        <v-icon right>visibility</v-icon>
      </v-btn>

      <v-btn dark color="teal">Edit Duty Sheet
        <v-icon dark right>edit</v-icon>
      </v-btn>

      <v-divider
        class="mx-3"
        vertical
      ></v-divider>

      <!-- Edit Duty Actions -->
      <v-overflow-btn
        :items="dropdownNames"
        label="Edit Assignee"
        hide-details
        class="pa-0"

      ></v-overflow-btn>

      <!-- Checkoff Actions -->
      <template v-if="duty_selected">
        <v-btn v-if="checked_off" color="error">Undo Checkoff
          <v-icon dark right>cancel</v-icon>
        </v-btn>

         <v-btn v-else dark color="#27af6a">Checkoff
          <v-icon right>check_circle</v-icon>
        </v-btn>
      </template>
    </template>
    <!-- TODO: Menus for other tabs -->
  </v-toolbar>
</template>

<script>
export default {
  name: 'duties-admin-bar',

  data () {
    return {
      duty_selected: true,
      showAdmin: true,
      checked_off: false,
      dropdownNames: [
        { text: 'Juan' },
        { text: 'Malik' },
        { text: 'Mo' },
        { text: 'Andre' }
      ]
    }
  },

  props: {
    tab: Number
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #admin-bar {
    margin-left: 12.5%;
    margin-right: 12.5%;
    max-width: 75%;
  }
</style>
