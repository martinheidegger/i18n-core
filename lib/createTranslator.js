'use strict'

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

  function ___ (key, namedValues, a, b, c, d, e, f, g, h, i, j) {
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
    return __.translate(key, namedValues, args)
  }

  function __ (key, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof namedValues === 'object' && namedValues !== null) {
      return ___(key, namedValues, a, b, c, d, e, f, g, h, i, j)
    }
    return ___(key, null, namedValues, a, b, c, d, e, f, g, h, i)
  }

  function _____n (singular, plural, count, namedValues, args) {
    if (typeof singular === 'object') {
      singular = singular[count] || singular.one
    }
    var keys
    var fallbackKey
    if (count > 1) {
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
      if (!singular) {
        return __.translate(plural, namedValues, args)
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
      if (!singular) {
        return __.translate(singular, namedValues, args)
      }
      keys = [
        singular + '.one',
        singular
      ]
      fallbackKey = singular
    }
    return __.translateFirst(keys, fallbackKey, namedValues, args)
  }

  function ____n (singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
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
    return _____n(singular || plural, plural || singular, count, namedValues, args)
  }

  function ___n (singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof namedValues === 'object' && namedValues !== null) {
      return ____n(singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j)
    }
    return ____n(singular, plural, count, {}, namedValues, a, b, c, d, e, f, g, h, i)
  }

  function __n (singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof plural !== 'object' && typeof plural !== 'string') {
      return ___n(singular, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i)
    }
    return ___n(singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j)
  }

  function lang (locale, allowSubModification) {
    return this.sub(locale + '.', allowSubModification)
  }

  function translate (key, fallbackKey, namedValues, args) {
    return parent.translate(addPrefix(prefix, key), fallbackKey, namedValues, args)
  }

  function translateFirst (keys, fallbackKey, namedValues, args) {
    return parent.translateFirst(
      keys.map(addPrefix.bind(null, prefix)),
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
    __.changeLang = function changeLang (lang) {
      __.changePrefix(lang + '.')
    }
  }
  return __
}
