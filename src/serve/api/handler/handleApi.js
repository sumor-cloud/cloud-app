import loadApi from '../../middleware/load.js'
import bodyParser from '../../middleware/middleware/bodyParser.js'
import checkData from '../../middleware/checkData.js'
import fileClearUp from '../../middleware/middleware/fileClearUp.js'
import clientEnv from '../../middleware/middleware/clientEnv.js'
import errorCatcher from '../../middleware/errorCatcher.js'
import Response from './Response.js'
import errorMiddleware from '../../middleware/error/errorMiddleware.js'

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

    let middlewares = bodyParser(apisMeta[path].parameters)

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
      await options.prepare(req, res)

      req.sumor.logger = req.logger
      req.sumor.data = checkData(req.data, apisMeta[path].parameters)
      const result = await apisMeta[path].program(req.sumor, req, res)
      req.sumor.response.data = result || req.sumor.response.data

      await options.finalize(req, res)
      next()
    })

    middlewares.push(fileClearUp)

    middlewares.push((req, res, next) => {
      req.sumor.response.send()
    })

    middlewares = middlewares.map(errorCatcher)

    middlewares.push(async (error, req, res, next) => {
      error.language = req.client.language
      req.logger.trace(error)
      await options.exception(req, res)

      next(error, req, res, next)
    })
    middlewares.push(errorMiddleware)

    app.all(apisMeta[path].route, ...middlewares)
  }
}
