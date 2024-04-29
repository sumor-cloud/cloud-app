export default (views) => {
  const obj = {}
  for (const i in views) {
    obj[i] = views[i].sql
  }
  return obj
}
