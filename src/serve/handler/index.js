import listenApis from './listenApis.js'
import checkData from './checkData.js'

export default async app => {
  // 暴露接口
  const apiPaths = Object.keys(app.program.api)
  apiPaths.sort((x, y) => (x > y ? 1 : -1))
  for (const path of apiPaths) {
    const apiInfo = app.program.api[path]
    const route = `/${path.replace(/\./g, '/')}`
    const callback = async function (req, res, next) {
      req.sumor.cors = true

      // req.sumor.response.changed = true

      if (app.program.event.context) {
        await app.program.event.context.app.program(req.sumor, req, res)
      }

      try {
        req.sumor.data = checkData(req.sumor.data, apiInfo)
        const result = await apiInfo.program(req.sumor, req, res)
        req.sumor.response.data = result || req.sumor.response.data
        await req.sumor.db.commit()
      } catch (e) {
        try {
          await req.sumor.db.rollback()
        } catch (e) {
          // todo raise error for db connection
        }
        req.sumor.logger.trace(e)
        e.language = req.sumor.language
        req.sumor.response.error(e)
      }

      next()
    }

    const hasFile = listenApis(path, apiInfo, app, callback)

    app.logger.info(`接口已就绪：${route}${hasFile ? ' (允许文件上传)' : ''}`)
  }
  app.logger.info('所有接口已就绪')
}
