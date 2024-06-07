import libRoot from '../../../../root.js'
import { meta } from '@sumor/config'
import { pathToFileURL } from 'url'

export default async root => {
  const api = {}

  const apiMeta = await meta(`${root}/api`, ['js'])
  const sumorApiMeta = await meta(`${libRoot}/template/api`, ['js'])

  const convert = async (source, target, prefix) => {
    for (const path in source) {
      const id = path.replace(/\//g, '.')
      const filePath = source[path].js
      let program = await import(pathToFileURL(filePath))
      if (program.default) {
        program = program.default
      }
      source[path].program = program
      target[prefix + id] = source[path]
    }
  }
  await convert(apiMeta, api, 'api.')
  await convert(sumorApiMeta, api, '')

  return api
}
