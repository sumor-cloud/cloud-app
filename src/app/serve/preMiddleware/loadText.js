const matchParameters = (message, data) => {
  message = message || ''
  data = data || {}
  const parameters = message.match(/\${.*?}/g)
  if (parameters) {
    for (const attr of parameters) {
      const parameterName = attr.substr(2, attr.length - 3)
      const value = data[parameterName] || ''
      message = message.replace(attr, value)
    }
  }
  return message
}

const getText = (texts, defaultLanguage) => (key, data, language) => {
  data = data || {}
  language = language || defaultLanguage
  let lang1
  let lang2
  if (language !== '') {
    const languageArray = language.split('-')
    lang1 = languageArray[0]
    lang2 = languageArray[1]
  }
  if (!key) {
    const result = {}
    for (const namespace in texts) {
      const baseData = texts[namespace][''] || {}
      let lang1Data = {}
      let lang2Data = {}
      if (lang1) {
        lang1Data = texts[namespace][lang1] || {}
      }
      if (lang2) {
        lang2Data = texts[namespace][language] || {}
      }
      const namespaceData = { ...baseData, ...lang1Data, ...lang2Data }
      for (const key in namespaceData) {
        result[`${namespace}.${key}`] = namespaceData[key]
      }
    }
    return result
  }
  const keyArray = key.split('.')
  const textKey = keyArray.pop()
  const namespace = keyArray.join('.')

  let result
  if (texts[namespace]) {
    // 查找语言+地区
    if (lang2) {
      const target = texts[namespace][language] || {}
      result = target[textKey]
    }

    // 查找语言
    if (!result && lang1) {
      const target = texts[namespace][lang1] || {}
      result = target[textKey]
    }

    // 查找默认值
    if (!result) {
      const target = texts[namespace][''] || {}
      result = target[textKey]
    }
  }
  return matchParameters(result, data)
}

export default async app => {
  const text = {}
  for (const namespace in app.sumor.meta.text) {
    text[namespace] = text[namespace] || {}
    text[namespace][''] = app.sumor.meta.text[namespace].origin || {}
    for (const language in app.sumor.meta.text[namespace].target) {
      text[namespace][language] = app.sumor.meta.text[namespace].target[language] || {}
    }
  }

  app.sumor.text = getText(text, app.sumor.language)
  app.use((req, res, next) => {
    req.sumor.text = getText(text, req.sumor.language)
    next()
  })
}
