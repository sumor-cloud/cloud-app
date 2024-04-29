import path from 'node:path'
import { fileURLToPath } from 'node:url'

export default path.dirname(fileURLToPath(import.meta.url))
