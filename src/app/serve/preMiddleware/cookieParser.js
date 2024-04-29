import cookieParser from 'cookie-parser'

export default (app) => {
  // 解析cookie到req.cookies
  app.use(cookieParser())
  app.use((req, res, next) => {
    req.sumor.cookie = JSON.parse(JSON.stringify(req.cookies))
    req.sumor.saveCookie = () => {
      for (const i in req.cookies) {
        if (!req.sumor.cookie[i]) {
          // 已删除key
          res.clearCookie(i)
        }
      }
      for (const i in req.sumor.cookie) {
        if (req.sumor.cookie[i] !== req.cookies[i]) {
          res.cookie(i, req.sumor.cookie[i], { maxAge: 365 * 24 * 3600 * 1000, httpOnly: true })
        }
      }
    }
    next()
  })
}
