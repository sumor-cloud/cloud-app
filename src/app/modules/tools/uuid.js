import uuidLib from 'uuid'

export default () => uuidLib.v4().replace(/-/g, '')
