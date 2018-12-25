import { eventNames as events } from './names'

export default [
  // Authentication
  {
    name: events.loginSuccess,
    callback: function (e) {
      this.snackbar.show = false
      this.$router.replace(this.$route.query.redirect || '/')
    }
  },
  {
    name: events.loginFailure,
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'error',
        text: 'Login error.',
        timeout: 3000
      }
    }
  },
  {
    name: events.loginFirstTimeUser,
    callback: function (e) {
      this.$router.replace('/register')
    }
  },
  {
    name: events.authFailed,
    callback: function (e) {
      this.$router.push('/login')
      this.$message.error('Token has expired')
    }
  },
  {
    name: events.logout,
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'success',
        text: 'Logout successfully.',
        timeout: 3000
      }
      this.$router.push({ path: '/login' })
    }
  },

  // API Responses
  {
    name: events.apiSuccess,
    // @msg msg to display
    callback: function (msg) {
      this.snackbar = {
        show: true,
        color: 'success',
        text: msg,
        timeout: 1500
      }
    }
  },
  {
    name: events.apiFailure,
    // @msg msg to display
    callback: function (msg) {
      this.snackbar = {
        show: true,
        color: 'error',
        text: msg,
        timeout: 1500
      }
    }
  }
]
