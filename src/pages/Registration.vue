<template>
  <v-app>
    <v-content>
        <v-container>
          <v-layout>
            <v-spacer lg2></v-spacer>
            <v-flex lg8>
              <v-card class="mb-4">
                <v-toolbar flat color="primary" dark>
                  <v-toolbar-title class="heading">Registration Form</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text class="">
                  <registration-form></registration-form>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-spacer lg2></v-spacer>
          </v-layout>
        </v-container>
      </v-content>
  </v-app>
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
