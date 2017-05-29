'use strict'
module.exports = function vsprintfSimple (value, args) {
  var cnt = 0
  return value.replace(/%s/ig, function (match) {
    return String(args[cnt++])
  })
}
