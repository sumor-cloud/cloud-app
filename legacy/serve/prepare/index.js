import Logger from '@sumor/logger'
import getRuntime from '../../../src/runtime/getRuntime.js'
import tools from '../../modules/tools/index.js'
import loadMeta from '../../context/loadMeta.js'

export default async ({ debug, config }) => {
  const runtime = getRuntime()
  runtime.root = process.cwd()

  // 准备基础参数
  const exposeApis = {}
  runtime.setContext({
    mode: debug ? 'development' : 'production',
    tools,
    config,
    exposeApis,
    name: config.name,
    logLevel: config.logLevel,
    language: config.language,
    domain: config.domain,
    port: config.port,
    origin: config.origin
  })

  // 准备额外参数
  const getLogger = (scope, id) =>
    new Logger({
      scope,
      level: runtime.config.logLevel,
      language: runtime.config.language,
      id
    })
  const logger = getLogger('RUNTIME')

  runtime.setContext({
    getLogger,
    logger
  })

  // 加载接口
  const meta = await loadMeta(runtime.root)
  runtime.setContext({ meta })

  return runtime
}
