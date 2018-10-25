import events from './names.js'

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
        color: 'green',
        text: 'Logout successfully.',
        timeout: 3000
      }
      this.$router.push({ path: '/login' })
    }
  },

  // API Responses
  {
    name: events.badRequest,
    // @error api response data
    callback: function (msg) {
      this.$message.error(msg)
    }
  },
  {
    name: events.accessDenied,
    // @error api response data
    callback: function (msg) {
      this.$message.error(msg)
      this.$router.push('/forbidden')
    }
  },
  {
    name: events.resourceDeleted,
    // @error api response data
    callback: function (msg) {
      this.$message.success(msg)
    }
  },
  {
    name: events.resourceUpdated,
    // @error api response data
    callback: function (msg) {
      this.$message.success(msg)
    }
  }
]
