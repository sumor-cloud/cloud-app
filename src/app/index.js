import dev from './entry/dev.js'
import prepare from './prepare/index.js'
import serve from './serve/index.js'
import build from './entry/build.js'
import setup from './entry/setup.js'

export default async (options) => {
  options = options || {}

  const context = await prepare(options)
  context.logger.info(`日志记录级别：${context.logLevel.toUpperCase()}`)
  context.logger.info(`运行模式：${context.mode.toUpperCase()}`)
  context.logger.trace(`全局交互对象: ${Object.keys(context).join(', ')}`)
  context.logger.trace(`配置信息: ${JSON.stringify(context.config, null, 4)}`)

  if (context.mode === 'development') {
    context.logger.info('开始准备开发环境')
    await dev(context)
    context.logger.info('开发环境准备完成')
  }
  if (context.mode === 'build' ||
        context.mode === 'preview') {
    context.logger.info('开始生成生产代码')
    await build(context)
    context.logger.info('生产代码生成完毕')
  }
  if (context.mode === 'setup') {
    context.logger.info('开始部署数据库')
    await setup(context)
    context.logger.info('部署数据库完成')
  }
  if (context.mode === 'development' ||
        context.mode === 'preview' ||
        context.mode === 'production') {
    context.logger.info('开始启动对外服务')
    await serve(context)
    context.logger.info('对外服务启动完成')
  }
}
