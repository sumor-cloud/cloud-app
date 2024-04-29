// import crypto from "crypto";
import fs from 'fs'
// import path from "path";
import axios from 'axios'
import { hextob64, KJUR } from 'jsrsasign'

export default (config) => {
  const privateKeyPath = `${process.cwd()}/${config.pay.privateKey}`
  const entryPoint = 'https://api.mch.weixin.qq.com'
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8')

  const rsaSign = function (params, hash = 'SHA256withRSA') {
    const content = `${params.join('\n')}\n`
    // 创建 Signature 对象
    const signature = new KJUR.crypto.Signature({
      alg: hash,
      //! 这里指定 私钥 pem!
      prvkeypem: privateKey
    })
    signature.updateString(content)
    const signData = signature.sign()
    // 将内容转成base64
    return hextob64(signData)
  }

  const call = async (payload) => {
    const timestamp = Math.floor(Date.now() / 1000)
    const nonceStr = Math.random().toString(36).substr(2, 15)

    const signature = rsaSign([
      payload.method.toUpperCase(),
      payload.url,
      timestamp,
      nonceStr,
      payload.body
    ])

    // let sign = crypto.createSign("RSA-SHA256");
    // sign.update(message);
    // let signature = sign.sign(privateKey, "base64");

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${config.pay.mchId}",nonceStr="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${config.pay.serialNo}"`
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

  const order = async function (params) {
    params.desc = params.desc || '虚拟商品'
    const payload = {
      method: 'POST',
      url: '/v3/pay/transactions/jsapi',
      body: JSON.stringify({
        appid: config.key,
        mchid: config.pay.mchId,
        description: params.desc,
        out_trade_no: params.id,
        notify_url: config.pay.notifyUrl,
        amount: {
          total: Math.round(params.amount * 100),
          currency: 'CNY'
        },
        payer: {
          openid: params.openId
        }
      })
    }
    const response = await call(payload)
    return response.prepay_id
  }

  const check = async function (id) {
    return await call({
      method: 'GET',
      url: `/v3/pay/transactions/out-trade-no/${id}?mchid=${config.pay.mchId}`
    })
  }

  const close = async function (id) {
    const payload = {
      method: 'POST',
      url: `/v3/pay/transactions/out-trade-no/${id}/close`,
      body: JSON.stringify({
        mchid: config.pay.mchId,
        out_trade_no: id
      })
    }
    return await call(payload)
  }

  return {
    sign: rsaSign,
    order,
    check,
    close
  }
}
