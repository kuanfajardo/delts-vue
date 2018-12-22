import firebase from 'firebase'
import { getNextDayOfWeek, getLastDayOfWeek } from '@/definitions'

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

export const allDutiesRef = db.collection('duties')
export const weekDutiesRef = db.collection('duties').where('date', '>=', getLastDayOfWeek(0)).where('date', '<', getNextDayOfWeek(0))
export const dutyTemplatesRef = db.collection('duty-templates')
export const usersRef = db.collection('users')
