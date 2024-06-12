import Logger from '@sumor/logger'

let requestSequence = 0

export default app => {
  app.use((req, res, next) => {
    req.sumor.loggerId = ++requestSequence

    req.sumor.ip = req.headers['x-forwarded-for'] || '0.0.0.0'

    req.sumor.logger = new Logger({
      scope: 'PROGRAM',
      id: req.sumor.loggerId
    })

    const httpLogger = new Logger({
      scope: 'HTTP',
      id: req.sumor.loggerId
    })
    const agent = req.headers['user-agent'] || 'unknown agent'
    httpLogger.info(`${req.method} ${req.originalUrl} IP/${req.sumor.ip} ${agent}`)

    next()
  })
}
