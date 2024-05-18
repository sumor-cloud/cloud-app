import { describe, expect, it } from '@jest/globals'
import getContext from '../src/context/index.js'
describe('context', () => {
  it('get config', () => {
    const context = getContext()
    expect(context).toBe('context')
  })
})
