import express from 'express'
import preMiddleware from './preMiddleware/index.js'
import handler from './handler/index.js'
import postMiddleware from './postMiddleware/index.js'
import listen from './listen/index.js'

export default async (context) => {
  const app = express()
  app.disable('x-powered-by')

  app.sumor = context
  app.sumor.app = app
  app.use((req, res, next) => {
    req.sumor = context.getContext()
    req.sumor.ssrContext = {
      pageInfo: {
        title: '',
        description: '',
        keywords: ''
      }
    }
    req.sumor.cors = false
    next()
  })

  await preMiddleware(app)

  app.use((req, res, next) => {
    req.sumor.logger.trace(`会话交互对象: ${Object.keys(req.sumor).join(', ')}`)
    next()
  })

  app.sumor.logger.debug('前置中间件加载完成')

  if (app.sumor.meta.event.setup) {
    await app.sumor.meta.event.setup.program(app.sumor)
  }

  if (app.sumor.meta.event.prepare) {
    await app.sumor.meta.event.prepare.program(app.sumor)
  }

  await handler(app)

  app.sumor.logger.debug('处理程序加载完成')

  if (app.sumor.meta.event.serve) {
    await app.sumor.meta.event.serve.program(app.sumor)
  }

  await postMiddleware(app)

  app.sumor.logger.debug('后置中间件加载完成')

  await listen(app)

  if (app.sumor.meta.event.served) {
    await app.sumor.meta.event.served.program(app.sumor)
  }

  app.sumor.logger.info(`应用已运行在 ${app.sumor.origin}`)

  if (app.sumor.mode === 'production') {
    process.on('uncaughtException', (err) => {
      app.sumor.logger.error('未捕捉错误')
      app.sumor.logger.error(err)
    })
  }
}
