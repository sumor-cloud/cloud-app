import chokidar from 'chokidar'

import singleThreadCaller from './utils/singleThreadCaller.js'

import getWebConfig from './web/index.js'
import generate from './web/generate/index.js'

import { createServer, defineConfig } from 'vite'
import prepare from './context/index.js'

export default async options => {
  const context = await prepare(options)
  context.logger.info('开始准备开发环境')

  const { getLogger, root } = context
  const logger = getLogger('DEV')

  const watch = singleThreadCaller(async force => {
    await generate(context, force)
    logger.info('代码已更新')
  })

  await watch(true)
  const watcher = chokidar.watch('.', {
    // ignore folders /tmp and /node_modules
    cwd: `${root}/web`,
    ignored:
      /(^|[/\\])(tmp|node_modules|\.git|\.nuxt|\.idea|\.vscode|\.cache|\.sass-cache|\.DS_Store|\.env)/,
    persistent: true
  })
  watcher.on('all', async (event, path) => {
    await watch()
  })

  const viteConfig = await getWebConfig(context)
  const viteDevServer = await createServer(defineConfig(viteConfig))
  await viteDevServer.listen()
  viteDevServer.printUrls()

  context.logger.info('开发环境准备完成')
}
