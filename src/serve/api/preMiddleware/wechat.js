import WeChat from '../modules/wechat/index.js'
import getCache from '../modules/cache/index.js'

export default async app => {
  if (app.config.wechat) {
    app.logger.debug('微信服务器正在启动')
    let cache
    if (app.config.wechat.cache) {
      const Cache = await getCache(app.config.wechat.cache, app.logger)
      cache = Cache(app.logger)
    } else {
      cache = app.cache
    }
    app.logger.trace(`微信服务器配置信息 ${JSON.stringify(app.config.wechat)}`)
    app.wechat = new WeChat(app.config.wechat, cache, app.logger)
    await app.wechat.init(app)
    app.logger.debug('微信服务器已启动')

    app.use((req, res, next) => {
      req.wechat = new WeChat(app.config.wechat, req.logger)
      next()
    })
  }
}
