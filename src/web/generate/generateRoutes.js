import { findReference } from '@sumor/config'
import updateFile from '../updateFile.js'

export default async (context, paths) => {
  const pageRouteStrings = []
  const pages = await findReference(paths.pages, ['vue'])
  for (const page in pages) {
    const relPath = `../../web/pages/${page}`.replace(/\\/g, '/')
    const meta = pages[page]
    let subPath = `/${page}`
      .replace(paths.pages, '')
      .replace('.vue', '')
      .replace(/\\/g, '/')
      .toLowerCase()
      .replace('/index', '')
    if (subPath === '') {
      subPath = '/'
    }
    let keepAliveString = ''
    if (meta.alive) {
      keepAliveString = ',\n    meta:{keepAlive:true}'
    }
    if (meta.routes) {
      for (const route of meta.routes) {
        pageRouteStrings.push(`    {
    path: "${route}",
    component: ()=>import("${relPath}"),
    props: true${keepAliveString}
}`)
      }
    } else {
      pageRouteStrings.push(`    {
    path: "${subPath}",
    component: ()=>import("${relPath}"),
    props: true${keepAliveString}
}`)
    }
  }

  const pagesConfig = context.config.pages || []
  for (const page of pagesConfig) {
    if (page.redirect) {
      pageRouteStrings.push(`    {
    path: "${page.path}",
    redirect: "${page.redirect}"
}`)
    } else {
      let keepAliveString = ''
      if (page.alive) {
        keepAliveString = ',\n    meta:{keepAlive:true}'
      }
      pageRouteStrings.push(`    {
    path: "${page.path}",
    component: ()=>import("../../web${page.component}"),
    props: true${keepAliveString}
}`)
    }
  }

  const pageRoutesFile = `export default [\n${pageRouteStrings.join(',\n')}\n]`
  await updateFile(`${paths.tmpWeb}/routes.js`, pageRoutesFile)
}
