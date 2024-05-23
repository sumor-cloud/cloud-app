import getPaths from './getPaths.js'
import copyTemplate from './copyTemplate.js'
import generateRoutes from './generateRoutes.js'
import generateStores from './generateStores.js'

export default async (context, force) => {
  const paths = await getPaths()
  await copyTemplate(context, paths, force)
  await generateRoutes(context, paths)
  await generateStores(paths)
}
