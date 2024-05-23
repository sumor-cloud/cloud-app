const startTime = Date.now() / 1000
const startHRTime = process.hrtime.bigint()

export default precision => {
  precision = precision || 's'
  const ns = Number(process.hrtime.bigint() - startHRTime)
  let us = ns / 1000
  if (precision === 'us') {
    us = Math.round(us)
  }
  let ms = us / 1000
  if (precision === 'ms') {
    ms = Math.round(ms)
  }
  let s = startTime + ms / 1000
  if (precision === 's') {
    s = Math.round(s)
  }
  return s
}
