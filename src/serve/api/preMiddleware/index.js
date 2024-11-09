import loadInstance from './loadInstance.js'
// import cache from './cache.js'
// import wechat from './wechat.js'

export default async app => {
  await loadInstance(app)
  // await cache(app)
  // await wechat(app)
}
