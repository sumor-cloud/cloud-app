export default async app => {
  app.use(async (req, res, next) => {
    const logger = req.sumor.getLogger('DATABASE')
    req.sumor.db = await req.sumor.connectDB(logger)
    next()
  })
}
