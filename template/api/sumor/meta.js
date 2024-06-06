export default async (context, req, res) => {
  return {
    name: context.name,
    instance: context.instance,
    api: req.exposeApis
  }
}
