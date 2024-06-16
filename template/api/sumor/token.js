export default ({ token }) => {
  if (token.id) {
    return {
      id: token.id,
      user: token.user,
      permission: token.permission || {},
      data: token.data || {}
    }
  } else {
    return {
      id: null,
      user: null,
      permission: {},
      data: {}
    }
  }
}
