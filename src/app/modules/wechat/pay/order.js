import call from './utils/call.js'

export default async (params, config) => {
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
  const response = await call(payload, config)
  return response.prepay_id
}
