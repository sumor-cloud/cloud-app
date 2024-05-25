import getPaths from './getPaths.js'
import copyTemplate from './copyTemplate.js'
import generateRoutes from './generateRoutes.js'
import generateStores from './generateStores.js'

export default async (config, force) => {
  const paths = await getPaths()
  await copyTemplate(paths, force)
  await generateRoutes(config, paths)
  await generateStores(paths)
}
