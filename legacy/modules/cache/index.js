import { install, operator } from '../db/index.js'

export default async (config, logger) => {
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
    await install({
      config,
      logger,
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
    const pool = await operator({
      config,
      logger
    })
    getCacheMethods = logger => ({
      get: async (namespace, key) => {
        const db = await pool.connect(logger)
        const result = await db.single('cache', { namespace, key })
        await db.commit()
        if (result) {
          logger.trace(`读取缓存${namespace} ${key}。数据为${result.value}`)
          return result.value
        }
        logger.trace(`读取缓存${namespace} ${key}。数据为空`)
      },
      set: async (namespace, key, value) => {
        const db = await pool.connect(logger)
        try {
          if (value) {
            await db.modify('cache', ['namespace', 'key'], { namespace, key, value })
          } else {
            await db.delete('cache', { namespace, key })
          }
          await db.commit()
          logger.trace(`写入缓存${namespace} ${key}成功。数据为${value}`)
        } catch (e) {
          await db.rollback()
          logger.trace(`写入缓存${namespace} ${key}失败。数据为${value}`)
          logger.error(e)
        }
      }
    })
  }
  return getCacheMethods
}
