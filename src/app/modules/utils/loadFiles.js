import fse from 'fs-extra'
import findFiles from './findFiles.js'
import parseFileName from './parseFileName.js'

export default async (path, type, suffix) => {
  const files = {}
  if (await fse.exists(path)) {
    const condition = type ? `**/**.${type}.json` : '**/**.json'
    const jsonList = await findFiles({
      condition,
      options: { cwd: path }
    })
    for (const item of jsonList) {
      const filePath = `${path}/${item}`
      const itemPath = parseFileName(item)
      files[itemPath.path] = await fse.readJson(filePath)
    }

    if (suffix && suffix !== 'json') {
      const condition = type ? `**/**.${type}.${suffix}` : `**/**.${suffix}`
      const suffixList = await findFiles({
        condition,
        options: { cwd: path }
      })
      for (const item of suffixList) {
        const filePath = `${path}/${item}`
        const itemPath = parseFileName(item)
        files[itemPath.path] = files[itemPath.path] || {}
        files[itemPath.path][itemPath.suffix] = await fse.readFile(filePath, 'utf-8')
      }
    }
  }
  return files
}
