export default depends => {
  const index = {}
  const checkIndex = name => {
    if (depends[name].length === 0) {
      return 1
    }
    let result = 1
    for (const i in depends[name]) {
      result += checkIndex(depends[name][i])
    }
    return result
  }
  for (const i in depends) {
    index[i] = checkIndex(i)
  }
  return index
}
