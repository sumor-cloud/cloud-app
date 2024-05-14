import load from './load.js'
import convert from './convert.js'
import find from './find.js'

const loadWithConvert = async (root, name, type) => {
  root = root || process.cwd()

  const config = await load(root, name) || {}
  if (type) {
    await convert(root, name, type)
  }

  return config
}

const findWithConvert = async (root, category, type) => {
  root = root || process.cwd()
  const files = await find(root, category)
  const configs = {}
  for (const file of files) {
    configs[file] = await loadWithConvert(root, file, type)
  }
  return configs
}

export default {
  load: loadWithConvert,
  find: findWithConvert
}
