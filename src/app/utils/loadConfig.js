import yaml from 'yaml'
import fse from 'fs-extra'
import updateFile from './updateFile.js'

export default async (path, disableUpdate) => {
  const hasJson = await fse.exists(`${path}.json`)
  const hasYaml = await fse.exists(`${path}.yaml`)
  const hasYml = await fse.exists(`${path}.yml`)
  let result = {}
  if (hasYml) {
    const data = await fse.readFile(`${path}.yml`, 'utf-8')
    result = yaml.parse(data)
  } else if (hasYaml) {
    const data = await fse.readFile(`${path}.yaml`, 'utf-8')
    result = yaml.parse(data)
  } else if (hasJson) {
    result = await fse.readJson(`${path}.json`)
  } else if (!disableUpdate) {
    await fse.ensureFile(`${path}.yml`)
    await fse.writeFile(`${path}.yml`, yaml.stringify(result))
  }

  if (!disableUpdate && (hasJson || hasYaml) && !hasYml) {
    await fse.remove(`${path}.json`)
    await fse.remove(`${path}.yaml`)
    await updateFile(`${path}.yml`, yaml.stringify(result))
  }

  return result
}
