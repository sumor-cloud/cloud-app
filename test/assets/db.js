import fs from 'fs'

let db = fs.readFileSync(`${process.cwd()}/test/config/DB.json`, 'utf-8')
db = JSON.parse(db)

export default db
