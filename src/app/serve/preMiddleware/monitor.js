import os from 'os'

const interval = 60 // 60;
const keep = 24 * 60

const serverUpTime = (Math.floor(Date.now() / 1000) - os.uptime()) * 1000
const serviceUpTime = Date.now()

// const round = (x) => Math.round(x * 100) / 100;
const round = (x) => Math.round(x)
const getMemory = () => round((os.totalmem() - os.freemem()) / os.totalmem() * 100)
const getIdleStatus = () => ({
  time: Date.now(),
  idle: os.cpus().map((cpu) => cpu.times.idle)
})
const compare = (t1, t2) => {
  const diff = t2.time - t1.time
  let total = 0
  for (const i in t2.idle) {
    const idle = t2.idle[i] - t1.idle[i]
    let rate = idle / diff
    if (rate > 1) {
      rate = 1
    }
    rate = 100 - rate * 100
    total += rate
  }
  return round(total / t2.idle.length)
}

const data = {
  serverUpTime,
  serviceUpTime,
  interval,
  memory: [],
  cpu: []
}
let lastStatus
const update = async () => {
  data.updateTime = Date.now()
  const currentStatus = getIdleStatus()
  if (lastStatus) {
    const rate = compare(lastStatus, currentStatus)
    data.cpu.unshift(rate)
    data.cpu = data.cpu.slice(0, keep)
  }
  lastStatus = currentStatus
  data.memory.unshift(getMemory())
  data.memory = data.memory.slice(0, keep)
}

export default async (app) => {
  update()
  setInterval(() => {
    update()
  }, interval * 1000)
  app.use((req, res, next) => {
    req.sumor.monitor = JSON.parse(JSON.stringify(data))
    next()
  })
}
