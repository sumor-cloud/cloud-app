import toDBType from '../utils/toDBType.js'

export default (table, name, parameterInfo, alterFlag) => {
  let parameterColumn

  parameterInfo.type = parameterInfo.type || 'string'

  // 补全长度
  switch (parameterInfo.type) {
    case 'string':
      parameterInfo.length = parameterInfo.length || 255
      break
    case 'number':
      parameterInfo.length = parameterInfo.length || 10
      break
    default:
      break
  }

  if (parameterInfo.increment) {
    parameterColumn = table.increments(name)
  } else {
    const dbType = toDBType(parameterInfo)
    let actualValueType
    switch (dbType) {
      case 'tinyint':
        parameterColumn = table.tinyint(name)
        actualValueType = 'number'
        break
      case 'smallint':
        parameterColumn = table.smallint(name)
        actualValueType = 'number'
        break
      case 'integer':
        parameterColumn = table.integer(name)
        actualValueType = 'number'
        break
      case 'bigInteger':
        parameterColumn = table.bigInteger(name)
        actualValueType = 'number'
        break
      case 'string':
        parameterColumn = table.string(name, parameterInfo.length)
        actualValueType = 'string'
        break
      case 'text':
        parameterColumn = table.text(name, parameterInfo.length)
        actualValueType = 'string'
        break
      case 'double':
        parameterColumn = table.double(name, parameterInfo.length, parameterInfo.scale)
        actualValueType = 'number'
        break
      default:
        break
    }
    if (parameterInfo.default !== null) {
      let defaultValue
      if (actualValueType === 'number') {
        if (parameterInfo.default === undefined) {
          parameterInfo.default = 0
        }
        defaultValue = parseInt(parameterInfo.default, 10)
      } else {
        if (parameterInfo.default === undefined) {
          parameterInfo.default = ''
        }
        defaultValue = parameterInfo.default.toString()
      }
      parameterColumn.defaultTo(defaultValue)
    }

    if (parameterInfo.notNull) {
      parameterColumn.notNullable()
    }
  }

  if (parameterInfo.key) {
    parameterColumn.primary()
  }

  if (alterFlag) {
    parameterColumn.alter()
  }
}
