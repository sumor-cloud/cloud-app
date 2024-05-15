const text = (data) => {
  data = data || {}
  data.name = data.name || ''
  data.desc = data.desc || ''
  data.origin = data.origin || {}
  data.target = data.target || {}
  return data
}
const rule = (data) => {
  data = data || {}
  data.name = data.name || ''
  data.desc = data.desc || ''
  data.text = data.text || ''
  data.expression = data.expression || ''
  return data
}
const type = (data) => {
  data = data || {}
  data.name = data.name || ''
  data.desc = data.desc || ''
  data.type = data.type || 'any'
  data.placeholder = data.placeholder || ''
  data.required = data.required === true
  // data.default = data.default;
  data.length = data.length || 0
  data.rule = data.rule || []
  data.helper = data.helper || {}
  if (data.type === 'string') {
    data.trim = data.trim !== false
    data.upperCase = data.upperCase === true
    data.lowerCase = data.lowerCase === true
  }
  return data
}
const entity = (data, context, key) => {
  data = data || {}
  data.name = data.name || ''
  data.desc = data.desc || ''
  data.property = data.property || {}
  for (const i in data.property) {
    const propertyType = data.property[i].type
    if (propertyType && context.type[propertyType]) {
      data.property[i] = { ...context.type[propertyType], ...data.property[i] }
      data.property[i].type = context.type[propertyType].type
    } else {
      data.property[i] = type(data.property[i])
    }
    context.type[`${key}.${i}`] = data.property[i]
  }
  data.join = data.join || {}
  return data
}
const program = (data, context) => {
  data = data || {}
  data.name = data.name || ''
  data.desc = data.desc || ''
  data.parameters = data.parameters || {}
  for (const i in data.parameters) {
    const parameterType = data.parameters[i].type
    if (parameterType && context.type[parameterType]) {
      data.parameters[i] = { ...context.type[parameterType], ...data.parameters[i] }
      data.parameters[i].type = context.type[parameterType].type
    } else {
      data.parameters[i] = type(data.parameters[i])
    }
  }
  return data
}
const view = (data) => {
  data = data || {}
  data.name = data.name || ''
  data.desc = data.desc || ''
  data.sql = data.sql || ''
  return data
}
export default {
  text,
  rule,
  type,
  entity,
  program,
  view
}
