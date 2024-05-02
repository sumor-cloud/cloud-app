import Logger from '../../modules/logger/index.js'

export default async (context) => {
  return (scope, id) => new Logger({
    scope,
    level: context.config.logLevel,
    id
  })
}
