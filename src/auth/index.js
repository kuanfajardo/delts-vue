/* eslint-disable */
import firebase from 'firebase'

export default {
  signIn(email, pass, callback) {
    firebase.auth().signInWithEmailAndPassword(email, pass).then(
        function (user) {
          callback(true)
        },
        function (err) {
          callback(false)
        }
      )
  },

  signOut (callback) {
    firebase.auth().signOut().then(
      function () {
        callback(true)
      },
      function () {
        callback(false)
      }
    )
  },

  loggedIn () {
    return !!firebase.auth().currentUser
  }
}
