import {
  dutyKeys,
  dutyTemplateKeys,
  partyKeys,
  puntKeys,
  puntMakeupKeys,
  puntMakeupTemplateKeys,
  userKeys
} from '../api'

import { comparePermissions, containsAllPermission, PermissionSets, DutyStatus, PuntStatus, PuntMakeupStatus, TODAY } from '../definitions'

import { compareAsc, eachDayOfInterval, startOfWeek, endOfWeek, fromUnixTime, format } from 'date-fns'

import store from '../store'

// TODO: Wait until loaded to not have to check so many nulls!

class FirestoreObject {
  classKeyMap = {
    User: {}, // TODO: Use userKeys when can guarantee all user have those keys
    Duty: dutyKeys,
    DutyTemplate: dutyTemplateKeys,
    Punt: puntKeys,
    PuntMakeup: puntMakeupKeys,
    PuntMakeupTemplate: puntMakeupTemplateKeys,
    Party: partyKeys
  }

  constructor (obj) {
    // Check for validity
    const instanceType = this.constructor.name
    const keyObj = this.classKeyMap[instanceType]
    if (FirestoreObject.isValidObject(obj, keyObj)) {
      // Set properties
      this.object = obj
      this.id = obj.id
      this.isValid = true
    } else {
      return { isValid: false }
    }
  }

  static createFromFirestoreObject (obj) {
    const dynamicObject = null
    eval('dynamicObject = new ' + this.name + '(obj)')
    return dynamicObject.isValid ? dynamicObject : null
  }

  static dateForFirestoreTimestamp (timestamp) {
    return fromUnixTime(timestamp.seconds)
  }

  static isValidObject (obj, keyObj) {
    var keysToCheck = [
      'id',
      ...Object.values(keyObj)
    ]

    var isValid = true
    keysToCheck.forEach(key => {
      if (!isValid) return

      isValid = isValid && obj.hasOwnProperty(key)
    })

    return isValid
  }
}

// Users

export class User extends FirestoreObject {

  // KEYED

  get courseNumber () {
    return this.object[userKeys.course]
  }

  get email () {
    return this.object[userKeys.email]
  }

  get facebookURL () {
    return this.object[userKeys.facebook]
  }

  get firstName () {
    return this.object[userKeys.firstName]
  }

  get givenName () {
    return this.object[userKeys.givenName]
  }

  get lastName () {
    return this.object[userKeys.lastName]
  }

  get phoneNumber () {
    return this.object[userKeys.phone]
  }

  get interests () {
    return this.object[userKeys.interests]
  }

  get snapchatHandle () {
    return this.object[userKeys.snapchat]
  }

  get homeState () {
    return this.object[userKeys.state]
  }

  get isVerified () {
    return this.object[userKeys.verified]
  }

  get classYear () {
    return this.object[userKeys.year]
  }

  get permissionSet () {
    return this.object[userKeys.permissionSet] || PermissionSets.User
  }

  // COMPUTED

  get fullName () {
    return this.firstName + ' ' + this.lastName
  }

  // TODO: Maybe move the functional comparePermissions and containsAllPermissions into User class
  hasPermissions (permissionSet) {
    return comparePermissions(this.permissionSet, permissionSet)
  }

  hasAllPermissions (permissionSet) {
    return containsAllPermission(this.permissionSet, permissionSet)
  }
}

// Duties

export class DutyTemplate extends FirestoreObject {
  // KEYED

  get description () {
    return this.object[dutyTemplateKeys.description]
  }

  get name () {
    return this.object[dutyTemplateKeys.name]
  }

  get schedule () {
    return this.object[dutyTemplateKeys.schedule]
  }
}

export class Duty extends FirestoreObject {
  // TODO: Pre-compute object properties (i.e. assignee User obj, etc) in constructor

  // KEYED

  get template () {
    return DutyTemplate.createFromFirestoreObject(this.object[dutyKeys.template])
  }

  get assignee () {
    return this.object[dutyKeys.assignee]
      ? User.createFromFirestoreObject(this.object[dutyKeys.assignee])
      : null
  }

  get checker () {
    return this.object[dutyKeys.checker]
      ? User.createFromFirestoreObject(this.object[dutyKeys.checker])
      : null
  }

  get checkTime () {
    return this.object[dutyKeys.checkTime]
      ? FirestoreObject.dateForFirestoreTimestamp(this.object[dutyKeys.checkTime])
      : null
  }

  get date () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[dutyKeys.date])
  }

  // COMPUTED

  get name () {
    return this.template.name
  }

  get assigneeName () {
    return this.assignee ? this.assignee.fullName : ''
  }

  get checkerName () {
    return this.checker ? this.checker.fullName : ''
  }

  get dateString () {
    return this.date.toDateString()
  }

  get checkTimeString () {
    return this.checkTime ? this.checkTime.toUTCString() : ''
  }

  get status () {
    if (this.object === null) {
      return DutyStatus.unavailable // TODO: Turn DutyStatus.unavailable to NULL (like PuntStatus)
    }

    const isClaimed = this.assignee !== null
    const isCheckedOff = this.checkTime !== null

    if (store.state.dutiesStore.isDutySheetLive) {
      return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed
    }

    // TODO: Switch from compareAsc to isPast / isFuture / isSameDay
    // TODO: Make sure all dates are setHours(0, 0, 0, 0) - maybe convenience function to produce today's date like that
    const comparisonResult = compareAsc(this.date, TODAY())

    switch (comparisonResult) {
      case -1: // Duty date BEFORE today
        return isCheckedOff ? DutyStatus.completed : DutyStatus.punted
      case 0: // Duty date IS today
        return isCheckedOff ? DutyStatus.completed : (isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed)
      case 1: // Duty date is AFTER today
        return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed

      // Should never execute
      default:
        throw Error('Something went wrong. Comparison result should be between -1 and 1.')
    }
  }

  get statusString () {
    switch (this.status) {
      case DutyStatus.unavailable:
        return ''
      case DutyStatus.unclaimed:
        return 'Unclaimed'
      case DutyStatus.claimed:
        return 'Claimed'
      case DutyStatus.completed:
        return 'Checked'
      case DutyStatus.punted:
        return 'Punted'
      default:
        return ''
    }
  }

  isDutyForCurrentUser () {
    return this.assignee
      ? this.assignee.id === store.state.currentUser.uid
      : false
  }

  // METHODS
}

export class DutyMap {
  constructor (dutyTemplates, weekDuties) {
    if (!dutyTemplates || !weekDuties) throw TypeError('DutyMap constructor params must be defined and non-null')

    this._rawTemplates = dutyTemplates

    this._generatedTemplates = []
    this._generationMap = {}
    this._dutyMap = null

    this._generateAllTemplates()
    this._generateDutyMap(weekDuties)
  }

  _generateAllTemplates () {
    var i = 0
    this._rawTemplates.forEach((dutyTemplate) => {
      var maxNumDuties = 0
      Object.keys(dutyTemplate.schedule).forEach(weekday => {
        maxNumDuties = Math.max(dutyTemplate.schedule[weekday], maxNumDuties)
      })

      this._generationMap[dutyTemplate.id] = []
      for (let j = 0; j < maxNumDuties; j++) {
        this._generatedTemplates.push(dutyTemplate)
        this._generationMap[dutyTemplate.id].push(i++)
      }
    })
  }

  _generateDutyMap (weekDuties) {
    var dutyMap = []
    this._generatedTemplates.forEach(template => {
      dutyMap = dutyMap.concat({
        template: template, // Unused, really only for visual debugging
        schedule: new Array(7).fill(null)
      })
    })

    weekDuties.forEach(duty => {
      if (!duty.template) return
      for (const idx of this._generationMap[duty.template.id]) {
        // Place in correct spot for templates with multiple slots / day (i.e. Kitchen)
        if (dutyMap[idx].schedule[duty.date.getDay()] === null) {
          dutyMap[idx].schedule[duty.date.getDay()] = duty
          break
        }
      }
    })

    this._dutyMap = dutyMap
  }

  dutyForTemplateAndWeekdayIndices (templateIndex, weekday) {
    return this._dutyMap[templateIndex].schedule[weekday]
  }

  get templateNames () {
    return this._generatedTemplates.map((template) => template.name)
  }

  get dates () {
    var startDate = 6
    var endDate = 0

    // Find span of week
    this._rawTemplates.forEach((dutyTemplate) => {
      Object.keys(dutyTemplate.schedule).forEach(weekday => {
        weekday = parseInt(weekday) // keys come as strings!

        if (dutyTemplate.schedule[weekday] <= 0) return

        if (weekday < startDate) {
          startDate = weekday
        }

        if (weekday > endDate) {
          endDate = weekday
        }
      })
    })

    var weekdays = []
    for (let i = startDate; i <= endDate; i++) {
      weekdays.push(i)
    }

    // TODO: Not use TODAY(), but rather a ref date to be able to see multiple weeks, not just current one
    return eachDayOfInterval({
      start: startOfWeek(TODAY(), {
        weekStartsOn: startDate
      }),
      end: endOfWeek(TODAY(), {
        weekStartsOn: (endDate + 1) % 7
      })
    })
  }
}

// Punts

export class PuntMakeupTemplate extends FirestoreObject {
  // KEYED

  get description () {
    return this.object[puntMakeupTemplateKeys.description]
  }

  get name () {
    return this.object[puntMakeupTemplateKeys.name]
  }

  get date () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[puntMakeupTemplateKeys.date])
  }

  get dateString () {
    return format(this.date, 'MM/dd/yy')
  }
}

export class PuntMakeup extends FirestoreObject {

  // KEYED

  get assignee () {
    return User.createFromFirestoreObject(this.object[puntMakeupKeys.assignedTo])
  }

  get completionTime () {
    return this.object[puntMakeupKeys.completionTime]
      ? FirestoreObject.dateForFirestoreTimestamp(this.object[puntMakeupKeys.completionTime])
      : null
  }

  // TODO: Rename to template
  get makeupTemplate () {
    return PuntMakeupTemplate.createFromFirestoreObject(this.object[puntMakeupKeys.makeupTemplate])
  }

  // COMPUTED

  get status () {
    return this.completionTime === null
      ? PuntMakeupStatus.NotCompleted
      : PuntMakeupStatus.Completed
  }

  get name () {
    return this.makeupTemplate ? this.makeupTemplate.name  :''
  }

  get completionTimeString () {
    return this.completionTime ? this.completionTime.toDateString() : ''
  }
}

export class Punt extends FirestoreObject {
  // KEYED

  get assignee () {
    return User.createFromFirestoreObject(this.object[puntKeys.assignee])
  }

  get giver () {
    return User.createFromFirestoreObject(this.object[puntKeys.givenBy])
  }

  get makeUp () {
    return this.object[puntKeys.makeUp]
      ? PuntMakeup.createFromFirestoreObject(this.object[puntKeys.makeUp])
      : null
  }

  get puntTime () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[puntKeys.puntTime])
  }

  get reason () {
    return this.object[puntKeys.reason]
  }

  // COMPUTED

  get puntTimeString () {
    return this.puntTime.toDateString()
  }

  get assigneeName () {
    return this.assignee ? this.assignee.fullName : ''
  }

  get giverName () {
    return this.giver ? this.giver.fullName : ''
  }

  get status () {
    if (this.object === null) return null

    if (this.makeUp === null) {
      return PuntStatus.Punted
    }

    return this.makeUp.status === PuntMakeupStatus.NotCompleted
      ? PuntStatus.MakeUpClaimed
      : PuntStatus.MadeUp
  }

  get statusString () {
    switch (this.status) {
      case PuntStatus.Punted:
        return 'Punted'
      case PuntStatus.MakeUpClaimed:
        return 'Making Up'
      case PuntStatus.MadeUp:
        return 'Made Up'
      default:
        return ''
    }
  }

  get makeUpName () {
    return this.makeUp ? this.makeUp.name : ''
  }

  get makeUpTimeString () {
    return this.makeUp ? this.makeUp.completionTimeString : ''
  }

  isAssignedToCurrentUser () {
    return this.assignee ? this.assignee.id === store.state.currentUser.uid : false
  }

  isGivenByCurrentUser () {
    return this.assignee ? this.assignee.id === store.state.currentUser.uid : false
  }
}

// Social

export class Party extends FirestoreObject {
  // KEYED

  get capacity () {
    return this.object[partyKeys.capacity]
  }

  get name () {
    return this.object[partyKeys.name]
  }

  get theme () {
    return this.object[partyKeys.theme]
  }

  get photoURL () {
    return this.object[partyKeys.photos]
  }

  get isActive () {
    return this.object[partyKeys.isActive]
  }

  // COMPUTED

  get startDate () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[partyKeys.startTimestamp])
  }

  get endDate () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[partyKeys.endTimestamp])
  }
}

// TODO: Use fromUnixTimestamp for creation of firestore dates
//
