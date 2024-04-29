import stream from 'stream'

const toStream = (source) => {
  let result = source
  let buffer
  if (typeof source === 'string') {
    buffer = Buffer.from(source)
  } else if (Buffer.isBuffer(source)) {
    buffer = source
  }
  if (buffer) {
    result = new stream.PassThrough()
    // setTimeout(() => {
    //     result.end(buffer);
    // }, 1000);
    result.end(buffer)
    // result.pipe(process.stdout);
  }
  return result
}
export default toStream
