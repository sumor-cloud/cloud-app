import preMiddleware from './preMiddleware/index.js'
import handler from './handler/index.js'
import postMiddleware from './postMiddleware/index.js'
import Logger from '@sumor/logger'
import addDatabase from './addDatabase.js'
import apiLogger from './i18n/apiMiddlewareLogger.js'
import getRuntime from './getRuntime.js'
import loadEvent from './loadEvent.js'

export default async (config, app) => {
  config.root = config.root || process.cwd()
  const logger = apiLogger(config.logLevel, config.language)

  // Fetch runtime
  const runtime = getRuntime()

  // Prepare runtime context
  runtime.setContext({
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

  // Add database
  if (runtime.config.database) {
    await addDatabase(runtime)
  }

  app.event = await loadEvent(config.root)
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
    next()
  })

  await preMiddleware(app)

  app.use((req, res, next) => {
    req.sumor.logger.trace(`会话交互对象: ${Object.keys(req.sumor).join(', ')}`)
    next()
  })

  logger.debug('前置中间件加载完成')

  if (app.event.setup) {
    await app.event.setup.program(app.sumor)
  }

  await handler(app)

  logger.debug('处理程序加载完成')

  if (app.event.serve) {
    await app.event.serve.program(app.sumor)
  }

  await postMiddleware(app)
}