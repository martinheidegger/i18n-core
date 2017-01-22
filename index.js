'use strict'

function defaultFallback (key) {
  if (!key) {
    return '(?)'
  }
  return key
}

function getLookup (data) {
  if (data && typeof data.get === 'function') {
    // Direct lookup implementation pass-through
    return data
  } else if (typeof data === 'function') {
    return {
      get: data
    }
  } else if (typeof data === 'string') {
    return require('./lookup/fs')(data)
  }
  return require('./lookup/object')(data || {})
}

function defaultTranslation (value, fallbackKey, namedValues, args) {
  if (value === null || value === undefined) {
    value = this.fallback(fallbackKey)
  }
  if (namedValues && (/{{.*}}/).test(value)) {
    value = this.mustache.render(value, namedValues)
  }
  if (args !== undefined && args.length > 0 && /%/.test(value)) {
    return this.vsprintf(value, args)
  }
  return value
}

module.exports = function (data) {
  var translate = function (value, fallbackKey, namedValues, args) {
    return translator.translate(value, fallbackKey, namedValues, args)
  }
  var translator = require('./lib/createTranslator')('', null, translate)
  var lookup = getLookup(data)
  translator.lookup = lookup
  translator.fallback = defaultFallback
  translator.get = lookup.get.bind(lookup)
  translator.mustache = require('mustache')
  translator.vsprintf = require('sprintf').vsprintf
  translator.translate = defaultTranslation.bind(translator)
  return translator
}
