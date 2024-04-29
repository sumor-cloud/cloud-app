import type from '../../utils/type.js'
import uuid from '../../tools/uuid.js'
import toCamelCase from '../utils/toCamelCase.js'
import fromCamelCase from '../utils/fromCamelCase.js'
import fromCamelCaseData from '../utils/fromCamelCaseData.js'
import toCamelCaseData from '../utils/toCamelCaseData.js'

export default (report, connector, cache, logger, user) => {
  user = user || ''

  const methods = {}
  let trx
  const _beginTransaction = async function () {
    if (!trx) {
      trx = await connector.knex.transaction()
      report.workingConnections++
    }
  }

  methods.setUser = (val) => {
    user = val
    logger.trace(`已修改操作用户为${val}`)
  }

  methods.info = async (table, forceReload) => {
    if (!forceReload && cache.info[table]) { return cache.info[table] }
    const info = await trx.from(table).columnInfo()
    const result = {}
    for (const i in info) {
      const fieldName = toCamelCase(i, '_', true)
      let type
      switch (info[i].type) {
        case 'char': type = 'string'; break
        case 'varchar': type = 'string'; break
        case 'text': type = 'string'; break
        case 'mediumtext': type = 'string'; break
        case 'tinyint': type = 'number'; break
        case 'smallint': type = 'number'; break
        case 'int': type = 'number'; break
        case 'integer': type = 'number'; break
        case 'bigint': type = 'number'; break
        case 'float': type = 'number'; break
        case 'double': type = 'number'; break
        case '': type = 'string'; break
        default:
          type = 'string'
          console.log(`未知数据类型 ${i} ${JSON.stringify(info[i])}`)
          break
      }
      result[fieldName] = {
        type,
        length: parseInt(info[i].maxLength, 10)
      }
    }
    cache.info[table] = result
    return result
  }

  methods.count = async (table, condition, options) => {
    await _beginTransaction()
    options = options || {}
    table = fromCamelCase(table, '_')
    const sql = trx.from(table)

    sql.count({ count: '*' })

    let whereFlag = false
    if (condition) {
      condition = fromCamelCaseData(condition)
      for (const i in condition) {
        if (type(condition[i]) === 'object') {
          for (const j in condition[i]) {
            const cond = j
            const value = condition[i][j]
            if (cond === '<>' && value === null) {
              sql.whereNotNull(i)
            } else {
              sql.where(i, cond, value)
            }
          }
        } else if (condition[i] === null) {
          sql.whereNull(i)
        } else {
          sql.where(i, condition[i])
        }
      }
      whereFlag = true
    }

    // 搜索条件
    if (options.term && options.term !== '' && options.termRange) {
      for (const i in options.termRange) {
        const range = options.termRange[i]
        if (parseInt(i) === 0) {
          if (!whereFlag) {
            sql.where(range, 'like', `%${options.term}%`)
            whereFlag = true
          } else {
            sql.andWhere(range, 'like', `%${options.term}%`)
          }
        } else {
          sql.orWhere(range, 'like', `%${options.term}%`)
        }
      }
    }

    logger.trace(sql.toSQL().sql, sql.toSQL().bindings)

    const result = await sql
    return result[0].count
  }
  methods.single = async (table, condition, options) => {
    options = options || {}
    options.top = 1
    const result = await methods.select(table, condition, options)
    if (result.length > 1) {
      // throw new base.Error("sumor.dataNuts.SINGLE_QUERY_RETURN_MULTIPLE",{table});
    }
    return result[0]
  }
  methods.select = async (table, condition, options) => {
    logger.trace(`查询${table}，条件${JSON.stringify(condition)}，参数${JSON.stringify(options)}`)
    await _beginTransaction()
    options = options || {}
    table = fromCamelCase(table, '_')
    const info = await methods.info(table)
    const sql = trx.from(table)

    let field = options.field
    if (field) {
      field = field.map((obj) => fromCamelCase(obj, '_'))
    }
    sql.select(field)

    let whereFlag = false
    if (condition) {
      condition = fromCamelCaseData(condition)
      for (const i in condition) {
        if (type(condition[i]) === 'object') {
          for (const j in condition[i]) {
            const cond = j
            const value = condition[i][j]
            if (cond === '<>' && value === null) {
              sql.whereNotNull(i)
            } else {
              sql.where(i, cond, value)
            }
          }
        } else if (condition[i] === null) {
          sql.whereNull(i)
        } else {
          sql.where(i, condition[i])
        }
      }
      whereFlag = true
    }

    // 搜索条件
    if (options.term && options.term !== '' && options.termRange) {
      for (const i in options.termRange) {
        const range = options.termRange[i]
        if (parseInt(i) === 0) {
          if (!whereFlag) {
            sql.where(range, 'like', `%${options.term}%`)
            whereFlag = true
          } else {
            sql.andWhere(range, 'like', `%${options.term}%`)
          }
        } else {
          sql.orWhere(range, 'like', `%${options.term}%`)
        }
      }
    }

    // 处理排序
    if (!options.sort && info.createdTime) {
      options.sort = 'created_time DESC'
    }
    if (options.sort) {
      if (typeof options.sort === 'string') {
        const items = options.sort.split(',')
        for (const i in items) {
          let item = items[i].trim()
          item = item.split(' ')
          item[0] = fromCamelCase(item[0], '_')
          items[i] = item.join(' ')
        }
        sql.orderByRaw(items.join(','))
      } else {
        sql.orderBy(options.sort)
      }
    }

    // 分页，单次取出数据数量限制
    if (options.top) {
      sql.limit(options.top)
    }
    if (options.skip) {
      sql.offset(options.skip)
    }

    logger.trace(sql.toSQL().sql, sql.toSQL().bindings)

    const result = await sql
    return result.map((obj) => toCamelCaseData(obj))
  }

  methods.insert = async (table, data) => {
    data = data || {}
    table = fromCamelCase(table, '_')
    await _beginTransaction()
    const getId = async () => {
      const id = uuid()
      const count = await methods.count(table, { id })
      if (count !== 0) {
        return await getId()
      }
      return id
    }

    if (!data.id) {
      data.id = await getId()
    }
        data.createdBy = user || ""; // eslint-disable-line
        data.createdTime = Date.now(); // eslint-disable-line
        data.updatedBy = user || ""; // eslint-disable-line
        data.updatedTime = Date.now(); // eslint-disable-line

    data = fromCamelCaseData(data)
    const sql = trx.insert(data).into(table)

    logger.trace(sql.toSQL().sql, sql.toSQL().bindings)

    await sql
    return data.id
  }
  methods.update = async (table, data) => {
    data = data || {}
    table = fromCamelCase(table, '_')
    await _beginTransaction()

    const id = data.id
    delete data.id
    if (id === undefined || id === null) {
      throw new Error('数据ID不存在，无法找到要更新的数据')
    }

        data.updatedBy = user || ""; // eslint-disable-line
        data.updatedTime = Date.now(); // eslint-disable-line

    data = fromCamelCaseData(data)
    const sql = trx.update(data).from(table)
      .where({ id })

    logger.trace(sql.toSQL().sql, sql.toSQL().bindings)

    await sql
  }
  methods.modify = async (table, check, data) => {
    logger.trace(`强制修改${table}，数据${JSON.stringify(data)}，检查字段${JSON.stringify(check)}`)
    table = fromCamelCase(table, '_')
    const condition = {}
    for (const checkField of check) {
      condition[fromCamelCase(checkField, '_')] = data[checkField]
    }
    const exist = await methods.single(table, condition, { field: ['id'] })
    let id
    if (!exist) {
      id = await methods.insert(table, data)
    } else {
      id = exist.id
      data.id = id
      await methods.update(table, data)
    }
    return id
  }
  methods.ensure = async (table, check, data) => {
    logger.trace(`确保${table}存在数据${JSON.stringify(data)}，检查字段${JSON.stringify(check)}`)
    table = fromCamelCase(table, '_')
    const condition = {}
    for (const checkField of check) {
      condition[fromCamelCase(checkField, '_')] = data[checkField]
    }
    const exist = await methods.select(table, condition, { field: ['id'] })
    let id
    if (!exist[0]) {
      id = await methods.insert(table, data)
    } else {
      id = exist[0].id
    }
    return id
  }
  methods.delete = async (table, condition) => {
    table = fromCamelCase(table, '_')
    const sql = trx.from(table)
    if (condition) {
      condition = fromCamelCaseData(condition)
      sql.where(condition)
    }

    logger.trace(sql.toSQL().sql, sql.toSQL().bindings)

    return await sql.del()
  }
  methods.sql = async (str, parameters) => {
    await _beginTransaction()
    return await trx.raw(str, parameters)
  }
  methods.commit = async () => {
    if (trx) {
      try {
        await trx.commit()
        trx = null
        report.workingConnections--
      } catch (e) {
        logger.error(e)
      }
    }
  }
  methods.release = methods.commit
  methods.rollback = async () => {
    if (trx) {
      try {
        await trx.rollback()
        report.workingConnections--
        trx = null
      } catch (e) {
        logger.error(e)
      }
    }
  }

  return methods
}
