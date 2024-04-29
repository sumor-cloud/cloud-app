import crypto from 'crypto'

export default (rs) => {
  const result = {}
  const hash = crypto.createHash('md5')
  let len = 0
  rs.on('data', (chunk) => {
    len += chunk.length
  })
  rs.on('data', hash.update.bind(hash))

  rs.on('end', () => {
    result.length = len
    result.hash = hash.digest('hex')
  })
  return result
}
