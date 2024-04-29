import fse from 'fs-extra'
import { build, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import npmToCamelCase from './npmToCamelCase.js'

export default async (options) => {
  const globals = {
    // "vue": "Vue"
  }
  const external = Object.keys(options.pkg.dependencies || {})
  for (let i = 0; i < external.length; i += 1) {
    globals[external[i]] = npmToCamelCase(external[i])
  }
  const name = npmToCamelCase(options.pkg.name) || 'MyLib'
  const config = {
    mode: options.mode,
    root: process.cwd(),
    base: '/',
    plugins: [],
    build: {
      emptyOutDir: false,
      sourcemap: options.mode === 'development' ? 'inline' : false,
      outDir: options.output,
      lib: {
        entry: options.entry,
        name
        // fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external,
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals
        }
      }
    }
  }

  config.build.lib.fileName = (format) => `index.${format}.js`
  config.plugins.push(vue())
  await build(defineConfig(config))

  await fse.move(path.join(options.output, './index.umd.js'), path.join(options.output, './index.umd.cjs'))
}
