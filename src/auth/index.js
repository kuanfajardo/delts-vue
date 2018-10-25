/* eslint-disable */
import firebase from 'firebase'

export default {
  signIn(email, pass, callback) {
    firebase.auth().signInWithEmailAndPassword(email, pass).then(
      user => {
        callback(user, null)
      }
    ).catch(
      error => {
        callback(null, error)
      }
    )
  },

  signOut (callback) {
    firebase.auth().signOut().then(
      () => {
        callback()
      }
    )
  },

  loggedIn () {
    return !!firebase.auth().currentUser
  },

  createNewUser(email, callback) {
    let tempPassword = generatePassword(12)

    // TODO: Send email with temp password! On Cloud functions
    // TODO: Set up user database! With Cloud functions

    firebase.auth().createUserWithEmailAndPassword(email, tempPassword).then(
      user => {
        callback(user, null)
      }
    ).catch(
      error => {
        callback(null, error)
      }
    )
  }
}

function generatePassword(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}
