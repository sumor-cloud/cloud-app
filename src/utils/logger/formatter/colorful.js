// import chalk from 'chalk';
import { Chalk } from 'chalk'

const chalk = new Chalk({})

const colors = {
  trace: '#00a3af',
  debug: '#1183d3',
  info: '#2ecc71',
  warn: '#f39c12',
  error: '#b91f12',
  fatal: '#ff1300'
}

const colorMethods = {
  trace: 'gray',
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  fatal: 'red'
}

const getFormattedTime = (time, offset) => {
  // format yyyy-mm-dd hh:mm:ss.SSS
  const date = new Date(time + offset * 60 * 1000)
  const year = date.getUTCFullYear()
  const month = (`0${date.getUTCMonth() + 1}`).slice(-2)
  const day = (`0${date.getUTCDate()}`).slice(-2)
  const hours = (`0${date.getUTCHours()}`).slice(-2)
  const minutes = (`0${date.getUTCMinutes()}`).slice(-2)
  const seconds = (`0${date.getUTCSeconds()}`).slice(-2)
  const milliseconds = (`00${date.getUTCMilliseconds()}`).slice(-3)
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
}
export default ({
  time, offset, level, scope, id, message
}) => {
  const timeStr = getFormattedTime(time, offset || 0)
  const idStr = id ? ` ${id}` : ''
  const prefix = `${timeStr} ${level.toUpperCase()} ${scope.toUpperCase()}${idStr} - `
  let prefixStr
  switch (chalk.level) {
    case 1:
      prefixStr = chalk[colorMethods[level.toLowerCase()]](prefix)
      break
    case 2:
      prefixStr = chalk.hex(colors[level.toLowerCase()]).visible(prefix)
      break
    case 3:
      prefixStr = chalk.hex(colors[level.toLowerCase()]).visible(prefix)
      break
    default:
      prefixStr = prefix
      break
  }
  return prefixStr + message
}
