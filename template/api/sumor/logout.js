export default async (context, req, res, next) => {
  const token = req.sumor.token
  if (token.user) {
    await token.destroy()
  }
}
