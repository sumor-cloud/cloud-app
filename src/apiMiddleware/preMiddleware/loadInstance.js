import fse from 'fs-extra'

export default async app => {
  const path = `${app.sumor.config.root}/instance.json`
  let instance = {}
  if (await fse.exists(path)) {
    try {
      instance = await fse.readJson(path)
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
  }
  instance.version = instance.version || '0.0.0'
  instance.server = instance.server || 'local'
  instance.port = instance.port || app.sumor.port
  instance.time = new Date().getTime()

  app.sumor.instance = JSON.parse(JSON.stringify(instance))
  app.use((req, res, next) => {
    req.sumor.instance = JSON.parse(JSON.stringify(instance))
    if (req.sumor.instance) {
      const { version, server, port, time } = req.sumor.instance
      res.set('sumor-instance', `${version}_${server}_${port}_${time}`)
    }
    next()
  })
}
