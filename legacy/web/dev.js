import chokidar from 'chokidar'

import singleThreadCaller from './singleThreadCaller.js'
import generate from './generate/index.js'
import { createServer, defineConfig } from 'vite'
import getViteConfig from './viteConfig/index.js'
import loadConfig from '../context/loadConfig.js'
import Logger from '@sumor/logger'

export default async options => {
  const config = await loadConfig(process.cwd())
  const logger = new Logger({
    scope: 'DEV',
    level: config.logLevel
  })
  logger.info('开始准备开发环境')

  const watch = singleThreadCaller(async force => {
    await generate(config, force)
    logger.info('代码已更新')
  })

  await watch(true)
  const watcher = chokidar.watch('.', {
    // ignore folders /tmp and /node_modules
    cwd: `${process.cwd()}/web`,
    ignored:
      /(^|[/\\])(tmp|node_modules|\.git|\.nuxt|\.idea|\.vscode|\.cache|\.sass-cache|\.DS_Store|\.env)/,
    persistent: true
  })
  watcher.on('all', async (event, path) => {
    await watch()
  })

  const viteConfig = await getViteConfig({
    config,
    port: config.port + 1
  })
  const viteDevServer = await createServer(defineConfig(viteConfig))
  await viteDevServer.listen()
  viteDevServer.printUrls()

  logger.info('开发环境准备完成')
}
