export default (app) => {
  app.use((req, res, next) => {
    const acceptLanguage = req.get('accept-language') || app.sumor.language
    const languageList = acceptLanguage.split(',')
    const language = languageList[0]
    const languages = []
    for (const i in languageList) {
      languages.push(languageList[i].split(';')[0])
    }

    req.sumor.language = language
    req.sumor.languages = languages
    next()
  })
}
