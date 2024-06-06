import compression from 'compression'
import zlib from 'zlib'
import serveStatic from 'serve-static'
import fse from 'fs-extra'

export default async app => {
  const path = `${app.sumor.config.root}/static`

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

  // if (await fse.exists(path + '/404.html')) {
  //   const indexFile = await fse.readFile(path + '/404.html', 'utf-8');
  //   app.use((req, res, next) => {
  //     res.set('Content-Type', 'text/html;charset=utf-8');
  //     res.send(indexFile);
  //   });
  // } else if (await fse.exists(path + '/index.html')) {
  //   const indexFile = await fse.readFile(path + '/index.html', 'utf-8');
  //   app.use((req, res, next) => {
  //     res.set('Content-Type', 'text/html;charset=utf-8');
  //     res.send(indexFile);
  //   });
  // }
  // else{
  //     app.get("/", (req, res) => {
  //         // eslint-disable-next-line no-magic-numbers
  //         res.redirect(302, "/api/");
  //     });
  // }
}
