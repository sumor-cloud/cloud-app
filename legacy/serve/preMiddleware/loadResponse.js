const getHtmlResponse = ({ title, code, message, errors }) => {
  let errorsHtml = ''
  if (errors && errors.length > 0) {
    const dataString = JSON.stringify(errors, null, 4)
    errorsHtml = `<div class="detailBox">
    <pre>${dataString}</pre>
    <div class="detailMessage">请将该技术信息提供给应用管理员</div>
</div>`
  }
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
<div class="content">${code}</div>
<div class="content">${message}</div>
<div class="title showDetail" onclick="show()">点击查看详细错误信息</div>
${errorsHtml}
<script>
function show(){
    var oDiv = document.getElementsByTagName('div')[3];
    oDiv.classList.add('show')
    var oPre = document.getElementsByTagName('div')[4];
    oPre.classList.add('show');
}
</script>
</body>
</html>`
}

class Response {
  constructor(req, res) {
    this.req = req
    this.res = res
    this.respond = false
    this._changed = false
    this._response = {
      code: 'OK',
      data: null
    }
  }

  set changed(val) {
    throw new Error('changed is readonly')
  }

  get changed() {
    return this._changed
  }

  set data(val) {
    this._response.data = val
    this._changed = true
  }

  get data() {
    return this._data
  }

  error(error) {
    this._changed = true
    try {
      this._response = error.json()
    } catch (e) {
      this._response = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message
      }
    }
  }

  end() {
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

  send() {
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
            getHtmlResponse({
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

export default async app => {
  app.use((req, res, next) => {
    req.sumor.response = new Response(req, res)
    next()
  })
}
