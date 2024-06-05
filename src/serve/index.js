import createApp from '@sumor/ssl-server'
import preMiddleware from './preMiddleware/index.js'
import handler from './handler/index.js'
import postMiddleware from './postMiddleware/index.js'
import Logger from '@sumor/logger'
import addDatabase from './addDatabase.js'
import loadConfig from '../config/loadConfig.js'
import appLogger from '../i18n/appLogger.js'
import getRuntime from './getRuntime.js'
import tools from '../modules/tools/index.js'
import loadProgram from './loadProgram.js'

export default async debug => {
  // Fetch config and logger
  const config = await loadConfig(process.cwd())
  const logger = appLogger(config.logLevel, config.language)
  logger.code('SUMOR_APP_LOGGER_LEVEL', { level: config.logLevel.toUpperCase() })
  logger.code('SUMOR_APP_CONFIG_INFO', { config: JSON.stringify(config, null, 4) })

  // Fetch runtime
  const runtime = getRuntime()
  runtime.root = process.cwd()

  // Prepare runtime context
  runtime.setContext({
    mode: debug ? 'development' : 'production',
    tools,
    config,
    name: config.name,
    logLevel: config.logLevel,
    language: config.language,
    domain: config.domain,
    port: config.port,
    origin: config.origin
  })

  // 准备额外参数
  const getLogger = (scope, id) =>
    new Logger({
      scope,
      level: runtime.config.logLevel,
      language: runtime.config.language,
      id
    })

  runtime.setContext({
    getLogger,
    logger: getLogger('RUNTIME')
  })
  logger.code('SUMOR_APP_ORIGIN_LANGUAGE', { language: runtime.language })
  logger.code('SUMOR_APP_RUNTIME_OBJECTS', { keys: Object.keys(runtime).join(', ') })

  // Add database
  if (runtime.config.database) {
    await addDatabase(runtime)
  }

  const app = createApp()
  app.logger = logger
  app.program = await loadProgram(process.cwd())
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

  if (app.program.event.setup) {
    await app.program.event.setup.program(app.sumor)
  }

  await handler(app)

  logger.debug('处理程序加载完成')

  if (app.program.event.serve) {
    await app.program.event.serve.program(app.sumor)
  }

  await postMiddleware(app)

  logger.debug('后置中间件加载完成')

  app.sumor.close = await app.listen(app.sumor.port)

  logger.info(`应用已运行在 ${app.sumor.origin}`)

  logger.info('对外服务启动完成')
}
