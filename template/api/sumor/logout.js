export default async (context, req, res, next) => {
  const token = req.token
  if (token.user) {
    await token.destroy()
  }
}
