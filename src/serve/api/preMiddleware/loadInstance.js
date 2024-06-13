import fse from 'fs-extra'

export default async app => {
  const path = `${app.config.root}/instance.json`
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
  instance.port = instance.port || app.config.port
  instance.time = new Date().getTime()

  app.instance = JSON.parse(JSON.stringify(instance))
  app.use((req, res, next) => {
    req.instance = JSON.parse(JSON.stringify(instance))
    if (req.instance) {
      const { version, server, port, time } = req.instance
      res.set('sumor-instance', `${version}_${server}_${port}_${time}`)
    }
    next()
  })
}
