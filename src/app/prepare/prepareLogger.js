import Logger from '@sumor/logger'

export default async (context) => {
  return (scope, id) => new Logger({
    scope,
    level: context.config.logLevel,
    id
  })
}
