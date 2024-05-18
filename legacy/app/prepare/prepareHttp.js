export default async context => {
  const domain = context.config.domain || 'localhost'
  const port = parseInt(context.config.port || '443', 10)
  const portString = port === 443 ? '' : `:${port}`
  const origin = context.config.origin || `https://${domain}${portString}`

  const uiPort = port + 1

  return {
    domain,
    origin,
    port,
    uiPort
  }
}
