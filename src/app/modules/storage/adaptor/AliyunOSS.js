import OSS from 'ali-oss'
// import exifGeojson from "exif-geojson";

const imageOptionsMeta = {
  resize: {
    mode: 'm',
    width: 'w',
    height: 'h',
    longer: 'l',
    shorter: 's'
  },
  quality: {
    related: 'q',
    absolute: 'Q'
  },
  circle: {
    radius: 'r'
  },
  blur: {
    radius: 'r',
    size: 's'
  }
}
const parseOptions = (options) => {
  const optionsData = {}
  if (options.image) {
    const items = []
    for (const i in imageOptionsMeta) {
      const option = options.image[i]
      if (option) {
        const item = []
        item.push(i)
        for (const j in imageOptionsMeta[i]) {
          if (option[j]) {
            item.push(`${imageOptionsMeta[i][j]}_${option[j]}`)
          }
        }
        items.push(item.join(','))
      }
    }
    if (options.image.format) {
      items.push(`format,${options.image.format}`)
    }
    if (options.image.orient) {
      items.push('auto-orient,1')
    }
    if (items.length > 0) {
      optionsData.process = `image/${items.join('/')}`
      // console.log(optionsData.process);
    }
  }
  return optionsData
}

class AliyunOSS {
  constructor (config) {
    this.aliyunOSS = new OSS(config)
    // this.imgClient = OSS.ImageClient(config);
  }

  async put (target, stream) {
    const response = await this.aliyunOSS.putStream(target, stream)
    if (response.res.status > 299) {
      const error = new Error('sumorStorage.STORAGE_INSTANCE_ERROR')
      error.data = { msg: response.res }
      throw error
    }
  }

  async info (target, options) {
    options = options || {}
    const result = {}
    let response
    let error
    try {
      response = await this.aliyunOSS.get(target, {
        process: 'image/info'
      })
      if (options.color) {
        try {
          const averageHue = await this.aliyunOSS.get(target, {
            process: 'image/average-hue'
          })
          if (averageHue.content) {
            const averageHueResult = JSON.parse(averageHue.content.toString())
            result.color = averageHueResult.RGB.replace('0x', '#')
          }
        } catch (e) {
          // ignore error
        }
      }
    } catch (e) {
      if (e.code !== 'NoSuchKey') {
        error = e.message
      } else {
        return null
      }
    }
    if (!error && response && response.res.status > 299) {
      error = response.res
    }
    if (error) {
      const err = new Error('sumorStorage.STORAGE_INSTANCE_ERROR')
      err.data = { msg: error }
      throw err
    }
    const origin = JSON.parse(response.content.toString())
    const getInfo = (name) => {
      if (origin[name]) {
        return origin[name].value
      }
    }
    result.format = getInfo('Format')
    result.size = getInfo('FileSize')
    result.height = getInfo('ImageHeight')
    if (result.height) { result.height = parseInt(result.height, 10) }
    result.width = getInfo('ImageWidth')
    if (result.width) { result.width = parseInt(result.width, 10) }
    result.make = getInfo('LensMake')
    result.model = getInfo('LensModel')
    // try {
    //     const gps = {};
    //     const getAttr = (name) => {
    //         if (origin[name]) {
    //             gps[name] = origin[name].value;
    //         }
    //     };
    //     getAttr("GPSAltitude");
    //     getAttr("GPSAltitudeRef");
    //     getAttr("GPSDateStamp");
    //     getAttr("GPSDestBearing");
    //     getAttr("GPSDestBearingRef");
    //     getAttr("GPSImgDirection");
    //     getAttr("GPSImgDirectionRef");
    //     getAttr("GPSLatitude");
    //     getAttr("GPSLatitudeRef");
    //     getAttr("GPSLongitude");
    //     getAttr("GPSLongitudeRef");
    //     getAttr("GPSSpeed");
    //     getAttr("GPSSpeedRef");
    //     getAttr("GPSTag");
    //     const point = exifGeojson({gps});
    //     result.gps = JSON.stringify(point);
    // } catch (e) {
    //     //
    //     console.log(e);
    // }
    return result
  }

  async get (target, options) {
    let result
    let response
    let error
    try {
      response = await this.aliyunOSS.getStream(target, parseOptions(options))
    } catch (e) {
      if (e.code !== 'NoSuchKey') {
        error = e.message
      }
    }
    if (!error && response && response.res.status > 299) {
      error = response.res
    }
    if (error) {
      const err = new Error('sumorStorage.STORAGE_INSTANCE_ERROR')
      err.data = { msg: error }
      throw err
    }
    if (response) {
      result = response.stream
    }
    return result
  }

  async delete (target) {
    const response = await this.aliyunOSS.delete(target)
    if (response.res.status > 299) {
      const err = new Error('sumorStorage.STORAGE_INSTANCE_ERROR')
      err.data = { msg: response.res }
      throw err
    }
  }

  async exists (target) {
    let flag = true
    try {
      await this.aliyunOSS.get(target)
    } catch (e) {
      if (e.code === 'NoSuchKey') {
        flag = false
      } else {
        throw new Error('sumorStorage.STORAGE_INSTANCE_ERROR')
      }
    }
    return flag
  }
}
export default AliyunOSS
