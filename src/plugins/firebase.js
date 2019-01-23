import firebase from 'firebase'
import { dutyKeys, puntKeys, partyKeys } from '../api'
import { nextStartOfWeek, lastStartOfWeek } from '../definitions'

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
// TODO: Fix this
export const partiesCollectionRef = db.collection('parties')
export const partiesRef = db.collection('parties').orderBy(partyKeys.startTimestamp)

console.log(lastStartOfWeek())
console.log(nextStartOfWeek())

// TODO: User keys!!
export const weekDutiesRef = db.collection('duties')
  .where(dutyKeys.date, '>=', lastStartOfWeek())
  .where(dutyKeys.date, '<', nextStartOfWeek())
  .orderBy(dutyKeys.date)
  .orderBy(dutyKeys.template)

export const dutyTemplatesRef = db.collection('duty-templates')
export const usersRef = db.collection('users')

export function dutiesRefForUser (user) {
  if (user) {
    const userRef = usersRef.doc(user.uid)
    return allDutiesRef.where(dutyKeys.assignee, '==', userRef).orderBy(dutyKeys.date)
  } else {
    return []
  }
}

export function puntsRefForUser (user) {
  if (user) {
    const userRef = usersRef.doc(user.uid)
    return allPuntsRef.where(puntKeys.assignee, '==', userRef).orderBy(puntKeys.puntTime)
  } else {
    return []
  }
}

// db.collection('duties').where('date', '>=', new Date(2018, 11, 23)).get().then((snapshot) => {
//   snapshot.forEach((doc) => {
//     db.collection('duties').doc(doc.id).delete()
//   })
// })
