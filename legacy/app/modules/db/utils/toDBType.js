export default info => {
  const length = info.length
  const type = info.type

  let resultType
  switch (type) {
    case 'string':
      if (length > 1000) {
        resultType = 'text'
      } else {
        resultType = 'string'
      }
      break
    case 'number':
      if (length > 18) {
        resultType = 'string'
      } else if (info.scale !== null && info.scale !== undefined) {
        resultType = 'double'
      } else if (length > 9) {
        // INT max 2147483647
        resultType = 'bigInteger'
      } else if (length > 4) {
        // SMALLINT max 32767
        resultType = 'integer'
      } else if (length > 2) {
        // TINYINT max 127
        resultType = 'smallint'
      } else {
        resultType = 'tinyint'
      }
      break
    default:
      break
  }
  return resultType
}
