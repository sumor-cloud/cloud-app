const getHtmlResponse = ({
  title, code, desc, data
}) => {
  const dataString = JSON.stringify(data, null, 4)
  return `<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<style type="text/css">
html{
    background: #273343;
    color: #fff;
    text-align: center;
    padding: 30px;
}
.title{
    opacity: .6;
    padding-bottom: 10px;
}
.content{
    padding-bottom: 10px;
}
.showDetail{
    margin-top: 20px;
    color: #03a9f4;
    cursor: pointer;
}
.showDetail.show{
    display: none;
}
.detailBox{
    position: relative;
    opacity: 0;
}
.detailBox.show{
    opacity: 1;
}
pre{
    border: 1px solid rgba(255,255,255,.6);
    border-radius: 2px;
    text-align: left;
    height: 50%;
    max-width: 500px;
    margin: 0 auto;
    margin-top: 20px;
    overflow: auto;
    padding: 10px;
}
.detailMessage{
    font-size: 14px;
    width: fit-content;
    margin: 0 auto;
    margin-top: 5px;
}
</style>
</head>
<body>
<h1>${title}</h1>
<div class="title">错误原因</div>
<div class="content">${code} ${desc}</div>
<div class="title showDetail" onclick="show()">点击查看详细错误信息</div>
<div class="detailBox">
    <pre>${dataString}</pre>
    <div class="detailMessage">请将该技术信息提供给应用管理员</div>
</div>
<script>
function show(){
    var oDiv = document.getElementsByTagName('div')[2];
    oDiv.classList.add('show')
    var oPre = document.getElementsByTagName('div')[3];
    oPre.classList.add('show');
}
</script>
</body>
</html>`
}

class Response {
  constructor (req, res) {
    this.req = req
    this.res = res
    this.respond = false
    this._changed = false
    this._hasError = false
    this._code = 'OK'
    this._message = ''
    this._data = null
  }

  set code (val) {
    const _message = this.req.sumor.text(val, this._data)
    if (val && _message) {
      this._code = val
      this._message = _message
    } else {
      this._code = 'sumorApp.NETWORK_ERROR'
      this._message = this.req.sumor.text(this._code)
    }
  }

  get code () {
    return this._code
  }

  set message (val) {
    this._message = val
  }

  get message () {
    return this._message
  }

  set data (val) {
    this._data = val
    this._changed = true
  }

  get data () {
    return this._data
  }

  set changed (val) {
    this._changed = val
  }

  get changed () {
    return this._changed
  }

  error (code) {
    this.code = code
    this._hasError = true
  }

  end () {
    if (this._data !== undefined) {
      try {
        this.res.send(this._data)
      } catch (e) {
        if (e.code !== 'ERR_HTTP_HEADERS_SENT') {
          throw e
        }
      }
    }
  }

  send () {
    const result = {
      code: this._code,
      message: this._message,
      data: this._data
    }
    if (!this._hasError) {
      try {
        this.res.set('Content-Type', 'application/json;charset=utf-8')
        this.res.send(result)
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
          this.res.send(getHtmlResponse({
            title: '服务异常，请稍后再试',
            ...result
          }))
        } else {
          this.res.send(result)
        }
      } catch (e) {
        if (e.code !== 'ERR_HTTP_HEADERS_SENT') {
          throw e
        }
      }
    }
  }
}

export default async (app) => {
  app.use((req, res, next) => {
    req.sumor.response = new Response(req, res)
    next()
  })
}
