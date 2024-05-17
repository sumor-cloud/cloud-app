import Connector from '../Connector.js'
import installTable from './installTable.js'
import sortView from './sortView/index.js'
import fromCamelCase from '../utils/fromCamelCase.js'

export default async ({ config, logger, entity, view }) => {
  logger = logger || {
    debug: console.log,
    trace: console.log
  }
  const connector = new Connector(config, logger)
  await connector.ensure()
  await connector.connect()

  const trx = await connector.knex.transaction()
  try {
    for (const i in entity) {
      const objName = fromCamelCase(i, '_')
      logger.debug(`正在安装实体${i}为${objName}`)
      await installTable(trx, objName, entity[i])
      logger.debug(`正在安装实体${i}完成`)
    }
    for (const i in view) {
      const objName = fromCamelCase(i, '_')
      await trx.schema.dropViewIfExists(objName)
    }
    const sortedView = sortView(view)
    for (const i in sortedView) {
      const objName = fromCamelCase(i, '_')
      logger.debug(`正在安装视图${i}为${objName}`)
      await trx.schema.createViewOrReplace(objName, view => {
        view.as(sortedView[i].sql)
      })
      logger.debug(`正在安装视图${i}完成`)
    }
    await trx.commit()
  } catch (e) {
    await trx.rollback()
  }

  await connector.destroy()
}
