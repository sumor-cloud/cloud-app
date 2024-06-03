import database from '@sumor/database'

export default async runtime => {
  const config = runtime.config.database

  const client = await database.client(config)
  const connectDB = async index => await client.connect(index)

  runtime.setContext({
    connectDB
  })
}
