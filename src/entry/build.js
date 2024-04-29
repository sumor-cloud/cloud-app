import pack from '../pack/index.js'
import app from '../app/index.js'

export default async (options) => {
  const debug = !!options.debug
  const type = options.type || 'app'
  const mode = debug ? 'development' : 'production'

  switch (type) {
    case 'vue':
      await pack({
        mode
      })
      break
    case 'node':
      await pack({
        mode,
        node: true
      })
      break
    default:
      await app({
        mode: 'build'
      })
      break
  }
}
