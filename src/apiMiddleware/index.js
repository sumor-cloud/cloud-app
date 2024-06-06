import preMiddleware from './preMiddleware/index.js'
import handler from './handler/index.js'
import postMiddleware from './postMiddleware/index.js'
import Logger from '@sumor/logger'
import addDatabase from './addDatabase.js'
import apiLogger from './i18n/apiMiddlewareLogger.js'
import getRuntime from './getRuntime.js'
import loadProgram from './loadProgram.js'

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

  app.program = await loadProgram(config.root)
  app.sumor = runtime
  app.sumor.app = app
  app.use((req, res, next) => {
    const exposeApis = {}
    const apiPaths = Object.keys(app.program.api)
    for (const path of apiPaths) {
      const apiData = app.program.api[path]
      if (apiData) {
        const route = `/${path.replace(/\./g, '/')}`
        exposeApis[route] = {
          name: apiData.name || '',
          desc: apiData.desc || '',
          parameters: apiData.parameters || {}
        }
      }
    }
    req.exposeApis = exposeApis

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
}
