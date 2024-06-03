import database from '@sumor/database'

export default async runtime => {
  const config = runtime.config.database
  const logger = runtime.getLogger('DATABASE')

  const dbPool = await database.client(config)
  const connectDB = async sessionLogger => await dbPool.connect(sessionLogger || logger)

  runtime.setContext({
    connectDB
  })
}
