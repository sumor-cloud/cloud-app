export default app => {
  app.use((req, res, next) => {
    if (req.sumor.cors) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'X-Requested-With')
      res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    }
    next()
  })
}
