import loadApi from '../../middleware/load.js'
import bodyParser from '../../middleware/middleware/bodyParser.js'
import checkData from '../../middleware/checkData.js'
import fileClearUp from '../../middleware/middleware/fileClearUp.js'
import clientEnv from '../../middleware/middleware/clientEnv.js'
import Response from './Response.js'

const exposeApis = {}

export default async (app, path, options) => {
  options = options || {}
  options.prepare = options.prepare || function () {}
  options.finalize = options.finalize || function () {}
  options.exception = options.exception || function () {}

  const apisMeta = await loadApi(path, options.prefix)

  for (const path in apisMeta) {
    // add exposeApi to global object
    exposeApis[apisMeta[path].route] = {
      name: apisMeta[path].name,
      desc: apisMeta[path].desc,
      parameters: apisMeta[path].parameters
    }

    const middlewares = bodyParser(apisMeta[path].parameters)

    middlewares.push(clientEnv)

    middlewares.push((req, res, next) => {
      req.sumor.response = new Response(req, res)
      next()
    })

    middlewares.push(async function (req, res, next) {
      req.exposeApis = exposeApis
      next()
    })

    middlewares.push(async function (req, res, next) {
      try {
        await options.prepare(req, res)

        req.sumor.logger = req.logger
        req.sumor.data = checkData(req.data, apisMeta[path].parameters)
        const result = await apisMeta[path].program(req.sumor, req, res)
        req.sumor.response.data = result || req.sumor.response.data

        await options.finalize(req, res)
      } catch (e) {
        await options.exception(req, res)

        req.logger.trace('API error: ', e)
        e.language = req.client.language
        req.sumor.response.error(e)
      }
      next()
    })

    middlewares.push(fileClearUp)

    middlewares.push((req, res, next) => {
      if (req.sumor.response.respond) {
        req.sumor.response.end()
      } else if (req.sumor.response.changed) {
        req.sumor.response.send()
      } else {
        next()
      }
    })

    app.all(apisMeta[path].route, ...middlewares)
  }
}
