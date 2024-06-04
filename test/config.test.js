import { describe, expect, it } from '@jest/globals'
import loadConfig from '../src/config/loadConfig.js'
import loadMeta from '../src/config/loadMeta.js'
const root = `${process.cwd()}/test/demo`

describe('context', () => {
  it('demo', () => {
    expect(1).toBe(1)
  })
  it('load config', async () => {
    const config = await loadConfig(root)
    expect(config.name).toBe('Sumor Cloud App')
    expect(config.logLevel).toBe('info')
    expect(config.port).toBe(443)
    expect(config.domain).toBe('localhost')
    expect(config.origin).toBe('https://localhost')
    expect(config.language).toBe('en-US')
    expect(config.dark).toBe(true)
    expect(config.database.host).toBe('localhost')
  })
  it('load meta', async () => {
    const meta = await loadMeta(root)
    expect(meta.api['api.plus'].name).toBe('Plus')
    expect(meta.event.serve).toBeDefined()
    expect(meta.event.token).toBeDefined()
    console.log(meta)
  })
})
