export default (text, spliter, lower) => {
  spliter = spliter || '-'
  text = text.toLowerCase()
  const arr = text.split(spliter)

  text = ''
  for (const i in arr) {
    const str = arr[i]

    text += str.replace(str[0], str[0].toUpperCase())
  }
  if (lower) {
    text = text.replace(text[0], text[0].toLowerCase())
  }
  return text
}
