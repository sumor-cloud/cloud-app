import database from '@sumor/database'

export default async (config) => {
  const type = config.type || 'sqlite'

  let getCacheMethods
  if (type === 'redis') {
    // todo add redis type cache store
    const tmpCache = {}
    getCacheMethods = logger => ({
      get: async (namespace, key) => {
        const store = tmpCache[namespace] || {}
        return store[key]
      },
      set: async (namespace, key, value) => {
        tmpCache[namespace] = tmpCache[namespace] || {}
        tmpCache[namespace][key] = value
      }
    })
  } else {
    await database.install(config, {
      entity: {
        cache: {
          property: {
            namespace: { type: 'string', length: 100, notNull: true },
            key: { type: 'string', length: 500, notNull: true },
            value: { type: 'string', length: 10000, notNull: true }
          }
        }
      }
    })
    const client = await database.client(config)
    getCacheMethods = loggerId => ({
      get: async (namespace, key) => {
        const db = await client.connect(loggerId)
        const result = await db.single('cache', { namespace, key })
        await db.commit()
        if (result) {
          // logger.trace(`读取缓存${namespace} ${key}。数据为${result.value}`)
          return result.value
        }
        // logger.trace(`读取缓存${namespace} ${key}。数据为空`)
      },
      set: async (namespace, key, value) => {
        const db = await client.connect(loggerId)
        try {
          if (value) {
            await db.modify('cache', ['namespace', 'key'], { namespace, key, value })
          } else {
            await db.delete('cache', { namespace, key })
          }
          await db.commit()
          // logger.trace(`写入缓存${namespace} ${key}成功。数据为${value}`)
        } catch (e) {
          await db.rollback()
          // logger.trace(`写入缓存${namespace} ${key}失败。数据为${value}`)
          // logger.error(e)
        }
      }
    })
  }
  return getCacheMethods
}
