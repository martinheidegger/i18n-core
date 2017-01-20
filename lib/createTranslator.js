'use strict'

var slice = Array.prototype.slice

function getStart (namedValues) {
  return (typeof namedValues === 'object' && namedValues !== null) ? 2 : 1
}

function getArgs (startOfArgs, args) {
  var len = args.length
  if (len < startOfArgs) {
    return null
  }
  while (args[len - 1] === undefined && --len > startOfArgs) {
  }
  if (len === startOfArgs) {
    return null
  }
  return slice.call(args, startOfArgs, len + 1)
}

function addPrefix (prefix, key) {
  return key !== null && key !== undefined ? prefix + key : prefix
}

module.exports = function createTranslator (prefix, parent, allowModification) {
  function has (key) {
    return parent.has(addPrefix(prefix, key))
  }

  function raw (key) {
    return parent.raw(addPrefix(prefix, key))
  }

  function __ (key, namedValues) {
    var startOfArgs = getStart(namedValues)
    var args = getArgs(startOfArgs, arguments)
    return __.translate(key, (startOfArgs === 2 ? namedValues : null), args)
  }

  function __n (singular, plural, count, namedValues) {
    var startOfArgs = getStart(namedValues) + 2
    var args
    var keys
    var fallbackKey

    if (typeof plural !== 'object' &&
      typeof plural !== 'string') {
      namedValues = count
      count = plural
      plural = typeof singular === 'object' ? singular : null
      startOfArgs -= 1
    }

    if (typeof plural === 'object') {
      if (plural !== null) {
        plural = plural[count] ||
        plural.other ||
        plural.one
      }
      plural = plural ||
      (typeof singular === 'object' ? (
        singular[count] ||
        singular.other ||
        singular.one)
        : null)
    }
    if (typeof singular === 'object') {
      singular = singular[count] ||
      singular.one
    }
    args = getArgs(startOfArgs, arguments) || []
    if (startOfArgs === 3 || typeof namedValues !== 'object' || namedValues === null) {
      namedValues = {}
    }
    namedValues.count = count
    args.unshift(count)
    if (count > 1) {
      keys = [
        singular + '.' + count,
        singular + '.other',
        singular,
        singular + '.one'
      ]
      if (plural) {
        keys.unshift(plural)
      }
      fallbackKey = (plural || singular)
    } else {
      keys = [
        singular + '.one',
        singular
      ]
      fallbackKey = singular
    }
    return this.translateFirst(keys, fallbackKey, namedValues, args)
  }

  function lang (locale, allowSubModification) {
    return this.sub(locale + '.', allowSubModification)
  }

  function translate (key, fallbackKey, namedValues, args) {
    return parent.translate(addPrefix(prefix, key), fallbackKey, namedValues, args)
  }

  function translateFirst (keys, fallbackKey, namedValues, args) {
    return parent.translateFirst(
      keys.map(addPrefix.bind(prefix)),
      addPrefix(prefix, fallbackKey),
      namedValues,
      args
    )
  }

  function sub (prefix, allowSubModification) {
    if (prefix === null || prefix === undefined) {
      throw new Error('Prefix is not allowed to be null or undefined')
    }
    if (allowSubModification) {
      return createTranslator(prefix, this, allowSubModification)
    }
    var translator = this.storage[prefix]
    if (!translator) {
      translator = createTranslator(prefix, this, allowSubModification)
      this.storage[prefix] = translator
    }
    return translator
  }

  __.storage = {}
  __.__ = __
  __.translate = translate.bind(__)
  __.translateFirst = translateFirst.bind(__)
  __.lang = lang.bind(__)
  __.sub = sub.bind(__)
  __.has = has.bind(__)
  __.raw = raw.bind(__)
  __.__n = __n.bind(__)

  if (allowModification) {
    __.changePrefix = function changePrefix (newPrefix) {
      prefix = newPrefix
    }
  } else {
    __.changePrefix = function changePrefix () {
      throw new Error('Forbidden by configuration')
    }
  }

  __.changeLang = function changeLang (lang) {
    __.changePrefix(lang + '.')
  }
  return __
}
