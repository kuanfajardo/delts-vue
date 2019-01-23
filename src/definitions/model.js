import {
  dutyKeys,
  dutyTemplateKeys,
  partyKeys,
  puntKeys,
  puntMakeupKeys,
  puntMakeupTemplateKeys,
  userKeys
} from '../api'

import { comparePermissions, containsAllPermission, PermissionSets, DutyStatus, PuntStatus, TODAY } from '../definitions'

import { compareAsc, getDay, eachDayOfInterval, startOfWeek, endOfWeek, fromUnixTime } from 'date-fns'

import store from '../store'

class FirestoreObject {
  constructor (obj) {
    this.object = obj
    this.id = obj.id
  }

  static dateForFirestoreTimestamp (timestamp) {
    return fromUnixTime(timestamp.seconds)
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
    return new DutyTemplate(this.object[dutyKeys.template])
  }

  get assignee () {
    return this.object[dutyKeys.assignee]
      ? new User(this.object[dutyKeys.assignee])
      : null
  }

  get checker () {
    return this.object[dutyKeys.checker]
      ? new User(this.object[dutyKeys.checker])
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
      return DutyStatus.unavailable
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

  get weekday () {
    return getDay(this.date)
  }

  isDutyForCurrentUser () {
    try {
      return this.assignee.id === store.state.currentUser.uid
    } catch (e) {
      return false
    }
  }

  // METHODS
}

export class DutyMap {
  constructor (dutyTemplates, weekDuties) {
    if (!dutyTemplates || !weekDuties) throw TypeError()

    this._rawTemplates = dutyTemplates

    this._generatedTemplates = []
    this._generationMap = {}
    this._dutyMap = null

    try {
      this._generateAllTemplates()
      this._generateDutyMap(weekDuties)
    } catch (e) {
      // Errors (i.e. not yet fully defined state)
    }
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
    try {
      return this._dutyMap[templateIndex].schedule[weekday]
    } catch (e) {
      return null
    }
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
}

export class PuntMakeup extends FirestoreObject {
  // KEYED

  get assignee () {
    return new User(this.object[puntMakeupKeys.assignedTo])
  }

  get completionTime () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[puntMakeupKeys.completionTime])
  }

  get makeupTemplate () {
    return new PuntMakeupTemplate(this.object[puntMakeupKeys.makeupTemplate])
  }
}

export class Punt extends FirestoreObject {
  // KEYED

  get assignee () {
    return new User(this.object[puntKeys.assignee])
  }

  get giver () {
    return new User(this.object[puntKeys.givenBy])
  }

  get makeUp () {
    return new PuntMakeup(this.object[puntKeys.makeUp])
  }

  get puntTime () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[puntKeys.puntTime])
  }

  get reason () {
    return this.object[puntKeys.reason]
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
