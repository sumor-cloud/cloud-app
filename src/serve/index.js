import loadConfig from '../config/loadConfig.js'
import apiHandler from './api/index.js'
import logger from './i18n/appLogger.js'
import createApp from '@sumor/ssl-server'
import tokenMiddleware from '@sumor/token-middleware'

export default async debug => {
  const config = await loadConfig(process.cwd())
  if (debug) {
    config.mode = 'development'
  }
  logger.code('SUMOR_APP_LOGGER_LEVEL', {
    level: config.logLevel.toUpperCase()
  })
  logger.code('SUMOR_APP_CONFIG_INFO', {
    config: JSON.stringify(config, null, 4)
  })
  logger.code('SUMOR_APP_ORIGIN_LANGUAGE', { language: config.language })

  const app = createApp()
  app.logger = logger
  app.config = config

  app.use((req, res, next) => {
    req.config = config
    next()
  })

  app.use(tokenMiddleware)

  await apiHandler(app)

  logger.code('SUMOR_APP_API_MIDDLEWARE_LOADED')

  const close = await app.listen(config.port)

  logger.code('SUMOR_APP_RUNNING', { origin: config.origin })

  return close
}
