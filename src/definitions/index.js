export const DutyStatus = {
  'unavailable': 0,
  'unclaimed': 1,
  'claimed': 2,
  'completed': 3,
  'punted': 4
}

export function getLastDayOfWeek (dayOfWeek) {
  const currentDate = new Date()
  var resultDate = new Date(currentDate.getTime())
  resultDate.setDate(currentDate.getDate() - 7 + (7 + dayOfWeek - currentDate.getDay()) % 7) // +7 to compensate for incorrect JS modulus w negative numbers
  return resultDate
}

export function getNextDayOfWeek (dayOfWeek) {
  const currentDate = new Date()
  var resultDate = new Date(currentDate.getTime())
  resultDate.setDate(currentDate.getDate() + (7 + dayOfWeek - currentDate.getDay()) % 7) // +7 to compensate for incorrect JS modulus w negative numbers
  return resultDate
}

//
// export class DutySheetDuty {
//   constructor (dutyName, weekday) {
//     this.dutyName = dutyName
//     this.weekday = weekday
//   }
// }
//
// export class Duty {
//   constructor (dutySheetDuty: DutySheetDuty) {
//     this.dutySheetDuty = dutySheetDuty
//     this.assignee = null
//     this.checker = null
//     this.checkoffTime = null
//   }
//
//   get status () {
//     if (this.dutySheetDuty === null) {
//       return DutyStatus.unavailable
//     }
//
//     if (this.assignee === null) {
//       return DutyStatus.unclaimed
//     }
//
//     if (this.checker === null) {
//       const currentDate = new Date()
//       if (currentDate.getDay() <= this.dutySheetDuty.weekday) {
//         return DutyStatus.claimed
//       } else {
//         return DutyStatus.punted
//       }
//     } else {
//       return DutyStatus.completed
//     }
//   }
//
//   checkoff (checker: String) {
//     this.checker = checker
//     this.checkoffTime = new Date()
//
//     // TODO: commit
//   }
// }
//
// export class DutyTemplate {
//   constructor (name, description, schedule) {
//     this.name = name
//     this.description = description
//     this.schedule = schedule
//   }
// }
//
// export class DutyMap {
//   constructor (templates: [DutyTemplate]) {
//     this.templates = templates
//   }
//
//   isAvailable (dutyName, weekday) {
//     return (this.templates.find((template) => {
//       return template.name === dutyName && template.schedule.includes(weekday)
//     })) !== null
//   }
//
//   get dutyNames () {
//     return this.templates.forEach(template => {
//       return template.name
//     })
//   }
// }
