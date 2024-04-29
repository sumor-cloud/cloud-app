import http from 'http'

export default (app) => {
  const serverHttp = http.createServer((req, res) => {
    const url = `https://${req.headers.host}${req.url}`
    res.writeHead(301, {
      Location: url
    })
    res.end()
  })
  serverHttp.listen(80)
  app.sumor.logger.info('http服务已启动，访问将跳转至https')
  return serverHttp
}
