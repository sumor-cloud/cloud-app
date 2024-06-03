export default (path, app, callback) => {
  const route = `/${path.replace(/\./g, '/')}`
  const uploadPath = `${app.sumor.root}/tmp/uploads`
  const uploadFunction = app.uploader(app.sumor.meta.api[path].parameters)
  if (uploadFunction) {
    app.all(
      route,
      uploadFunction,
      (req, res, next) => {
        const files = {}
        if (req.files) {
          for (const i in req.files) {
            const obj = []
            for (const j in req.files[i]) {
              obj.push({
                name: req.files[i][j].originalname,
                size: req.files[i][j].size,
                mime: req.files[i][j].mimetype,
                encoding: req.files[i][j].encoding,
                path: `${uploadPath}/${req.files[i][j].filename}`
              })
            }
            files[i] = obj
          }
        }
        req.sumor.data = { ...req.params, ...req.query, ...req.body, ...files }
        next()
      },
      callback
    )
  } else {
    app.all(
      route,
      (req, res, next) => {
        next()
      },
      callback
    )
  }
  return !!uploadFunction
}
