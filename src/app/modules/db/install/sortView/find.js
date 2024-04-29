export default (views) => {
  const whereUsed = {}
  for (const i in views) {
    whereUsed[i] = []
    for (const j in views) {
      let sql = views[j].toLowerCase()
      sql = sql.replace(/`/g, '')
      sql = sql.replace(/\n/g, ' ')
      sql = sql.replace(/ {2}/g, ' ')
      sql = sql.replace(/ {2}/g, ' ')
      sql = sql.replace(/ {2}/g, ' ')
      if (sql.indexOf(` from ${i} `) >= 0 || sql.indexOf(` join ${i} `) >= 0) {
        whereUsed[i].push(j)
      }
    }
  }

  const dependencies = {}
  for (const i in views) {
    dependencies[i] = []
    for (const j in whereUsed) {
      if (whereUsed[j].indexOf(i) >= 0) {
        dependencies[i].push(j)
      }
    }
  }
  return dependencies
}
