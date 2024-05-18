export default async app => {
  app.sumor.range = name => {
    if (name) {
      return app.sumor.meta.range[name]
    }
    return app.sumor.meta.range
  }
  app.use((req, res, next) => {
    req.sumor.range = app.sumor.range
    next()
  })
}
