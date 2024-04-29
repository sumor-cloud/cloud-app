import http from 'http'
import https from 'https'
// import spdy from 'spdy'
import closer from './closer.js'

export default async (app) => {
  const port = app.sumor.port
  if (app.sumor.protocol === 'https') {
    let redirectCloser
    if (port === 443) {
      const redirectServer = http.createServer((req, res) => {
        const url = `https://${req.headers.host}${req.url}`
        res.writeHead(301, {
          Location: url
        })
        res.end()
      })

      redirectCloser = await new Promise((resolve) => {
        redirectServer.listen(80, () => {
          resolve(closer(redirectServer))
        })
      })
      app.sumor.logger.info('http服务已启动，访问将跳转至https')
    }

    // let httpsServer
    // if (true) { // app.sumor.mode === "development"){
    const httpsServer = https.createServer({
      ...app.sumor.ssl
    }, app)
    // } else {
    //   httpsServer = spdy.createServer({
    //     ...app.sumor.ssl
    //   }, app)
    // }

    httpsServer.on('error', (e) => {
      app.sumor.logger.error(e)
    })

    // 启动https服务
    const httpsCloser = await new Promise((resolve) => {
      httpsServer.listen(port, () => {
        resolve(closer(httpsServer))
      })
    })

    app.sumor.close = async () => {
      app.sumor.logger.info('正在终止网页服务')
      if (redirectCloser) {
        await redirectCloser()
      }
      await httpsCloser()
      // await app.sumor.event.close(app.sumor);
      app.sumor.logger.info('网页服务已停止运行')
    }
  } else {
    const httpServer = http.createServer(app)
    const httpCloser = await new Promise((resolve) => {
      httpServer.listen(port, () => {
        resolve(closer(httpServer))
      })
    })
    app.sumor.close = async () => {
      app.sumor.logger.info('正在终止网页服务')
      await httpCloser()
      // await app.sumor.event.close(app.sumor);
      app.sumor.logger.info('网页服务已停止运行')
    }
  }
}
