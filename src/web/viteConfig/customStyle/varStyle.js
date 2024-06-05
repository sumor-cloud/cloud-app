import alias from './alias.js'
import defaultValue from './defaultValue.js'

const getVar = (data, alias) => {
  let scss = ''
  for (const i in data) {
    scss += `$${i}:${data[i]};\n`
  }
  for (const i in alias) {
    scss += `$${i}:$${alias[i]};\n`
  }

  const less = {}
  for (const i in data) {
    less[i] = data[i] // +=`@${i}:${data[i]};\n`;
  }
  for (const i in alias) {
    less[i] = `@${alias[i]}`
  }
  return { scss, less }
}

export default vars => {
  vars = defaultValue(vars)
  return getVar(vars, alias)
}
