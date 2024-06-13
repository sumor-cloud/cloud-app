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
    try {
      this.res.set('Content-Type', 'application/json;charset=utf-8')
      this.res.send(this._response)
    } catch (e) {
      if (e.code !== 'ERR_HTTP_HEADERS_SENT') {
        throw e
      }
    }
  }
}

export default Response
