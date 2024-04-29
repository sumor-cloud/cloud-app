import SMSClient from '@alicloud/sms-sdk'

let smsClient

export default class SMS {
  constructor (config, logger) {
    this._config = config
    this._logger = logger || {
      error: console.log,
      debug: console.log,
      trace: console.log
    }
  }

  async send (templateCode, mobilePrefix, mobile, param) {
    const { signName, accessKeyId, secretAccessKey } = this._config
    if (this._config && !this._config.disable) {
      if (!smsClient) {
        smsClient = new SMSClient({ accessKeyId, secretAccessKey })
      }

      switch (mobilePrefix) {
        case 86:
          if (!mobile.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
            throw new Error('sumorSMS.MOBILE_FORMAT')
          }
          break
        default:
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve()
            }, 1000)
          })
          throw new Error('sumorSMS.MOBILE_PREFIX_NOT_SUPPORT')
      }

      try {
        await new Promise((resolve, reject) => {
          smsClient.sendSMS({
            PhoneNumbers: mobile,
            SignName: signName,
            TemplateCode: templateCode,
            TemplateParam: JSON.stringify(param)
          }).then((res) => {
            const { Code } = res
            if (Code === 'OK') {
              resolve()
            } else {
              reject(Code)
            }
          }, (err) => {
            if (err.data) {
              reject(err.data.Code)
            } else {
              reject(err)
            }
          })
        })
      } catch (e) {
        const error = new Error('sumorSMS.SMS_SEND_FAILED')
        error.data = { msg: e }
        throw error
      }
    } else {
      this._logger.error(`消息发送功能不可用。需要发送消息${templateCode}给${mobilePrefix} ${mobile}，参数${JSON.stringify(param)}`)
    }
  }
}
