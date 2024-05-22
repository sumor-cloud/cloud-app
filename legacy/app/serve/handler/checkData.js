import { validate, format } from '@sumor/validator'
import CloudAppError from '../../../../src/CloudAppError.js'

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
    throw new CloudAppError('SUMOR_API_FIELDS_VALIDATION_FAILED', {}, errors)
  }
  return data
}
