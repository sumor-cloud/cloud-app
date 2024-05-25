import createApp from '@sumor/ssl-server'
import preMiddleware from './preMiddleware/index.js'
import handler from './handler/index.js'
import postMiddleware from './postMiddleware/index.js'
import prepare from './prepare/index.js'
import addDatabase from './addDatabase.js'
import loadConfig from '../context/loadConfig.js'
import appLogger from '../../src/i18n/appLogger.js'

export default async debug => {
  const app = createApp()

  // Fetch config and logger
  const config = await loadConfig(process.cwd())
  const logger = appLogger(config.logLevel, config.language)
  logger.code('SUMOR_APP_LOGGER_LEVEL', { level: config.logLevel.toUpperCase() })
  logger.code('SUMOR_APP_CONFIG_INFO', { config: JSON.stringify(config, null, 4) })

  // Fetch runtime
  const runtime = await prepare({ debug, config })
  logger.code('SUMOR_APP_DEFAULT_LANGUAGE', { language: runtime.language })
  logger.code('SUMOR_APP_RUNTIME_OBJECTS', { keys: Object.keys(runtime).join(', ') })

  // Add database
  if (runtime.config.database) {
    await addDatabase(runtime)
  }

  app.logger = logger
  app.sumor = runtime
  app.sumor.app = app
  app.use((req, res, next) => {
    req.sumor = runtime.getContext()
    req.sumor.ssrContext = {
      pageInfo: {
        title: '',
        description: '',
        keywords: ''
      }
    }
    req.sumor.cors = false
    next()
  })

  await preMiddleware(app)

  app.use((req, res, next) => {
    req.sumor.logger.trace(`会话交互对象: ${Object.keys(req.sumor).join(', ')}`)
    next()
  })

  logger.debug('前置中间件加载完成')

  if (app.sumor.meta.event.setup) {
    await app.sumor.meta.event.setup.program(app.sumor)
  }

  await handler(app)

  logger.debug('处理程序加载完成')

  if (app.sumor.meta.event.serve) {
    await app.sumor.meta.event.serve.program(app.sumor)
  }

  await postMiddleware(app)

  logger.debug('后置中间件加载完成')

  app.sumor.close = await app.listen(app.sumor.port)

  logger.info(`应用已运行在 ${app.sumor.origin}`)

  logger.info('对外服务启动完成')
}
