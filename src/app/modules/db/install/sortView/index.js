import sortObject from './sortObject.js'
import parseViews from './parseViews.js'
import find from './find.js'
import calcRank from './calcRank.js'
import fromCamelCase from '../../utils/fromCamelCase.js'
import toCamelCase from '../../utils/toCamelCase.js'

export default (views, desc) => {
  desc = !!desc

  const _views = {}
  for (const i in views) {
    const objName = fromCamelCase(i, '_')
    _views[objName] = views[i]
  }

  const viewsSQL = parseViews(_views)
  const depends = find(viewsSQL)
  const rank = calcRank(depends)
  const sequence = sortObject(rank, desc)

  // console.log(depends,rank,sequence);

  const result = {}
  for (const i in sequence) {
    const objName = toCamelCase(sequence[i], '_')
    result[objName] = _views[sequence[i]]
  }

  return result
}
