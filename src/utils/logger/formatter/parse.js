export default (log) => {
  const regex = /#(.*?)\s-\s/g // 匹配 {user} 的正则表达式
  const matches = log.match(regex)

  const result = []
  const save = (pre, suf) => {
    const keys = pre.trim().replace('# ', '').replace(' -', '').split(' ')
    for (let i = 0; i < keys.length; i += 1) {
      keys[i] = keys[i].trim().replace('[', '').replace(']', '')
    }
    const time = new Date(keys[0]).getTime()
    const level = keys[1]
    const scope = keys[2]
    const id = keys[3]
    const content = suf.split('|')
    const message = content.shift().trim()
    let data
    if (content.length > 0) {
      const dataStr = content.join('|').trim()
      data = JSON.parse(dataStr)
    }
    const item = {
      time,
      level,
      scope
    }
    if (id) {
      item.id = id
    }
    item.message = message
    if (data) {
      item.data = data
    }
    result.push(item)
  }

  let remainingLog = log
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i]
    const arr = remainingLog.split(match)
    const pre = arr.shift()
    remainingLog = arr.join(match)
    if (i > 0) {
      save(matches[i - 1], pre)
    }
  }
  save(matches[matches.length - 1], remainingLog)

  return result
}
