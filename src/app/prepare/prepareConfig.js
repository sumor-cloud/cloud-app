import loadConfig from '../utils/loadConfig.js'

export default async (context) => {
  const staticConfigPath = `${context.root}/sumor`
  const staticConfig = await loadConfig(staticConfigPath, context.mode === 'production')

  const configPath = `${context.root}/config/config`
  const config = await loadConfig(configPath, context.mode === 'production')

  return { ...staticConfig, ...config }
}
