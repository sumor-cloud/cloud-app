import toCamelCase from './toCamelCase.js'

export default (data) => {
  const result = {}
  for (const i in data) {
    const fieldName = toCamelCase(i, '_', true)
    result[fieldName] = data[i]
  }
  return result
}
