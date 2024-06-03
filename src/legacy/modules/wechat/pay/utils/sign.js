// import { hextob64, KJUR } from 'jsrsasign';
import crypto from 'crypto'
import fs from 'fs'
//
// export default function (params, privateKey) {
//   const hash = 'SHA256withRSA';
//   const content = params.join('\n') + '\n';
//   // 创建 Signature 对象
//   const signature = new KJUR.crypto.Signature({
//     alg: hash,
//     //! 这里指定 私钥 pem!
//     prvkeypem: privateKey
//   });
//   signature.updateString(content);
//   const signData = signature.sign();
//   // 将内容转成base64
//   return hextob64(signData);
// };
export default (params, config) => {
  const privateKeyPath = `${process.cwd()}/${config.pay.privateKey}`
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
  const content = `${params.join('\n')}\n`
  return crypto.createSign('RSA-SHA256').update(content).sign(privateKey, 'base64')
}
