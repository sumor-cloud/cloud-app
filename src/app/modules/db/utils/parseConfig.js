export default (config) => {
  config = config || {}
  const knexConfig = {}
  // 格式化数据库类型
  config.type = config.type || 'better-sqlite3'
  switch (config.type) {
    case 'sqlite':
      knexConfig.client = 'better-sqlite3'
      break
    case 'sqlite3':
      knexConfig.client = 'better-sqlite3'
      break
    case 'better-sqlite3':
      knexConfig.client = 'better-sqlite3'
      break
    case 'mysql':
      knexConfig.client = 'mysql2'
      break
    case 'mysql2':
      knexConfig.client = 'mysql2'
      break
    default:
      throw new Error(`不支持数据库类型${config.type}`)
  }

  // 格式化连接信息
  switch (knexConfig.client) {
    case 'better-sqlite3':
      knexConfig.connection = {
        filename: config.path || `${process.cwd()}/main.sqlite`
      }
      knexConfig.useNullAsDefault = true
      break
    case 'mysql2':
      knexConfig.connection = {
        host: config.host,
        port: config.port || 3306,
        user: config.user,
        password: config.password,
        database: config.database,
        charset: config.charset || 'utf8mb4'
      }
      knexConfig.pool = config.pool || { min: 2, max: 10 }
      break
    default:
      break
  }
  return knexConfig
}
