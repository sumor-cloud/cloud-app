import axios from 'axios'
import sign from './sign.js'

export default async (payload, config) => {
  const entryPoint = 'https://api.mch.weixin.qq.com'
  const timestamp = Math.floor(Date.now() / 1000)
  const nonceStr = Math.random().toString(36).substr(2, 15)

  const signature = sign(
    [payload.method.toUpperCase(), payload.url, timestamp, nonceStr, payload.body],
    config
  )

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${config.pay.mchId}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${config.pay.serialNo}"`
  }

  try {
    const response = await axios({
      method: payload.method.toUpperCase(),
      url: entryPoint + payload.url,
      data: payload.body,
      headers
    })
    return response.data
  } catch (e) {
    throw e.response
  }
}
