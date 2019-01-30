// TODO: Cast firestore stuff into objects. Internally, objects use key constants, but externally can use (.) notation
export const userKeys = {
  courseNumber: 'course',
  email: 'email',
  facebookURL: 'facebook',
  firstName: 'first',
  givenName: 'given',
  interests: 'interests',
  lastName: 'last',
  permissionSet: 'permissionsMask',
  phoneNumber: 'phone',
  snapchatHandle: 'snapchat',
  homeState: 'state',
  isVerified: 'verified',
  classYear: 'year'
}

export const userProxyKeys = {
  // Props
  fullName: 'fullName',

  // Funcs
  hasPermissions: 'hasPermissions',
  hasAllPermissions: 'hasAllPermissions'
}

export const puntProxyKeys = {
  // Props
  assigneeName: 'assigneeName',
  giverName: 'giverName',
  status: 'status',
  statusString: 'statusString',

  // Funcs
  isAssignedToCurrentUser: 'isAssignedToCurrentUser',
  isGivenByCurrentUser: 'isGivenByCurrentUser'
}

export const dutyKeys = {
  assignee: 'brother',
  checker: 'checker',
  checkTime: 'checktime', // TODO: Change to 'check-time'
  date: 'date',
  template: 'duty' // TODO: Change to 'duty-template'
}

export const dutyTemplateKeys = {
  description: 'description',
  name: 'name',
  schedule: 'schedule'
}

export const puntKeys = {
  assignee: 'brother',
  giver: 'given-by',
  makeUp: 'make-up',
  puntTime: 'punt-time',
  reason: 'reason'
}

export const puntMakeupKeys = {
  assignee: 'assigned-to',
  completionTime: 'completion-time',
  template: 'template'
}

export const puntMakeupTemplateKeys = {
  description: 'description',
  name: 'name',
  value: 'value',
  date: 'date'
}
export const partyKeys = {
  capacity: 'capacity',
  name: 'name',
  startDate: 'time-start',
  endDate: 'time-end',
  theme: 'theme',
  photoURL: 'photos',
  isActive: 'is-active'
}
}

export default {
  userKeys: userKeys,
  dutyKeys: dutyKeys,
  dutyTemplateKeys: dutyTemplateKeys,
  puntKeys: puntKeys,
  puntMakeupKeys: puntMakeupKeys,
  puntMakeupTemplateKeys: puntMakeupTemplateKeys,
  inviteListKeys: inviteListKeys,
  partyKeys: partyKeys
}
