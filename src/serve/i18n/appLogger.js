import Logger from '@sumor/logger'

// original code is en
const code = {
  trace: {
    SUMOR_APP_CONFIG_INFO: 'Configuration information: {config}'
  },
  debug: {
    SUMOR_APP_API_MIDDLEWARE_LOADED: 'API middleware loaded'
  },
  info: {
    SUMOR_APP_ORIGIN_LANGUAGE: 'Application Origin Language: {language}',
    SUMOR_APP_LOGGER_LEVEL: 'Log level: {level}',
    SUMOR_APP_RUNNING: 'Application is running at {origin}'
  },
  warn: {},
  error: {}
}

// languages: zh, es, ar, fr, ru, de, pt, ja, ko
const i18n = {
  zh: {
    SUMOR_APP_ORIGIN_LANGUAGE: '应用原始语言：{language}',
    SUMOR_APP_LOGGER_LEVEL: '日志记录级别：{level}',
    SUMOR_APP_CONFIG_INFO: '配置信息：{config}',
    SUMOR_APP_API_MIDDLEWARE_LOADED: 'API 中间件已加载',
    SUMOR_APP_RUNNING: '应用正在运行于 {origin}'
  }
}
export default new Logger({
  scope: 'APP',
  code,
  i18n
})
