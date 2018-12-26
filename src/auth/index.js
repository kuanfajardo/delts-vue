import firebase from 'firebase'

export default {
  signIn (email, pass, callback) {
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
  }
}
