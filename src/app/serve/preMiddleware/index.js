import loadInstance from './loadInstance.js'
import language from './language.js'
import loadText from './loadText.js'
import loadRange from './loadRange.js'
import timezone from './timezone.js'
import logger from './logger.js'
import monitor from './monitor.js'
import bodyParser from './bodyParser.js'
import cookieParser from './cookieParser.js'
import cache from './cache.js'
import token from './token.js'
import database from './database.js'
import loadResponse from './loadResponse.js'
import storage from './storage.js'
import sms from './sms.js'
import wechat from './wechat.js'

export default async (app) => {
  await loadInstance(app)
  await loadResponse(app)
  await language(app)
  await loadText(app)
  await loadRange(app)
  await timezone(app)
  await logger(app)
  await monitor(app)
  await bodyParser(app)
  await cookieParser(app)
  await cache(app)
  await database(app)
  await token(app)
  await storage(app)
  await sms(app)
  await wechat(app)
}
