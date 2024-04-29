// import net from "net";
// import http from "http";
// import https from "https";
// import fs from "fs";
//
// var httpPort = 3345;
// var httpsPort = 3346;
//
// var server = http.createServer(function(req, res) {
//     res.writeHead(200, {"Content-Type": "text/plain"});
//     res.end("hello world!");
// }).listen(httpPort);
//
// var options = {
//     key: fs.readFileSync("./ssl/domain.key"),
//     cert: fs.readFileSync("./ssl/domain.cer"),
//     ca: fs.readFileSync("./ssl/ca.cer")
// };
//
// var sserver = https.createServer(options, function(req, res) {
//     res.writeHead(200, {"Content-Type": "text/plain"});
//     res.end("secured hello world");
// }).listen(httpsPort);
//
// net.createServer(function(socket) {
//     socket.once("data", function(buf) {
//         console.log(buf[0]);
//         // https数据流的第一位是十六进制“16”，转换成十进制就是22
//         var address = buf[0] === 22 ? httpsPort : httpPort;
//         // 创建一个指向https或http服务器的链接
//         var proxy = net.createConnection(address, function() {
//             proxy.write(buf);
//             // 反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
//             socket.pipe(proxy).pipe(socket);
//         });
//
//
//         proxy.on("error", function(err) {
//             console.log(err);
//         });
//     });
//
//     socket.on("error", function(err) {
//         console.log(err);
//     });
// }).listen(3344);
//
// console.log("http://localhost:3344");
// console.log("http://localhost:3345");
// console.log("https://localhost:3346");
