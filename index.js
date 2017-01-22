'use strict'

var getLookup = require('./lib/getLookup.js')
var createRoot = require('./lib/createRoot.js')

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

function _____n (node, singular, plural, count, namedValues, args) {
  var keys
  var fallbackKey
  if (count > 1) {
    if (typeof plural === 'object' && plural !== null) {
      plural = plural[count] ||
      plural.other
    }

    if (!plural) {
      plural = (typeof singular === 'object' && singular !== null ? (
          singular[count] ||
          singular.other)
          : null)
    }
    if (!singular) {
      return node.translate(plural, namedValues, args)
    } else if (typeof singular === 'object' && singular !== null) {
      singular = singular[count] || singular.one
    }
    keys = [
      singular + '.' + count,
      singular + '.other',
      singular,
      singular + '.one'
    ]
    if (plural && plural !== singular) {
      keys.unshift(plural)
    }
    fallbackKey = plural
  } else {
    if (typeof singular === 'object' && singular !== null) {
      singular = singular[count] || singular.one
    }
    if (!singular) {
      return node.translate(singular, namedValues, args)
    }
    keys = [
      singular + '.one',
      singular
    ]
    fallbackKey = singular
  }
  return node.translateFirst(keys, fallbackKey, namedValues, args)
}

function ____n (node, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
  var args
  if (j !== undefined) {
    args = [count, a, b, c, d, e, f, g, h, i, j]
  } else if (i !== undefined) {
    args = [count, a, b, c, d, e, f, g, h, i]
  } else if (h !== undefined) {
    args = [count, a, b, c, d, e, f, g, h]
  } else if (g !== undefined) {
    args = [count, a, b, c, d, e, f, g]
  } else if (f !== undefined) {
    args = [count, a, b, c, d, e, f]
  } else if (e !== undefined) {
    args = [count, a, b, c, d, e]
  } else if (d !== undefined) {
    args = [count, a, b, c, d]
  } else if (c !== undefined) {
    args = [count, a, b, c]
  } else if (b !== undefined) {
    args = [count, a, b]
  } else if (a !== undefined) {
    args = [count, a]
  } else {
    args = [count]
  }
  namedValues.count = count
  return _____n(node, singular || plural, plural || singular, count, namedValues, args)
}

function ___n (node, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
  if (typeof namedValues === 'object' && namedValues !== null) {
    return ____n(node, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j)
  }
  return ____n(node, singular, plural, count, {}, namedValues, a, b, c, d, e, f, g, h, i)
}

function ___ (node, key, namedValues, a, b, c, d, e, f, g, h, i, j) {
  var args
  if (j !== undefined) {
    args = [a, b, c, d, e, f, g, h, i, j]
  } else if (i !== undefined) {
    args = [a, b, c, d, e, f, g, h, i]
  } else if (h !== undefined) {
    args = [a, b, c, d, e, f, g, h]
  } else if (g !== undefined) {
    args = [a, b, c, d, e, f, g]
  } else if (f !== undefined) {
    args = [a, b, c, d, e, f]
  } else if (e !== undefined) {
    args = [a, b, c, d, e]
  } else if (d !== undefined) {
    args = [a, b, c, d]
  } else if (c !== undefined) {
    args = [a, b, c]
  } else if (b !== undefined) {
    args = [a, b]
  } else if (a !== undefined) {
    args = [a]
  }
  return node.translate(key, namedValues, args)
}

function convertToAPI (node) {
  var api = function __ (key, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof namedValues === 'object' && namedValues !== null) {
      return ___(node, key, namedValues, a, b, c, d, e, f, g, h, i, j)
    }
    return ___(node, key, null, namedValues, a, b, c, d, e, f, g, h, i)
  }
  api.__ = api
  api.has = node.has.bind(node)
  api.get = node.get.bind(node)
  api.translate = node.translate.bind(node)
  api.__n = function __n (singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof plural !== 'object' && typeof plural !== 'string') {
      return ___n(node, singular, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i)
    }
    return ___n(node, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j)
  }
  api.sub = function (prefix, allowSubModification) {
    if (allowSubModification) {
      return convertToAPI(node.sub(prefix, allowSubModification))
    }
    var subAPI
    if (!api.storage) {
      api.storage = {}
    } else {
      subAPI = api.storage[prefix]
    }
    if (!subAPI) {
      subAPI = convertToAPI(node.sub(prefix, allowSubModification))
      api.storage[prefix] = subAPI
    }
    return subAPI
  }
  api.lang = function lang (locale, allowSubModification) {
    return api.sub(locale + '.', allowSubModification)
  }
  if (node.changePrefix) {
    api.changePrefix = node.changePrefix.bind(node)
    api.changeLang = function changeLang (lang) {
      node.changePrefix(lang + '.')
    }
  }
  return api
}

module.exports = function (data) {
  var translator = function (value, key, namedValues, args) {
    return rootAPI.translator(value, key, namedValues, args)
  }
  var rootNode = createRoot(getLookup(data), translator)
  var rootAPI = convertToAPI(rootNode)
  rootAPI.fallback = defaultFallback
  rootAPI.mustache = require('mustache')
  rootAPI.vsprintf = require('sprintf').vsprintf
  rootAPI.translator = defaultTranslation.bind(rootAPI)
  return rootAPI
}
