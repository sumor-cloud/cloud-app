import { validate, format } from '@sumor/validator'
import CloudAppError from '../../../../src/CloudAppError.js'

export default (data, meta) => {
  let errors = []
  for (const key in meta.parameters) {
    data[key] = format(meta.parameters[key], data[key])
    const fieldErrors = validate(
      {
        error: true,
        ...meta.parameters[key]
      },
      data[key]
    )
    errors = errors.concat(fieldErrors)
  }
  if (errors.length > 0) {
    throw new CloudAppError('SUMOR_API_FIELDS_VALIDATION_FAILED', {}, errors)
  }
  //   const definition = meta.parameters[key]
  //
  //
  //   // 补充默认值
  //   if (definition.default !== undefined) {
  //     if (definition.type === 'string') {
  //       if (data[key] === null || data[key] === undefined || data[key] === '') {
  //         data[key] = definition.default
  //       }
  //     } else if (data[key] === null || data[key] === undefined) {
  //       data[key] = definition.default
  //     }
  //   }
  //
  //   // 强制类型转换
  //   switch (definition.type) {
  //     case 'string':
  //       if (data[key] !== null && data[key] !== undefined && typeof data[key] !== 'string') {
  //         data[key] = data[key].toString()
  //       }
  //       break
  //     case 'number':
  //       if (typeof data[key] !== 'number' && data[key] !== null && data[key] !== undefined) {
  //         if (typeof data[key] === 'string') {
  //           data[key] = parseFloat(data[key])
  //           if (isNaN(data[key])) {
  //             data[key] = null
  //           }
  //         } else {
  //           delete data[key]
  //         }
  //       }
  //       break
  //     default:
  //       break
  //   }
  //
  //   // 强制修正数据
  //   if (data[key]) {
  //     if (definition.trim) {
  //       data[key] = data[key].trim()
  //     }
  //     if (definition.upperCase) {
  //       data[key] = data[key].toUpperCase()
  //     }
  //     if (definition.lowerCase) {
  //       data[key] = data[key].toLowerCase()
  //     }
  //   }
  //
  //   // 校验数据
  //   if (
  //     definition.required === true &&
  //     (data[key] === undefined || data[key] === null || data[key] === '')
  //   ) {
  //     throw new Error('sumorApp.REQUIRED')
  //   }
  //   if (definition.length && data[key] && data[key].length > definition.length) {
  //     const error = new Error('sumorApp.LENGTH_OUT_OF_LIMIT')
  //     error.data = { length: definition.length }
  //     throw error
  //   }
  //   console.log("definition",definition)
  //   for (const rule of definition.rule) {
  //     const matched = new RegExp(rule.expression).test(data[key])
  //     if (!matched) {
  //       throw new Error(rule.text)
  //     }
  //   }
  // }
  return data
}
