export default (app) => {
  app.use((req, res, next) => {
    req.sumor.saveCookie()
    if (req.sumor.response.respond) {
      req.sumor.response.end()
    } else if (req.sumor.response.changed) {
      req.sumor.response.send()
    } else {
      next()
    }
  })
}
