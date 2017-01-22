'use strict'

function addPrefix (prefix, key) {
  return key !== null && key !== undefined ? prefix + key : prefix
}

function ___ (translate, getRaw, prefix, key, namedValues, a, b, c, d, e, f, g, h, i, j) {
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
  return translate(getRaw(key), addPrefix(prefix, key), namedValues, args)
}

function translateFirst (translate, getRaw, prefix, keys, fallbackKey, namedValues, args) {
  var keyNo = 0
  while (keyNo < keys.length) {
    var key = addPrefix(prefix, keys[keyNo])
    var value = getRaw(key)
    if (value !== null && value !== undefined) {
      return translate(value, key, namedValues, args)
    }
    keyNo += 1
  }
  return translate(null, addPrefix(prefix, fallbackKey), namedValues, args)
}

function _____n (translate, getRaw, prefix, singular, plural, count, namedValues, args) {
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
      return translate(getRaw(addPrefix(prefix, plural)), plural, namedValues, args)
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
      return translate(getRaw(addPrefix(prefix, singular)), singular, namedValues, args)
    }
    keys = [
      singular + '.one',
      singular
    ]
    fallbackKey = singular
  }
  return translateFirst(translate, getRaw, prefix, keys, fallbackKey, namedValues, args)
}

function ____n (translate, getRaw, prefix, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
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
  return _____n(translate, getRaw, prefix, singular || plural, plural || singular, count, namedValues, args)
}

function ___n (translate, getRaw, prefix, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
  if (typeof namedValues === 'object' && namedValues !== null) {
    return ____n(translate, getRaw, prefix, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j)
  }
  return ____n(translate, getRaw, prefix, singular, plural, count, {}, namedValues, a, b, c, d, e, f, g, h, i)
}

module.exports = function createTranslator (prefix, parent, translate, allowModification) {
  var __ = function __ (key, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof namedValues === 'object' && namedValues !== null) {
      return ___(translate, __.get, prefix, key, namedValues, a, b, c, d, e, f, g, h, i, j)
    }
    return ___(translate, __.get, prefix, key, null, namedValues, a, b, c, d, e, f, g, h, i)
  }
  __.__ = __
  __.lang = function lang (locale, allowSubModification) {
    return __.sub(locale + '.', allowSubModification)
  }
  __.sub = function sub (prefix, allowSubModification) {
    if (prefix === null || prefix === undefined) {
      throw new Error('Prefix is not allowed to be null or undefined')
    }
    if (allowSubModification) {
      return createTranslator(prefix, this, translate, allowSubModification)
    }
    var translator
    if (!__.storage) {
      __.storage = {}
    } else {
      translator = __.storage[prefix]
    }
    if (!translator) {
      translator = createTranslator(prefix, __, translate, allowSubModification)
      __.storage[prefix] = translator
    }
    return translator
  }
  __.has = function has (key) {
    var value = __.get(key)
    return value !== null && value !== undefined
  }
  __.get = function get (key) {
    return parent.get(addPrefix(prefix, key))
  }
  __.__n = function __n (singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j) {
    if (typeof plural !== 'object' && typeof plural !== 'string') {
      return ___n(translate, __.get, prefix, singular, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i)
    }
    return ___n(translate, __.get, prefix, singular, plural, count, namedValues, a, b, c, d, e, f, g, h, i, j)
  }

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
