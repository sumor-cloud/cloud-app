import { meta } from '@sumor/config'
import { pathToFileURL } from 'url'

export default async root => {
  const event = {}

  const eventMeta = await meta(`${root}/event`, ['js'])

  for (const path in eventMeta) {
    const id = path.replace(/\//g, '.')
    const filePath = eventMeta[path].js
    let programFunc = await import(pathToFileURL(filePath))
    if (programFunc.default) {
      programFunc = programFunc.default
    }
    event[id] = eventMeta[path]
    event[id].program = async (context, req, res) => {
      context.logger.trace(`正在执行事件${id}`)
      let newContext = { ...context }
      let standaloneDB
      if (!context.db) {
        standaloneDB = await context.connectDB()
        newContext = Object.assign(newContext, { db: standaloneDB })
      }
      try {
        await programFunc(newContext || context, req, res)
        if (standaloneDB) {
          await standaloneDB.commit()
        }
        context.logger.debug(`事件${id}完成`)
      } catch (e) {
        if (standaloneDB) {
          await standaloneDB.rollback()
        }
        context.logger.error(`事件${id}执行失败，${e.message}`)
        context.logger.trace(e)
      }
    }
  }

  return event
}
