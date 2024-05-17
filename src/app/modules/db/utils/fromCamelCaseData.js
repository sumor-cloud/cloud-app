import fromCamelCase from './fromCamelCase.js'

export default data => {
  const result = {}
  for (const i in data) {
    const fieldName = fromCamelCase(i, '_')
    result[fieldName] = data[i]
  }
  return result
}
