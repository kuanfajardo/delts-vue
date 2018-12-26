// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

exports.addUserToFirestore = functions.auth.user().onCreate((user) => {
  return db.collection('users').doc(user.uid).set({
    'email': user.email
  }).then(() => {
    return console.log('Added user ' + user.uid + ' to Firestore.')
  })
})

exports.removeUserFromFirestore = functions.auth.user().onDelete((user) => {
  return db.collection('users').doc(user.uid).delete()
    .then(() => {
      return console.log('Deleted user ' + user.uid + ' from Firestore.')
    })
})
