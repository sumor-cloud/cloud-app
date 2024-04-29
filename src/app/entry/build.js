import getWebViteConfig from '../web/index.js'
import generate from '../web/generate/index.js'
import { build, defineConfig } from 'vite'

export default async (context) => {
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

  // const buildWebClient = 'vite build --ssrManifest --outDir ../../output/web/client --config tmp/web/vite.config.js --emptyOutDir';
  // const buildWebServer = 'vite build --ssr src/entry-server.js --outDir ../../output/web/server --config tmp/web/vite.config.js --emptyOutDir';
  //
  // await execSync(buildWebClient, {
  //   stdio: 'inherit',
  // });
  // await execSync(buildWebServer, {
  //   stdio: 'inherit',
  // });

  // await execSync("cd ./output && npm install --production", {
  //     stdio: 'inherit'
  // });
}
