import getCache from '../modules/cache/index.js'

export default async app => {
  if (app.config.cache) {
    const cache = await getCache(app.config.cache)

    app.cache = cache()

    app.use(async (req, res, next) => {
      req.cache = cache(req.client.id)
      next()
    })
  }
}
