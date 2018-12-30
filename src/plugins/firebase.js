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

// TODO: make ref locations constants
export const allDutiesRef = db.collection('duties')
export const allPuntsRef = db.collection('punts')
export const puntMakeupsRef = db.collection('punt-makeups')
export const puntMakeupTemplatesRef = db.collection('punt-makeup-templates')

// TODO: Remove!! Only for debugging
export const today = new Date(2018, 11, 26)

console.log(getLastDayOfWeek(0, today))
console.log(getNextDayOfWeek(0, today))

// TODO: User keys!!
export const weekDutiesRef = db.collection('duties')
  .where(dutyKeys.date, '>=', getLastDayOfWeek(0, today))
  .where(dutyKeys.date, '<', getNextDayOfWeek(0, today))
  .orderBy(dutyKeys.date)
  .orderBy(dutyKeys.template)

export const dutyTemplatesRef = db.collection('duty-templates')
export const usersRef = db.collection('users')

export function dutiesRefForUser (user) {
  const userRef = usersRef.doc(user.uid)
  return allDutiesRef.where(dutyKeys.assignee, '==', userRef).orderBy(dutyKeys.date)
}

export function puntsRefForUser (user) {
  const userRef = usersRef.doc(user.uid)
  return allPuntsRef.where(puntKeys.assignee, '==', userRef).orderBy(puntKeys.puntTime)
}

