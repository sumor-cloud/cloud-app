import { validate, format } from '@sumor/validator'
import APIMiddlewareError from '../../../../src/i18n/APIMiddlewareError.js'

export default (data, meta) => {
  let errors = []
  for (const key in meta.parameters) {
    data[key] = format(meta.parameters[key], data[key])
    const fieldErrors = validate(
      {
        ...meta.parameters[key],
        error: true
      },
      data[key]
    )
    errors = errors.concat(fieldErrors)
  }
  if (errors.length > 0) {
    throw new APIMiddlewareError('SUMOR_API_FIELDS_VALIDATION_FAILED', {}, errors)
  }
  return data
}
