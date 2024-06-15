import { meta } from '@sumor/config'
import { pathToFileURL } from 'url'
import Logger from '@sumor/logger'

export default async root => {
  const logger = new Logger()
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
      logger.debug(`正在执行事件${id}`)
      try {
        const result = await programFunc(context, req, res)
        logger.debug(`事件${id}完成`)
        return result
      } catch (e) {
        logger.error(`事件${id}执行失败，${e.message}`)
        logger.debug(e)
      }
    }
  }

  return name => {
    if (event[name]) {
      return event[name].program
    } else {
      return () => {}
    }
  }
}
