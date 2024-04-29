function streamToBuffer (stream) {
  return new Promise((resolve, reject) => {
    const buffers = []
    stream.on('error', reject)
    stream.on('data', (data) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
  })
}

export default async (source, type) => {
  if (source) {
    type = type || 'stream'
    let result
    let buffer
    switch (type) {
      case 'string':
        buffer = await streamToBuffer(source)
        result = buffer.toString()
        break
      case 'buffer':
        result = await streamToBuffer(source)
        break
      default:
        result = source
        break
    }
    return result
  }
  return source
}
