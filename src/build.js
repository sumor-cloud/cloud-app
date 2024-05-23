import getWebViteConfig from './web/index.js'
import generate from './web/generate/index.js'
import { build, defineConfig } from 'vite'
import prepare from './context/index.js'

export default async options => {
  const context = await prepare(options)
  context.logger.info('开始生成生产代码')

  await generate(context, true)

  // 构建客户端
  const viteClientConfig = await getWebViteConfig(context)
  viteClientConfig.build.ssrManifest = true
  viteClientConfig.build.outDir = '../../output/web/client'
  viteClientConfig.build.emptyOutDir = true
  await build(defineConfig(viteClientConfig))

  // 构建服务端
  const viteServerConfig = await getWebViteConfig(context)
  viteServerConfig.build.ssr = 'src/entry-server.js'
  viteServerConfig.build.outDir = '../../output/web/server'
  viteServerConfig.build.emptyOutDir = true
  await build(defineConfig(viteServerConfig))

  context.logger.info('生产代码生成完毕')
}
