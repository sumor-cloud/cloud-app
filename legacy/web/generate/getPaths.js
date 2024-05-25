import path from 'path'
import fse from 'fs-extra'

export default async () => {
  const root = process.cwd()
  const paths = {
    root,
    pages: path.join(root, '/web/pages'),
    stores: path.join(root, '/web/stores'),
    // apis: path.join(root,"/services/apis"),
    // events: path.join(root,"/services/events"),

    tmp: path.join(root, '/tmp'),
    tmpWeb: path.join(root, '/tmp/web')
    // tmpServices: path.join(root,"/tmp/services"),
    // tmpDatabase: path.join(root,"/tmp/database"),
  }
  for (const i in paths) {
    paths[i] = paths[i].replace(/\\/g, '/')
    await fse.ensureDir(paths[i])
  }
  return paths
}
