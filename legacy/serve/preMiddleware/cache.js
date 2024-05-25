import getCache from '../../modules/cache/index.js'

export default async app => {
  const config = app.sumor.config.cache || {}
  const logger = app.sumor.getLogger('CACHE')
  const cache = await getCache(config, logger)

  app.sumor.cache = cache(logger)

  app.use(async (req, res, next) => {
    const logger = req.sumor.getLogger('CACHE')
    req.sumor.cache = cache(logger)
    next()
  })
}
