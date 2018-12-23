// TODO: make symbols: https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
export const DutyStatus = Object.freeze({
  'unavailable': 0,
  'unclaimed': 1,
  'claimed': 2,
  'completed': 3,
  'punted': 4
})

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

export function getAllIndexes (arr, val) {
  var indexes = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      indexes.push(i)
    }
  }
  return indexes
}
