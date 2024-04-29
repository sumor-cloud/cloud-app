export default (str) => {
  if (str) {
    // 替换/为-
    str = str.replace(/\//g, '-')

    // 删除首字母@
    str = str.replace(/@/g, '')

    // 首字母大写
    str = str.replace(/(\w)/, (v) => v.toUpperCase())

    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
  }
  return str
}
