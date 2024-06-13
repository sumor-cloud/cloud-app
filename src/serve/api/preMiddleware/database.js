export default async app => {
  app.use(async (req, res, next) => {
    req.connectDB = async () => {
      return await app.connectDB(req.client.id)
    }
    req.db = await req.connectDB()
    next()
  })
}
