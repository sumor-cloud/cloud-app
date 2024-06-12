import preMiddleware from './preMiddleware/index.js'
import postMiddleware from './postMiddleware/index.js'
import addDatabase from './addDatabase.js'
import logger from '../i18n/appLogger.js'
import getRuntime from './getRuntime.js'
import loadEvent from './loadEvent.js'
import ssrLoader from './ssrLoader.js'
import handleApi from './handler/handleApi.js'
import libRoot from '../../../root.js'

export default async (config, app) => {
  config.root = config.root || process.cwd()

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
  await ssrLoader(app)

  await preMiddleware(app)

  logger.debug('前置中间件加载完成')

  const prepare = async (req, res) => {
    await app.event('context')(req.sumor, req, res)
  }
  const finalize = async (req, res) => {
    await req.sumor.db.commit()
  }
  const exception = async (req, res) => {
    try {
      await req.sumor.db.rollback()
    } catch (e) {
      req.logger.error('数据库回滚失败', e)
    }
  }

  await handleApi(app, `${app.sumor.config.root}/api`, {
    prefix: '/api',
    prepare,
    finalize,
    exception
  })
  await handleApi(app, `${libRoot}/template/api`, { prepare, finalize, exception })
  app.logger.info('所有接口已就绪')

  logger.debug('处理程序加载完成')

  await app.event('serve')(app.sumor)

  await postMiddleware(app)
}
