import { Command } from 'commander'
import fse from 'fs-extra'
import cmdCover from '../utils/cmdCover.js'
import root from '../../root.js'

// entry
import app from '../app/index.js'
import build from './build.js'

export default async () => {
  const program = new Command()

  const pkgInfo = await fse.readJson(`${root}/package.json`)
  const version = pkgInfo.version || '0.0.0'
  cmdCover(version)

  program
    .name('sumor')
    .version(version || '0.0.0', '-v, --version')

  program
    .command('dev')
    .description('开发')
    .action(async () => {
      await app({ mode: 'dev' })
    })

  program
    .command('build')
    .description('打包依赖库')
    .option('-d, --debug', '调试模式')
    .option('-t, --type [name]', '构建环境，app、vue、node')
    .action(async (options) => {
      await build(options)
    })

  program
    .command('setup')
    .description('安装')
    .action(async () => {
      await app({ mode: 'setup' })
    })
  program
    .command('preview')
    .description('试运行')
    .action(async () => {
      await app({ mode: 'preview' })
    })
  program
    .command('run')
    .description('运行')
    .action(async () => {
      await app({ mode: 'run' })
    })

  program.parse(process.argv)
}
