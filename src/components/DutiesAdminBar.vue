<template>
  <v-toolbar v-if="showAdmin"  id="admin-bar" class="mb-3 mt-2" style="opacity: 1">
    <template v-if="tab === 0">
      <!-- General Actions-->
      <v-btn color="primary" @click.stop="liveButtonClicked">Go Live
        <v-icon right>visibility</v-icon>
      </v-btn>

      <v-btn dark color="teal" @click.stop="editDutySheetButtonClicked">Edit Duty Sheet
        <v-icon dark right>edit</v-icon>
      </v-btn>

      <v-divider
        class="mx-3"
        vertical
      ></v-divider>

      <!-- Edit Duty Actions -->
      <template v-if="selectedDuty !== null">
        <v-overflow-btn
          editable
          clearable
          :items="dropdownNames"
          :label="overflowLabel"
          hide-details
          class="pa-0"
          v-model="assignee"
        ></v-overflow-btn>

        <!-- Checkoff Actions -->
        <v-btn v-if="checked_off" color="error">Undo Checkoff
          <v-icon dark right>cancel</v-icon>
        </v-btn>

         <v-btn v-else :dark="showCheckoffButton" :disabled="!showCheckoffButton" color="#27af6a">Checkoff
          <v-icon right>check_circle</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-spacer></v-spacer>
        <v-btn class="elevation-0">
          Select a Duty to Edit
        </v-btn>
        <v-spacer></v-spacer>
    </template>
    </template>
    <!-- TODO: Menus for other tabs -->
  </v-toolbar>
</template>

<script>
import { dutiesMixin } from '../mixins/duties-mixin'
import { mapState } from 'vuex'
import api from '../api'

export default {
  name: 'duties-admin-bar',
  mixins: [dutiesMixin],

  data () {
    return {
      showAdmin: true,
      checked_off: false,
      assignee: null,
    }
  },

  props: {
    tab: Number
  },

  methods: {
    liveButtonClicked () {
      alert('Live button clicked')
      const refDate = new Date(2018, 11, 16)
      api.generateDutySheet(refDate)
    },

    editDutySheetButtonClicked () {
      alert('Edit duty sheet button clicked')
    }
  },

  computed: {
    ...mapState({
      selectedDuty: state => state.dutiesStore.selectedDuty,
      users: state => state.dutiesStore.users
    }),

    showCheckoffButton () {
      if (this.selectedDuty === null) return false
      return true
    },

    dropdownNames () {
      return this.users.map(user => {
        return { text: user.first + ' ' + user.last }
      })
    },

    overflowLabel () {
      if (this.selectedDuty.brother !== null) {
        return this.selectedDuty.brother.first + ' ' + this.selectedDuty.brother.last
      } else {
        return 'Edit Assignee'
      }
    }
  },

  watch: {
    assignee (newValue, oldValue) {
      console.log(newValue)
    },

    selectedDuty (newValue, oldValue) {
      if (newValue === null) {
        this.assignee = null
      } else {
        if (newValue.brother !== null) {
          this.assignee = newValue.brother.first + ' ' + newValue.brother.last
        } else {
          this.assignee = null
        }
      }
    }
  },
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
