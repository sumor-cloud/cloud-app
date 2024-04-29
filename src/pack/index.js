import fse from 'fs-extra'
import path from 'node:path'
import preparePkg from './preparePkg.js'
import viteBuild from './viteBuild.js'
import esBuild from './esBuild.js'

export default async (options) => {
  const root = options.root || process.cwd()
  const entry = options.entry || path.resolve(root, './src/index.js')
  const mode = options.mode || 'production'
  const output = options.output || path.resolve(root, './output', `./${mode}`)
  const node = !!options.node

  await fse.remove(output)
  await fse.ensureDir(output)

  if (await fse.exists(`${root}/static`)) {
    await fse.copy(`${root}/static`, output)
  }

  const pkg = await fse.readJson(`${root}/package.json`)

  if (node) {
    await esBuild({
      mode,
      entry,
      output,
      pkg
    })
  } else {
    await viteBuild({
      mode,
      entry,
      output,
      pkg
    })
  }

  const outputPkg = await preparePkg(pkg, node)
  await fse.ensureFile(`${output}/package.json`)
  await fse.writeFile(`${output}/package.json`, JSON.stringify(outputPkg, null, 4))

  return {
    name: pkg.name
  }
}
