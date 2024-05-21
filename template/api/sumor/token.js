export default (context, req, res, next) => {
  const token = req.sumor.token
  if (token.id) {
    const nickname = token.data ? token.data.nickname : ''
    return {
      id: token.id,
      user: token.user,
      nickname,
      time: token.time,
      permission: token.permission
    }
  }
  return {}
}
