// TODO: Cast firestore stuff into objects. Internally, objects use key constants, but externally can use (.) notation
export const userKeys = {
  course: 'course',
  email: 'email',
  facebook: 'facebook',
  firstName: 'first',
  givenName: 'given',
  interests: 'interests',
  lastName: 'last',
  permissionSet: 'permissionsMask',
  phone: 'phone',
  snapchat: 'snapchat',
  state: 'state',
  verified: 'verified',
  year: 'year'
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
  givenBy: 'given-by',
  makeUp: 'make-up',
  puntTime: 'punt-time',
  reason: 'reason'
}

export const puntMakeupKeys = {
  assignedTo: 'assigned-to',
  completionTime: 'completion-time',
  makeupTemplate: 'template'
}

export const puntMakeupTemplateKeys = {
  description: 'description',
  name: 'name',
  value: 'value',
  date: 'date'
}
