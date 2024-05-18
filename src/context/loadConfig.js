import { load } from '@sumor/config'

export default async root => {
  const staticConfig = await load(root, 'sumor')
  const config = await load(`${root}/config`, 'config')
  return { ...staticConfig, ...config }
}
