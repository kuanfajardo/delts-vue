export const DutyStatus = {
  'unavailable': 0,
  'unclaimed': 1,
  'claimed': 2,
  'completed': 3,
  'punted': 4
}

export function getLastDayOfWeek (dayOfWeek, refDate = new Date()) {
  // Get next day-of-week and subtract a week
  var resultDate = new Date(refDate.getTime())
  resultDate.setDate(getNextDayOfWeek(dayOfWeek, refDate).getDate() - 7)

  // Standardize all reference dates to have a time of 00:00:00:0000
  resultDate.setHours(0, 0, 0, 0)

  return resultDate
}

export function getNextDayOfWeek (dayOfWeek, refDate = new Date()) {
  // Compute distance to next day-of-week
  const diff = dayOfWeek - refDate.getDay()
  const fixedDiff = (diff + 7) % 7 // +7 to compensate for incorrect JS modulus w negative numbers

  // Copy reference date and add the difference needed to get next day-of-week
  var resultDate = new Date(refDate.getTime())
  resultDate.setDate(refDate.getDate() + fixedDiff)

  // Standardize all reference dates to have a time of 00:00:00:0000
  resultDate.setHours(0, 0, 0, 0)

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
