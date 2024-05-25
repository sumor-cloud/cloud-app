import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from './cors.js'
import fileClearUp from './fileClearUp.js'
import sendResponse from './sendResponse.js'
import ssrLoader from './ssrLoader.js'
import staticParser from './staticParser.js'

export default async app => {
  await cors(app)
  await fileClearUp(app)
  await sendResponse(app)
  await staticParser(app)
  if (app.sumor.mode === 'development') {
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
  if (app.sumor.mode === 'production') {
    await ssrLoader(app)
  }
}
