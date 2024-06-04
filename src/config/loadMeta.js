import { find, findReference } from '@sumor/config'
import formatter from './formatter.js'
import { pathToFileURL } from 'url'
import libRoot from '../../root.js'

export default async root => {
  const meta = {}
  const categories = ['api', 'event']
  for (const category of categories) {
    let type = category
    meta[category] = meta[category] || {}
    if (category === 'api' || category === 'event') {
      type = 'program'
    }
    let files = await find(`${root}/${category}`, type)
    // change files key's slash to point
    const newFiles = {}
    for (const i in files) {
      newFiles[i.replace(/\//g, '.')] = files[i]
    }
    files = newFiles

    if (category === 'api') {
      const newFiles = {}
      for (const i in files) {
        newFiles[`api.${i}`] = files[i]
      }
      files = newFiles
    }
    meta[category] = Object.assign(meta[category], files)
    if (formatter[type]) {
      for (const name in meta[category]) {
        meta[category][name] = formatter[type](meta[category][name], meta, name)
      }
    }
  }

  const loadApis = async (root, prefix = '') => {
    const apiMeta = await findReference(root, ['js'])
    for (const path in apiMeta) {
      apiMeta[path] = apiMeta[path] || {}
      const item = apiMeta[path]
      const route = path.replace(/\//g, '.')
      const filePath = `${root}/${path}.js`
      item.program = (await import(pathToFileURL(filePath))).default
      meta.api[`${prefix}${route}`] = item
    }
  }

  // 获取api程序对象文件
  await loadApis(`${root}/api`, 'api.')

  // 获取sumor api程序对象文件
  await loadApis(`${libRoot}/template/api`)

  // 获取event程序对象文件
  const eventRootPath = `${root}/event`
  const eventMeta = await findReference(eventRootPath, ['js'])
  for (const path in eventMeta) {
    eventMeta[path] = eventMeta[path] || {}
    const item = eventMeta[path]
    const route = path.replace(/\//g, '.')
    const filePath = `${eventRootPath}/${path}.js`
    const eventProgram = (await import(pathToFileURL(filePath))).default
    item.program = async context => {
      context.logger.trace(`正在执行事件${route}`)
      let newContext = { ...context }
      let standaloneDB
      if (!context.db) {
        standaloneDB = await context.connectDB()
        newContext = Object.assign(newContext, { db: standaloneDB })
      }
      try {
        await eventProgram(newContext || context)
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
    meta.event[path] = item
  }
  return meta
}
