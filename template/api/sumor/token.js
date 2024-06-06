export default (context, req, res, next) => {
  const token = req.token
  if (token.id) {
    const nickname = token.data ? token.data.nickname : ''
    return {
      id: token.id,
      user: token.user,
      nickname,
      permission: token.permission
    }
  }
  return {}
}
