export default async (context) => {
  const domain = context.config.domain || 'localhost'
  const port = parseInt(context.config.port || '443', 10)
  const portString = port === 443 ? '' : `:${port}`
  const origin = context.config.origin || `https://${domain}${portString}`

  const uiPort = context.mode === 'development' || context.mode === 'preview' ? port + 1 : port

  return {
    domain,
    origin,
    port,
    uiPort
  }
}
