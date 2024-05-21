import { find, findReference } from '@sumor/config'
import formatter from '../../legacy/app/prepare/meta/formatter.js'
import loadFiles from '../../legacy/utils/loadFiles.js'
import { pathToFileURL } from 'url'
import libRoot from '../../root.js'

export default async root => {
  const meta = {}
  const categories = ['text', 'rule', 'type', 'entity', 'view', 'api', 'event']
  for (const category of categories) {
    let type = category
    meta[category] = meta[category] || {}
    if (category === 'api' || category === 'event') {
      type = 'program'
    }
    let files = await find(`${root}/${category}`, type)
    // change files key's slash to point
    const newFiles = {}
    for (const i in files) {
      newFiles[i.replace(/\//g, '.')] = files[i]
    }
    files = newFiles

    if (category === 'api') {
      const newFiles = {}
      for (const i in files) {
        newFiles[`api.${i}`] = files[i]
      }
      files = newFiles
    }
    meta[category] = Object.assign(meta[category], files)
    if (formatter[type]) {
      for (const name in meta[category]) {
        meta[category][name] = formatter[type](meta[category][name], meta, name)
      }
    }
  }

  const viewSql = await loadFiles(`${root}/view`, 'view', 'sql')
  for (const i in viewSql) {
    meta.view[i] = formatter.view(meta.view[i])
    meta.view[i] = Object.assign(meta.view[i], viewSql[i])
  }

  // // 获取api程序对象文件
  // const apiRootPath = `${root}/api`
  // if (await fse.exists(apiRootPath)) {
  //   const programList = await findFiles('**/**.js', { cwd: apiRootPath })
  //   for (const item of programList) {
  //     const itemPath = parseFileName(item)
  //     const route = `api.${itemPath.path}`
  //     const filePath = `${apiRootPath}/${item}`
  //     meta.api[route] = meta.api[route] || {}
  //     meta.api[route].program = (await import(pathToFileURL(filePath))).default
  //   }
  // }

  const loadApis = async (root, prefix = '') => {
    const apiMeta = await findReference(root, ['js'])
    for (const path in apiMeta) {
      apiMeta[path] = apiMeta[path] || {}
      const item = apiMeta[path]
      const filePath = `${root}/${path}.js`
      item.program = (await import(pathToFileURL(filePath))).default
      meta.api[`${prefix}${path.replace(/\//g, '.')}`] = item
    }
  }
  // 获取api程序对象文件
  await loadApis(`${root}/api`, 'api.')
  // 获取sumor api程序对象文件
  await loadApis(`${libRoot}/template/api`)

  return meta
}
