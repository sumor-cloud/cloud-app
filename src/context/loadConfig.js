import { load } from '@sumor/config'

export default async root => {
  const staticConfig = await load(root, 'sumor')
  const config = await load(`${root}/config`, 'config')

  config.name = config.name || 'Sumor Cloud App'
  config.logLevel = (config.logLevel || 'info').toLowerCase()
  config.port = parseInt(config.port || '443', 10)
  config.domain = config.domain || 'localhost'
  config.origin =
    config.origin || `https://${config.domain}${config.port === 443 ? '' : `:${config.port}`}`
  config.language = config.language || 'en-US'

  return { ...staticConfig, ...config }
}
