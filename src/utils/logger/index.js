import stringfy from './formatter/stringfy.js'
import colorful from './formatter/colorful.js'
import parse from './formatter/parse.js'
import i18nParser from './i18n/parse.js'

export default class Logger {
  constructor (options) {
    options = options || {}
    const scope = options.scope || 'MAIN'
    const level = (options.level || 'trace').toLowerCase()
    const id = options.id || ''
    const saver = options.saver || function () {}
    const types = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
    const getElementsSinceElement = (arr, ele) => {
      const index = arr.indexOf(ele)
      return index === -1 ? [] : arr.slice(index)
    }
    const displayedLevels = getElementsSinceElement(types, level)
    for (let i = 0; i < types.length; i += 1) {
      const type = types[i]
      if (displayedLevels.indexOf(type) === -1) {
        this[type] = function () {}
      } else {
        this[type] = function (message, data) {
          const time = Date.now()
          saver(`${stringfy(time, type, scope, id, message, data)}\n`)
          let i18nMessage = message
          if (options.i18n && options.i18n[message]) {
            i18nMessage = i18nParser(options.i18n[message], data)
          }
          const offset = options.offset !== undefined
            ? options.offset
            : -new Date().getTimezoneOffset()
          console.log(colorful({
            time,
            offset,
            level: type,
            scope,
            id,
            message: i18nMessage
          }))
        }
      }
    }
    this.load = (history) => {
      const list = parse(history)
      let result = ''
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i]
        const { message, data } = item
        let i18nMessage = message
        if (options.i18n && options.i18n[message]) {
          i18nMessage = i18nParser(options.i18n[message], data)
        }
        result += `${colorful({
          ...item,
          offset: options.offset || new Date().getTimezoneOffset(),
          message: i18nMessage
        })}\n`
      }
      return result
    }
  }
}
