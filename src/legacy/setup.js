import database from '@sumor/database'
import loadConfig from '../../src/config/loadConfig.js'
import loadMeta from '../../src/config/loadMeta.js'
import Logger from '@sumor/logger'

export default async () => {
  const config = await loadConfig(process.cwd())
  const meta = await loadMeta(process.cwd())
  const logger = new Logger({
    scope: 'DATABASE',
    level: config.logLevel
  })
  logger.info('开始部署数据库')
  await database.install(config.database, {
    entity: meta.entity,
    view: meta.view
  })
  logger.info('部署数据库完成')
}
