import Logger from '@sumor/logger'

// original code is en
const code = {
  trace: {
    SUMOR_APP_RUNTIME_OBJECTS: 'Runtime objects: {keys}',
    SUMOR_APP_CONFIG_INFO: 'Configuration information: {config}'
  },
  debug: {},
  info: {
    SUMOR_APP_ORIGIN_LANGUAGE: 'Application Origin Language: {language}',
    SUMOR_APP_LOGGER_LEVEL: 'Log level: {level}'
  },
  warn: {},
  error: {}
}

// languages: zh, es, ar, fr, ru, de, pt, ja, ko
const i18n = {
  zh: {
    SUMOR_APP_ORIGIN_LANGUAGE: '应用原始语言：{language}',
    SUMOR_APP_LOGGER_LEVEL: '日志记录级别：{level}',
    SUMOR_APP_RUNTIME_OBJECTS: '运行时对象：{keys}',
    SUMOR_APP_CONFIG_INFO: '配置信息：{config}'
  }
}
export default (level, language) =>
  new Logger({
    scope: 'APP',
    level,
    language,
    code,
    i18n
  })
