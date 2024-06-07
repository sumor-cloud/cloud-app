import { createProxyMiddleware } from 'http-proxy-middleware'
import fileClearUp from './fileClearUp.js'
import sendResponse from './sendResponse.js'
import ssrLoader from './ssrLoader.js'
import staticParser from './staticParser.js'

export default async app => {
  await fileClearUp(app)
  await sendResponse(app)
  await staticParser(app)
  if (app.sumor.config.mode === 'development') {
    const uiOrigin = `http://localhost:${app.sumor.port + 1}`
    app.use(
      '*',
      createProxyMiddleware({
        target: uiOrigin,
        changeOrigin: true,
        ws: true
      })
    )
  }
  if (app.sumor.config.mode !== 'development') {
    await ssrLoader(app)
  }
}