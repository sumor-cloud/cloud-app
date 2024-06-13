import compression from 'compression'
import zlib from 'zlib'
import serveStatic from 'serve-static'
import fse from 'fs-extra'

export default async app => {
  const path = `${app.config.root}/static`

  // 压缩开放文件
  app.use(
    compression({
      filter() {
        return true
      },
      flush: zlib.Z_SYNC_FLUSH
    })
  )

  // 开放静态文件访问
  if (await fse.exists(path)) {
    app.use(serveStatic(path))
  }
}
