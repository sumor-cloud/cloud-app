import AliyunOSS from './adaptor/AliyunOSS.js'
import File from './adaptor/File.js'

import toStream from './toStream.js'
import fromStream from './fromStream.js'
import getStreamMeta from './getStreamMeta.js'

export default class Storage {
  constructor(config) {
    if (config) {
      switch (config.type) {
        case 'aliyunOSS':
          this._instance = new AliyunOSS(config)
          break
        case 'file':
          this._instance = new File(config)
          break
        default:
          break
      }
    }
  }

  async put(target, data) {
    data = toStream(data)
    if (this._instance) {
      try {
        const meta = getStreamMeta(data)
        const res = await this._instance.put(target, data)
        meta.response = res
        return meta
      } catch (e) {
        throw new Error('sumorStorage.STORAGE_FILE_SAVE_FAILED')
      }
    } else {
      throw new Error('sumorStorage.STORAGE_NOT_CONNECTED')
    }
  }

  async get(target, options) {
    options = options || {}
    if (this._instance) {
      try {
        const result = await this._instance.get(target, options) // https://help.aliyun.com/document_detail/183902.html
        return await fromStream(result, options.type)
      } catch (e) {
        throw new Error('sumorStorage.STORAGE_FILE_READ_FAILED')
      }
    } else {
      throw new Error('sumorStorage.STORAGE_NOT_CONNECTED')
    }
  }

  async delete(target) {
    if (this._instance) {
      try {
        return await this._instance.delete(target)
      } catch (e) {
        throw new Error('sumorStorage.STORAGE_FILE_DELETE_FAILED')
      }
    } else {
      throw new Error('sumorStorage.STORAGE_NOT_CONNECTED')
    }
  }

  async info(target, options) {
    if (this._instance) {
      try {
        return await this._instance.info(target, options)
      } catch (e) {
        throw new Error('sumorStorage.STORAGE_FILE_INFO_FAILED')
      }
    } else {
      throw new Error('sumorStorage.STORAGE_NOT_CONNECTED')
    }
  }

  async exists(target) {
    if (this._instance) {
      try {
        return await this._instance.exists(target)
      } catch (e) {
        throw new Error('sumorStorage.STORAGE_FILE_INFO_FAILED')
      }
    } else {
      throw new Error('sumorStorage.STORAGE_NOT_CONNECTED')
    }
  }
}
