import app from '../app/index.js'

export default async (options) => {
  await app({
    mode: 'build'
  })
}
