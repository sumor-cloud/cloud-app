import getFormattedTime from './getFormattedTime.js'

export default ({
  time, offset, level, scope, id
}) => {
  level = level || 'trace'
  level = level.toUpperCase()
  scope = scope || 'main'
  scope = scope.toUpperCase()
  const timeStr = getFormattedTime(time, offset)
  const idStr = id ? ` ${id}` : ''
  return `${timeStr} ${level} ${scope}${idStr} -`
}
