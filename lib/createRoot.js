'use strict'
var createNode = require('./createNode.js')

function createRoot (lookup, translateFn) {
  return createNode('', lookup, translateFn, false)
}

module.exports = createRoot
