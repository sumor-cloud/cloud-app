import checkData from '../../middleware/checkData.js'
import libRoot from '../../../../root.js'
import loadApi from '../../middleware/load.js'
import exposeApi from '../../middleware/middleware/exposeApi.js'
import bodyParser from '../../middleware/middleware/bodyParser.js'

export default async app => {
  const customApi = await loadApi(`${app.sumor.config.root}/api`, '/api')
  const sumorApi = await loadApi(`${libRoot}/template/api`)
  const apisMeta = Object.assign({}, customApi, sumorApi)

  for (const path in apisMeta) {
    const callback = async function (req, res, next) {
      await app.event('context')(req.sumor, req, res)

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
    }

    const uploadParameters = []
    for (const i in apisMeta[path].parameters) {
      if (apisMeta[path].parameters[i].type === 'file') {
        uploadParameters.push({ name: i })
      }
    }

    app.all(apisMeta[path].route, bodyParser(uploadParameters), (req, res, next) => {
      req.sumor.data = req.data
      next()
    })
    app.all(apisMeta[path].route, exposeApi(apisMeta), callback)
  }
  app.logger.info('所有接口已就绪')
}
