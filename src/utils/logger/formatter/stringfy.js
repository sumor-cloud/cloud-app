export default (time, level, scope, id, message, data) => {
  const timeStr = new Date(time).toISOString()
  const levelStr = level.toUpperCase()
  const scopeStr = scope.toUpperCase()
  const idStr = id ? ` [${id}]` : ''
  let dataStr = ''
  if (data) {
    dataStr = ` | ${JSON.stringify(data)}`
  }
  return `# ${timeStr} [${levelStr}] [${scopeStr}]${idStr} - ${message}${dataStr}`
}
