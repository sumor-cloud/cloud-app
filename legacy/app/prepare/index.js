import prepareContext from './prepareContext.js'
import tools from '../modules/tools/index.js'
import loadConfig from '../../../src/context/loadConfig.js'
import prepareHttp from './prepareHttp.js'
import prepareDatabase from './prepareDatabase.js'
import load from './meta/load.js'
import Logger from '@sumor/logger'

export default async options => {
  const context = prepareContext(options)

  // 获取配置信息
  const config = await loadConfig(process.cwd())
  context.setContext({
    tools,
    config
  })

  // 准备基础参数
  const name = config.name || '轻呈云应用'
  const logLevel = (config.logLevel || 'info').toLowerCase()
  const language = config.language || 'zh-CN'
  const httpParams = await prepareHttp(context)
  const exposeApis = {}
  context.setContext({
    name,
    logLevel,
    language,
    ...httpParams,
    exposeApis
  })

  // 准备额外参数
  const getLogger = (scope, id) =>
    new Logger({
      scope,
      level: context.config.logLevel,
      id
    })
  const logger = getLogger('APP')

  context.setContext({
    getLogger,
    logger
  })

  if (context.config.database) {
    const connectDB = await prepareDatabase(context)
    context.setContext({
      connectDB
    })
  }

  // 加载接口
  await load(context)

  context.logger.info(`日志记录级别：${context.logLevel.toUpperCase()}`)
  context.logger.trace(`全局交互对象: ${Object.keys(context).join(', ')}`)
  context.logger.trace(`配置信息: ${JSON.stringify(context.config, null, 4)}`)

  return context
}
