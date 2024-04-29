let requestSequence = 0

export default (app) => {
  app.use((req, res, next) => {
    const current = ++requestSequence

    req.sumor.ip = req.headers['x-forwarded-for'] || '0.0.0.0'
    req.sumor.getLogger = (scope) => app.sumor.getLogger(scope, current)

    req.sumor.logger = req.sumor.getLogger('PROGRAM')

    const logger = req.sumor.getLogger('HTTP')
    const agent = req.headers['user-agent'] || 'unknown agent'
    logger.info(`${req.method} ${req.originalUrl} IP/${req.sumor.ip} ${agent}`)

    next()
  })
}
