import varStyle from './varStyle.js'

export default style => {
  const customStyle = varStyle(style)
  return {
    preprocessorOptions: {
      scss: {
        additionalData: customStyle.scss
      },
      less: {
        modifyVars: customStyle.less,
        javascriptEnabled: true
      }
    }
  }
}
