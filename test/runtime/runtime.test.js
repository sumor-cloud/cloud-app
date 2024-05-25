import { describe, expect, it } from '@jest/globals'
import getRuntime from '../../src/runtime/getRuntime.js'

describe('Runtime', () => {
  it('define runtime', () => {
    const runtime = getRuntime()
    expect(runtime).toBeDefined()

    const context1 = runtime.getContext()
    expect(context1).toBeDefined()
    expect(context1.logger).toBeUndefined()

    runtime.setContext({
      logger: 'logger'
    })
    runtime.setContext('db', 'db')
    const context2 = runtime.getContext()
    expect(context2).toBeDefined()
    expect(context2.logger).toBe('logger')
    expect(context2.db).toBe('db')
    expect(context1.logger).toBeUndefined()
  })
})
