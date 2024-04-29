import Storage from '../../modules/storage/index.js'

export default async (app) => {
  const logger = app.sumor.getLogger('STORAGE')
  app.sumor.storage = new Storage(app.sumor.config.storage, logger)
  app.use((req, res, next) => {
    const logger = req.sumor.getLogger('STORAGE')
    req.sumor.storage = new Storage(app.sumor.config.storage, logger)
    next()
  })
}
