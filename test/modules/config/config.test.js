// port number prefix is 111

import {
  describe, expect, it, beforeEach, afterEach
} from '@jest/globals'
import fse from 'fs-extra'
import YAML from 'yaml'

import convert from '../../../src/modules/config/convert.js'
import load from '../../../src/modules/config/load.js'
import entry from '../../../src/modules/config/index.js'
import find from '../../../src/modules/config/find.js'
import os from 'os'

describe('Config', () => {
  const root = `${os.tmpdir()}/sumor-cloud-app-test/config`
  beforeEach(async () => {
    await fse.remove(root)
    await fse.ensureDir(root)
  })
  afterEach(async () => {
    await fse.remove(root)
  })
  it('load config files', async () => {
    // The loading order should be: yml > yaml > json
    await fse.writeFile(`${root}/config.json`, JSON.stringify({
      type: 'json'
    }))
    const config1 = await load(root, 'config')
    expect(config1.type).toBe('json')

    await fse.writeFile(`${root}/config.yaml`, YAML.stringify({
      type: 'yaml'
    }))
    const config2 = await load(root, 'config')
    expect(config2.type).toBe('yaml')

    await fse.writeFile(`${root}/config.yml`, YAML.stringify({
      type: 'yml'
    }))
    const config3 = await load(root, 'config')
    expect(config3.type).toBe('yml')

    await fse.ensureDir(`${root}/map`)
    await fse.writeFile(`${root}/map/china.yml`, YAML.stringify({
      type: 'yml'
    }))
    const config4 = await load(root, 'map/china')
    expect(config4.type).toBe('yml')
  })
  it('load failed', async () => {
    await fse.writeFile(`${root}/dummy.yaml`, '{"type":!@123}')
    const config = await load(root, 'dummy')
    expect(config).toBe(undefined)
  })
  it('convert type', async () => {
    await fse.writeFile(`${root}/config1.json`, JSON.stringify({
      type: 'json'
    }))
    await fse.writeFile(`${root}/config2.yaml`, JSON.stringify({
      type: 'yaml'
    }))
    await convert(root, 'config1', 'json')
    const config1 = await fse.readJson(`${root}/config1.json`)
    expect(config1.type).toBe('json')
    await convert(root, 'config2', 'json')
    const config2 = await fse.readJson(`${root}/config2.json`)
    expect(config2.type).toBe('yaml')

    // check if the original file is changed when converting to the same type
    const changeTime = (await fse.stat(`${root}/config2.json`)).mtimeMs
    await convert(root, 'config2', 'json')
    const newChangeTime = (await fse.stat(`${root}/config2.json`)).mtimeMs
    expect(newChangeTime).toBe(changeTime)
  })
  it('load scope config with entry', async () => {
    await fse.writeFile(`${root}/scope.json`, JSON.stringify({
      type: 'json'
    }))
    const config = await entry.load(root, 'scope', 'yaml')
    expect(config).toEqual({
      type: 'json'
    })
    const yamlConfig = await fse.readFile(`${root}/scope.yml`, 'utf8')
    expect(yamlConfig).toBe('type: json\n')
  })
  it('find config files', async () => {
    await fse.writeFile(`${root}/car.entity.json`, JSON.stringify({
      name: 'car'
    }))
    await fse.writeFile(`${root}/ship.entity.json`, JSON.stringify({
      name: 'ship'
    }))
    await fse.writeFile(`${root}/train.entity.yaml`, YAML.stringify({
      name: 'train'
    }))
    await fse.ensureDir(`${root}/map`)
    await fse.writeFile(`${root}/map/china.entity.yml`, YAML.stringify({
      name: 'china'
    }))
    const files = await find(root, 'entity')
    expect(files).toEqual([
      'car.entity',
      'map/china.entity',
      'ship.entity',
      'train.entity'
    ])
  })
  it('find config files with entry', async () => {
    await fse.writeFile(`${root}/car.entity.json`, JSON.stringify({
      name: 'car'
    }))
    await fse.writeFile(`${root}/ship.entity.json`, JSON.stringify({
      name: 'ship'
    }))
    await fse.writeFile(`${root}/train.entity.yaml`, YAML.stringify({
      name: 'train'
    }))
    await fse.ensureDir(`${root}/map`)
    await fse.writeFile(`${root}/map/china.entity.yml`, YAML.stringify({
      name: 'china'
    }))
    const configs = await entry.find(root, 'entity', 'yaml')
    expect(configs).toEqual({
      'car.entity': {
        name: 'car'
      },
      'ship.entity': {
        name: 'ship'
      },
      'train.entity': {
        name: 'train'
      },
      'map/china.entity': {
        name: 'china'
      }
    })

    const carConfig = await fse.readFile(`${root}/car.entity.yml`, 'utf8')
    expect(carConfig).toBe('name: car\n')
  })
})
