export default options => {
  const context = {}
  const middlewares = {}
  context.setContext = (key, value) => {
    if (typeof key === 'object') {
      Object.assign(context, key)
      Object.assign(middlewares, key)
    } else {
      context[key] = value
      middlewares[key] = value
    }
  }
  context.getContext = () => ({ ...middlewares })

  context.setContext({
    mode: options.mode || 'production'
  })

  context.root = process.cwd()

  return context
}
