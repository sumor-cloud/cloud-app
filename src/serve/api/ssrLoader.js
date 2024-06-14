import { meta } from '@sumor/config'
import database from '@sumor/database'
import bodyParser from './bodyParser.js'
import { pathToFileURL } from 'url'

export default async app => {
  const ssrMeta = await meta(`${process.cwd()}/ssr`, ['js'])

  for (const metaName in ssrMeta) {
    const metaInfo = ssrMeta[metaName]
    for (const route of metaInfo.routes) {
      app.get(route, bodyParser())
      app.get(route, async function (req, res, next) {
        const client = await database.client(app.config.database)
        const context = {
          data: req.data,
          db: await client.connect()
        }
        let program
        try {
          program = await import(pathToFileURL(metaInfo.js))
          program = program.default
        } catch (e) {
          app.logger.error('ssr file load failed', e)
        }
        if (program) {
          req.ssrContext.data = await program(context, req, res)
        }
        next()
      })
    }
  }
}
