import libRoot from '../../root.js'
import { meta } from '@sumor/config'
import { pathToFileURL } from 'url'

export default async root => {
  const api = {}
  const event = {}

  const apiMeta = await meta(`${root}/api`, ['js'])
  const sumorApiMeta = await meta(`${libRoot}/template/api`, ['js'])
  const eventMeta = await meta(`${root}/event`, ['js'])

  const convert = async (source, target, prefix) => {
    for (const path in source) {
      const id = path.replace(/\//g, '.')
      const filePath = source[path].js
      let program = await import(pathToFileURL(filePath))
      if (program.default) {
        program = program.default
      }
      source[path].program = program
      target[prefix + id] = source[path]
    }
  }
  await convert(apiMeta, api, 'api.')
  await convert(sumorApiMeta, api, '')
  await convert(eventMeta, event, '')

  for (const route in event) {
    const programFunc = event[route].program
    event[route].program = async (context, req, res) => {
      context.logger.trace(`正在执行事件${route}`)
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
        context.logger.debug(`事件${route}完成`)
      } catch (e) {
        if (standaloneDB) {
          await standaloneDB.rollback()
        }
        context.logger.error(`事件${route}执行失败，${e.message}`)
        context.logger.trace(e)
      }
    }
  }

  return { api, event }
}
