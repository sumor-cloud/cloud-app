import fse from 'fs-extra'

export default (app) => {
  app.use(async (req, res, next) => {
    if (req.files) {
      const uploadPath = `${app.sumor.root}/tmp/uploads`
      for (const i in req.files) {
        for (const j in req.files[i]) {
          const path = `${uploadPath}/${req.files[i][j].filename}`
          await fse.remove(path)
        }
      }
    }
    next()
  })
}
