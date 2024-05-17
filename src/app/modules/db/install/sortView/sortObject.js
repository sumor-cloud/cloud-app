export default (rank, desc) => {
  let arr = []
  for (const i in rank) {
    arr.push({ name: i, index: rank[i] })
  }
  arr = arr.sort((x, y) => (x.index > y.index ? 1 : -1))
  if (desc) {
    arr = arr.reverse()
  }

  const result = []
  for (const i in arr) {
    result.push(arr[i].name)
  }
  return result
}
