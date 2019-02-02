import {
  dutyKeys,
  dutyTemplateKeys,
  partyKeys,
  puntKeys,
  puntMakeupKeys,
  puntMakeupTemplateKeys,
  userKeys,
  userProxyKeys,
  puntProxyKeys
} from '../api'

import Keys from '../api/keys'

import { comparePermissions, containsAllPermission, PermissionSets, DutyStatus, PuntStatus, PuntMakeupStatus, TODAY, typeGuard, parameterTypeGuard } from '../definitions'

import { compareAsc, eachDayOfInterval, startOfWeek, endOfWeek, format } from 'date-fns'

import { firestore } from 'firebase'

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

      // For factory method
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

  /**
   *
   * @param {firebase.firestore.Timestamp} timestamp
   * @return {Date}
   */
  static dateForFirestoreTimestamp (timestamp) {
    return timestamp.toDate()
  }

  /**
   *
   * @param {firebase.firestore.Timestamp} date
   */
  static firestoreTimestampFromDate (date) {
    return firestore.Timestamp.fromDate(date)
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

/**
 * @typedef {Object} target
 */

/**
 * @typedef {Object} proxy
 */

/**
 * @typedef {*} value
 */

/**
 * Function type for proxy field getter
 *
 * @typedef {Function} proxyGetter
 * @param {target} target
 * @param {proxy} proxy
 */

/**
 * Function type for proxy field setter
 *
 * @typedef {Function} proxySetter
 * @param {target} target
 * @param {value} value
 * @param {proxy} proxy
 */

/**
 * Function type for proxy field function
 *
 * @typedef {Object} proxyFunction
 * @property {String} name
 * @property {Function} body
 */

/**
 * @typedef {Object} proxyFieldGetter
 * @property {String} field - name of field // TODO: Rename to name
 * @property {proxyGetter} get - getter for field
 */

/**
 * @typedef {Object} proxyFieldSetter
 * @property {String} field - name of field
 * @property {*} type - type of value // TODO: ??
 * @property {proxySetter} set - setter for field
 */

/**
 * @typedef {Object} proxyProxy
 * @property {String} field
 * @property {String} name
 * @property {*} proxyClass
 */

/**
 * A type for specifying all aspects of a proxy handler
 * @typedef {Object} proxyFieldHandler
 * @property {String} field - name of field on target for this handler
 * @property {proxyGetter} get - getter for field
 * @property {proxySetter} set - setter for field
 */

class NotImplementedError extends Error {}
class NoSetterAllowedError extends Error {}
class AbstractMethodNotImplementedError extends Error {}

// TODO: Rename ProxyWrapper?
export class ProxyHandler {
  // LIFECYCLE
  /**
   * @param {*} proxyClass
   * @param {Object} handlers
   * @param {Object} functions
   */
  constructor (proxyClass = null, handlers = {}, functions = {}) {
    this.proxyClass = proxyClass
    this.handlers = handlers
    this.functions = functions
  }

  /**
   * @param {*} proxyClass
   * @return {ProxyHandler}
   */
  static new (proxyClass) {
    return new ProxyHandler(proxyClass)
  }

  // HELPERS
  /**
   *
   * @param {String} field
   * @private
   */
  _initiateField (field) {
    if (!(field in this.handlers)) {
      this.handlers[field] = {
        getter: () => { throw new NotImplementedError() },
        setter: () => { throw new NoSetterAllowedError() }
      }
    }
  }

  /**
   *
   * @param {String} funcName
   * @private
   */
  _initiateFunction (funcName) {
    if (!(funcName in this.functions)) {
      this.functions[funcName] = {
        body: () => { throw new NotImplementedError() }
      }
    }
  }

  /**
   *
   * @param {String} field
   * @return {*}
   * @private
   */
  _getTargetField (field) {
    return FirestoreObjectProxy.classKeyMap[this.proxyClass.name][field]
  }

  // GENERAL
  // TODO: Rename all to 'set' rather than 'add'
  // TODO: Rename method names?

  /**
   *
   * @param {proxyFieldGetter} fieldGetter
   */
  addGetter (fieldGetter) {
    this._initiateField(fieldGetter.field)
    this.handlers[fieldGetter.field].getter = fieldGetter.get
    return this
  }

  /**
   *
   * @param {proxyFieldSetter} fieldSetter
   */
  addSetter (fieldSetter) {
    this._initiateField(fieldSetter.field)
    this.handlers[fieldSetter.field].setter = fieldSetter.set
    return this
  }

  /**
   *
   * @param {proxyFieldHandler} fieldHandler
   * @return {ProxyHandler}
   */
  _addHandler (fieldHandler) {
    this._initiateField(fieldHandler.field)
    this.handlers[fieldHandler.field] = {
      getter: fieldHandler.get,
      setter: fieldHandler.set
    }

    return this
  }

  // SPECIFIC

  /**
   *
   * @param {String} proxyField
   * @return {ProxyHandler}
   */
  addString (proxyField) {
    return this.addPrimitive(proxyField, String)
  }

  /**
   *
   * @param {String} proxyField
   * @return {ProxyHandler}
   */
  addNumber (proxyField) {
    return this.addPrimitive(proxyField, Number)
  }

  /**
   *
   * @param {String} proxyField
   * @return {ProxyHandler}
   */
  addArray (proxyField) {
    return this.addPrimitive(proxyField, Array)
  }

  /**
   *
   * @param {String} proxyField
   * @return {ProxyHandler}
   */
  addObject (proxyField) {
    return this.addPrimitive(proxyField, Object)
  }

  /**
   *
   * @param {String} proxyField
   * @return {ProxyHandler}
   */
  addBoolean (proxyField) {
    return this.addPrimitive(proxyField, Boolean)
  }

  /**
   *
   * @param proxyField
   * @param type
   * @return {ProxyHandler}
   */
  addPrimitive (proxyField, type) {
    const targetField = this._getTargetField(proxyField)
    return this._addHandler({
      field: proxyField,
      get: (target, proxy) => { return target[targetField] },
      set: (target, value, proxy) => {
        typeGuard(value, type)
        target[targetField] = value
      }
    })
  }

  /**
   *
   * @param {proxyFunction} func
   * @return {ProxyHandler}
   */
  addFunction (func) {
    this._initiateFunction(func.name)
    this.functions[func.name].body = func.body
    return this
  }

  /**
   *
   * @param {String} field
   * @return {ProxyHandler}
   */
  addDate (field) {
    const targetField = this._getTargetField(field)
    return this._addHandler({
      field: field,
      get: (target, proxy) => {
        const timestamp = target[targetField]
        return timestamp
          ? FirestoreObjectProxy.dateForFirestoreTimestamp(timestamp)
          : null
      },
      set: (target, value, proxy) => {
        typeGuard(value, Date)
        target[targetField] = FirestoreObjectProxy.firestoreTimestampForDate(value)
      }
    })
  }

  /**
   *
   * @param {String} field
   * @param {*} proxyClass
   * @return {ProxyHandler}
   */
  addProxy (field, proxyClass) {
    const targetField = this._getTargetField(field)
    return this._addHandler({
      field: field,
      get: (target, proxy) => {
        if (!target[targetField]) return null

        const dynamicProxyHandler = null
        eval('dynamicProxyHandler = ' + proxyClass.name + '.proxyHandler()')
        return dynamicProxyHandler
          ? dynamicProxyHandler.generateProxy(target[targetField])
          : null
      },
      set: (target, value, proxy) => {
        typeGuard(value, proxyClass)
        const isValid = FirestoreObjectProxy.isValid(value, proxyClass)
        if (isValid) {
          target[targetField] = value
        } else {
          throw new TypeError()
        }
      }
    })
  }

  /**
   *
   * @param {proxyGetter} func
   * @return {ProxyHandler}
   */
  addName (func) {
    return this.addGetter({
      field: 'text',
      get: func
    })
  }

  // USE
  /**
   *
   * @return {Object} actual handler for Proxy object
   */
  _formatForProxy () {
    const properties = this.handlers
    const methods = this.functions
    return {
      get (target, field, proxy) {
        try {
          // CUSTOM INSERTS FOR ALL PROXIES: .object and .toString
          if (field === 'object') {
            return target
          }

          if (field === 'toString') {
            return function () {
              return target.id + (proxy.text || '')
            }
          }

          if (field === 'value') {
            return target.id
          }

          if (field in properties) {
            return properties[field].getter(target, proxy)
          }

          if (field in methods) {
            const func = methods[field].body
            return function (...args) {
              return func.apply(proxy, [proxy, ...args])
            }
          }

          if (field in target) {
            return target[field]
          }
        } catch (e) {
          // console.warn(e)
          return null
        }
      },

      set (target, field, value, proxy) {
        if (field in properties) {
          properties[field].setter(target, value, proxy)
        }

        if (field in target) {
          target[field] = value
        }

        return true
      },

      has (target, field) {
        return field in target
      }
    }
  }

  generateProxy (obj) {
    return obj ? new Proxy(obj, this._formatForProxy()) : null
  }

  /**
   *
   * @param {ProxyHandler} handlerA
   * @param {ProxyHandler} handlerB
   * @return {ProxyHandler}
   */
  static merge (handlerA, handlerB) {
    if (handlerA.proxyClass !== handlerB.proxyClass) throw new Error('To merge handlers, they both must wrap the same class.')

    const mergedHandlers = {}
    Object.assign(mergedHandlers, handlerA.handlers)
    Object.assign(mergedHandlers, handlerB.handlers)

    const mergedFunctions = {}
    Object.assign(mergedFunctions, handlerA.functions)
    Object.assign(mergedFunctions, handlerB.functions)

    return new ProxyHandler(handlerA.proxyClass, mergedHandlers, mergedFunctions)
  }

  /**
   *
   * @param {ProxyHandler} handler
   * @return {ProxyHandler}
   */
  merge (handler) {
    return ProxyHandler.merge(this, handler)
  }
}

// Users

/**
 * Callback
 */

export class FirestoreObjectProxy {
  static classKeyMap = {
    UserProxy: Keys.userKeys,
    DutyProxy: Keys.dutyKeys,
    DutyTemplateProxy: Keys.dutyTemplateKeys,
    PuntProxy: Keys.puntKeys,
    PuntMakeupProxy: Keys.puntMakeupKeys,
    PuntMakeupTemplateProxy: Keys.puntMakeupTemplateKeys,
    PartyProxy: Keys.partyKeys
  }

  // LIFE CYCLE
  static createFromFirestoreObject (obj) {
    // TODO: Check validity!
    return this.proxyHandler().generateProxy(obj)
  }

  /**
   *
   * @param {Object} obj
   * @param {*} proxyClass
   * @return {boolean}
   */
  static isValid (obj, proxyClass) {
    const keyObj = FirestoreObjectProxy.classKeyMap[proxyClass.name]
    var keysToCheck = [
      'id',
      ...Object.values(keyObj)
    ]

    var isValid = true
    keysToCheck.forEach(key => {
      if (!isValid) return
      isValid = isValid && (key in obj)
    })

    return isValid
  }

  // ABSTRACT
  /**
   * @return {ProxyHandler} proxyHandler for class ... TO BE SUBCLASSED
   */
  static proxyHandler () {
    throw new AbstractMethodNotImplementedError()
  }

  // HELPERS
  /**
   *
   * @param {firebase.firestore.Timestamp} timestamp
   */
  static dateForFirestoreTimestamp (timestamp) {
    return timestamp.toDate()
  }

  /**
   *
   * @param {Date} date
   * @return {firebase.firestore.Timestamp}
   */
  static firestoreTimestampForDate (date) {
    return firestore.Timestamp.fromDate(date)
  }
}

export class UserProxy extends FirestoreObjectProxy {
  static proxyHandler () {
    return ProxyHandler
      .new(UserProxy)
      .addString('courseNumber')
      .addString('email')
      .addString('facebookURL')
      .addString('firstName')
      .addString('givenName')
      .addString('lastName')
      .addString('phoneNumber')
      .addString('snapchatHandle')
      .addString('homeState')
      .addArray('interests')
      .addBoolean('isVerified')
      .addNumber('classYear')
      .addNumber('permissionSet')
      .addGetter({
        field: userProxyKeys.fullName,
        get: (target, proxy) => {
          return target[userKeys.firstName] + ' ' + target[userKeys.lastName]
          // return proxy.firstName + ' ' + proxy.lastName
        }
      })
      .addFunction({
        name: userProxyKeys.hasPermissions,
        body: (proxy, permissionSet) => {
          return comparePermissions(proxy.permissionSet, permissionSet)
        }
      })
      .addFunction({
        name: userProxyKeys.hasAllPermissions,
        body: (proxy, permissionSet) => {
          return containsAllPermission(proxy.permissionSet, permissionSet)
        }
      })
      .addName((target, proxy) => { return proxy.fullName })
  }
}

export class User extends FirestoreObject {
  // KEYED

  get courseNumber () {
    return this.object[userKeys.courseNumber]
  }

  get email () {
    return this.object[userKeys.email]
  }

  get facebookURL () {
    return this.object[userKeys.facebookURL]
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
    return this.object[userKeys.phoneNumber]
  }

  get interests () {
    return this.object[userKeys.interests]
  }

  get snapchatHandle () {
    return this.object[userKeys.snapchatHandle]
  }

  get homeState () {
    return this.object[userKeys.homeState]
  }

  get isVerified () {
    return this.object[userKeys.isVerified]
  }

  get classYear () {
    return this.object[userKeys.classYear]
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

export class DutyTemplateProxy extends FirestoreObjectProxy {
  static proxyHandler () {
    return ProxyHandler
      .new(DutyTemplateProxy)
      .addObject('schedule')
      .addString('name')
      .addString('description')
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

export class DutyProxy extends FirestoreObjectProxy {
  static proxyHandler () {
    return ProxyHandler
      .new(DutyProxy)
      .addDate('date')
      .addDate('checkTime')
      .addProxy('assignee', UserProxy)
      .addProxy('checker', UserProxy)
      .addProxy('template', DutyTemplateProxy)
      .addGetter({
        field: 'name',
        get: (target, proxy) => { return proxy.template.name }
      })
      .addGetter({
        field: 'assigneeName',
        get: (target, proxy) => { return proxy.assignee.fullName }
      })
      .addGetter({
        field: 'checkerName',
        get: (target, proxy) => { return proxy.checker.fullName }
      })
      .addGetter({
        field: 'status',
        get: (target, proxy) => {
          // if (this.object === null) {
          //   return DutyStatus.unavailable // TODO: Turn DutyStatus.unavailable to NULL (like PuntStatus)
          // }

          const isClaimed = proxy.assignee !== null
          const isCheckedOff = proxy.checkTime !== null

          if (store.state.dutiesStore.isDutySheetLive) {
            return isClaimed ? DutyStatus.claimed : DutyStatus.unclaimed
          }

          // TODO: Switch from compareAsc to isPast / isFuture / isSameDay
          const comparisonResult = compareAsc(proxy.date, TODAY())

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
      })
      .addGetter({
        field: 'statusString',
        get: (target, proxy) => {
          switch (proxy.status) {
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
      })
      .addFunction({
        name: 'isAssignedToCurrentUser',
        body: (proxy) => {
          return proxy.assignee ? proxy.assignee.id === store.state.currentUser.uid : false
        }
      })
  }
}

export class Duty extends FirestoreObject {
  // TODO: Pre-compute object properties (i.e. assignee User obj, etc) in constructor

  // KEYED

  get template () {
    return DutyTemplateProxy.createFromFirestoreObject(this.object[dutyKeys.template])
  }

  get assignee () {
    return this.object[dutyKeys.assignee]
      ? UserProxy.createFromFirestoreObject(this.object[dutyKeys.assignee])
      : null
  }

  get checker () {
    return this.object[dutyKeys.checker]
      ? UserProxy.createFromFirestoreObject(this.object[dutyKeys.checker])
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

export class PuntMakeupTemplateProxy extends FirestoreObjectProxy {
  static proxyHandler () {
    return ProxyHandler
      .new(PuntMakeupTemplateProxy)
      .addString('description')
      .addString('name')
      .addDate('date')
      .addName((target, proxy) => { return proxy.name })
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

  get dateString () {
    return format(this.date, 'MM/dd/yy')
  }
}

export class PuntMakeupProxy extends FirestoreObjectProxy {
  static proxyHandler () {
    return ProxyHandler
      .new(PuntMakeupProxy)
      .addDate('completionTime')
      .addProxy('assignee', UserProxy)
      .addProxy('template', PuntMakeupTemplateProxy)
      .addGetter({
        field: 'status',
        get: (target, proxy) => {
          return proxy.completionTime === null
            ? PuntMakeupStatus.NotCompleted
            : PuntMakeupStatus.Completed
        }
      })
      .addGetter({
        field: 'name',
        get: (target, proxy) => { return proxy.template.name }
      })
  }
}

export class PuntMakeup extends FirestoreObject {

  // KEYED

  get assignee () {
    return UserProxy.createFromFirestoreObject(this.object[puntMakeupKeys.assignee])
  }

  get completionTime () {
    return this.object[puntMakeupKeys.completionTime]
      ? FirestoreObject.dateForFirestoreTimestamp(this.object[puntMakeupKeys.completionTime])
      : null
  }

  // TODO: Rename to template
  get makeupTemplate () {
    return PuntMakeupTemplateProxy.createFromFirestoreObject(this.object[puntMakeupKeys.template])
  }

  // COMPUTED

  get status () {
    return this.completionTime === null
      ? PuntMakeupStatus.NotCompleted
      : PuntMakeupStatus.Completed
  }

  get name () {
    return this.makeupTemplate ? this.makeupTemplate.name : ''
  }

  get completionTimeString () {
    return this.completionTime ? this.completionTime.toDateString() : ''
  }
}

export class PuntProxy extends FirestoreObjectProxy {
  static proxyHandler () {
    return ProxyHandler.new(PuntProxy)
      .addString('reason')
      .addProxy('assignee', UserProxy)
      .addProxy('giver', UserProxy)
      .addProxy('makeUp', PuntMakeupProxy)
      .addDate('puntTime')
      .addGetter({
        field: puntProxyKeys.assigneeName,
        get: (target, proxy) => { return proxy.assignee.fullName }
      })
      .addGetter({
        field: puntProxyKeys.giverName,
        get: (target, proxy) => { return proxy.giver.fullName }
      })
      .addGetter({
        field: puntProxyKeys.status,
        get: (target, proxy) => {
          if (target[puntKeys.makeUp] === null) {
            return PuntStatus.Punted
          }

          return proxy.makeUp.status === PuntMakeupStatus.NotCompleted
            ? PuntStatus.MakeUpClaimed
            : PuntStatus.MadeUp
        }
      })
      .addGetter({
        field: puntProxyKeys.statusString,
        get: (target, proxy) => {
          switch (proxy.status) {
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
      })
      .addFunction({
        name: puntProxyKeys.isAssignedToCurrentUser,
        body: (proxy) => {
          return proxy.assignee ? proxy.assignee.id === store.state.currentUser.uid : false
        }
      })
      .addFunction({
        name: puntProxyKeys.isGivenByCurrentUser,
        body: (proxy) => {
          return proxy.assignee ? proxy.assignee.id === store.state.currentUser.uid : false
        }
      })
  }
}

export class Punt extends FirestoreObject {
  // KEYED

  get assignee () {
    return UserProxy.createFromFirestoreObject(this.object[puntKeys.assignee])
  }

  get giver () {
    return UserProxy.createFromFirestoreObject(this.object[puntKeys.giver])
  }

  get makeUp () {
    return this.object[puntKeys.makeUp]
      ? PuntMakeupProxy.createFromFirestoreObject(this.object[puntKeys.makeUp])
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

export class PartyProxy extends FirestoreObjectProxy {
  static proxyHandler () {
    return ProxyHandler
      .new(PartyProxy)
      .addNumber('capacity')
      .addString('name')
      .addString('theme')
      .addString('photoURL')
      .addBoolean('isActive')
      .addDate('startDate')
      .addDate('endDate')
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
    return this.object[partyKeys.photoURL]
  }

  get isActive () {
    return this.object[partyKeys.isActive]
  }

  get startDate () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[partyKeys.startDate])
  }

  get endDate () {
    return FirestoreObject.dateForFirestoreTimestamp(this.object[partyKeys.endDate])
  }

  // COMPUTED

  get startDateString () {
    return format(this.startDate, 'MM/dd/yy @ p')
  }

  get endDateString () {
    return format(this.endDate, 'MM/dd/yy @ p')
  }
}

// TODO: Use fromUnixTimestamp for creation of firestore dates
//
