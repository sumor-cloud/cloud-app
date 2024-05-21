export default async (context, req, res) => {
  const name = req.sumor.data.name
  return req.sumor.range(name)
}
