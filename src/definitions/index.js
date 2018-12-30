// TODO: make enums symbols: https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
// TODO: capitalize
// TODO: make into bitmask (can have multiple values at once!
export const DutyStatus = Object.freeze({
  unavailable: 0,
  unclaimed: 1,
  claimed: 2,
  completed: 3,
  punted: 4
})

export const PuntStatus = Object.freeze({
  Punted: 0,
  MakeUpClaimed: 1,
  MadeUp: 2
})

// TODO: Redo levels and sets, define how they work (each user has collection of defined sets (positions),
// which correspond to one mask over all permissions. In code, check permissions against collection of sets.
// In DB, store sets
export const Permissions = Object.freeze({
  None: 0,
  // Duties
  House_Checker: 1,
  House_Admin: 2,

  // Punts
  Punts_Giver: 4,
  Punts_Admin: 8,

  // Social
  Events_Bouncing: 16,
  Events_Social: 32,

  // Other
  Admin: 64
})

export const PermissionSets = Object.freeze({
  // Duties
  Checker: Permissions.House_Checker, // 1
  House: Permissions.House_Checker | Permissions.House_Admin | Permissions.Punts_Giver | Permissions.Punts_Admin, // 15

  // Social
  Bouncing: Permissions.Events_Bouncing | Permissions.Punts_Giver, // 20
  Social: Permissions.Events_Social | Permissions.Punts_Giver, // 36

  // Other
  User: Permissions.None, // 0
  Admin: Permissions.House_Checker | Permissions.House_Admin | Permissions.Punts_Giver | Permissions.Punts_Admin |
    Permissions.Events_Bouncing | Permissions.Events_Social | Permissions.Admin // 127
})

export function comparePermissions (a, b) {
  return (a & b) !== Permissions.None
}

/**
 * Order matters! Test whether \a TEST \in HAS
 * @param has
 * @param test
 */
export function containsAllPermission (has, test) {
  return (has & test) === test
}

export function getLastDayOfWeek (dayOfWeek, refDate = new Date()) {
  // Get next day-of-week and subtract a week
  var resultDate = getNextDayOfWeek(dayOfWeek, refDate)
  resultDate.setDate(resultDate.getDate() - 7)

  // Standardize all reference dates to have a time of 00:00:00:0000
  resultDate.setHours(0, 0, 0, 0)

  return resultDate
}

export function getNextDayOfWeek (dayOfWeek, refDate = new Date()) {
  // Compute distance to next day-of-week
  const diff = dayOfWeek - refDate.getDay() // Relative diff
  var fixedDiff // Actual diff

  if (diff === 0) { // If same day of week, just add a week
    fixedDiff = 7
  } else {
    fixedDiff = (diff + 7) % 7 // +7 to compensate for incorrect JS modulus w negative numbers
  }

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

export function classYears () {
  var dt = new Date()
  var years = []

  for (var i = 0; i < 5; i++) {
    var year = dt.getFullYear()
    years.push(year)
    dt.setFullYear(year + 1)
  }

  return years
}

export const stateAbbreviations = [
  'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC',
  'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV',
  'WI', 'WY'
]

export const stateNames = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Federated States of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Marshall Islands',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Northern Mariana Islands',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Island',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
]

export const courseNumbers = [
  // Architecture & Planning
  '4',
  '4-B',
  '11',

  // Engineering
  '16',
  '3-C',
  '20',
  '10-B',
  '10',
  '10-C',
  '6-3',
  '6-2',
  '6-P',
  '6-1',
  '16-ENG',
  '10-ENG',
  '2-A',
  '1-ENG',
  '3',
  '3-A',
  '2-OE',
  '2',
  '22',

  // HASS
  '21A',
  'CMS',
  '14-1',
  '21G',
  '21H',
  '21',
  '21E',
  '21S',
  '24-2',
  '21L',
  '14-2',
  '21M-1',
  '24-1',
  '17',
  'STS',
  '21M-2',
  '21W',

  // MANAGEMENT
  '15-2',
  '15-3',
  '15-1',

  // SCIENCE
  '7',
  '7-A',
  '9',
  '5',
  '12',
  '18',
  '18-C',
  '8',

  // INTER-DISCIPLINARY
  '5-7',
  '6-7',
  '6-14',
  '11-6'
].sort()
