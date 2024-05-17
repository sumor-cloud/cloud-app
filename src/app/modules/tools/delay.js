export default async (sec) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, sec * 1000)
  })
