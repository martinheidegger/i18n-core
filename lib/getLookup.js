'use strict'
module.exports = function getLookup (data) {
  if (data && typeof data.get === 'function') {
    // Direct lookup implementation pass-through
    return data
  } else if (typeof data === 'function') {
    return {
      get: data
    }
  } else if (typeof data === 'string') {
    return require('../lookup/fs')(data)
  }
  return require('../lookup/object')(data || {})
}
