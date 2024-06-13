import preMiddleware from './preMiddleware/index.js'
import postMiddleware from './postMiddleware/index.js'
import addDatabase from './addDatabase.js'
import logger from '../i18n/appLogger.js'
import loadEvent from './loadEvent.js'
import ssrLoader from './ssrLoader.js'
import handleApi from '../middleware/index.js'
import libRoot from '../../../root.js'

export default async app => {
  // Add database
  if (app.config.database) {
    await addDatabase(app)
  }

  app.event = await loadEvent(app.config.root)
  app.use((req, res, next) => {
    req.ssrContext = {
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
    await app.event('context')(req, res)
  }
  const finalize = async (req, res) => {
    await req.db.commit()
  }
  const exception = async (req, res) => {
    try {
      await req.db.rollback()
    } catch (e) {
      req.logger.error('数据库回滚失败', e)
    }
  }

  await handleApi(app, `${app.config.root}/api`, {
    prefix: '/api',
    prepare,
    finalize,
    exception
  })
  await handleApi(app, `${libRoot}/template/api`, { prepare, finalize, exception })
  app.logger.info('所有接口已就绪')

  logger.debug('处理程序加载完成')

  await app.event('serve')(app)

  await postMiddleware(app)
}
