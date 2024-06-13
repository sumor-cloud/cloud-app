export default async ({ config, instance, exposeApis }) => {
  return {
    name: config.name,
    instance,
    api: exposeApis
  }
}
