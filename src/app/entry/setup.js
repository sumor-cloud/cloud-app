import database from '../modules/db/index.js'

export default async (context) => {
  const config = context.config.database
  const logger = context.getLogger('DATABASE')
  await database.install({
    config,
    logger,
    entity: context.meta.entity,
    view: context.meta.view
  })
}
