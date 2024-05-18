import database from '../modules/db/index.js'
import loadConfig from '../../../src/context/loadConfig.js'
import loadMeta from '../../../src/context/loadMeta.js'
import Logger from '@sumor/logger'

export default async () => {
  const config = await loadConfig(process.cwd())
  const meta = await loadMeta(process.cwd())
  const logger = new Logger({
    scope: 'DATABASE',
    level: config.logLevel
  })
  logger.info('开始部署数据库')
  await database.install({
    config: config.database,
    logger,
    entity: meta.entity,
    view: meta.view
  })
  logger.info('部署数据库完成')
}
