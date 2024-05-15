import { load } from '@sumor/config'

export default async (context) => {
  const staticConfig = await load(context.root, 'sumor')
  const config = await load(`${context.root}/config`, 'config')
  return { ...staticConfig, ...config }
}
