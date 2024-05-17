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

  const inboundMode = (options.mode || process.env.mode || 'production').toLowerCase()

  let mode
  switch (inboundMode) {
    case 'dev':
      mode = 'development'
      break
    case 'debug':
      mode = 'development'
      break
    case 'development':
      mode = 'development'
      break
    case 'build':
      mode = 'build'
      break
    case 'setup':
      mode = 'setup'
      break
    case 'preview':
      mode = 'preview'
      break
    case 'production':
      mode = 'production'
      break
    case 'run':
      mode = 'production'
      break
    default:
      mode = 'production'
      break
  }

  context.setContext({
    mode
  })
  context.root = process.cwd()

  return context
}
