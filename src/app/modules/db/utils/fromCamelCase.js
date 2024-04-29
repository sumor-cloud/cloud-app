export default (text, spliter) => {
  spliter = spliter || '-'
  const isUpper = function (char) {
    return char >= 'A' && char <= 'Z'
  }
  const list = []

  for (let i = 0; i < text.length; i++) {
    const current = text.charAt(i)
    const lower = current.toLowerCase()

    if (list.length === 0) {
      list.push(lower)
    } else {
      if (isUpper(current)) {
        list.push('')
      }
      list[list.length - 1] = list[list.length - 1] += lower
    }
  }
  return list.join(spliter)
}
