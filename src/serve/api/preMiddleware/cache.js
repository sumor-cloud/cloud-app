import getCache from '../modules/cache/index.js'

export default async app => {
  const config = app.config.cache || {}
  const cache = await getCache(config)

  app.cache = cache()

  app.use(async (req, res, next) => {
    req.cache = cache(req.client.id)
    next()
  })
}
