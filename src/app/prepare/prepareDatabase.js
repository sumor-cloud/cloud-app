import operator from '../modules/db/operator/index.js'

export default async context => {
  const config = context.config.database
  const logger = context.getLogger('DATABASE')

  const dbPool = await operator({
    config,
    logger
  })
  return async sessionLogger => await dbPool.connect(sessionLogger || logger)
}
