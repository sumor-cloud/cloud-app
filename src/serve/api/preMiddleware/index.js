import loadInstance from './loadInstance.js'
import language from './language.js'
import timezone from './timezone.js'
import logger from './logger.js'
import cache from './cache.js'
import database from './database.js'
import wechat from './wechat.js'

export default async app => {
  await loadInstance(app)
  await language(app)
  await timezone(app)
  await logger(app)
  await cache(app)
  await database(app)
  await wechat(app)
}
