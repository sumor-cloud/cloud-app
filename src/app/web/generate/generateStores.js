import findFiles from './findFiles.js'
import updateFile from '../../utils/updateFile.js'

export default async (paths) => {
  const stores = await findFiles('**/*.js', { cwd: paths.stores })
  const imports = []
  const result = []
  for (const i in stores) {
    const importName = `store${parseInt(i) + 1}`
    imports.push(`import ${importName} from "../../web/stores/${stores[i]}"`)
    result.push(`"${stores[i].replace('.js', '').replace(/\\/g, '/').replace(/\//g, '.')}":${importName}`)
  }
  const resultFile = `${imports.join(';\n')};
const stores = {
${result.join(',\n')}
}
export default stores;`
  await updateFile(`${paths.tmpWeb}/stores.js`, resultFile)
}
