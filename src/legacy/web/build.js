import generate from './generate/index.js'
import { build, defineConfig } from 'vite'
import getViteConfig from './viteConfig/index.js'
import loadConfig from '../../src/config/loadConfig.js'
import Logger from '@sumor/logger'

export default async () => {
  const config = await loadConfig(process.cwd())
  const logger = new Logger({
    scope: 'BUILD',
    level: config.logLevel
  })
  logger.info('开始生成生产代码')

  await generate(config, true)

  // 构建客户端
  const viteClientConfig = await getViteConfig({
    config
  })
  viteClientConfig.build.ssrManifest = true
  viteClientConfig.build.outDir = '../../output/client'
  viteClientConfig.build.emptyOutDir = true
  await build(defineConfig(viteClientConfig))

  // 构建服务端
  const viteServerConfig = await getViteConfig({
    config
  })
  viteServerConfig.build.ssr = 'src/entry-server.js'
  viteServerConfig.build.outDir = '../../output/server'
  viteServerConfig.build.emptyOutDir = true
  await build(defineConfig(viteServerConfig))

  logger.info('生产代码生成完毕')
}
