import database from '@sumor/database'
import loadConfig from './config/loadConfig.js'
import Logger from '@sumor/logger'

export default async () => {
  const config = await loadConfig(process.cwd())
  const logger = new Logger({
    scope: 'DATABASE',
    level: config.logLevel
  })
  logger.info('开始部署数据库')
  await database.install(config.database, process.cwd() + '/data')
  logger.info('部署数据库完成')
}
