'use strict'

function addPrefixRecursive (node, key) {
  var prefix = node.currentPrefix
  while (node.parent) {
    node = node.parent
    if (node.currentPrefix !== undefined && node.currentPrefix !== '') {
      prefix = node.currentPrefix + prefix
    }
  }
  return addPrefix(prefix, key)
}

function addPrefix (prefix, key) {
  return key !== null && key !== undefined ? prefix + key : prefix
}

function onContextChange (type, fn) {
  if (type !== 'contextChange' || typeof fn !== 'function' || this.listener === fn) {
    return
  }
  if (this.off === noop) {
    this.off = offContextChange
  }
  if (this.listener === undefined) {
    this.listener = fn
    return
  }
  if (typeof this.listener === 'function') {
    this.listener = {
      fn: this.listener
    }
  }
  var curr = this.listener
  var last
  while (curr) {
    if (curr.fn === fn) {
      return
    }
    last = curr
    curr = curr.next
  }
  last.next = {
    fn: fn
  }
}

function offContextChange (type, fn) {
  if (type !== 'contextChange') {
    return
  }
  if (this.listener === fn) {
    this.listener = undefined
    return
  }
  var curr = this.listener
  var prev
  while (curr) {
    if (curr.fn === fn) {
      if (prev !== undefined) {
        prev.next = curr.next
      } else {
        this.listener = curr.next
      }
      if (this.listener.next === undefined) {
        this.listener = this.listener.fn
      }
      return
    }
    prev = curr
    curr = curr.next
  }
}

var API = {
  get: function (key) {
    return this.parent.get(addPrefixRecursive(this, key))
  },
  on: noop,
  off: noop,
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

function triggerListener () {
  var listener = this.listener
  if (typeof listener === 'function') {
    listener()
    return
  }
  while (listener) {
    listener.fn()
    listener = listener.next
  }
}

function noop () {}

function createNode (prefix, parent, translator, allowModification) {
  var node = Object.create(API)
  node.currentPrefix = prefix
  node.parent = parent
  node.translator = translator
  node.absRoot = parent.absRoot
  node.triggerListener = triggerListener.bind(node)
  var changeParent = parent.changeParent
  if (allowModification) {
    node.changeParent = node
    node.changePrefix = function (newPrefix) {
      this.currentPrefix = newPrefix
      if (this.listener !== undefined) {
        this.triggerListener()
      }
    }
    node.lock = function (lock) {
      this.absRoot = lock === undefined || lock ? this : this.parent.absRoot
      return this
    }
    node.on = onContextChange
  } else {
    node.changeParent = parent.changeParent
  }
  if (changeParent) {
    node.on = function (type, fn) {
      changeParent.on(type, node.triggerListener)
      node.off = function (type, fn) {
        offContextChange.apply(node, [type, fn])
        if (node.listener === undefined) {
          changeParent.off(type, node.triggerListener)
        }
      }
      onContextChange.apply(node, [type, fn])
      node.on = onContextChange
    }
  }
  return node
}

module.exports = createNode
