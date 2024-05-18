import SMS from '../../modules/sms/index.js'

export default async app => {
  if (app.sumor.config.sms) {
    const logger = app.sumor.getLogger('SMS')
    app.sumor.sms = new SMS(app.sumor.config.sms, logger)
  }
  app.use((req, res, next) => {
    if (app.sumor.config.sms) {
      const logger = req.sumor.getLogger('SMS')
      req.sumor.sms = new SMS(app.sumor.config.sms, logger)
    }
    next()
  })
}
