export default (code) => {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'
  const radix = chars.length
  code = String(code)
  const len = code.length
  let i = 0
  let number = 0
  while (i < len) {
    number += radix ** i++ * chars.indexOf(code.charAt(len - i) || 0)
  }
  return number
}
