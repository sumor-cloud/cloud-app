import { describe, expect, it } from '@jest/globals'
import loadConfig from '../src/config/loadConfig.js'
import loadEvent from '../src/serve/api/loadEvent.js'
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
  it('load program', async () => {
    const event = await loadEvent(root)
    // expect(program.api['api.plus'].name).toBeDefined()
    // expect(program.api['sumor.token'].name).toBeDefined()
    expect(await event('serve')()).toBe('OK')

    // const plus = program.api['api.plus'].program
    // const result = await plus({
    //   data: {
    //     a: 1,
    //     b: 1
    //   }
    // })
    // expect(result).toEqual(2)
  })
})
