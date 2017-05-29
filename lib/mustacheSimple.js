'use strict'
module.exports = {
  render: function mustacheSimple (value, namedValues) {
    return value.replace(/{{(.*)}}/ig, function (match, param) {
      if (/^{.*}$/.test(param)) {
        param = param.substring(1, param.length - 1)
      }
      var val = namedValues[param]
      if (val === null || val === undefined) {
        return ''
      }
      return String(val)
    })
  }
}
