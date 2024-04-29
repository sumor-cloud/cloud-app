import bodyParser from 'body-parser'
import multer from 'multer'
import fse from 'fs-extra'

export default async (app) => {
  const uploadPath = `${app.sumor.root}/tmp/uploads`
  await fse.ensureDir(uploadPath)
  const upload = multer({ dest: 'tmp/uploads/' })
  app.uploader = (parameters) => {
    let uploadFunction
    if (parameters) {
      const fileFields = []
      for (const i in parameters) {
        if (parameters[i].type === 'file') {
          fileFields.push({ name: i })
        }
      }
      if (fileFields.length > 0) {
        uploadFunction = upload.fields(fileFields)
      }
    }
    return uploadFunction
  }

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(bodyParser.text())

  app.use((req, res, next) => {
    req.sumor.data = { ...req.params, ...req.query, ...req.body }
    next()
  })
}
