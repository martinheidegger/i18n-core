'use strict'

module.exports = function i18nChain () {
  var first = null
  var current
  for (var i = 0; i < arguments.length; i++) {
    var handler = arguments[i]
    if (handler) {
      if (!handler.get && typeof handler === 'function') {
        handler = {
          get: handler
        }
      }
      var next = {
        handler: handler
      }
      if (!first) {
        first = next
      } else {
        current.next = next
      }
      current = next
    }
  }
  if (!first) {
    return {
      get: function () { return undefined }
    }
  }
  if (!first.next) {
    return first.handler
  }
  first.get = function (key) {
    var current = first
    while (current) {
      var value = current.handler.get(key)
      if (value !== null && value !== undefined) {
        return value
      }
      current = current.next
    }
  }
  return first
}
