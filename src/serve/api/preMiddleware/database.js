export default async app => {
  app.use(async (req, res, next) => {
    req.db = await app.connectDB(req.client.id)
    next()
  })
}
