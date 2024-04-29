import wxPay from './apis/wx/pay.js'

export default (context) => {
  const sumorApis = {
    monitor: {
      name: '服务健康状态监控',
      program: async (context, req, res) => req.sumor.monitor
    },
    text: {
      name: '当前语言环境文本数据',
      program: async (context, req, res) => req.sumor.text()
    },
    token: {
      name: '当前授权登录令牌',
      program: (context, req, res, next) => {
        const token = req.sumor.token
        if (token.id) {
          const nickname = token.data ? token.data.nickname : ''
          return {
            id: token.id,
            user: token.user,
            nickname,
            time: token.time,
            permission: token.permission
          }
        }
        return {}
      }
    },
    logout: {
      name: '退出登录',
      program: async (context, req, res, next) => {
        const token = req.sumor.token
        if (token.user) {
          await token.destroy()
        }
      }
    },
    range: {
      name: '数据输入范围列表',
      parameters: {
        name: {
          name: '数据名称',
          desc: '帮助数据的名称',
          required: true,
          type: 'string'
        }
      },
      program: async (context, req, res) => {
        const name = req.sumor.data.name
        return req.sumor.range(name)
      }
    },
    meta: {
      name: '接口信息',
      program: async (context, req, res) => {
        const exposeApis = {}
        for (const i in context.exposeApis) {
          const api = context.exposeApis[i]
          exposeApis[i] = {
            name: api.name,
            desc: api.desc,
            parameters: api.parameters
          }
        }
        return {
          name: context.name,
          instance: context.instance,
          api: exposeApis,
          text: req.sumor.text()
        }
      }
    }
  }
  const result = {}
  for (const path in sumorApis) {
    result[`sumor.${path}`] = sumorApis[path]
  }
  result['wx.pay'] = {
    name: '微信支付',
    program: wxPay
  }
  return result
}
