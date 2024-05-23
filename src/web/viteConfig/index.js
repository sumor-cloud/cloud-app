import vuePlugin from '@vitejs/plugin-vue'
import fse from 'fs-extra'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import customStyle from './customStyle/index.js'
import { pathToFileURL } from 'url'

export default async ({ config, port }) => {
  let viteConfig = {}
  if (await fse.exists(process.cwd() + '/vite.config.js')) {
    viteConfig = (await import(pathToFileURL(process.cwd() + '/vite.config.js'))).default
  }

  const styleVars = config.styleVars
  const css = customStyle(styleVars)

  await fse.remove(process.cwd() + '/tmp/web/.vite')
  await fse.ensureDir(process.cwd() + '/tmp/web/.vite')

  viteConfig = Object.assign(
    {
      root: process.cwd() + '/tmp/web',
      base: '/',
      publicDir: process.cwd() + '/web/public',
      cacheDir: process.cwd() + '/tmp/web/.vite'
    },
    viteConfig
  )
  if (port) {
    viteConfig.server = Object.assign({}, viteConfig.server, {
      server: { middlewareMode: 'html' },
      port
    })
  }
  viteConfig.plugins = [pluginRewriteAll(), vuePlugin()].concat(viteConfig.plugins)
  viteConfig.css = Object.assign({}, viteConfig.css, css)
  viteConfig.build = Object.assign({}, viteConfig.build)
  viteConfig.resolve = Object.assign(
    {
      extensions: ['.vue', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    viteConfig.resolve
  )

  return viteConfig
}
