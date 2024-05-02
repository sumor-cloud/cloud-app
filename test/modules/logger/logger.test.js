import {
  describe, expect, it
} from '@jest/globals'

import getFormattedTime from '../../../src/modules/logger/getFormattedTime.js'
import colorful from '../../../src/modules/logger/colorful.js'
import formatPrefix from '../../../src/modules/logger/formatPrefix.js'
import Logger from '../../../src/modules/logger/index.js'

describe('Logger', () => {
  it('format time', async () => {
    const time = 1714640856354
    const offset = 0
    const formattedTime1 = getFormattedTime(time, offset)
    expect(formattedTime1).toBe('2024-05-02 09:07:36.354')

    const offset2 = 8 * 60 // UTC+8
    const formattedTime2 = getFormattedTime(time, offset2)
    expect(formattedTime2).toBe('2024-05-02 17:07:36.354')
  })
  it('colorful', async () => {
    process.env.loggerColorLevel = 3
    const text = 'DEMO'
    const colors = {
      trace: '#00a3af',
      debug: '#1183d3',
      info: '#2ecc71',
      warn: '#f39c12',
      error: '#b91f12',
      fatal: '#ff1300'
    }
    const colorfulText30 = colorful('trace', text, {
      trace: '#000'
    })
    expect(JSON.stringify(colorfulText30)).toBe('"\\u001b[38;2;0;0;0mDEMO\\u001b[39m"')
    const colorfulText31 = colorful('trace', text, colors)
    expect(JSON.stringify(colorfulText31)).toBe('"\\u001b[38;2;0;163;175mDEMO\\u001b[39m"')
    const colorfulText32 = colorful('debug', text, colors)
    expect(JSON.stringify(colorfulText32)).toBe('"\\u001b[38;2;17;131;211mDEMO\\u001b[39m"')
    const colorfulText33 = colorful('info', text, colors)
    expect(JSON.stringify(colorfulText33)).toBe('"\\u001b[38;2;46;204;113mDEMO\\u001b[39m"')
    const colorfulText34 = colorful('warn', text, colors)
    expect(JSON.stringify(colorfulText34)).toBe('"\\u001b[38;2;243;156;18mDEMO\\u001b[39m"')
    const colorfulText35 = colorful('error', text, colors)
    expect(JSON.stringify(colorfulText35)).toBe('"\\u001b[38;2;185;31;18mDEMO\\u001b[39m"')
    const colorfulText36 = colorful('fatal', text, colors)
    expect(JSON.stringify(colorfulText36)).toBe('"\\u001b[38;2;255;19;0mDEMO\\u001b[39m"')
    const colorfulText37 = colorful('unknown', text, colors)
    expect(JSON.stringify(colorfulText37)).toBe('"\\u001b[38;2;46;204;113mDEMO\\u001b[39m"')

    process.env.loggerColorLevel = 2
    const colorfulText21 = colorful('trace', text, colors)
    expect(JSON.stringify(colorfulText21)).toBe('"\\u001b[38;5;37mDEMO\\u001b[39m"')
    const colorfulText22 = colorful('debug', text, colors)
    expect(JSON.stringify(colorfulText22)).toBe('"\\u001b[38;5;38mDEMO\\u001b[39m"')
    const colorfulText23 = colorful('info', text, colors)
    expect(JSON.stringify(colorfulText23)).toBe('"\\u001b[38;5;78mDEMO\\u001b[39m"')
    const colorfulText24 = colorful('warn', text, colors)
    expect(JSON.stringify(colorfulText24)).toBe('"\\u001b[38;5;214mDEMO\\u001b[39m"')
    const colorfulText25 = colorful('error', text, colors)
    expect(JSON.stringify(colorfulText25)).toBe('"\\u001b[38;5;166mDEMO\\u001b[39m"')
    const colorfulText26 = colorful('fatal', text, colors)
    expect(JSON.stringify(colorfulText26)).toBe('"\\u001b[38;5;196mDEMO\\u001b[39m"')

    process.env.loggerColorLevel = 1
    const colorfulText11 = colorful('trace', text, colors)
    expect(JSON.stringify(colorfulText11)).toBe('"\\u001b[90mDEMO\\u001b[39m"')
    const colorfulText12 = colorful('debug', text, colors)
    expect(JSON.stringify(colorfulText12)).toBe('"\\u001b[34mDEMO\\u001b[39m"')
    const colorfulText13 = colorful('info', text, colors)
    expect(JSON.stringify(colorfulText13)).toBe('"\\u001b[32mDEMO\\u001b[39m"')
    const colorfulText14 = colorful('warn', text, colors)
    expect(JSON.stringify(colorfulText14)).toBe('"\\u001b[33mDEMO\\u001b[39m"')
    const colorfulText15 = colorful('error', text, colors)
    expect(JSON.stringify(colorfulText15)).toBe('"\\u001b[31mDEMO\\u001b[39m"')
    const colorfulText16 = colorful('fatal', text, colors)
    expect(JSON.stringify(colorfulText16)).toBe('"\\u001b[31mDEMO\\u001b[39m"')

    process.env.loggerColorLevel = 0
    const colorfulText01 = colorful('trace', text)
    expect(JSON.stringify(colorfulText01)).toBe('"DEMO"')
    const colorfulText02 = colorful('debug', text)
    expect(JSON.stringify(colorfulText02)).toBe('"DEMO"')
    const colorfulText03 = colorful('info', text)
    expect(JSON.stringify(colorfulText03)).toBe('"DEMO"')
    const colorfulText04 = colorful('warn', text)
    expect(JSON.stringify(colorfulText04)).toBe('"DEMO"')
    const colorfulText05 = colorful('error', text)
    expect(JSON.stringify(colorfulText05)).toBe('"DEMO"')
    const colorfulText06 = colorful('fatal', text)
    expect(JSON.stringify(colorfulText06)).toBe('"DEMO"')
  })
  it('format prefix', async () => {
    process.env.loggerColorLevel = 3
    const time = 1714640856354
    const offset = 0
    const level = 'info'
    const scope = 'test'
    const id = 'USER001'
    const formattedPrefix1 = formatPrefix({ time, offset })
    expect(formattedPrefix1).toBe('2024-05-02 09:07:36.354 TRACE MAIN -')
    const formattedPrefix2 = formatPrefix({ time, offset, level, scope, id })
    expect(formattedPrefix2)
      .toBe('2024-05-02 09:07:36.354 INFO TEST USER001 -')
  })
  it('entry', async () => {
    process.env.loggerColorLevel = 3
    process.env.loggerTimeOffset = 0
    const scope = 'test'
    const id = 'USER001'
    const logger = new Logger({
      scope,
      offset: 0,
      level: 'trace',
      id
    })
    let log1 = logger.trace('HELLO')
    log1 = JSON.stringify(log1)
    const log11 = log1.split('175m')[0]
    const log12 = log1.split('TRACE')[1]
    expect(log11).toBe('"\\u001b[38;2;0;163;')
    expect(log12).toBe(' TEST USER001 -\\u001b[39mHELLO"')

    let log2 = logger.debug(new Error())
    log2 = JSON.stringify(log2)
    console.log(log2)
    const log21 = log2.split('175m')[0]
    const log22 = log2.split('DEBUG')[1]
    expect(log21).toBe('"\\u001b[38;2;0;163;')
    expect(log22).toBe(' TEST USER001 -\\u001b[39m{}"')
  })
  it('exception', async () => {
    const logger = new Logger()
    expect(logger.trace()).toBe(undefined)
    const logger2 = new Logger({
      level: 'unknown'
    })
    expect(logger2.trace()).toBe(undefined)
  })
})
