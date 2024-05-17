import getViteConfig from './viteConfig/index.js'
import getPaths from './getPaths.js'

export default async context => {
  const paths = await getPaths(context)
  return await getViteConfig(context, paths)
}
