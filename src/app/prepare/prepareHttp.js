import fse from 'fs-extra'

const loadSsl = async (root) => {
  if (await fse.exists(root)) {
    const obj = {
      key: await fse.readFile(`${root}/domain.key`, 'utf-8'),
      cert: await fse.readFile(`${root}/domain.cer`, 'utf-8')
    }
    if (await fse.exists(`${root}/ca.cer`)) {
      obj.ca = await fse.readFile(`${root}/ca.cer`, 'utf-8')
    }
    return obj
  }
}

export default async (context) => {
  const ssl = await loadSsl(`${context.root}/ssl`)

  let protocol = context.config.protocol || 'https'
  if (protocol === 'https' && !ssl) {
    protocol = 'http'
  }
  const domain = context.config.domain || 'localhost'
  const port = parseInt(context.config.port || (protocol === 'http' ? 80 : 443), 10)
  const portString = (protocol === 'http' && port === 80) || (protocol === 'https' && port === 443) ? '' : `:${port}`
  const origin = context.config.origin || `${protocol}://${domain}${portString}`

  const uiPort = context.mode === 'development' || context.mode === 'preview' ? port + 1 : port

  return {
    ssl,
    protocol,
    domain,
    port,
    origin,

    uiPort
  }
}
