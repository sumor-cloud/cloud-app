import getCache from '../../modules/cache/index.js'

export default async app => {
  const config = app.sumor.config.cache || {}
  const cache = await getCache(config)

  app.sumor.cache = cache()

  app.use(async (req, res, next) => {
    req.sumor.cache = cache(req.sumor.loggerId)
    next()
  })
}
