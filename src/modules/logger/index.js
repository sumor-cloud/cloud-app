import formatPrefix from './formatPrefix.js'
import colorful from './colorful.js'

export default class Logger {
  constructor (options) {
    options = options || {}
    const scope = options.scope
    const level = (options.level || 'info').toLowerCase()
    const id = options.id
    let offset = options.offset
    if (options.offset === undefined) {
      offset = -new Date().getTimezoneOffset()
    }
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
        this[type] = function () {
          const time = Date.now()

          const prefix = formatPrefix({
            time,
            offset,
            level: type,
            scope,
            id
          })
          const colorfulPrefix = colorful(level, prefix)

          const logArray = [colorfulPrefix]
          for (let j = 0; j < arguments.length; j += 1) {
            logArray.push(arguments[j])
          }
          console.log.apply(console, logArray)

          try {
            let logStr = ''
            for (const item of logArray) {
              if (typeof item === 'string') {
                logStr += item
              } else {
                logStr += JSON.stringify(item)
              }
            }
            return logStr
          } catch (e) {
            return undefined
          }
        }
      }
    }
  }
}
