// TODO: Cast firestore stuff into objects. Internally, objects use key constants, but externally can use (.) notation
export const userKeys = {
  course: 'course',
  email: 'email',
  facebook: 'facebook',
  firstName: 'first',
  givenName: 'given',
  interests: 'interests',
  lastName: 'last',
  phone: 'phone',
  snapchat: 'snapchat',
  state: 'state',
  verified: 'verified',
  year: 'year'
}

export const dutyKeys = {
  assignee: 'brother',
  checker: 'checker',
  checkTime: 'checktime', // Change to 'check-time'
  date: 'date',
  template: 'duty' // Change to 'duty-template'
}

export const dutyTemplateKeys = {
  description: 'description',
  name: 'name',
  schedule: 'schedule'
}
