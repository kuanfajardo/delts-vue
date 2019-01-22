import {
  dutyKeys,
  dutyTemplateKeys,
  partyKeys,
  puntKeys,
  puntMakeupKeys,
  puntMakeupTemplateKeys,
  userKeys
} from '../api'

import { comparePermissions, containsAllPermission, PermissionSets } from '../definitions'

class FirestoreObject {
  constructor (obj) {
    this.object = obj
  }

  static dateForFirestoreTimestamp (timestamp) {
    return new Date(timestamp.seconds * 1000)
  }
}

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
      ? FirestoreObject.dateForFirestoreTimestamp(this.object[dutyKeys.checkTime]).toUTCString()
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

  get checkTimeString () {
    return this.checkTime ? this.checkTime.toUTCString() : ''
  }
}

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
