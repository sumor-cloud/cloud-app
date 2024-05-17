import fse from 'fs-extra'
import path from 'path'

class File {
  constructor(config) {
    this.config = config
    this.root = path.resolve(process.cwd(), this.config.path)
  }

  _getTargetPath(target) {
    return path.join(this.root, target)
  }

  async put(target, stream) {
    const targetPath = this._getTargetPath(target)
    fse.ensureFileSync(targetPath)
    await new Promise(resolve => {
      const ws = fse.createWriteStream(targetPath, { encoding: 'utf8', start: 0 })
      stream.pipe(ws)
      stream.on('end', () => {
        resolve()
      })
    })
  }

  async get(target) {
    const targetPath = this._getTargetPath(target)
    if (await fse.exists(targetPath)) {
      return fse.createReadStream(targetPath)
    }
  }

  async delete(target) {
    const targetPath = this._getTargetPath(target)
    await fse.remove(targetPath)
  }

  async exists(target) {
    const targetPath = this._getTargetPath(target)
    return await fse.exists(targetPath)
  }
}
export default File
