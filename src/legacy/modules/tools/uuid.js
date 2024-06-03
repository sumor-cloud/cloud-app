import crypto from 'crypto'

export default () => {
  return crypto.randomUUID().replace(/-/g, '')
}
