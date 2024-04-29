import prepareContext from './prepareContext.js'
import tools from '../modules/tools/index.js'
import prepareConfig from './prepareConfig.js'
import prepareHttp from './prepareHttp.js'
import prepareLogger from './prepareLogger.js'
import prepareDatabase from './prepareDatabase.js'
import load from '../modules/meta/load.js'

export default async (options) => {
  const context = prepareContext(options)

  // 获取配置信息
  const config = await prepareConfig(context)
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
  const getLogger = await prepareLogger(context)
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

  return context
}
