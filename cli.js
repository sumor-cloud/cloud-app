#!/usr/bin/env node
import { Command } from 'commander'
import fse from 'fs-extra'

import root from './root.js'
import cmdCover from './src/legacy/utils/cmdCover.js'
import setup from './src/legacy/setup.js'
import webServe from './src/legacy/web/dev.js'
import webBuild from './src/legacy/web/build.js'
import serve from './src/legacy/serve/index.js'

const program = new Command()

const pkgInfo = await fse.readJson(`${root}/package.json`)
const version = pkgInfo.version || '0.0.0'
cmdCover(version)

program.name('sumor').version(version || '0.0.0', '-v, --version')

program
  .command('dev')
  .description('开发')
  .action(async () => {
    await webServe()
    await serve(true)
  })

program
  .command('build')
  .description('打包')
  .action(async () => {
    await webBuild()
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
    await webBuild()
    await serve()
  })
program
  .command('run')
  .description('运行')
  .action(async () => {
    await serve()
  })

program.parse(process.argv)
