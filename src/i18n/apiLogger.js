import Logger from '@sumor/logger'

// original code is en
const code = {
  trace: {},
  debug: {},
  info: {},
  warn: {},
  error: {}
}

// languages: zh, es, ar, fr, ru, de, pt, ja, ko
const i18n = {
  zh: {}
}
export default (level, language) =>
  new Logger({
    scope: 'API',
    level,
    language,
    code,
    i18n
  })
