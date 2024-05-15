import fse from 'fs-extra'
import { pathToFileURL } from 'url'
import formatter from './formatter.js'
import loadFiles from '../../../utils/loadFiles.js'
import { find } from '@sumor/config'

import sumorText from './sumorObjects/text.js'
import sumorType from './sumorObjects/type.js'
import sumorRange from './sumorObjects/range/index.js'
import getSumorApi from './sumorObjects/api.js'
import findFiles from '../../../utils/findFiles.js'
import parseFileName from '../../../utils/parseFileName.js'

export default async (context) => {
  const sumorApi = getSumorApi(context)
  const sumorApiInfo = {}
  for (const i in sumorApi) {
    sumorApiInfo[i] = {
      name: sumorApi[i].name,
      parameters: sumorApi[i].parameters
    }
  }
  const categories = ['text', 'rule', 'type', 'entity', 'view', 'api', 'event']
  const meta = {
    range: sumorRange,
    text: sumorText,
    type: sumorType,
    api: sumorApiInfo
  }
  for (const category of categories) {
    let type = category
    meta[category] = meta[category] || {}
    if (category === 'api' || category === 'event') {
      type = 'program'
    }
    let files = await find(`${context.root}/${category}`, type)
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

  await fse.ensureDir(`${process.cwd()}/tmp`)
  await fse.writeFile(`${process.cwd()}/tmp/meta.json`, JSON.stringify(meta, null, 4))

  // 获取对象文件
  for (const i in sumorApi) {
    meta.api[i] = sumorApi[i]
  }
  const viewSql = await loadFiles(`${context.root}/view`, 'view', 'sql')
  for (const i in viewSql) {
    meta.view[i] = formatter.view(meta.view[i])
    meta.view[i] = Object.assign(meta.view[i], viewSql[i])
  }

  // 获取api程序对象文件
  const apiRootPath = `${context.root}/api`
  if (await fse.exists(apiRootPath)) {
    const programList = await findFiles('**/**.js', { cwd: apiRootPath })
    for (const item of programList) {
      const itemPath = parseFileName(item)
      const route = `api.${itemPath.path}`
      const filePath = `${apiRootPath}/${item}`
      meta.api[route] = meta.api[route] || {}
      meta.api[route].program = (await import(pathToFileURL(filePath))).default
    }
  }
  // 获取event程序对象文件
  const eventRootPath = `${context.root}/event`
  if (await fse.exists(eventRootPath)) {
    const programList = await findFiles('**/**.js', { cwd: eventRootPath })
    for (const item of programList) {
      const itemPath = parseFileName(item)
      const route = itemPath.path
      const filePath = `${eventRootPath}/${item}`
      meta.event[route] = meta.event[route] || {}
      meta.event[route].program = async (context) => {
        context.logger.trace(`正在执行事件${route}`)
        let newContext = { ...context }
        let standaloneDB
        if (!context.db) {
          standaloneDB = await context.connectDB()
          newContext = Object.assign(newContext, { db: standaloneDB })
        }
        const program = (await import(pathToFileURL(filePath))).default
        if (program) {
          try {
            await program(newContext || context)
            if (standaloneDB) { await standaloneDB.commit() }
            context.logger.debug(`事件${route}完成`)
          } catch (e) {
            if (standaloneDB) { await standaloneDB.rollback() }
            context.logger.error(`事件${route}执行失败，${e.message}`)
            context.logger.trace(e)
          }
        } else {
          context.logger.error(`事件${route}执行失败，该程序不存在`)
        }
      }
    }
  }

  context.setContext({ meta })
}
