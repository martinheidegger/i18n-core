'use strict'

var getLookup = require('./lib/getLookup.js')
function defaultFallback (key) {
  if (!key) {
    return '(?)'
  }
  return key
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
