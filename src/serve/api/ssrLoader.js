import { meta } from '@sumor/config'
import database from '@sumor/database'
import bodyParser from '../middleware/middleware/bodyParser.js'

export default async app => {
  const ssrMeta = await meta(`${process.cwd()}/ssr`, ['js'])

  for (const metaName in ssrMeta) {
    const metaInfo = ssrMeta[metaName]
    for (const route of metaInfo.routes) {
      app.get(route, bodyParser())
      app.get(route, async function (req, res, next) {
        const client = await database.client(app.sumor.config.database)
        const context = {
          data: req.data,
          db: await client.connect()
        }
        const program = await import(metaInfo.js)
        req.sumor.ssrContext.data = await program.default(context, req, res)
        next()
      })
    }
  }
}
