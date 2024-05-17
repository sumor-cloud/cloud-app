import call from './utils/call.js'

export default async function (id, config) {
  let result
  try {
    result = await call(
      {
        method: 'GET',
        url: `/v3/pay/transactions/out-trade-no/${id}?mchid=${config.pay.mchId}`
      },
      config
    )
  } catch (e) {
    if (e.status === 404) {
      result = { trade_state: 'NOTPAY' }
    } else {
      throw e
    }
  }
  return result
}
