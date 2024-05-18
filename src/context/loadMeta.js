import { find } from '@sumor/config'
import formatter from '../../legacy/app/prepare/meta/formatter.js'
import loadFiles from '../../legacy/utils/loadFiles.js'

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
  return meta
}
