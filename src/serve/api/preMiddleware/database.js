export default async app => {
  app.use(async (req, res, next) => {
    req.sumor.db = await req.sumor.connectDB(req.client.id)
    next()
  })
}
