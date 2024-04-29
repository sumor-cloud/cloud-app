import call from './utils/call.js'

export default async function (id, config) {
  return await call({
    method: 'POST',
    url: `/v3/pay/transactions/out-trade-no/${id}/close`,
    body: JSON.stringify({
      mchid: config.pay.mchId,
      out_trade_no: id
    })
  }, config)
}
