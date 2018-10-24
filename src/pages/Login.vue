<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <h1 class="flex my-4 font-weight-medium display-1">Delts Manager</h1>
                </div>
                <v-form>
                  <v-text-field
                    append-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="username"
                    placeholder="jfajardo@mit.edu"
                  ></v-text-field>
                  <v-text-field
                    append-icon="lock"
                    name="password"
                    label="Password"
                    id="password"
                    type="password"
                    v-model="pass"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mx-1" color="primary" @click="signIn" :loading="loading">Login</v-btn>
              </v-card-actions>
              <v-snackbar
                v-model="snackbar"
                color="error"
                :timeout="timeout"
                top
              >
                {{ text }}
                <v-btn
                  dark
                  flat
                  @click="snackbar = false"
                >
                  Close
                </v-btn>
              </v-snackbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import auth from '@/auth/'

export default {
  data: () => ({
    text: 'Login failure',
    timeout: 6000,
    snackbar: false,
    loading: false,
    username: '',
    pass: ''
  }),

  methods: {
    signIn () {
      this.loading = true

      auth.signIn(this.username, this.pass, loggedIn => {
        this.snackbar = !loggedIn
        if (loggedIn) {
          this.$router.replace(this.$route.query.redirect || '/')
        }

        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
