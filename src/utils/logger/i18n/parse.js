export default (message, data) => {
  data = data || {}
  const regex = /\{([a-zA-Z0-9]+)\}/g // 匹配 {user} 的正则表达式
  const matches = message.match(regex)

  let newMessage = message
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i]
    const matchKey = match.replace('{', '').replace('}', '')
    if (data[matchKey]) {
      newMessage = newMessage.replace(match, data[matchKey])
    } else {
      newMessage = newMessage.replace(match, '')
    }
  }
  return newMessage
}
