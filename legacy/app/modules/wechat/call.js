import axios from 'axios'

export default async (url, data) => {
  try {
    let result
    if (data) {
      result = await axios.post(url, data)
    } else {
      result = await axios.get(url)
    }
    if (!result.data.errcode) {
      return result.data
    }
    const err = new Error('WECHAT_ERROR')
    err.data = { msg: result.data.errmsg }
    throw err
  } catch (e) {
    const err = new Error('WECHAT_API_FAILED')
    err.data = { msg: `微信服务器连接失败：${e.message}` }
    throw err
  }
}
