import listenApis from './listenApis.js'
import checkData from './checkData.js'

export default async (app) => {
  // 暴露接口
  const apiPaths = Object.keys(app.sumor.meta.api)
  apiPaths.sort((x, y) => (x > y ? 1 : -1))
  for (const path of apiPaths) {
    const route = `/${path.replace(/\./g, '/')}`
    const callback = async function (req, res, next) {
      req.sumor.meta = app.sumor.meta
      req.sumor.cors = true

      req.sumor.response.changed = true

      if (app.sumor.meta.event.context) {
        await app.sumor.meta.event.context.program(req.sumor, req, res)
      }

      try {
        const meta = app.sumor.meta.api[path]
        req.sumor.data = checkData(req.sumor.data, meta)
        const result = await meta.program(req.sumor, req, res)
        req.sumor.response.data = result || req.sumor.response.data
        await req.sumor.db.commit()
      } catch (e) {
        try {
          await req.sumor.db.rollback()
        } catch (e) {
          // todo raise error for db connection
        }
        req.sumor.response.error(e.message)
        let message = ''
        if (e instanceof Error) {
          message = app.sumor.text(e.message)
        }
        req.sumor.logger.debug(`外部请求出错：${e.message} ${message}`)
        req.sumor.logger.trace(e)
      }

      next()
    }

    const hasFile = listenApis(path, app, callback)

    app.sumor.exposeApis[route] = {
      name: app.sumor.meta.api[path].name || '',
      desc: app.sumor.meta.api[path].desc || '',
      parameters: app.sumor.meta.api[path].parameters || {}
    }
    app.logger.info(`接口已就绪：${route}${hasFile ? ' (允许文件上传)' : ''}`)
  }
  app.logger.info('所有接口已就绪')
}
