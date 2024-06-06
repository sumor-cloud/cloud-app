import loadConfig from './config/loadConfig.js'
import apiMiddleware from './serve/index.js'

export default async debug => {
  const config = await loadConfig(process.cwd())
  await apiMiddleware(config, debug)
}
