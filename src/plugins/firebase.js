import firebase from 'firebase'

let config = {
  apiKey: 'AIzaSyCYos8q_4IeiPVsuS-2xQkR8wvkXMYQ164',
  authDomain: 'delts-app.firebaseapp.com',
  databaseURL: 'https://delts-app.firebaseio.com',
  projectId: 'delts-app',
  storageBucket: 'delts-app.appspot.com',
  messagingSenderId: '1088281406702'
}

firebase.initializeApp(config)

// Firestore setup
const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export const dutiesRef = db.collection('duties')
export const dutyTemplatesRef = db.collection('duty-templates')
export const usersRef = db.collection('users')
