import fs from 'fs'
import Logger from '../../utils/logger/index.js'

export default async (context) => {
  const logPath = `${context.root}/tmp/main.log`
  const saver = (message) => {
    fs.appendFileSync(logPath, message)
  }
  return (scope, id) => new Logger({
    scope,
    level: context.config.logLevel,
    id,
    saver
  })
}
