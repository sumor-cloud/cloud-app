export default app => {
  app.use((req, res, next) => {
    req.sumor.timezone = req.get('sumor-timezone') // parseInt(req.get("sumor-timezone") || "0", 10);
    next()
  })
}
