import { createProxyMiddleware } from 'http-proxy-middleware'
import ssrLoader from './ssrLoader.js'
import staticParser from './staticParser.js'

export default async app => {
  await staticParser(app)
  if (app.config.mode === 'development') {
    const uiOrigin = `http://localhost:${app.config.port + 1}`
    app.use(
      '*',
      createProxyMiddleware({
        target: uiOrigin,
        changeOrigin: true,
        ws: true
      })
    )
  } else {
    await ssrLoader(app)
  }
}
