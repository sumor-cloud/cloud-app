import bodyParser from 'body-parser'
import multer from 'multer'
import fse from 'fs-extra'

const uploadPath = `${process.cwd()}/tmp/uploads`
await fse.ensureDir(uploadPath)
const upload = multer({ dest: 'tmp/uploads/' })

export default parameters => {
  parameters = parameters || []

  const uploadParameters = []
  for (const i in parameters) {
    if (parameters[i].type === 'file') {
      uploadParameters.push({ name: i })
    }
  }
  return [
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    bodyParser.text(),
    upload.fields(uploadParameters),
    (req, res, next) => {
      const files = {}
      for (const name in req.files) {
        files[name] = files[name] || []
        for (const fileIndex in req.files[name]) {
          files[name].push({
            name: req.files[name][fileIndex].originalname,
            size: req.files[name][fileIndex].size,
            mime: req.files[name][fileIndex].mimetype,
            encoding: req.files[name][fileIndex].encoding,
            path: `${uploadPath}/${req.files[name][fileIndex].filename}`
          })
        }
      }
      req.data = { ...req.params, ...req.query, ...req.body, ...files }
      next()
    }
  ]
}
