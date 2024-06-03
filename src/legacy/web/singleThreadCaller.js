export default cb => {
  const status = {
    running: false,
    next: false
  }
  return async (...args) => {
    if (status.running) {
      status.next = true
      return
    }
    status.running = true
    await cb(...args)
    await new Promise(resolve => {
      setTimeout(resolve, 500)
    })
    status.running = false
    if (status.next) {
      status.next = false
      await cb()
    }
  }
}
