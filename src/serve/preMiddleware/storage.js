import Storage from '../../modules/storage/index.js'

export default async app => {
  app.sumor.storage = new Storage(app.sumor.config.storage)
  app.use((req, res, next) => {
    req.sumor.storage = new Storage(app.sumor.config.storage)
    next()
  })
}
