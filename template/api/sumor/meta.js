export default async (context, req, res) => {
  const exposeApis = {}
  const apiPaths = Object.keys(context.meta.api)
  for (const path of apiPaths) {
    const apiData = context.meta.api[path]
    if (apiData) {
      const route = `/${path.replace(/\./g, '/')}`
      exposeApis[route] = {
        name: apiData.name || '',
        desc: apiData.desc || '',
        parameters: apiData.parameters || {}
      }
    }
  }
  return {
    name: context.name,
    instance: context.instance,
    api: exposeApis
  }
}
