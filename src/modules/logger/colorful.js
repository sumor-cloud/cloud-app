import { Chalk } from 'chalk'

export default (level, text, colors) => {
  const config = {}
  if (process.env.loggerColorLevel) {
    config.level = parseInt(process.env.loggerColorLevel, 10)
  } else {
    // auto detect color level
  }
  const chalk = new Chalk(config)

  colors = colors || {
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

  level = level.toLowerCase()
  const colorKeys = Object.keys(colors)
  if (!colorKeys.includes(level)) {
    level = 'info'
  }

  let result
  switch (chalk.level) {
    case 1:
      result = chalk[colorMethods[level]](text)
      break
    case 2:
      result = chalk.hex(colors[level]).visible(text)
      break
    case 3:
      result = chalk.hex(colors[level]).visible(text)
      break
    default:
      result = text
      break
  }
  return result
}
