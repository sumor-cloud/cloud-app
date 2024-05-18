import { describe, expect, it, beforeAll, afterAll } from '@jest/globals'
import loadConfig from '../src/context/loadConfig.js'
import fse from 'fs-extra'

const root = `${process.cwd()}/tmp`
const configRoot = `${root}/config`
const entityRoot = `${root}/entity`
const viewRoot = `${root}/view`

describe('context', () => {
  beforeAll(async () => {
    await fse.ensureDir(configRoot)
    await fse.ensureDir(entityRoot)
    await fse.ensureDir(viewRoot)
  })
  afterAll(async () => {
    await fse.remove(root)
  })
  it('load config', async () => {
    await fse.writeJson(`${root}/sumor.json`, {
      dark: true
    })
    await fse.writeJson(`${configRoot}/config.json`, {
      database: {
        host: 'localhost'
      }
    })

    const config = await loadConfig(root)
    expect(config).toEqual({
      dark: true,
      database: {
        host: 'localhost'
      }
    })
  })
  it('load meta', async () => {
    await fse.writeJson(`${entityRoot}/Car.json`, {
      name: '汽车',
      property: {
        model: {
          name: '型号',
          type: 'string',
          length: 100
        }
      }
    })
    await fse.writeFile(`${viewRoot}/vCar.view.sql`, `select * from car`)
  })
})
