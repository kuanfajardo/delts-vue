<template>
  <div class="registration-page">
    <v-container>
      <v-layout>
        <v-flex lg9>
          <v-card class="mb-4">
            <v-toolbar flat>
              <v-toolbar-title class="heading">Registration Form</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="">
              <registration-form></registration-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import RegistrationForm from './RegistrationForm'

export default {
  name: 'registration-page',
  components: { RegistrationForm },
  data () {
    return {
      msg: 'msg'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .registration-page {

  }
</style>
