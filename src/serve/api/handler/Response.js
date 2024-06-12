import getErrorHtml from './getErrorHtml.js'

class Response {
  constructor(req, res) {
    this.req = req
    this.res = res
    this.respond = false
    this._response = {
      code: 'OK',
      data: null
    }
  }

  set data(val) {
    this._response.data = val
  }

  get data() {
    return this._response.data
  }

  error(error) {
    try {
      error.language = this.req.client.language
      this._response = error.json()
    } catch (e) {
      this._response = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message
      }
    }
  }

  send() {
    if (this.respond) {
      this.sendData()
    } else {
      this.sendJson()
    }
  }

  sendData() {
    // directly send response data
    try {
      const data = this._response.data || ''
      this.res.send(data)
    } catch (e) {
      if (e.code !== 'ERR_HTTP_HEADERS_SENT') {
        throw e
      }
    }
  }

  sendJson() {
    if (this._response.code === 'OK') {
      try {
        this.res.set('Content-Type', 'application/json;charset=utf-8')
        this.res.send(this._response)
      } catch (e) {
        if (e.code !== 'ERR_HTTP_HEADERS_SENT') {
          throw e
        }
      }
    } else {
      try {
        this.res.status(500)
        const accept = this.req.accepts(['html', 'json'])
        if (accept === 'html') {
          this.res.send(
            getErrorHtml({
              title: '服务异常，请稍后再试',
              ...this._response
            })
          )
        } else {
          this.res.send(this._response)
        }
      } catch (e) {
        if (e.code !== 'ERR_HTTP_HEADERS_SENT') {
          throw e
        }
      }
    }
  }
}

export default Response
