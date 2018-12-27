import firebase from 'firebase'
import { getNextDayOfWeek, getLastDayOfWeek } from '../definitions'
import { dutyKeys, puntKeys } from '../api'

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
export const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export const allDutiesRef = db.collection('duties')
export const allPuntsRef = db.collection('punts')

// TODO: Remove!! Only for debugging
export const today = new Date(2018, 11, 19)

// TODO: User keys!!
export const weekDutiesRef = db.collection('duties')
  .where('date', '>=', getLastDayOfWeek(0, today))
  .where('date', '<', getNextDayOfWeek(0, today))
  .orderBy('date')
  .orderBy('duty')
export const dutyTemplatesRef = db.collection('duty-templates')
export const usersRef = db.collection('users')

export function dutiesRefForUser (user) {
  const userRef = usersRef.doc(user.uid)
  return allDutiesRef.where(dutyKeys.assignee, '==', userRef).orderBy('date')
}

export function puntsRefForUser (user) {
  const userRef = usersRef.doc(user.uid)
  return allPuntsRef.where(puntKeys.assignee, '==', userRef).orderBy('date')
}

