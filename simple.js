'use strict'

var getLookup = require('./lib/getLookup.js')
var createRoot = require('./lib/createRoot.js')
var vsprintfSimple = require('./lib/vsprintfSimple.js')
var mustacheSimple = require('./lib/mustacheSimple.js')

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
  api.on = function (type, handler) {
    node.on(type, handler)
  }
  api.off = function (type, handler) {
    node.off(type, handler)
  }
  api.getAbs = function (key) {
    return node.absRoot.get(key)
  }
  api.abs = function abs (key, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof namedValues === 'object' && namedValues !== null) {
      return ___(node.absRoot, key, namedValues, a, b, c, d, e, f, g, h, i, j)
    }
    return ___(node.absRoot, key, null, namedValues, a, b, c, d, e, f, g, h, i)
  }
  api.hasAbs = function (key) {
    return node.absRoot.has(key)
  }
  api.translate = node.translate.bind(node)
  api.translateAbs = function (abs, key, namedValues, args) {
    return node.absRoot.translate(abs, key, namedValues, args)
  }
  api.lock = function lock (lock) {
    var newNode = node.lock(lock)
    if (newNode === node) {
      return api
    }
    return convertToAPI(newNode)
  }
  api.absN = function absN (singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof plural !== 'object' && typeof plural !== 'string') {
      return ___n(node.absRoot, singular, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i)
    }
    return ___n(node.absRoot, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j)
  }
  api.__n = function __n (singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof plural !== 'object' && typeof plural !== 'string') {
      return ___n(node, singular, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i)
    }
    return ___n(node, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j)
  }
  api.absPrefix = function prefix (prefix, allowModification) {
    if (allowModification) {
      return convertToAPI(node.absPrefix(prefix, allowModification))
    }
    var subAPI
    if (!api.absStorage) {
      api.absStorage = {}
    } else {
      subAPI = api.absStorage[prefix]
    }
    if (!subAPI) {
      subAPI = convertToAPI(node.absPrefix(prefix, allowModification))
      api.absStorage[prefix] = subAPI
    }
    return subAPI
  }
  api.prefix = function (prefix, allowModification) {
    if (allowModification) {
      return convertToAPI(node.prefix(prefix, allowModification))
    }
    var subAPI
    if (!api.storage) {
      api.storage = {}
    } else {
      subAPI = api.storage[prefix]
    }
    if (!subAPI) {
      subAPI = convertToAPI(node.prefix(prefix, allowModification))
      api.storage[prefix] = subAPI
    }
    return subAPI
  }
  api.root = function root () {
    return api.absPrefix('')
  }
  api.absSection = function absSection (section, allowModification) {
    return api.absPrefix(section + '.', allowModification)
  }
  api.section = function section (locale, allowModification) {
    return api.prefix(locale + '.', allowModification)
  }
  if (node.changePrefix) {
    api.changePrefix = node.changePrefix.bind(node)
    api.changeSection = function changeSection (section) {
      node.changePrefix(section + '.')
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
  rootAPI.mustache = mustacheSimple
  rootAPI.vsprintf = vsprintfSimple
  rootAPI.translator = defaultTranslation.bind(rootAPI)
  return rootAPI
}
