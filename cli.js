#!/usr/bin/env node
import { Command } from 'commander'
import fse from 'fs-extra'

import root from './root.js'
import cmdCover from './src/utils/cmdCover.js'
import setup from './src/setup.js'
import dev from './src/dev.js'
import build from './src/build.js'
import serve from './src/serve/index.js'

const program = new Command()

const pkgInfo = await fse.readJson(`${root}/package.json`)
const version = pkgInfo.version || '0.0.0'
cmdCover(version)

program.name('sumor').version(version || '0.0.0', '-v, --version')

program
  .command('dev')
  .description('开发')
  .action(async () => {
    await dev()
    await serve(true)
  })

program
  .command('build')
  .description('打包')
  .action(async () => {
    await build()
  })

program
  .command('setup')
  .description('安装')
  .action(async () => {
    await setup()
  })
program
  .command('preview')
  .description('试运行')
  .action(async () => {
    await build()
    await serve()
  })
program
  .command('run')
  .description('运行')
  .action(async () => {
    await serve()
  })

program.parse(process.argv)
