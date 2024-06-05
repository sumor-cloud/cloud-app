export default () => {
  const runtime = {}
  const middlewares = {}
  runtime.setContext = (key, value) => {
    // context will be both runtime and middlewares
    if (typeof key === 'object') {
      Object.assign(runtime, key)
      Object.assign(middlewares, key)
    } else {
      runtime[key] = value
      middlewares[key] = value
    }
  }
  runtime.getContext = () => ({ ...middlewares })

  return runtime
}
