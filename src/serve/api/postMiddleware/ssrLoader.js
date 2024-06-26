import fse from 'fs-extra'
import path from 'node:path'
import serveStatic from 'serve-static'
import { pathToFileURL } from 'url'

export default async app => {
  const exposeRoot = '/'
  const webPath = path.resolve(process.cwd(), './output')
  if (await fse.exists(webPath)) {
    const indexFile = await fse.readFile(`${webPath}/client/index.html`, 'utf-8')

    const manifest = JSON.parse(await fse.readFile(`${webPath}/client/ssr-manifest.json`, 'utf-8'))

    app.use(
      exposeRoot,
      serveStatic(`${webPath}/client`, {
        index: false
      })
    )

    let ssrServerEntry
    try {
      const ssrPath = path.resolve(webPath, './server/entry-server.js')
      if (await fse.exists(ssrPath)) {
        const { render } = await import(pathToFileURL(ssrPath))
        ssrServerEntry = render
      }
    } catch (e) {
      app.logger.error('ssrServerEntry load failed', e)
    }

    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl.replace(exposeRoot, '/')
        const ctx = req.ssrContext
        const [appHtml, preloadLinks] = await ssrServerEntry(url, manifest, ctx)

        const pageInfo = `<title>${ctx.pageInfo.title}</title>
    <meta name="description" content="${ctx.pageInfo.description}" />
    <meta name="keywords" content="${ctx.pageInfo.keywords}" />`
        const html = indexFile
          .replace('<!--app-page-info-->', pageInfo)
          .replace('<!--preload-links-->', preloadLinks)
          .replace('<!--app-html-->', appHtml)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (e) {
        console.log(e.stack)
        res.status(500).end(e.stack)
      }
    })
  }
}
