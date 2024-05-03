import loadConfig from '../../utils/loadConfig.js'
import findFiles from './findFiles.js'
import updateFile from '../../utils/updateFile.js'

export default async (context, paths) => {
  const pages = await findFiles('**/*.vue', { cwd: paths.pages })
  const pageRouteStrings = []
  for (const i in pages) {
    const page = pages[i]
    const absolutePath = (`${paths.pages}/${page}`).replace(/\\/g, '/')
    const metaPath = absolutePath.replace('.vue', '')
    const relPath = (`../../web/pages/${page}`).replace(/\\/g, '/')

    const meta = await loadConfig(metaPath, context.mode === 'production')
    let subPath = (`/${page}`).replace(paths.pages, '').replace('.vue', '').replace(/\\/g, '/').toLowerCase()
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
