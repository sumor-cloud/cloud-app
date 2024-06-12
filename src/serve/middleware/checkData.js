import { validate, format } from '@sumor/validator'
import APIError from './i18n/APIError.js'

export default (data, apiParameters) => {
  let errors = []
  for (const key in apiParameters) {
    data[key] = format(apiParameters[key], data[key])
    const fieldErrors = validate(
      {
        ...apiParameters[key],
        error: true
      },
      data[key]
    )
    errors = errors.concat(fieldErrors)
  }
  if (errors.length > 0) {
    throw new APIError('SUMOR_API_FIELDS_VALIDATION_FAILED', {}, errors)
  }
  return data
}
