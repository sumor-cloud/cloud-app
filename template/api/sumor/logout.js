export default async ({ token }) => {
  if (token.user) {
    await token.destroy()
  }
}
