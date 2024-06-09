import listenApis from './listenApis.js'
import checkData from '../../middleware/checkData.js'
import libRoot from '../../../../root.js'
import loadApi from '../../middleware/load.js'
import exposeApi from '../../middleware/middleware/exposeApi.js'

export default async app => {
  const customApi = await loadApi(`${app.sumor.config.root}/api`)
  const sumorApi = await loadApi(`${libRoot}/template/api`)

  // add api. prefix to custom api
  const customApiResult = {}
  for (const i in customApi) {
    customApiResult[`api.${i}`] = customApi[i]
  }

  const apisMeta = Object.assign({}, customApi, sumorApi)

  // 暴露接口
  const apiPaths = Object.keys(apisMeta)

  for (const path of apiPaths) {
    const apiInfo = apisMeta[path]
    const callback = async function (req, res, next) {
      await app.event('context')(req.sumor, req, res)

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

    listenApis(apiInfo, app, [exposeApi(apisMeta), callback])
  }
  app.logger.info('所有接口已就绪')
}
