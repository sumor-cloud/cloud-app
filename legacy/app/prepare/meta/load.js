import fse from 'fs-extra'
import { pathToFileURL } from 'url'

import findFiles from '../../../utils/findFiles.js'
import parseFileName from '../../../utils/parseFileName.js'
import loadMeta from '../../../../src/context/loadMeta.js'

export default async context => {
  const meta = await loadMeta(context.root)

  // 获取event程序对象文件
  const eventRootPath = `${context.root}/event`
  if (await fse.exists(eventRootPath)) {
    const programList = await findFiles('**/**.js', { cwd: eventRootPath })
    for (const item of programList) {
      const itemPath = parseFileName(item)
      const route = itemPath.path
      const filePath = `${eventRootPath}/${item}`
      meta.event[route] = meta.event[route] || {}
      meta.event[route].program = async context => {
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
        } else {
          context.logger.error(`事件${route}执行失败，该程序不存在`)
        }
      }
    }
  }

  context.setContext({ meta })
}
