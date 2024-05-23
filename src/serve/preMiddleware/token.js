import type from '../../utils/type.js'

class Token {
  constructor(req) {
    this.req = req
    this._id = req.sumor.cookie.t
    this._user = null
    this._permission = {}
    this._data = {}
    this._time = 0
  }

  async update({ user, data, permission }) {
    if (user) {
      this._user = user
      if (this.req.sumor.db) {
        this.req.sumor.db.setUser(user)
      }
    }
    if (permission) {
      this._permission = permission
    }
    if (data) {
      this._data = data
    }
    // await this.save();
  }

  get id() {
    return this._id || ''
  }

  set id(id) {
    throw new Error('sumorApp.TOKEN_ID_EDIT_FORBIDDEN_DIRECTLY')
  }

  get time() {
    return this._time || ''
  }

  set time(time) {
    throw new Error('sumorApp.TOKEN_TIME_EDIT_FORBIDDEN_DIRECTLY')
  }

  get data() {
    return this._data || {}
  }

  set data(id) {
    throw new Error('sumorApp.TOKEN_DATA_EDIT_FORBIDDEN_DIRECTLY')
  }

  get user() {
    return this._user || ''
  }

  set user(user) {
    throw new Error('sumorApp.USER_EDIT_FORBIDDEN_DIRECTLY')
  }

  get permission() {
    return this._permission
  }

  set permission(permission) {
    throw new Error('sumorApp.PERMISSION_EDIT_FORBIDDEN_DIRECTLY')
  }

  async setId(id) {
    this._id = id
    await this.save()
  }

  async setData(key, value) {
    this._data[key] = value
    await this.save()
  }

  async setPermission(key, list) {
    /*
            支持三种类型的设置：
            1. Permission1,"Attribute1"
            2. ['Permission1','Permission2']
            3. {Permission1:["Attribute1"],Permission2:[]}
        */
    if (key) {
      let permission = {}
      if (typeof key === 'string') {
        permission[key] = list || []
      } else if (type(key) === 'array') {
        for (const name of key) {
          permission[name] = []
        }
      } else {
        permission = key
      }
      for (const item in permission) {
        this._permission[item] = this._permission[item] || []
        this._permission[item] = this._permission[item].concat(permission[item])
      }
      await this.save()
    }
  }

  has(key, value) {
    let matched = false
    if (this._permission[key]) {
      if (value) {
        if (this._permission[key].indexOf(value) >= 0) {
          matched = true
        }
      } else {
        matched = true
      }
    }
    return matched
  }

  check(key, value) {
    if (!this.user) {
      // 检查是否登录
      throw new Error('sumorApp.LOGIN_EXPIRED')
    } else {
      // 检查指定权限项目
      if (key) {
        let currentMatched
        const lacked = []
        const appendLacked = (key, value) => {
          if (value) {
            lacked.push(`${key}-${value}`)
          } else {
            lacked.push(`${key}`)
          }
        }
        if (typeof key === 'string') {
          currentMatched = this.has(key, value)
          if (!currentMatched) {
            appendLacked(key, value)
          }
        } else {
          for (const i in key) {
            const current = key[i]
            if (typeof current === 'string') {
              currentMatched = this.has(current, '')
              if (!currentMatched) {
                appendLacked(current, '')
              }
            } else {
              currentMatched = this.has(current.key, current.value)
              if (!currentMatched) {
                appendLacked(current.key, current.value)
              }
            }
          }
        }

        const matched = lacked.length > 0
        if (lacked.length > 0) {
          const error = new Error('sumorApp.PERMISSION_DENIED')
          error.data = { auth: lacked.join(',') }
          throw error
        }
        return matched
      }
    }
  }

  async destroy() {
    this._id = null
    await this.save()
    // if (this.id !== '') {
    //   await this.req.sumor.cache.set('token', this.id, undefined);
    //   delete this.req.sumor.cookie.t;
    // }
  }

  // async load () {
  //   if (this.id !== '') {
  //     let res = await this.req.sumor.cache.get('token', this.id);
  //     if (res) {
  //       res = JSON.parse(res);
  //       this._user = res.user || null;
  //       this._time = res.time || 0;
  //       this._data = res.data || {};
  //       this._permission = res.permission || {};
  //     } else {
  //       this._id = null;
  //       this.req.sumor.cookie.t = this._id;
  //     }
  //   }
  // }

  async save() {
    this.req.sumor.cookie.t = this._id
  }
}

export default async app => {
  app.use(async (req, res, next) => {
    const apiPaths = Object.keys(app.sumor.meta.api)
    const matched =
      apiPaths.filter(path => {
        return req.path === `/${path.replace(/\./g, '/')}`
      }).length > 0
    if (matched) {
      req.sumor.token = new Token(req)
      if (app.sumor.meta.event.token) {
        req.sumor.token.load = async () => {
          await app.sumor.meta.event.token.program(req.sumor, req, res)
        }
        await req.sumor.token.load()
      }
      if (req.sumor.token.user && req.sumor.db) {
        req.sumor.db.setUser(req.sumor.token.user)
      }
    }

    next()
  })
}
