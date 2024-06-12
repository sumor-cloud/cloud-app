import loadInstance from './loadInstance.js'
import cache from './cache.js'
import database from './database.js'
import wechat from './wechat.js'

export default async app => {
  await loadInstance(app)
  await cache(app)
  await database(app)
  await wechat(app)
}
