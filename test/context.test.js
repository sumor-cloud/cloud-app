import { describe, expect, it } from '@jest/globals'
import loadConfig from '../src/context/loadConfig.js'
import loadMeta from '../src/context/loadMeta.js'
const root = `${process.cwd()}/test/demo`

describe('context', () => {
  it('load config', async () => {
    const config = await loadConfig(root)
    expect(config).toEqual({
      dark: true,
      database: {
        host: 'localhost'
      }
    })
  })
  it('load meta', async () => {
    const meta = await loadMeta(root)
    expect(meta.entity.Car.name).toBe('Car')
    expect(meta.view.vCar.sql).toBe('select * from car')
    expect(meta.api['api.plus'].name).toBe('Plus')
    console.log(meta)
  })
})
