import database from '@sumor/database'

export default async app => {
  const config = app.config.database

  const client = await database.client(config)
  app.connectDB = async index => await client.connect(index)
}
