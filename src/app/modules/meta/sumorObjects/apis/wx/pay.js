export default async (context, req, res) => {
  const {
    data, config, response, tools, wechat
  } = context
  if (config.wechat) {
    response.respond = true
    const id = data.id

    const params = {
      appId: config.wechat.key, // 公众号ID，由商户传入
      timeStamp: Math.round(Date.now() / 1000), // 时间戳，自1970年以来的秒数
      nonceStr: tools.uuid(), // 随机串
      package: `prepay_id=${id}`,
      signType: 'RSA' // 微信签名方式：
    }
    params.paySign = wechat.pay.sign([params.appId, params.timeStamp, params.nonceStr, params.package])
    res.end(`
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>微信支付</title>
</head>
<body>
<h1 id="message">正在启动微信支付，请稍后。如遇到问题，请稍后重试或联系客服。</h1>
<script>
function onBridgeReady() {
    WeixinJSBridge.invoke('getBrandWCPayRequest', ${JSON.stringify(params)},
    function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            
            var divElem = document.getElementById('message');  // 获取指定ID的div元素
            divElem.innerHTML = '支付完成';  // 修改div元素中的内容
            setTimeout(function (){
                var target = '${config.wechat.pay.callback || ''}';
                if(target&&target!==""){
                    window.location.href = target;
                }else{
                    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
                    if(isChrome) {
                      window.location.href = 'about:blank';
                      window.close();
                    } else {
                      window.close();
                    }
                }
            },1000);
        }
    });
}
if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
} else {
    onBridgeReady();
}
</script>
</body>
</html>`)
  }
}
