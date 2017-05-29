'use strict'

function addPrefixRecursive (node, key) {
  var prefix = node.currentPrefix
  while (node !== node.absRoot) {
    prefix = node.absRoot.currentPrefix + prefix
    node = node.absRoot
  }
  return addPrefix(prefix, key)
}

function addPrefix (prefix, key) {
  return key !== null && key !== undefined ? prefix + key : prefix
}

var API = {
  get: function (key) {
    return this.parent.get(addPrefixRecursive(this, key))
  },
  has: function has (key) {
    var value = this.parent.get(addPrefixRecursive(this, key))
    return value !== null && value !== undefined
  },
  translate: function (key, namedValues, args) {
    var prefixed = addPrefix(this.currentPrefix, key)
    return this.translator(this.parent.get(prefixed), addPrefixRecursive(this, key), namedValues, args)
  },
  translateFirst: function (keys, fallbackKey, namedValues, args) {
    var keyNo = 0
    while (keyNo < keys.length) {
      var key = addPrefix(this.currentPrefix, keys[keyNo])
      var value = this.parent.get(key)
      if (value !== null && value !== undefined) {
        return this.translator(value, key, namedValues, args)
      }
      keyNo += 1
    }
    return this.translator(null, addPrefixRecursive(this, fallbackKey), namedValues, args)
  },
  absPrefix: function (prefix, allowSubModification) {
    if (prefix === null || prefix === undefined) {
      throw new Error('Prefix is not allowed to be null or undefined')
    }
    return createNode(prefix, this.absRoot, this.translator, allowSubModification)
  },
  prefix: function (prefix, allowSubModification) {
    if (prefix === null || prefix === undefined) {
      throw new Error('Prefix is not allowed to be null or undefined')
    }
    return createNode(prefix, this, this.translator, allowSubModification)
  },
  lock: function createLock (lock) {
    if (lock === undefined || lock) {
      var clone = createNode(this.currentPrefix, this.parent, this.translator, true)
      clone.lock(lock)
      return clone
    }
    // unmodifiable nodes are always not locked
    return this
  }
}

function createNode (prefix, parent, translator, allowModification) {
  var node = Object.create(API)
  node.currentPrefix = prefix
  node.parent = parent
  node.translator = translator
  node.absRoot = parent.absRoot
  if (allowModification) {
    node.changePrefix = function (newPrefix) {
      this.currentPrefix = newPrefix
    }
    node.lock = function (lock) {
      this.absRoot = lock === undefined || lock ? this : this.parent.absRoot
      return this
    }
  }
  return node
}

module.exports = createNode
