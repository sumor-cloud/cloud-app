import {
  describe, expect, it
} from '@jest/globals'

import demo from '../src/demo.js'

describe('Expose App', () => {
  it('Verify expose type', async () => {
    expect(demo(1, 1)).toBe(2)
  })
})
