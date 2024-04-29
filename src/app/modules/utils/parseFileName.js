export default (path) => {
  const pathArr = path.split('/')
  const fileName = pathArr.pop()
  const fileNameArr = fileName.split('.')
  const suffix = fileNameArr.pop()
  const name = fileNameArr.shift()
  let type = null
  if (fileNameArr.length > 0) {
    type = fileNameArr.pop()
  }
  const shortPath = [...pathArr, name].join('.')
  return {
    path: shortPath,
    route: `/api/${shortPath.replace(/\./g, '/')}`,
    name,
    suffix,
    type
  }
}
