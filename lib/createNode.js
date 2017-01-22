'use strict'

function addPrefix (prefix, key) {
  return key !== null && key !== undefined ? prefix + key : prefix
}

var API = {
  get: function (key) {
    return this.parent.get(addPrefix(this.prefix, key))
  },
  has: function has (key) {
    var value = this.parent.get(addPrefix(this.prefix, key))
    return value !== null && value !== undefined
  },
  translate: function (key, namedValues, args) {
    var prefixed = addPrefix(this.prefix, key)
    return this.translator(this.parent.get(prefixed), prefixed, namedValues, args)
  },
  translateFirst: function (keys, fallbackKey, namedValues, args) {
    var keyNo = 0
    while (keyNo < keys.length) {
      var key = addPrefix(this.prefix, keys[keyNo])
      var value = this.parent.get(key)
      if (value !== null && value !== undefined) {
        return this.translator(value, key, namedValues, args)
      }
      keyNo += 1
    }
    return this.translator(null, addPrefix(this.prefix, fallbackKey), namedValues, args)
  },
  sub: function (prefix, allowSubModification) {
    if (prefix === null || prefix === undefined) {
      throw new Error('Prefix is not allowed to be null or undefined')
    }
    return createNode(prefix, this, this.translator, allowSubModification)
  }
}

function createNode (prefix, parent, translator, allowModification) {
  var node = Object.create(API)
  node.prefix = prefix
  node.parent = parent
  node.translator = translator
  if (allowModification) {
    node.changePrefix = function (newPrefix) {
      this.prefix = newPrefix
    }
  }
  return node
}

module.exports = createNode
