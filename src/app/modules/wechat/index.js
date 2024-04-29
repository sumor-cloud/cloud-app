import axios from 'axios'
import wechatPay from './pay/index.js'

const refreshTime = 30 * 60 * 1000
export default class WeChat {
  constructor (config, cache, logger) {
    this._config = config
    this._cache = cache
    this._name = config.name || ''
    this._logger = logger
    this._updatingToken = false

    if (config.pay) {
      this.pay = {
        order (params) {
          return wechatPay.order(params, config)
        },
        close (params) {
          return wechatPay.close(params, config)
        },
        check (params) {
          return wechatPay.check(params, config)
        },
        sign (params) {
          return wechatPay.sign(params, config)
        }
      }
    }
  }

  async call (url, data) {
    let result
    try {
      if (data) {
        result = await axios.post(url, data)
      } else {
        result = await axios.get(url)
      }
    } catch (e) {
      const err = new Error('WECHAT_API_FAILED')
      err.data = { msg: `微信服务器连接失败：${e.message}` }
      throw err
    }
    if (!result.data.errcode) {
      return result.data
    }
    this._logger.error()
    const err = new Error('WECHAT_ERROR')
    err.data = { msg: result.data.errmsg }
    throw err
  }

  async init (app) {
    this._app = app
    this._logger.info(`微信校验文件已启动 /MP_verify_${this._config.verifyCode}.txt`)
    app.get(`/MP_verify_${this._config.verifyCode}.txt`, (req, res) => {
      const content = this._config.verifyCodeContent || this._config.verifyCode
      res.send(content)
    })
    await this.getToken()
    setInterval(() => {
      this._logger.trace('开始检查微信服务授权凭证是否过期')
      this.getToken()
      this._logger.trace('检查微信服务授权凭证已完成')
    }, 60 * 1000)
  }

  async getToken () {
    const getTokenFromCache = async () => {
      let token = await this._cache.get('wechatAccessToken', this._name)
      if (token) {
        token = JSON.parse(token)
      }
      token = token || {}
      token.time = token.time || 0
      return token
    }
    let token = await getTokenFromCache()
    if (Date.now() - token.time > refreshTime) {
      await this._refreshToken()
      token = await getTokenFromCache()
    }
    if (!token || !token.token || Date.now() - token.time > refreshTime) {
      this._logger.error('微信服务授权凭证更新失败')
    }

    return token.token
  }

  async reloadUsers () {
    let next = ''
    let total
    let current = 0
    let list = []
    const drill = async () => {
      const res = await this.list(next)
      if (!total) {
        total = res.total
      }
      current += res.count
      list = list.concat(res.data.openid)
      if (current < total) {
        next = res.next_openid
        await drill()
      }
    }

    await drill()

    const result = []
    for (const id of list) {
      result.push(await this.detail(id))
    }
    return result
  }

  async list (next) {
    next = next || ''
    const token = await this.getToken()
    const url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${token}&next_openid=${next}`
    return await this.call(url)
  }

  async detail (openid) {
    const token = await this.getToken()
    const url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${token}&openid=${openid}`
    return await this.call(url)
  }

  // async check(code) {
  //     const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this._config.key}&secret=${this._config.secret}&code=${code}&grant_type=authorization_code`;
  //     return await this.call(url);
  // }
  // async fetchInfo(openid) {
  //     const token = await this.getToken();
  //     const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openid}&lang=zh_CN`;
  //     return await this.call(url);
  // }
  async sendTemplateMessage (openId, templateId, url, data) {
    const token = await this.getToken()
    const dataStyle = {}
    for (const i in data) {
      dataStyle[i] = {
        value: data[i]
      }
    }
    const apiUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`
    try {
      await this.call(apiUrl, {
        touser: openId,
        template_id: templateId,
        url,
        data: dataStyle
      })
      this._logger.debug(`模版消息已发送给${openId}，模版${templateId}，数据${JSON.stringify(data)}`)
    } catch (e) {
      this._logger.error(`给${openId}的模版消息发送失败，模版${templateId}，数据${JSON.stringify(data)}`)
      this._logger.error(e)
    }
  }

  async updateMenu (data) {
    const token = await this.getToken()
    await this.call(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`, data)
  }

  async _refreshToken () {
    if (!this._updatingToken) {
      this._updatingToken = true
      this._logger.info('正在更新微信服务授权凭证')
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this._config.key}&secret=${this._config.secret}`
      const result = await axios.get(url)
      if (result.status === 200) {
        const tokenInfo = {}
        if (result.data.access_token) {
          tokenInfo.token = result.data.access_token
          tokenInfo.time = Date.now()
          this._logger.trace(`微信服务授权凭证: ${tokenInfo.token}`)
          this._logger.info('微信服务授权凭证已更新')
          await this._cache.set('wechatAccessToken', this._name, JSON.stringify(tokenInfo))
        } else {
          let err = result.data
          try {
            err = JSON.stringify(result.data)
          } catch (e) {}
          this._logger.error(err)
        }
      } else {
        let err = result.data
        try {
          err = JSON.stringify(result.data)
        } catch (e) {}
        this._logger.error(err)
      }
      this._updatingToken = false
    }
  }
}
