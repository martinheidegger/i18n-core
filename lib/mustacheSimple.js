'use strict'
var escapeHTML = require('escape-html')
module.exports = {
  render: function mustacheSimple (value, namedValues) {
    return value.replace(/{{\s?({?[^}]*}?)\s?}}/ig, function (match, param) {
      var unescaped = /^{.*}$/.test(param)
      if (unescaped) {
        param = param.substring(1, param.length - 1)
      }
      var val = namedValues[param]
      if (val === null || val === undefined) {
        return ''
      }
      if (!unescaped) {
        val = escapeHTML(val)
      }
      return String(val)
    })
  }
}
