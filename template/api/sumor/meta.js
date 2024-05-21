export default async (context, req, res) => {
  const exposeApis = {}
  for (const i in context.exposeApis) {
    const api = context.exposeApis[i]
    exposeApis[i] = {
      name: api.name,
      desc: api.desc,
      parameters: api.parameters
    }
  }
  return {
    name: context.name,
    instance: context.instance,
    api: exposeApis,
    text: req.sumor.text()
  }
}
