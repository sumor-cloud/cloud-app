import loadApi from '../../middleware/load.js'
import bodyParser from '../../middleware/middleware/bodyParser.js'
import checkData from '../../middleware/checkData.js'

const exposeApis = {}

export default async (app, path, options) => {
  options = options || {}
  options.prepare = options.prepare || function () {}

  const apisMeta = await loadApi(path, options.prefix)

  for (const path in apisMeta) {
    exposeApis[apisMeta[path].route] = {
      name: apisMeta[path].name,
      desc: apisMeta[path].desc,
      parameters: apisMeta[path].parameters
    }

    app.all(apisMeta[path].route, bodyParser(apisMeta[path].parameters), (req, res, next) => {
      req.sumor.data = req.data
      next()
    })

    app.all(apisMeta[path].route, async function (req, res, next) {
      req.exposeApis = exposeApis

      await options.prepare(req, res)

      try {
        req.sumor.data = checkData(req.sumor.data, apisMeta[path])
        const result = await apisMeta[path].program(req.sumor, req, res)
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
    })
  }
}
