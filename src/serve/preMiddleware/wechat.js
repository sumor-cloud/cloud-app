import WeChat from '../../modules/wechat/index.js'
import getCache from '../../modules/cache/index.js'

export default async app => {
  if (app.sumor.config.wechat) {
    const logger = app.sumor.getLogger('WECHAT')
    logger.debug('微信服务器正在启动')
    let cache
    if (app.sumor.config.wechat.cache) {
      const Cache = await getCache(app.sumor.config.wechat.cache, logger)
      cache = Cache(logger)
    } else {
      cache = app.sumor.cache
    }
    logger.trace(`微信服务器配置信息 ${JSON.stringify(app.sumor.config.wechat)}`)
    app.sumor.wechat = new WeChat(app.sumor.config.wechat, cache, logger)
    await app.sumor.wechat.init(app)
    logger.debug('微信服务器已启动')

    app.use((req, res, next) => {
      const sessionLogger = req.sumor.getLogger('WECHAT')
      req.sumor.wechat = new WeChat(app.sumor.config.wechat, sessionLogger)
      next()
    })
  }
}
