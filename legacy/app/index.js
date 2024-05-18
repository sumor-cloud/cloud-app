import dev from './entry/dev.js'
import prepare from './prepare/index.js'
import serve from './serve/index.js'
import build from './entry/build.js'

export default async options => {
  options = options || {}

  const context = await prepare(options)

  if (context.mode === 'development') {
    context.logger.info('开始准备开发环境')
    await dev(context)
    context.logger.info('开发环境准备完成')
  }

  if (context.mode === 'build') {
    context.logger.info('开始生成生产代码')
    await build(context)
    context.logger.info('生产代码生成完毕')
  }

  if (context.mode === 'development' || context.mode === 'production') {
    context.logger.info('开始启动对外服务')
    await serve(context)
    context.logger.info('对外服务启动完成')
  }
}
