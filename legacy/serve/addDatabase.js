import { operator } from '../modules/db/index.js'

export default async runtime => {
  const config = runtime.config.database
  const logger = runtime.getLogger('DATABASE')

  const dbPool = await operator({
    config,
    logger
  })
  const connectDB = async sessionLogger => await dbPool.connect(sessionLogger || logger)

  runtime.setContext({
    connectDB
  })
}
