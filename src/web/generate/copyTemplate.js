import fse from 'fs-extra'
import root from '../../../root.js'

// const sslString = `https: {
//             cert: getSSL("./ssl/domain.cer"),
//             key: getSSL("./ssl/domain.key"),
//             ca: getSSL("./ssl/ca.cer")
//         },`;
export default async (paths, force) => {
  const template = `${root}/template/web`
  const hasIndex = await fse.exists(`${paths.tmpWeb}/index.html`)
  if (force || !hasIndex) {
    await fse.copy(`${template}/index.html`, `${paths.tmpWeb}/index.html`)
  }
  const hasSrc = await fse.exists(`${paths.tmpWeb}/src`)
  if (force || !hasSrc) {
    await fse.copy(`${template}/src`, `${paths.tmpWeb}/src`)
  }
  const frameFilePath = `${paths.root}/web/Frame.vue`
  const hasFrame = await fse.exists(frameFilePath)
  if (force || hasFrame) {
    await fse.copy(`${template}/AppWithFrame.vue`, `${paths.tmpWeb}/src/App.vue`)
  }
}
