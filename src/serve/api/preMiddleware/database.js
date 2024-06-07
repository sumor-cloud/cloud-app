export default async app => {
  app.use(async (req, res, next) => {
    console.log('req.sumor.loggerId', req.sumor.loggerId)
    req.sumor.db = await req.sumor.connectDB(req.sumor.loggerId)
    next()
  })
}
