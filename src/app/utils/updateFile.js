import fse from 'fs-extra'

export default async (path, data) => {
  await fse.ensureFile(path)
  const existingFile = await fse.readFile(path, 'utf-8')
  if (existingFile !== data) {
    await fse.writeFile(path, data)
  }
}
