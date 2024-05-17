import path from 'path'
import { glob } from 'glob'

export default async (condition, options) => {
  options = options || {}
  let files = await glob(condition, options)
  files = files.map(file => {
    file = path.normalize(file)
    file = file.replace(/\\/g, '/')
    return file
  })
  return files
}
