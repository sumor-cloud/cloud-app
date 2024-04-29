import Connector from '../Connector.js'
import getMethods from './methods.js'

export default async ({ config, logger }) => {
  logger = logger || {
    debug: console.log,
    trace: console.log
  }
  const report = {
    workingConnections: 0,
    alertConnections: 20
  }
  setInterval(() => {
    if (report.workingConnections > report.alertConnections) {
      console.log(`数据库连接过多，请检查是否有未提交的事务，当前连接数${report.workingConnections}`)
    } else {
      // console.log(`当前数据库连接数${workingConnections}`);
    }
  }, 1000)

  const connector = new Connector(config, logger)
  await connector.ensure()
  await connector.connect()

  const cache = {
    info: {}
  }

  const connect = async (logger, user) => getMethods(report, connector, cache, logger, user)
  const destroy = async () => {
    await connector.destroy()
  }

  return {
    connect,
    destroy
  }
}
